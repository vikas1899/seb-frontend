// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

// Authentication
export const TOKEN_KEY = 'seb_exam_token'
export const REFRESH_TOKEN_KEY = 'seb_exam_refresh_token'

// Exam Status
export const EXAM_STATUS = {
  DRAFT: 'draft',
  SCHEDULED: 'scheduled',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}

// Compatibility Check Types
export const COMPATIBILITY_CHECKS = {
  INTERNET_SPEED: {
    key: 'internet_speed',
    label: 'Internet Speed Test',
    description: 'Test minimum required internet speed',
    minSpeed: 5 // Mbps
  },
  DEVICE_COMPATIBILITY: {
    key: 'device_compatibility',
    label: 'Device Compatibility',
    description: 'Check OS, browser, and hardware compatibility'
  },
  AUDIO_CHECK: {
    key: 'audio_check',
    label: 'Audio Test',
    description: 'Test microphone and speaker functionality'
  },
  VIDEO_CHECK: {
    key: 'video_check',
    label: 'Video Test',
    description: 'Test camera functionality'
  },
  WEBCAM_ACCESS: {
    key: 'webcam_access',
    label: 'Webcam Access',
    description: 'Verify webcam permissions and functionality'
  },
  SCREEN_RECORDING: {
    key: 'screen_recording',
    label: 'Screen Recording',
    description: 'Test screen capture capabilities'
  }
}

// SEB Download Links
export const SEB_DOWNLOAD_LINKS = {
  WINDOWS: 'https://safeexambrowser.org/download_en.html',
  MAC: 'https://safeexambrowser.org/download_en.html',
  IOS: 'https://apps.apple.com/app/safe-exam-browser/id1447243784'
}

// Time Constants
export const TIME_CONSTANTS = {
  EXAM_LAUNCH_WINDOW: 30, // minutes
  TOKEN_REFRESH_THRESHOLD: 5, // minutes before expiry
  COMPATIBILITY_CHECK_TIMEOUT: 30 // seconds
}

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_EXTENSIONS: ['.seb'],
  SUPPORTED_FORMATS: ['application/octet-stream', 'application/x-seb']
}

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Session expired. Please login again.',
  FILE_TOO_LARGE: 'File size exceeds the maximum limit of 10MB.',
  INVALID_FILE_TYPE: 'Please upload a valid SEB configuration file (.seb).',
  EXAM_NOT_FOUND: 'Exam not found or has expired.',
  EXAM_TIME_INVALID: 'Exam is not available at this time.',
  COMPATIBILITY_FAILED: 'Please complete all required compatibility checks.',
  SEB_NOT_INSTALLED: 'Safe Exam Browser is not installed or configured properly.'
}

// Success Messages
export const SUCCESS_MESSAGES = {
  EXAM_CREATED: 'Exam created successfully!',
  EXAM_UPDATED: 'Exam updated successfully!',
  EXAM_DELETED: 'Exam deleted successfully!',
  LOGIN_SUCCESS: 'Login successful!',
  REGISTER_SUCCESS: 'Registration successful!',
  COMPATIBILITY_PASSED: 'All compatibility checks passed!',
  FILE_UPLOADED: 'SEB configuration file uploaded successfully!'
}

// Validation Rules
export const VALIDATION = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 3,
  EXAM_TITLE_MIN_LENGTH: 3,
  EXAM_TITLE_MAX_LENGTH: 100,
  EXAM_DURATION_MIN: 15, // minutes
  EXAM_DURATION_MAX: 480 // 8 hours
}

// UI Constants
export const UI = {
  ITEMS_PER_PAGE: 10,
  MOBILE_BREAKPOINT: 768,
  SIDEBAR_WIDTH: 256
}

export default {
  API_BASE_URL,
  TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  EXAM_STATUS,
  COMPATIBILITY_CHECKS,
  SEB_DOWNLOAD_LINKS,
  TIME_CONSTANTS,
  FILE_UPLOAD,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION,
  UI
}