import { apiRequest, handleRequest, uploadFile } from './api'

// Exam service - Updated to match API documentation
export const examService = {
  // Get all exams for current teacher
  getExams: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString()
    return handleRequest(() => 
      apiRequest.get(`/exams/${queryParams ? `?${queryParams}` : ''}`)
    )
  },

  // Get single exam by ID
  getExam: async (examId) => {
    return handleRequest(() => 
      apiRequest.get(`/exams/${examId}/`)
    )
  },

  // Create new exam - Updated to use FormData for file upload
  createExam: async (examData) => {
    const formData = new FormData()
    
    // Add text fields
    formData.append('title', examData.title)
    formData.append('subject', examData.subject)
    formData.append('exam_date', examData.exam_date)
    formData.append('exam_time', examData.exam_time)
    formData.append('duration_minutes', examData.duration_minutes)
    formData.append('launch_window_minutes', examData.launch_window_minutes || 30)
    
    if (examData.description) {
      formData.append('description', examData.description)
    }
    
    if (examData.additional_requirements) {
      formData.append('additional_requirements', examData.additional_requirements)
    }
    
    // Add SEB config file
    if (examData.seb_config_file) {
      formData.append('seb_config_file', examData.seb_config_file)
    }
    
    // Add required checks as JSON string
    if (examData.required_checks) {
      formData.append('required_checks', JSON.stringify(examData.required_checks))
    }

    return handleRequest(() => 
      apiRequest.post('/exams/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    )
  },

  // Update existing exam
  updateExam: async (examId, examData) => {
    const formData = new FormData()
    
    // Add text fields
    if (examData.title) formData.append('title', examData.title)
    if (examData.subject) formData.append('subject', examData.subject)
    if (examData.exam_date) formData.append('exam_date', examData.exam_date)
    if (examData.exam_time) formData.append('exam_time', examData.exam_time)
    if (examData.duration_minutes) formData.append('duration_minutes', examData.duration_minutes)
    if (examData.launch_window_minutes) formData.append('launch_window_minutes', examData.launch_window_minutes)
    if (examData.description !== undefined) formData.append('description', examData.description)
    if (examData.additional_requirements !== undefined) formData.append('additional_requirements', examData.additional_requirements)
    
    // Add SEB config file if provided
    if (examData.seb_config_file) {
      formData.append('seb_config_file', examData.seb_config_file)
    }
    
    // Add required checks if provided
    if (examData.required_checks) {
      formData.append('required_checks', JSON.stringify(examData.required_checks))
    }

    return handleRequest(() => 
      apiRequest.put(`/exams/${examId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    )
  },

  // Delete exam
  deleteExam: async (examId) => {
    return handleRequest(() => 
      apiRequest.delete(`/exams/${examId}/`)
    )
  },

  // Duplicate exam
  duplicateExam: async (examId, newExamData) => {
    return handleRequest(() => 
      apiRequest.post(`/exams/${examId}/duplicate/`, newExamData)
    )
  },

  // Get exam attempts
  getExamAttempts: async (examId) => {
    return handleRequest(() => 
      apiRequest.get(`/exams/${examId}/attempts/`)
    )
  },

}

export default examService;