import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useExams } from '../../hooks/useExams'
import { validateExamForm } from '../../utils/validation'
import { COMPATIBILITY_CHECKS } from '../../utils/constants'
import { 
  ArrowLeft, 
  Upload, 
  Calendar, 
  Clock, 
  BookOpen,
  CheckSquare,
  Square
} from 'lucide-react'
import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const CreateExam = () => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    date: '',
    time: '',
    duration: '',
    compatibilityChecks: [],
    sebFile: null,
    instructions: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const { createExam, uploadSEBConfig } = useExams()
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const handleCompatibilityCheck = (checkKey) => {
    setFormData(prev => ({
      ...prev,
      compatibilityChecks: prev.compatibilityChecks.includes(checkKey)
        ? prev.compatibilityChecks.filter(c => c !== checkKey)
        : [...prev.compatibilityChecks, checkKey]
    }))
    
    if (errors.compatibilityChecks) {
      setErrors(prev => ({ ...prev, compatibilityChecks: null }))
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setFormData(prev => ({ ...prev, sebFile: file }))
    
    if (errors.sebFile) {
      setErrors(prev => ({ ...prev, sebFile: null }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form
    const validation = validateExamForm(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      // Create exam data
      const examData = {
        title: formData.title,
        subject: formData.subject,
        description: formData.description,
        scheduled_at: `${formData.date}T${formData.time}:00`,
        duration: parseInt(formData.duration),
        compatibility_checks: formData.compatibilityChecks,
        instructions: formData.instructions
      }

      // Create the exam
      const result = await createExam(examData)
      
      if (result.success) {
        const examId = result.data.id
        
        // Upload SEB config file if provided
        if (formData.sebFile) {
          const uploadResult = await uploadSEBConfig(
            examId, 
            formData.sebFile, 
            setUploadProgress
          )
          
          if (!uploadResult.success) {
            toast.error('Exam created but SEB config upload failed')
          }
        }
        
        toast.success('Exam created successfully!')
        navigate(`/teacher/exam/${examId}`)
      } else {
        toast.error(result.error || 'Failed to create exam')
      }
    } catch (err) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/teacher/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Create New Exam</h1>
          <p className="text-gray-600">Set up a new secure exam with SEB integration</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Basic Information
              </h3>
              <p className="card-description">
                Enter the basic details for your exam
              </p>
            </div>
            <div className="card-content space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Exam Title *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`input ${errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Enter exam title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  className={`input ${errors.subject ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Enter subject name"
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="input resize-none"
                  placeholder="Enter exam description (optional)"
                />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Schedule & Duration
              </h3>
              <p className="card-description">
                Set when the exam will be available and how long it will last
              </p>
            </div>
            <div className="card-content space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date */}
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                    Exam Date *
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    required
                    value={formData.date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={`input ${errors.dateTime ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  />
                </div>

                {/* Time */}
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                    Exam Time *
                  </label>
                  <input
                    id="time"
                    name="time"
                    type="time"
                    required
                    value={formData.time}
                    onChange={handleInputChange}
                    className={`input ${errors.dateTime ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  />
                </div>
              </div>

              {errors.dateTime && (
                <p className="text-sm text-red-600">{errors.dateTime}</p>
              )}

              {/* Duration */}
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes) *
                </label>
                <input
                  id="duration"
                  name="duration"
                  type="number"
                  required
                  min="15"
                  max="480"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className={`input ${errors.duration ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Enter duration in minutes"
                />
                {errors.duration && (
                  <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Minimum 15 minutes, maximum 8 hours (480 minutes)
                </p>
              </div>
            </div>
          </div>

          {/* SEB Configuration */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                SEB Configuration
              </h3>
              <p className="card-description">
                Upload your Safe Exam Browser configuration file
              </p>
            </div>
            <div className="card-content">
              <div>
                <label htmlFor="sebFile" className="block text-sm font-medium text-gray-700 mb-2">
                  SEB Config File (.seb) *
                </label>
                <input
                  id="sebFile"
                  name="sebFile"
                  type="file"
                  accept=".seb"
                  required
                  onChange={handleFileChange}
                  className={`input ${errors.sebFile ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                />
                {errors.sebFile && (
                  <p className="mt-1 text-sm text-red-600">{errors.sebFile}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Upload a .seb configuration file created with Safe Exam Browser
                </p>
                
                {uploadProgress > 0 && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Uploading...</span>
                      <span className="text-gray-600">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Compatibility Checks */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title flex items-center">
                <CheckSquare className="w-5 h-5 mr-2" />
                Compatibility Checks
              </h3>
              <p className="card-description">
                Select which system checks students must pass before taking the exam
              </p>
            </div>
            <div className="card-content">
              <div className="space-y-4">
                {Object.values(COMPATIBILITY_CHECKS).map((check) => (
                  <label 
                    key={check.key}
                    className="flex items-start space-x-3 cursor-pointer"
                  >
                    <button
                      type="button"
                      onClick={() => handleCompatibilityCheck(check.key)}
                      className="flex-shrink-0 mt-0.5"
                    >
                      {formData.compatibilityChecks.includes(check.key) ? (
                        <CheckSquare className="w-5 h-5 text-primary-600" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    <div>
                      <div className="font-medium text-gray-900">{check.label}</div>
                      <div className="text-sm text-gray-600">{check.description}</div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.compatibilityChecks && (
                <p className="mt-2 text-sm text-red-600">{errors.compatibilityChecks}</p>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Instructions for Students</h3>
              <p className="card-description">
                Optional instructions that will be shown to students before the exam
              </p>
            </div>
            <div className="card-content">
              <textarea
                id="instructions"
                name="instructions"
                rows={4}
                value={formData.instructions}
                onChange={handleInputChange}
                className="input resize-none"
                placeholder="Enter any special instructions for students (optional)"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/teacher/dashboard')}
              className="btn btn-outline"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Creating Exam...</span>
                </div>
              ) : (
                'Create Exam'
              )}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  )
}

export default CreateExam;