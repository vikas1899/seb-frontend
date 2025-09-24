import { VALIDATION, FILE_UPLOAD } from './constants'

// Email validation
export const validateEmail = (email) => {
  if (!email) return 'Email is required'
  if (!VALIDATION.EMAIL.test(email)) return 'Please enter a valid email address'
  return null
}

// Password validation
export const validatePassword = (password) => {
  if (!password) return 'Password is required'
  if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters long`
  }
  return null
}

// Confirm password validation
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Please confirm your password'
  if (password !== confirmPassword) return 'Passwords do not match'
  return null
}

// Name validation
export const validateName = (name, fieldName = 'Name') => {
  if (!name) return `${fieldName} is required`
  if (name.length < 2) return `${fieldName} must be at least 2 characters long`
  if (name.length > 50) return `${fieldName} must be less than 50 characters`
  return null
}

// Exam title validation
export const validateExamTitle = (title) => {
  if (!title) return 'Exam title is required'
  if (title.length < VALIDATION.EXAM_TITLE_MIN_LENGTH) {
    return `Exam title must be at least ${VALIDATION.EXAM_TITLE_MIN_LENGTH} characters long`
  }
  if (title.length > VALIDATION.EXAM_TITLE_MAX_LENGTH) {
    return `Exam title must be less than ${VALIDATION.EXAM_TITLE_MAX_LENGTH} characters`
  }
  return null
}

// Subject validation
export const validateSubject = (subject) => {
  if (!subject) return 'Subject is required'
  if (subject.length < 2) return 'Subject must be at least 2 characters long'
  if (subject.length > 50) return 'Subject must be less than 50 characters'
  return null
}

// Duration validation
export const validateDuration = (duration) => {
  if (!duration) return 'Duration is required'
  
  const durationNum = parseInt(duration)
  if (isNaN(durationNum)) return 'Duration must be a number'
  if (durationNum < VALIDATION.EXAM_DURATION_MIN) {
    return `Duration must be at least ${VALIDATION.EXAM_DURATION_MIN} minutes`
  }
  if (durationNum > VALIDATION.EXAM_DURATION_MAX) {
    return `Duration must be less than ${VALIDATION.EXAM_DURATION_MAX} minutes`
  }
  return null
}

// Date validation
export const validateExamDate = (date) => {
  if (!date) return 'Exam date is required'
  
  const examDate = new Date(date)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const examDateOnly = new Date(examDate.getFullYear(), examDate.getMonth(), examDate.getDate())
  
  if (examDateOnly < today) return 'Exam date cannot be in the past'
  return null
}

// Time validation
export const validateExamTime = (time) => {
  if (!time) return 'Exam time is required'
  return null
}

// Date and time combination validation
export const validateExamDateTime = (date, time) => {
  if (!date || !time) return 'Both date and time are required'
  
  const examDateTime = new Date(`${date} ${time}`)
  const now = new Date()
  
  if (examDateTime <= now) return 'Exam must be scheduled for a future date and time'
  
  // Check if exam is at least 30 minutes from now
  const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60000)
  if (examDateTime < thirtyMinutesFromNow) {
    return 'Exam must be scheduled at least 30 minutes in advance'
  }
  
  return null
}

// File validation
export const validateSEBFile = (file) => {
  if (!file) return 'SEB configuration file is required'
  
  // Check file size
  if (file.size > FILE_UPLOAD.MAX_SIZE) {
    return `File size must be less than ${Math.round(FILE_UPLOAD.MAX_SIZE / (1024 * 1024))}MB`
  }
  
  // Check file extension
  const fileName = file.name.toLowerCase()
  if (!fileName.endsWith('.seb')) {
    return 'Please upload a valid SEB configuration file (.seb)'
  }
  
  return null
}

// URL validation
export const validateUrl = (url) => {
  if (!url) return null // URL is optional
  
  try {
    new URL(url)
    return null
  } catch {
    return 'Please enter a valid URL'
  }
}

// Compatibility checks validation
export const validateCompatibilityChecks = (checks) => {
  if (!checks || !Array.isArray(checks)) return 'At least one compatibility check must be selected'
  if (checks.length === 0) return 'At least one compatibility check must be selected'
  return null
}

// Form validation helpers
export const validateLoginForm = (formData) => {
  const errors = {}
  
  const emailError = validateEmail(formData.email)
  if (emailError) errors.email = emailError
  
  const passwordError = validatePassword(formData.password)
  if (passwordError) errors.password = passwordError
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  }
}

export const validateRegisterForm = (formData) => {
  const errors = {}
  
  const firstNameError = validateName(formData.firstName, 'First name')
  if (firstNameError) errors.firstName = firstNameError
  
  const lastNameError = validateName(formData.lastName, 'Last name')
  if (lastNameError) errors.lastName = lastNameError
  
  const emailError = validateEmail(formData.email)
  if (emailError) errors.email = emailError
  
  const passwordError = validatePassword(formData.password)
  if (passwordError) errors.password = passwordError
  
  const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword)
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  }
}

export const validateExamForm = (formData) => {
  const errors = {}
  
  const titleError = validateExamTitle(formData.title)
  if (titleError) errors.title = titleError
  
  const subjectError = validateSubject(formData.subject)
  if (subjectError) errors.subject = subjectError
  
  const durationError = validateDuration(formData.duration)
  if (durationError) errors.duration = durationError
  
  const dateTimeError = validateExamDateTime(formData.date, formData.time)
  if (dateTimeError) errors.dateTime = dateTimeError
  
  const compatibilityError = validateCompatibilityChecks(formData.compatibilityChecks)
  if (compatibilityError) errors.compatibilityChecks = compatibilityError
  
  if (formData.sebFile) {
    const fileError = validateSEBFile(formData.sebFile)
    if (fileError) errors.sebFile = fileError
  } else if (!formData.id) {
    // SEB file is required for new exams
    errors.sebFile = 'SEB configuration file is required'
  }
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  }
}

// Real-time validation helpers
export const createValidator = (validationFn) => {
  return (value) => {
    const error = validationFn(value)
    return {
      isValid: !error,
      error
    }
  }
}

export const validators = {
  email: createValidator(validateEmail),
  password: createValidator(validatePassword),
  name: createValidator((value) => validateName(value)),
  examTitle: createValidator(validateExamTitle),
  subject: createValidator(validateSubject),
  duration: createValidator(validateDuration),
  examDate: createValidator(validateExamDate),
  examTime: createValidator(validateExamTime),
  sebFile: createValidator(validateSEBFile),
  url: createValidator(validateUrl)
}

export default {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateName,
  validateExamTitle,
  validateSubject,
  validateDuration,
  validateExamDate,
  validateExamTime,
  validateExamDateTime,
  validateSEBFile,
  validateUrl,
  validateCompatibilityChecks,
  validateLoginForm,
  validateRegisterForm,
  validateExamForm,
  validators
}