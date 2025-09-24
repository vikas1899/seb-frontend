import React, { useState, useEffect } from 'react'
import { useCompatibilityCheck } from '../../hooks/useCompatibilityCheck'
import { COMPATIBILITY_CHECKS } from '../../utils/constants'
import {
  CheckCircle,
  XCircle,
  Clock,
  Wifi,
  Monitor,
  Mic,
  Video,
  RefreshCw,
  AlertTriangle,
  Play
} from 'lucide-react'
import LoadingSpinner from '../common/LoadingSpinner'

const CompatibilityChecks = ({ examId, requirements, checks, loading, allPassed, onProceed }) => {
  const {
    runCheck,
    runAllChecks,
    testInternetSpeed,
    testDeviceCompatibility,
    testAudio,
    testVideo,
    cleanup
  } = useCompatibilityCheck(examId)

  const [runningChecks, setRunningChecks] = useState({})
  const [hasRunInitialChecks, setHasRunInitialChecks] = useState(false)

  // Cleanup on unmount
  useEffect(() => {
    return () => cleanup()
  }, [cleanup])

  // Auto-run checks when component loads
  useEffect(() => {
    if (requirements.length > 0 && !hasRunInitialChecks) {
      setHasRunInitialChecks(true)
      handleRunAllChecks()
    }
  }, [requirements, hasRunInitialChecks])

  const getCheckIcon = (checkType) => {
    switch (checkType) {
      case 'internet_speed':
        return Wifi
      case 'device_compatibility':
        return Monitor
      case 'audio_check':
        return Mic
      case 'video_check':
        return Video
      default:
        return CheckCircle
    }
  }

  const getCheckStatus = (checkType) => {
    const check = checks[checkType]
    const isRunning = runningChecks[checkType]

    if (isRunning) return 'running'
    if (!check) return 'pending'
    if (check.passed) return 'passed'
    return 'failed'
  }

  const handleRunCheck = async (checkType) => {
    setRunningChecks(prev => ({ ...prev, [checkType]: true }))
    
    try {
      await runCheck(checkType)
    } catch (error) {
      console.error(`Check ${checkType} failed:`, error)
    } finally {
      setRunningChecks(prev => ({ ...prev, [checkType]: false }))
    }
  }

  const handleRunAllChecks = async () => {
    const allChecks = {}
    requirements.forEach(req => {
      allChecks[req] = true
    })
    setRunningChecks(allChecks)

    try {
      await runAllChecks()
    } catch (error) {
      console.error('Running all checks failed:', error)
    } finally {
      setRunningChecks({})
    }
  }

  const renderCheckResult = (checkType, check) => {
    if (!check) return null

    if (check.passed) {
      return (
        <div className="mt-2 text-sm text-green-600">
          <CheckCircle className="w-4 h-4 inline mr-1" />
          Check passed
          {checkType === 'internet_speed' && check.speed && (
            <span className="ml-2">({check.speed} Mbps)</span>
          )}
        </div>
      )
    }

    return (
      <div className="mt-2 text-sm text-red-600">
        <XCircle className="w-4 h-4 inline mr-1" />
        Check failed
        {check.error && (
          <div className="mt-1 text-xs text-red-500">{check.error}</div>
        )}
        {checkType === 'internet_speed' && check.speed && (
          <div className="mt-1 text-xs text-red-500">
            Speed: {check.speed} Mbps (minimum required: {COMPATIBILITY_CHECKS.INTERNET_SPEED.minSpeed} Mbps)
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">System Compatibility Check</h2>
          <p className="card-description">
            Please complete all required system checks before proceeding to the exam
          </p>
        </div>
        
        <div className="card-content space-y-4">
          {requirements.length === 0 ? (
            <div className="text-center py-8">
              <LoadingSpinner size="lg" text="Loading requirements..." />
            </div>
          ) : (
            <>
              {/* Check Items */}
              <div className="space-y-4">
                {requirements.map((checkType) => {
                  const checkConfig = Object.values(COMPATIBILITY_CHECKS).find(c => c.key === checkType)
                  if (!checkConfig) return null

                  const IconComponent = getCheckIcon(checkType)
                  const status = getCheckStatus(checkType)
                  const check = checks[checkType]
                  const isRunning = runningChecks[checkType]

                  return (
                    <div
                      key={checkType}
                      className={`p-4 border rounded-lg ${
                        status === 'passed' ? 'border-green-200 bg-green-50' :
                        status === 'failed' ? 'border-red-200 bg-red-50' :
                        status === 'running' ? 'border-blue-200 bg-blue-50' :
                        'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${
                            status === 'passed' ? 'bg-green-100' :
                            status === 'failed' ? 'bg-red-100' :
                            status === 'running' ? 'bg-blue-100' :
                            'bg-gray-100'
                          }`}>
                            <IconComponent className={`w-5 h-5 ${
                              status === 'passed' ? 'text-green-600' :
                              status === 'failed' ? 'text-red-600' :
                              status === 'running' ? 'text-blue-600' :
                              'text-gray-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                              {checkConfig.label}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {checkConfig.description}
                            </p>
                            {renderCheckResult(checkType, check)}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {status === 'passed' && (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          )}
                          {status === 'failed' && (
                            <button
                              onClick={() => handleRunCheck(checkType)}
                              disabled={isRunning}
                              className="btn btn-outline btn-sm"
                            >
                              <RefreshCw className="w-4 h-4 mr-1" />
                              Retry
                            </button>
                          )}
                          {status === 'running' && (
                            <LoadingSpinner size="sm" />
                          )}
                          {status === 'pending' && (
                            <button
                              onClick={() => handleRunCheck(checkType)}
                              disabled={isRunning}
                              className="btn btn-primary btn-sm"
                            >
                              <Play className="w-4 h-4 mr-1" />
                              Start
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button
                  onClick={handleRunAllChecks}
                  disabled={Object.values(runningChecks).some(Boolean)}
                  className="btn btn-outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Run All Checks
                </button>

                <div className="flex items-center space-x-4">
                  {allPassed ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      <span className="text-sm font-medium">All checks passed</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-amber-600">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      <span className="text-sm font-medium">Complete all checks to proceed</span>
                    </div>
                  )}

                  <button
                    onClick={onProceed}
                    disabled={!allPassed}
                    className="btn btn-primary"
                  >
                    Proceed to Exam
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">What These Checks Do</h3>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Internet Speed</h4>
              <p className="text-gray-600">
                Ensures you have sufficient bandwidth for the exam platform and any media content.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Device Compatibility</h4>
              <p className="text-gray-600">
                Verifies your browser and operating system are compatible with the secure exam environment.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Audio Test</h4>
              <p className="text-gray-600">
                Tests microphone access and functionality for proctoring or audio-based questions.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Video Test</h4>
              <p className="text-gray-600">
                Verifies camera access and video recording capabilities for identity verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompatibilityChecks;