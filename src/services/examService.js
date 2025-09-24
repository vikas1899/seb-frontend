import { apiRequest, handleRequest, uploadFile } from './api'

// Exam service for teacher operations
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

  // Create new exam
  createExam: async (examData) => {
    return handleRequest(() => 
      apiRequest.post('/exams/', examData)
    )
  },

  // Update existing exam
  updateExam: async (examId, examData) => {
    return handleRequest(() => 
      apiRequest.put(`/exams/${examId}/`, examData)
    )
  },

  // Delete exam
  deleteExam: async (examId) => {
    return handleRequest(() => 
      apiRequest.delete(`/exams/${examId}/`)
    )
  },

  // Duplicate exam
  duplicateExam: async (examId) => {
    return handleRequest(() => 
      apiRequest.post(`/exams/${examId}/duplicate/`)
    )
  },

  // Upload SEB configuration file
  uploadSEBConfig: async (examId, file, onProgress = null) => {
    return handleRequest(() => 
      uploadFile(`/exams/${examId}/seb-config/`, file, onProgress)
    )
  },

  // Download SEB configuration file
  downloadSEBConfig: async (examId) => {
    return handleRequest(() => 
      apiRequest.get(`/exams/${examId}/seb-config/`, {
        responseType: 'blob'
      })
    )
  },

  // Generate exam access link
  generateExamLink: async (examId) => {
    return handleRequest(() => 
      apiRequest.post(`/exams/${examId}/generate-link/`)
    )
  },

  // Get exam statistics
  getExamStats: async (examId) => {
    return handleRequest(() => 
      apiRequest.get(`/exams/${examId}/stats/`)
    )
  },

  // Get exam attempts/submissions
  getExamAttempts: async (examId, params = {}) => {
    const queryParams = new URLSearchParams(params).toString()
    return handleRequest(() => 
      apiRequest.get(`/exams/${examId}/attempts/${queryParams ? `?${queryParams}` : ''}`)
    )
  },

  // Update exam status (activate, deactivate, etc.)
  updateExamStatus: async (examId, status) => {
    return handleRequest(() => 
      apiRequest.patch(`/exams/${examId}/status/`, { status })
    )
  },

  // Get exam dashboard data
  getDashboardData: async () => {
    return handleRequest(() => 
      apiRequest.get('/exams/dashboard/')
    )
  },

  // Bulk operations
  bulkUpdateExams: async (examIds, updates) => {
    return handleRequest(() => 
      apiRequest.post('/exams/bulk-update/', { examIds, updates })
    )
  },

  bulkDeleteExams: async (examIds) => {
    return handleRequest(() => 
      apiRequest.post('/exams/bulk-delete/', { examIds })
    )
  },

  // Export exam data
  exportExam: async (examId, format = 'json') => {
    return handleRequest(() => 
      apiRequest.get(`/exams/${examId}/export/`, {
        params: { format },
        responseType: format === 'csv' ? 'blob' : 'json'
      })
    )
  },

  // Import exam data
  importExam: async (file, onProgress = null) => {
    return handleRequest(() => 
      uploadFile('/exams/import/', file, onProgress)
    )
  }
}

export default examService;