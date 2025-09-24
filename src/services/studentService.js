import { apiRequest, handleRequest } from './api'

// Student service for exam access and compatibility checks
export const studentService = {
  // Get exam details by exam link/ID (no auth required)
  getExamByLink: async (examId) => {
    return handleRequest(() => 
      apiRequest.get(`/student/exam/${examId}/`)
    )
  },

  // Verify exam access (time window, status, etc.)
  verifyExamAccess: async (examId) => {
    return handleRequest(() => 
      apiRequest.get(`/student/exam/${examId}/verify/`)
    )
  },

  // Submit compatibility check results
  submitCompatibilityCheck: async (examId, checkType, result) => {
    return handleRequest(() => 
      apiRequest.post(`/student/exam/${examId}/compatibility-check/`, {
        checkType,
        result
      })
    )
  },

  // Get compatibility check requirements
  getCompatibilityRequirements: async (examId) => {
    return handleRequest(() => 
      apiRequest.get(`/student/exam/${examId}/compatibility-requirements/`)
    )
  },

  // Get compatibility check status
  getCompatibilityStatus: async (examId, sessionId = null) => {
    const params = sessionId ? { sessionId } : {}
    return handleRequest(() => 
      apiRequest.get(`/student/exam/${examId}/compatibility-status/`, { params })
    )
  },

  // Start exam session (get SEB config)
  startExamSession: async (examId, deviceInfo = {}) => {
    return handleRequest(() => 
      apiRequest.post(`/student/exam/${examId}/start/`, { deviceInfo })
    )
  },

  // Launch exam in SEB
  launchExam: async (examId, sessionId) => {
    return handleRequest(() => 
      apiRequest.post(`/student/exam/${examId}/launch/`, { sessionId })
    )
  },

  // Submit exam completion
  completeExam: async (examId, sessionId, results = {}) => {
    return handleRequest(() => 
      apiRequest.post(`/student/exam/${examId}/complete/`, {
        sessionId,
        results
      })
    )
  },

  // Get SEB download links
  getSEBDownloadLinks: async () => {
    return handleRequest(() => 
      apiRequest.get('/student/seb-download-links/')
    )
  },

  // Test internet speed
  testInternetSpeed: async () => {
    const startTime = Date.now()
    
    return handleRequest(async () => {
      const response = await apiRequest.get('/student/speed-test/', {
        timeout: 30000,
        responseType: 'arraybuffer'
      })
      
      const endTime = Date.now()
      const duration = (endTime - startTime) / 1000
      const bytes = response.data.byteLength
      const speedMbps = (bytes * 8) / (duration * 1000 * 1000)
      
      return {
        data: {
          speed: Math.round(speedMbps * 100) / 100,
          duration,
          bytes,
          timestamp: new Date().toISOString()
        }
      }
    })
  },

  // Test device compatibility
  testDeviceCompatibility: async (deviceInfo) => {
    return handleRequest(() => 
      apiRequest.post('/student/device-compatibility/', deviceInfo)
    )
  },

  // Test audio functionality
  testAudio: async (audioData = null) => {
    const formData = new FormData()
    if (audioData) {
      formData.append('audio', audioData)
    }
    
    return handleRequest(() => 
      apiRequest.post('/student/audio-test/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    )
  },

  // Test video functionality
  testVideo: async (videoData = null) => {
    const formData = new FormData()
    if (videoData) {
      formData.append('video', videoData)
    }
    
    return handleRequest(() => 
      apiRequest.post('/student/video-test/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    )
  },

  // Get exam instructions
  getExamInstructions: async (examId) => {
    return handleRequest(() => 
      apiRequest.get(`/student/exam/${examId}/instructions/`)
    )
  },

  // Report technical issue
  reportIssue: async (examId, issueData) => {
    return handleRequest(() => 
      apiRequest.post(`/student/exam/${examId}/report-issue/`, issueData)
    )
  },

  // Get system requirements
  getSystemRequirements: async () => {
    return handleRequest(() => 
      apiRequest.get('/student/system-requirements/')
    )
  },

  // Validate session
  validateSession: async (examId, sessionId) => {
    return handleRequest(() => 
      apiRequest.post(`/student/exam/${examId}/validate-session/`, { sessionId })
    )
  },

  // Get exam time remaining
  getTimeRemaining: async (examId, sessionId) => {
    return handleRequest(() => 
      apiRequest.get(`/student/exam/${examId}/time-remaining/`, {
        params: { sessionId }
      })
    )
  },

  // Heartbeat to maintain session
  sendHeartbeat: async (examId, sessionId) => {
    return handleRequest(() => 
      apiRequest.post(`/student/exam/${examId}/heartbeat/`, { sessionId })
    )
  }
}

export default studentService;