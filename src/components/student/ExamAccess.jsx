import React from 'react'
import { isWithinTimeWindow, getTimeUntilExam, formatDateTime } from '../../utils/helpers'
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Shield,
  Info
} from 'lucide-react'

const ExamAccess = ({ exam, timeRemaining, onProceed }) => {
  const isAccessible = isWithinTimeWindow(exam.scheduled_at)

  // Exam is currently accessible
  if (isAccessible) {
    return (
      <div className="space-y-6">
        <div className="card text-center">
          <div className="card-content p-8">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Exam Available</h2>
            <p className="text-gray-600 mb-6">
              You can now proceed to take the exam. Please read the instructions carefully 
              and complete all required system checks.
            </p>
            
            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-green-800 font-medium">Secure exam environment ready</span>
              </div>
            </div>
            
            <button
              onClick={onProceed}
              className="btn btn-primary btn-lg"
            >
              Continue to Instructions
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Exam Information</h3>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Scheduled Time</p>
                  <p className="font-medium text-gray-900">{formatDateTime(exam.scheduled_at)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium text-gray-900">{exam.duration} minutes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Exam not yet available - show countdown
  if (timeRemaining && timeRemaining.total > 0) {
    return (
      <div className="space-y-6">
        <div className="card text-center">
          <div className="card-content p-8">
            <Clock className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Exam Not Yet Available</h2>
            <p className="text-gray-600 mb-6">
              The exam will be available soon. Please wait until the scheduled time.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-800 mb-2">
                  {String(timeRemaining.hours).padStart(2, '0')}:
                  {String(timeRemaining.minutes).padStart(2, '0')}
                </div>
                <p className="text-blue-600 font-medium">Time until exam starts</p>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 space-y-1">
              <p>Scheduled for: <span className="font-medium">{formatDateTime(exam.scheduled_at)}</span></p>
              <p>Duration: <span className="font-medium">{exam.duration} minutes</span></p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title flex items-center">
              <Info className="w-5 h-5 mr-2" />
              What to do while waiting
            </h3>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Download Safe Exam Browser</h4>
                  <p className="text-sm text-gray-600">
                    If you haven't already, download and install SEB on your device
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Prepare your workspace</h4>
                  <p className="text-sm text-gray-600">
                    Ensure you have a quiet, distraction-free environment
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Check your internet connection</h4>
                  <p className="text-sm text-gray-600">
                    Ensure you have a stable internet connection for the exam
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">4</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Keep this page open</h4>
                  <p className="text-sm text-gray-600">
                    This page will automatically refresh when the exam becomes available
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Exam access window expired
  return (
    <div className="space-y-6">
      <div className="card text-center">
        <div className="card-content p-8">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Exam Access Expired</h2>
          <p className="text-gray-600 mb-6">
            The time window for accessing this exam has expired. You are no longer 
            able to take this exam.
          </p>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="text-sm text-red-800">
              <p><strong>Exam was scheduled for:</strong> {formatDateTime(exam.scheduled_at)}</p>
              <p><strong>Access window:</strong> 30 minutes from start time</p>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            <p>If you believe this is an error, please contact your instructor immediately.</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Need Help?</h3>
        </div>
        <div className="card-content">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
              <p className="text-sm text-gray-600">
                If you experienced technical difficulties or other issues that prevented you 
                from accessing the exam on time, contact your instructor or the technical 
                support team as soon as possible.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">What to include:</h4>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Your name and student ID (if applicable)</li>
                <li>• Exam title: {exam.title}</li>
                <li>• Subject: {exam.subject}</li>
                <li>• Scheduled time: {formatDateTime(exam.scheduled_at)}</li>
                <li>• Description of any technical issues encountered</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExamAccess