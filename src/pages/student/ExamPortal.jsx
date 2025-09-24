import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import ExamAccess from '../../components/student/ExamAccess';
import CompatibilityChecks from '../../components/student/CompatibilityChecks';
import ExamLaunch from '../../components/student/ExamLaunch';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import toast from 'react-hot-toast';

const STEPS = {
  EXAM_ACCESS: 'exam_access',
  COMPATIBILITY: 'compatibility',
  LAUNCH: 'launch'
};

const ExamPortal = () => {
  const { examLink } = useParams();
  const [currentStep, setCurrentStep] = useState(STEPS.EXAM_ACCESS);
  const [examData, setExamData] = useState(null);
  const [studentId, setStudentId] = useState('');
  const [compatibilityResults, setCompatibilityResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExamData();
  }, [examLink]);

  const fetchExamData = async () => {
    try {
      const data = await studentService.getExamInfo(examLink);
      setExamData(data);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load exam information');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentIdSubmit = (id) => {
    setStudentId(id);
    setCurrentStep(STEPS.COMPATIBILITY);
  };

  const handleCompatibilityComplete = (results) => {
    setCompatibilityResults(results);
    setCurrentStep(STEPS.LAUNCH);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Steps */}
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Progress">
            <div className={`py-4 text-sm font-medium border-b-2 ${
              currentStep === STEPS.EXAM_ACCESS 
                ? 'border-primary-500 text-primary-600' 
                : 'border-transparent text-gray-500'
            }`}>
              1. Exam Access
            </div>
            <div className={`py-4 text-sm font-medium border-b-2 ${
              currentStep === STEPS.COMPATIBILITY 
                ? 'border-primary-500 text-primary-600' 
                : 'border-transparent text-gray-500'
            }`}>
              2. System Check
            </div>
            <div className={`py-4 text-sm font-medium border-b-2 ${
              currentStep === STEPS.LAUNCH 
                ? 'border-primary-500 text-primary-600' 
                : 'border-transparent text-gray-500'
            }`}>
              3. Launch Exam
            </div>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === STEPS.EXAM_ACCESS && (
          <ExamAccess 
            examData={examData}
            onStudentIdSubmit={handleStudentIdSubmit}
          />
        )}
        
        {currentStep === STEPS.COMPATIBILITY && (
          <CompatibilityChecks
            examData={examData}
            examLink={examLink}
            studentId={studentId}
            onComplete={handleCompatibilityComplete}
          />
        )}
        
        {currentStep === STEPS.LAUNCH && (
          <ExamLaunch
            examData={examData}
            examLink={examLink}
            studentId={studentId}
            compatibilityResults={compatibilityResults}
          />
        )}
      </div>
    </div>
  );
};

export default ExamPortal;
