import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useExams } from '../../hooks/useExams'
import {
  Calendar,
  Clock,
  Users,
  Settings,
  Copy,
  ExternalLink,
  Trash2,
  Edit,
  Share,
  Download
} from 'lucide-react'
import { formatDateTime, formatDuration, copyToClipboard, generateExamUrl } from '../../utils/helpers'
import { EXAM_STATUS } from '../../utils/constants'
import ConfirmModal from '../common/ConfirmModal'
import toast from 'react-hot-toast'

const ExamCard = ({ exam, onUpdate }) => {
  const { deleteExam, duplicateExam, generateExamLink } = useExams()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isGeneratingLink, setIsGeneratingLink] = useState(false)

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
      const result = await deleteExam(exam.id)
      if (result.success) {
        setShowDeleteModal(false)
        onUpdate && onUpdate()
      }
    } catch (error) {
      console.error('Delete failed:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDuplicate = async () => {
    try {
      const result = await duplicateExam(exam.id)
      if (result.success) {
        onUpdate && onUpdate()
      }
    } catch (error) {
      console.error('Duplicate failed:', error)
    }
  }

  const handleGenerateLink = async () => {
    setIsGeneratingLink(true)
    try {
      const result = await generateExamLink(exam.id)
      if (result.success) {
        onUpdate && onUpdate()
        toast.success('Exam link generated successfully!')
      }
    } catch (error) {
      console.error('Generate link failed:', error)
    } finally {
      setIsGeneratingLink(false)
    }
  }

  const handleShareLink = async () => {
    const examUrl = exam.access_link || generateExamUrl(exam.id)
    const success = await copyToClipboard(examUrl)
    if (success) {
      toast.success('Exam link copied to clipboard!')
    } else {
      toast.error('Failed to copy link')
    }
  }

  return (
    <>
      <div className="card hover:shadow-md transition-shadow">
        <div className="card-content p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {exam.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {exam.subject}
              </p>
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(exam.status)}`}>
              {exam.status}
            </span>
          </div>

          {/* Exam Details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{formatDateTime(exam.scheduled_at)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{formatDuration(exam.duration)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Users className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{exam.attempts_count || 0} attempts</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <Link
                to={`/teacher/exam/${exam.id}`}
                className="text-primary-600 hover:text-primary-500 text-sm font-medium"
              >
                View Details
              </Link>
              {exam.access_link && (
                <button
                  onClick={handleShareLink}
                  className="text-gray-600 hover:text-gray-500"
                  title="Copy exam link"
                >
                  <Share className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center space-x-1">
              {/* Generate Link */}
              {!exam.access_link && (
                <button
                  onClick={handleGenerateLink}
                  disabled={isGeneratingLink}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                  title="Generate exam link"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              )}

              {/* Edit */}
              <Link
                to={`/teacher/exam/${exam.id}/edit`}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                title="Edit exam"
              >
                <Edit className="w-4 h-4" />
              </Link>

              {/* Duplicate */}
              <button
                onClick={handleDuplicate}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                title="Duplicate exam"
              >
                <Copy className="w-4 h-4" />
              </button>

              {/* Delete */}
              <button
                onClick={() => setShowDeleteModal(true)}
                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                title="Delete exam"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Exam"
        message={`Are you sure you want to delete "${exam.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        loading={isDeleting}
      />
    </>
  )
}

export default ExamCard;