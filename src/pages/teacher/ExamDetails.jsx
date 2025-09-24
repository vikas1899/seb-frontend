import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useExam, useExams } from '../../hooks/useExams'
import {
  ArrowLeft,
  Edit,
  Copy,
  Share,
  Download,
  Trash2,
  Calendar,
  Clock,
  Users,
  Settings,
  FileText,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Play
} from 'lucide-react'
import { 
  formatDateTime, 
  formatDuration, 
  copyToClipboard, 
  generateExamUrl 
} from '../../utils/helpers'
import { EXAM_STATUS, COMPATIBILITY_CHECKS } from '../../utils/constants'
import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import ConfirmModal from '../../components/common/ConfirmModal'
import toast from 'react-hot-toast'

const ExamDetails = () => {
  const { id } = useParams()
  const { exam, loading, error, refetch } = useExam(id)
  const { deleteExam, duplicateExam, generateExamLink, updateExamStatus } = useExams()
  const navigate = useNavigate()

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isGeneratingLink, setIsGeneratingLink] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  const getStatusColor = (status) => {
    switch (status) {
      case EXAM_STATUS.DRAFT:
        return 'bg-gray-100 text-gray-800'
      case EXAM_STATUS.SCHEDULED:
        return 'bg-blue-100 text-blue-800'
      case EXAM_STATUS.ACTIVE:
        return 'bg-green-100 text-green-800'
      case EXAM_STATUS.COMPLETED:
        return 'bg-purple-100 text-purple-800'
      case EXAM_STATUS.CANCELLED:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteExam(id)
      if (result.success) {
        toast.success('Exam deleted successfully!')
        navigate('/teacher/dashboard')
      }
    } catch (error) {
      console.error('Delete failed:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDuplicate = async () => {
    try {
      const result = await duplicateExam(id)
      if (result.success) {
        navigate(`/teacher/exam/${result.data.id}`)
      }
    } catch (error) {
      console.error('Duplicate failed:', error)
    }
  }

  const handleGenerateLink = async () => {
    setIsGeneratingLink(true)
    try {
      const result = await generateExamLink(id)
      if (result.success) {
        refetch()
        toast.success('Exam link generated successfully!')
      }
    } catch (error) {
      console.error('Generate link failed:', error)
    } finally {
      setIsGeneratingLink(false)
    }
  }

  const handleShareLink = async () => {
    const examUrl = exam.access_link || generateExamUrl(id)
    const success = await copyToClipboard(examUrl)
    if (success) {
      toast.success('Exam link copied to clipboard!')
    } else {
      toast.error('Failed to copy link')
    }
  }

  const handleStatusChange = async (newStatus) => {
    setIsUpdatingStatus(true)
    try {
      const result = await updateExamStatus(id, newStatus)
      if (result.success) {
        refetch()
        toast.success('Exam status updated successfully!')
      }
    } catch (error) {
      console.error('Status update failed:', error)
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading exam details..." />
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <ErrorMessage error={error} onRetry={refetch} />
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/teacher/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{exam.title}</h1>
              <p className="text-gray-600">{exam.subject}</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(exam.status)}`}>
                {exam.status}
              </span>
              
              <div className="flex items-center space-x-2">
                <Link
                  to={`/teacher/exam/${id}/edit`}
                  className="btn btn-outline btn-sm"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Link>
                
                <button
                  onClick={handleDuplicate}
                  className="btn btn-outline btn-sm"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </button>
                
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="btn btn-outline btn-sm text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Exam Information */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Exam Information
                </h3>
              </div>
              <div className="card-content space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-700">
                      <Calendar className="w-5 h-5 mr-3 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Scheduled Date & Time</p>
                        <p className="font-medium">{formatDateTime(exam.scheduled_at)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-700">
                      <Clock className="w-5 h-5 mr-3 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="font-medium">{formatDuration(exam.duration)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-700">
                      <Users className="w-5 h-5 mr-3 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Total Attempts</p>
                        <p className="font-medium">{exam.attempts_count || 0}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-700">
                      <Settings className="w-5 h-5 mr-3 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className="font-medium capitalize">{exam.status}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {exam.description && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-2">Description</p>
                    <p className="text-gray-700">{exam.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Compatibility Checks */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Compatibility Requirements
                </h3>
              </div>
              <div className="card-content">
                {exam.compatibility_checks && exam.compatibility_checks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {exam.compatibility_checks.map((checkKey) => {
                      const check = Object.values(COMPATIBILITY_CHECKS).find(c => c.key === checkKey)
                      return check ? (
                        <div key={checkKey} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-900">{check.label}</p>
                            <p className="text-sm text-gray-600">{check.description}</p>
                          </div>
                        </div>
                      ) : null
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500">No compatibility checks required</p>
                )}
              </div>
            </div>

            {/* Instructions */}
            {exam.instructions && (
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Student Instructions</h3>
                </div>
                <div className="card-content">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">{exam.instructions}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Quick Actions</h3>
              </div>
              <div className="card-content space-y-3">
                {!exam.access_link ? (
                  <button
                    onClick={handleGenerateLink}
                    disabled={isGeneratingLink}
                    className="btn btn-primary w-full"
                  >
                    {isGeneratingLink ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Generate Exam Link
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleShareLink}
                    className="btn btn-primary w-full"
                  >
                    <Share className="w-4 h-4 mr-2" />
                    Copy Exam Link
                  </button>
                )}
                
                <Link
                  to={`/teacher/exam/${id}/attempts`}
                  className="btn btn-outline w-full"
                >
                  <Users className="w-4 h-4 mr-2" />
                  View Attempts
                </Link>
                
                <Link
                  to={`/teacher/exam/${id}/edit`}
                  className="btn btn-outline w-full"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Exam
                </Link>
              </div>
            </div>

            {/* Exam Link */}
            {exam.access_link && (
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Exam Access Link</h3>
                </div>
                <div className="card-content">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Share this link with students:</p>
                    <div className="flex items-center space-x-2">
                      <code className="flex-1 text-xs bg-white p-2 rounded border text-gray-700 truncate">
                        {exam.access_link}
                      </code>
                      <button
                        onClick={handleShareLink}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                        title="Copy link"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Status Management */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Status Management</h3>
              </div>
              <div className="card-content space-y-3">
                <p className="text-sm text-gray-600">
                  Current status: <span className="font-medium capitalize">{exam.status}</span>
                </p>
                
                <div className="space-y-2">
                  {exam.status === EXAM_STATUS.DRAFT && (
                    <button
                      onClick={() => handleStatusChange(EXAM_STATUS.SCHEDULED)}
                      disabled={isUpdatingStatus}
                      className="btn btn-outline btn-sm w-full"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Activate Exam
                    </button>
                  )}
                  
                  {exam.status === EXAM_STATUS.SCHEDULED && (
                    <button
                      onClick={() => handleStatusChange(EXAM_STATUS.CANCELLED)}
                      disabled={isUpdatingStatus}
                      className="btn btn-outline btn-sm w-full text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Cancel Exam
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* SEB Configuration */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">SEB Configuration</h3>
              </div>
              <div className="card-content">
                {exam.seb_config ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Configuration uploaded</span>
                    </div>
                    <button className="btn btn-outline btn-sm w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download Config
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-yellow-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">No configuration uploaded</span>
                    </div>
                    <Link
                      to={`/teacher/exam/${id}/edit`}
                      className="btn btn-outline btn-sm w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Config
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Statistics */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Statistics</h3>
              </div>
              <div className="card-content space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Attempts</span>
                  <span className="font-semibold">{exam.attempts_count || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="font-semibold">{exam.completed_attempts || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">In Progress</span>
                  <span className="font-semibold">{exam.active_attempts || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average Score</span>
                  <span className="font-semibold">
                    {exam.average_score ? `${exam.average_score}%` : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Exam"
        message={`Are you sure you want to delete "${exam.title}"? This action cannot be undone and will remove all associated data.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        loading={isDeleting}
      />

      <Footer />
    </div>
  )
}

export default ExamDetails;