import { apiRequest, handleRequest } from './api'

// Student service - Updated to match API documentation
export const studentService = {
  // Get exam details by exam link (no auth required)
  getExamByLink: async (examLink) => {
    return handleRequest(() => 
      apiRequest.get(`/students/exam/${examLink}/`)
    )
  },

  // Get compatibility checks for exam
  getCompatibilityChecks: async (examLink, studentIdentifier) => {
    const params = new URLSearchParams({ 
      exam_link: examLink, 
      student_identifier: studentIdentifier 
    })
    return handleRequest(() => 
      apiRequest.get(`/students/compatibility-checks/?${params}`)
    )
  },

  // Submit compatibility check results
  submitCompatibilityCheck: async (examLink, studentIdentifier, checkType, resultData) => {
    return handleRequest(() => 
      apiRequest.post('/students/compatibility-checks/', {
        exam_link: examLink,
        student_identifier: studentIdentifier,
        check_type: checkType,
        result_data: resultData
      })
    )
  },

  // Launch exam
  launchExam: async (examLink, studentIdentifier) => {
    return handleRequest(() => 
      apiRequest.post('/students/launch-exam/', {
        exam_link: examLink,
        student_identifier: studentIdentifier
      })
    )
  },

  // Download SEB configuration
  downloadSEBConfig: async (examLink, studentIdentifier) => {
    const params = new URLSearchParams({ student: studentIdentifier })
    return handleRequest(() => 
      apiRequest.get(`/students/seb-config/${examLink}/?${params}`, {
        responseType: 'blob'
      })
    )
  },

  // Complete exam
  completeExam: async (examLink, studentIdentifier, status = 'completed') => {
    return handleRequest(() => 
      apiRequest.post('/students/complete-exam/', {
        exam_link: examLink,
        student_identifier: studentIdentifier,
        status
      })
    )
  },

  // Test internet speed - Simple implementation
  testInternetSpeed: async () => {
    const startTime = Date.now()
    
    try {
      // Use a small test endpoint or create a simple speed test
      const response = await fetch('/api/students/speed-test/', {
        method: 'GET',
        cache: 'no-cache'
      })
      
      const endTime = Date.now()
      const duration = (endTime - startTime) / 1000
      
      // Simple speed calculation (this is basic, real implementation would be more sophisticated)
      const estimatedSpeed = duration < 1 ? 50 : (duration < 2 ? 25 : 10)
      
      return {
        success: true,
        data: {
          download_speed: estimatedSpeed,
          upload_speed: estimatedSpeed * 0.2,
          ping: Math.round(duration * 20),
          success: true
        }
      }
    } catch (error) {
      return {
        success: false,
        error: 'Speed test failed'
      }
    }
  },

  // Test device compatibility
  testDeviceCompatibility: async (deviceInfo) => {
    // This would typically be handled client-side
    return {
      success: true,
      data: {
        os: deviceInfo.os,
        browser: deviceInfo.browser,
        compatible: true,
        success: true
      }
    }
  }
}

export default studentService;