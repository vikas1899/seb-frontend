import React, { useState } from 'react';
import { format } from 'date-fns';

const ExamAccess = ({ examData, onStudentIdSubmit }) => {
  const [studentId, setStudentId] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (studentId.trim() && agreed) {
      onStudentIdSubmit(studentId.trim());
    }
  };

  const examDateTime = new Date(`${examData.exam_date}T${examData.exam_time}`);
  const isExamTimeActive = examData.is_exam_time_active === 'true';

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">{examData.title}</h1>
        <p className="text-gray-600">{examData.subject}</p>
      </div>

      <div className="p-6">
        {/* Exam Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Exam Details</h3>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Date & Time</dt>
                <dd className="text-sm text-gray-900">
                  {format(examDateTime, 'EEEE, MMMM do, yyyy')} at {format(examDateTime, 'HH:mm')}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Duration</dt>
                <dd className="text-sm text-gray-900">{examData.duration_minutes} minutes</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Launch Window</dt>
                <dd className="text-sm text-gray-900">{examData.launch_window_minutes} minutes after start time</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Status</h3>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              isExamTimeActive
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {isExamTimeActive ? 'Available Now' : 'Not Yet Available'}
            </div>
            {!isExamTimeActive && (
              <p className="text-sm text-gray-600 mt-2">
                The exam will be available during the scheduled time window.
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        {examData.description && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700">{examData.description}</p>
          </div>
        )}

        {/* Additional Requirements */}
        {examData.additional_requirements && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Additional Requirements</h3>
            <p className="text-gray-700">{examData.additional_requirements}</p>
          </div>
        )}

        {/* Student ID Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">
              Student ID *
            </label>
            <input
              type="text"
              id="studentId"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Enter your student ID"
              required
            />
          </div>

          <div className="flex items-start">
            <input
              type="checkbox"
              id="agreement"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
            />
            <label htmlFor="agreement" className="ml-2 block text-sm text-gray-900">
              I agree to follow all exam rules and acknowledge that this exam session will be monitored 
              and recorded for academic integrity purposes.
            </label>
          </div>

          <button
            type="submit"
            disabled={!studentId.trim() || !agreed || !isExamTimeActive}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {!isExamTimeActive ? 'Exam Not Available' : 'Proceed to System Check'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExamAccess;
