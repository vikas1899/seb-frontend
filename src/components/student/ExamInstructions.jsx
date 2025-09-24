import React from 'react';
import { SEB_DOWNLOAD_LINKS } from '../../utils/constants';

const ExamInstructions = () => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Before You Start</h2>
      <ul className="space-y-3 text-gray-600">
        <li className="flex items-start">
          <span className="inline-block w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
          Install Safe Exam Browser on your device.
        </li>
        <li className="flex items-start">
          <span className="inline-block w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
          Ensure you have a stable internet connection.
        </li>
        <li className="flex items-start">
          <span className="inline-block w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
          Close all other applications before launching the exam.
        </li>
        <li className="flex items-start">
          <span className="inline-block w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
          Have your student ID ready.
        </li>
        <li className="flex items-start">
          <span className="inline-block w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
          You must complete all compatibility checks before the "Launch Test" button is enabled.
        </li>
      </ul>
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Download Safe Exam Browser</h3>
        <div className="space-y-3">
            <a href={SEB_DOWNLOAD_LINKS.WINDOWS} target="_blank" rel="noopener noreferrer" className="btn btn-outline w-full">Download for Windows</a>
            <a href={SEB_DOWNLOAD_LINKS.MAC} target="_blank" rel="noopener noreferrer" className="btn btn-outline w-full">Download for macOS</a>
        </div>
      </div>
    </div>
  );
};

export default ExamInstructions;