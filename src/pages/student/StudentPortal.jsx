import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEB_DOWNLOAD_LINKS } from '../../utils/constants';

const StudentPortal = () => {
  const [examLink, setExamLink] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (examLink.trim()) {
      // Extract exam link from full URL if needed
      const linkPart = examLink.includes('/exam/') 
        ? examLink.split('/exam/')[1] 
        : examLink;
      navigate(`/exam/${linkPart}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Student Exam Portal
          </h1>
          <p className="text-lg text-gray-600">
            Enter your exam link to begin the secure examination process
          </p>
        </div>

        {/* Exam Link Entry */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="examLink" className="block text-sm font-medium text-gray-700 mb-2">
                Exam Link
              </label>
              <input
                type="text"
                id="examLink"
                value={examLink}
                onChange={(e) => setExamLink(e.target.value)}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Enter your exam link or paste the full URL"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Access Exam
            </button>
          </form>
        </div>

        {/* Instructions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* SEB Download */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Download Safe Exam Browser
            </h2>
            <p className="text-gray-600 mb-4">
              You need Safe Exam Browser (SEB) installed to take secure exams.
            </p>
            <div className="space-y-3">
              <a
                href={SEB_DOWNLOAD_LINKS.WINDOWS}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md px-4 py-3 text-center text-blue-700 font-medium transition-colors"
              >
                Download for Windows
              </a>
              <a
                href={SEB_DOWNLOAD_LINKS.MAC}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md px-4 py-3 text-center text-gray-700 font-medium transition-colors"
              >
                Download for macOS
              </a>
            </div>
          </div>

          {/* General Instructions */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Before You Start
            </h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Install Safe Exam Browser on your device
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Ensure stable internet connection
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Close all other applications
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Have your student ID ready
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Complete all compatibility checks
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPortal;
