import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { studentService } from '../../services/studentService'
import { formatDuration } from '../../utils/helpers'
import {
  Clock,
  Shield,
  AlertTriangle,
  CheckCircle,
  Send,
  Save
} from 'lucide-react'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'

const ExamPortal = () => {
  const { examId } = useParams()
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session')

  const [exam, setExam] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeRemaining, setTimeRemaining] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [examStarted, setExamStarted] = useState(false)

  useEffect(() => {
    const fetchExamData = async () => {
      if (!sessionId) {
        setError('Invalid exam session. Please restart the exam.')
        setLoading(false)
        return
      }

      try {
        // Validate session
        const sessionResponse = await studentService.validateSession(examId, sessionId)
        if (!sessionResponse.success) {
          throw new Error(sessionResponse.error || 'Invalid exam session')
        }

        // Get exam details
        const examResponse = await studentService.getExamByLink(examId)
        if (!examResponse.success) {
          throw new Error(examResponse.error || 'Failed to load exam')
        }

        setExam(examResponse.data)
        setExamStarted(true)
        
        // Initialize timer
        const timeResponse = await studentService.getTimeRemaining(examId, sessionId)
        if (timeResponse.success) {
          setTimeRemaining(timeResponse.data.remaining_seconds)
        }

      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchExamData()
  }, [examId, sessionId])

  // Timer countdown
  useEffect(() => {
    if (!examStarted || timeRemaining === null || timeRemaining <= 0) return

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleAutoSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [examStarted, timeRemaining])

  // Heartbeat to maintain session
  useEffect(() => {
    if (!examStarted || !sessionId) return

    const heartbeat = setInterval(async () => {
      try {
        await studentService.sendHeartbeat(examId, sessionId)
      } catch (error) {
        console.error('Heartbeat failed:', error)
      }
    }, 30000) // Every 30 seconds

    return () => clearInterval(heartbeat)
  }, [examStarted, examId, sessionId])

  const handleAutoSubmit = async () => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    try {
      await studentService.completeExam(examId, sessionId, { auto_submit: true })
      // Show completion message
      setError('Exam time expired. Your responses have been automatically submitted.')
    } catch (err) {
      setError('Failed to submit exam automatically. Please contact your instructor.')
    }
  }

  const handleManualSubmit = async () => {
    setIsSubmitting(true)
    try {
      await studentService.completeExam(examId, sessionId, { manual_submit: true })
      setError('Exam submitted successfully!')
    } catch (err) {
      setError('Failed to submit exam. Please try again or contact your instructor.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTime = (seconds) => {
    if (!seconds) return '00:00:00'
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getTimeColor = () => {
    if (!timeRemaining) return 'text-gray-600'
    if (timeRemaining < 300) return 'text-red-600' // Less than 5 minutes
    if (timeRemaining < 900) return 'text-amber-600' // Less than 15 minutes
    return 'text-green-600'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-white mt-4">Loading secure exam environment...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg p-8">
          <ErrorMessage error={error} />
          {error.includes('submitted') && (
            <div className="mt-4 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <p className="text-green-600 font-medium">
                You may now close this window.
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Secure Header */}
      <header className="bg-gray-900 text-white px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Shield className="w-6 h-6 text-green-400" />
            <div>
              <h1 className="text-lg font-semibold">{exam.title}</h1>
              <p className="text-sm text-gray-300">{exam.subject} • Secure Exam Mode</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            {/* Timer */}
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <div className="text-right">
                <div className={`text-lg font-mono font-bold ${getTimeColor()}`}>
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-xs text-gray-400">Time Remaining</div>
              </div>
            </div>
            
            {/* Status Indicator */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm">Secure Mode Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Instructions Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-900">Secure Exam Environment</h3>
                <p className="text-sm text-blue-800 mt-1">
                  This exam is running in secure mode. You cannot access other applications, 
                  websites, or system functions during the exam. All activities are being monitored.
                </p>
              </div>
            </div>
          </div>

          {/* Exam Content Placeholder */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-gray-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Secure Exam Interface
                </h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  This is the secure exam portal. In a real implementation, 
                  this would contain the actual exam questions and interface.
                </p>
                
                {/* Placeholder exam content */}
                <div className="max-w-2xl mx-auto text-left space-y-6">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Sample Question 1</h3>
                    <p className="text-gray-700 mb-3">
                      This is where exam questions would appear in the actual implementation.
                    </p>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" name="q1" className="text-primary-600" />
                        <span className="text-sm">Option A</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" name="q1" className="text-primary-600" />
                        <span className="text-sm">Option B</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" name="q1" className="text-primary-600" />
                        <span className="text-sm">Option C</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Sample Question 2</h3>
                    <p className="text-gray-700 mb-3">
                      Another example question would be displayed here.
                    </p>
                    <textarea 
                      className="w-full p-3 border border-gray-300 rounded-md resize-none"
                      rows="3"
                      placeholder="Type your answer here..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Exam Controls */}
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  className="btn btn-outline inline-flex items-center"
                  disabled={isSubmitting}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Progress
                </button>
                
                <div className="text-sm text-gray-600">
                  Progress is automatically saved every 30 seconds
                </div>
              </div>
              
              <button
                onClick={handleManualSubmit}
                disabled={isSubmitting}
                className="btn btn-primary inline-flex items-center"
              >
                {isSubmitting ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Submit Exam
              </button>
            </div>
          </div>

          {/* Warning Messages */}
          {timeRemaining && timeRemaining < 900 && ( // Less than 15 minutes
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <div>
                  <h4 className="font-medium text-amber-900">Time Warning</h4>
                  <p className="text-sm text-amber-800">
                    {timeRemaining < 300 ? 
                      'Less than 5 minutes remaining! Your exam will be automatically submitted when time expires.' :
                      'Less than 15 minutes remaining. Please review your answers and submit soon.'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Connection: Stable</span>
            </div>
            <div>Session: {sessionId?.slice(-8)}</div>
          </div>
          
          <div>
            Secure Exam Browser • All activities monitored
          </div>
        </div>
      </footer>
    </div>
  )
}

export default ExamPortal;