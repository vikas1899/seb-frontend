import React, { useState } from 'react';
import { studentService } from '../../services/studentService';
import { SEB_DOWNLOAD_LINKS } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const ExamLaunch = ({ examData, examLink, studentId, compatibilityResults }) => {
  const [launching, setLaunching] = useState(false);
  const [examStarted, setExamStarted] = useState(false);

  const handleLaunchExam = async () => {
    setLaunching(true);

    try {
      const launchData = {
        exam_link: examLink,
        student_identifier: studentId
      };

      const response = await studentService.launchExam(launchData);
      
      if (response.success) {
        // Download SEB config file
        const configBlob = await studentService.getSebConfig(examLink, studentId);
        const url = window.URL.createObjectURL(configBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `exam_${examLink}.seb`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        setExamStarted(true);
        toast.success('Exam launched successfully! SEB config file downloaded.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to launch exam');
    } finally {
      setLaunching(false);
    }
  };

  const handleCompleteExam = async (status = 'completed') => {
    try {
      await studentService.completeExam({
        exam_link: examLink,
        student_identifier: studentId,
        status
      });
      toast.success('Exam session ended successfully');
    } catch (error) {
      toast.error('Failed to end exam session');
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Launch Secure Exam</h2>
        <p className="text-gray-600">Ready to start your exam in Safe Exam Browser</p>
      </div>

      <div className="p-6">
        {!examStarted ? (
          <div className="space-y-6">
            {/* Pre-launch Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Before Launching</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Ensure Safe Exam Browser is installed on your device</li>
                      <li>Close all other applications and browser tabs</li>
                      <li>Make sure you have a stable internet connection</li>
                      <li>The exam will start automatically once SEB opens</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* SEB Download Links (if needed) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={SEB_DOWNLOAD_LINKS.WINDOWS}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Download SEB for Windows
              </a>
              <a
                href={SEB_DOWNLOAD_LINKS.MAC}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Download SEB for macOS
              </a>
            </div>

            {/* System Check Summary */}
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <h4 className="text-sm font-medium text-green-800 mb-2">System Checks Completed</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-green-700">
                {Object.entries(compatibilityResults).map(([check, result]) => (
                  <div key={check} className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {check.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                ))}
              </div>
            </div>

            {/* Launch Button */}
            <div className="flex justify-center">
              <button
                onClick={handleLaunchExam}
                disabled={launching}
                className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {launching ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Launching Exam...</span>
                  </>
                ) : (
                  'Launch Secure Exam'
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Post-launch Interface */
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900">Exam Launched Successfully</h3>
              <p className="text-gray-600">
                The SEB configuration file has been downloaded. Open it to start your exam.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-yellow-800">Important</h4>
                  <p className="text-sm text-yellow-700">
                    Do not close this browser tab until you have completed the exam. 
                    Use the controls below to end your exam session when finished.
                  </p>
                </div>
              </div>
            </div>

            {/* Exam Control Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleCompleteExam('completed')}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Complete Exam
              </button>
              <button
                onClick={() => handleCompleteExam('abandoned')}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                End Session
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamLaunch;
