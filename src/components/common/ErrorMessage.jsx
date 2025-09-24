import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorMessage = ({ error, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
      <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-red-800 mb-2">An Error Occurred</h3>
      <p className="text-sm text-red-700 mb-6">{error || 'Something went wrong.'}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-outline text-red-600 border-red-300 hover:bg-red-100"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;