import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExams } from '../../hooks/useExams';
import { validateExamForm } from '../../utils/validation';
import { COMPATIBILITY_CHECKS } from '../../utils/constants';
import { Upload, Calendar, Clock, BookOpen, CheckSquare, Square } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const ExamForm = ({ exam, isEditing = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    date: '',
    time: '',
    duration: '',
    compatibilityChecks: [],
    sebFile: null,
    instructions: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { createExam, updateExam, uploadSEBConfig } = useExams();
  const navigate = useNavigate();

  useEffect(() => {
    if (isEditing && exam) {
      const scheduledAt = new Date(exam.scheduled_at);
      setFormData({
        title: exam.title || '',
        subject: exam.subject || '',
        description: exam.description || '',
        date: scheduledAt.toISOString().split('T')[0],
        time: scheduledAt.toTimeString().slice(0, 5),
        duration: exam.duration?.toString() || '',
        compatibilityChecks: exam.compatibility_checks || [],
        sebFile: null,
        instructions: exam.instructions || '',
      });
    }
  }, [exam, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleCompatibilityCheck = (checkKey) => {
    setFormData((prev) => ({
      ...prev,
      compatibilityChecks: prev.compatibilityChecks.includes(checkKey)
        ? prev.compatibilityChecks.filter((c) => c !== checkKey)
        : [...prev.compatibilityChecks, checkKey],
    }));
    if (errors.compatibilityChecks) setErrors((prev) => ({ ...prev, compatibilityChecks: null }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, sebFile: file }));
    if (errors.sebFile) setErrors((prev) => ({ ...prev, sebFile: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateExamForm({ ...formData, id: isEditing ? exam.id : null });
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const examData = {
        title: formData.title,
        subject: formData.subject,
        description: formData.description,
        exam_date: formData.date,
        exam_time: formData.time,
        duration_minutes: parseInt(formData.duration),
        required_checks: formData.compatibilityChecks,
        additional_requirements: formData.instructions,
      };

      let result;
      if (isEditing) {
        result = await updateExam(exam.id, examData);
      } else {
        const formDataToSubmit = new FormData();
        Object.keys(examData).forEach(key => {
          if (key === 'required_checks') {
            examData[key].forEach(item => formDataToSubmit.append(key, item));
          } else {
            formDataToSubmit.append(key, examData[key]);
          }
        });
        if (formData.sebFile) {
          formDataToSubmit.append('seb_config_file', formData.sebFile);
        }
        result = await createExam(formDataToSubmit);
      }
      
      if (result.success) {
        const examId = result.data.id;
        if (isEditing && formData.sebFile) {
          await uploadSEBConfig(examId, formData.sebFile, setUploadProgress);
        }
        toast.success(`Exam ${isEditing ? 'updated' : 'created'} successfully!`);
        navigate(`/teacher/exam/${examId}`);
      } else {
        toast.error(result.error || `Failed to ${isEditing ? 'update' : 'create'} exam`);
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Basic Information
          </h3>
          <p className="card-description">Enter the basic details for your exam</p>
        </div>
        <div className="card-content space-y-6">
          <input name="title" value={formData.title} onChange={handleInputChange} placeholder="Exam Title" className="input" />
          {errors.title && <p className="text-red-600">{errors.title}</p>}
          <input name="subject" value={formData.subject} onChange={handleInputChange} placeholder="Subject" className="input" />
          {errors.subject && <p className="text-red-600">{errors.subject}</p>}
          <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" className="input"></textarea>
        </div>
      </div>

      {/* Schedule & Duration */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Schedule & Duration
          </h3>
        </div>
        <div className="card-content space-y-6">
            <input name="date" type="date" value={formData.date} onChange={handleInputChange} className="input" />
            {errors.date && <p className="text-red-600">{errors.date}</p>}
            <input name="time" type="time" value={formData.time} onChange={handleInputChange} className="input" />
            {errors.time && <p className="text-red-600">{errors.time}</p>}
            <input name="duration" type="number" value={formData.duration} onChange={handleInputChange} placeholder="Duration (minutes)" className="input" />
            {errors.duration && <p className="text-red-600">{errors.duration}</p>}
        </div>
      </div>

      {/* SEB Configuration */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            SEB Configuration
          </h3>
        </div>
        <div className="card-content">
          <input type="file" name="sebFile" onChange={handleFileChange} className="input" />
          {errors.sebFile && <p className="text-red-600">{errors.sebFile}</p>}
        </div>
      </div>
      
      {/* Compatibility Checks */}
      <div className="card">
          <div className="card-header">
              <h3 className="card-title flex items-center">
                  <CheckSquare className="w-5 h-5 mr-2" />
                  Compatibility Checks
              </h3>
          </div>
          <div className="card-content space-y-4">
              {Object.values(COMPATIBILITY_CHECKS).map((check) => (
                  <label key={check.key} className="flex items-start space-x-3 cursor-pointer">
                      <input type="checkbox" checked={formData.compatibilityChecks.includes(check.key)} onChange={() => handleCompatibilityCheck(check.key)} />
                      <div>
                          <p>{check.label}</p>
                          <p>{check.description}</p>
                      </div>
                  </label>
              ))}
          </div>
      </div>

      {/* Instructions */}
      <div className="card">
          <div className="card-header">
              <h3 className="card-title">Instructions</h3>
          </div>
          <div className="card-content">
              <textarea name="instructions" value={formData.instructions} onChange={handleInputChange} placeholder="Instructions for students" className="input"></textarea>
          </div>
      </div>

      <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full">
        {isSubmitting ? <LoadingSpinner size="sm" /> : (isEditing ? 'Update Exam' : 'Create Exam')}
      </button>
    </form>
  );
};

export default ExamForm;