import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useExams } from '../../hooks/useExams'
import { validateExamForm } from '../../utils/validation'
import { COMPATIBILITY_CHECKS } from '../../utils/constants'
import { 
  ArrowLeft, 
  Upload, 
  Calendar, 
  Clock, 
  BookOpen,
  CheckSquare,
  Square,
  FileText,
  Settings,
  Shield,
  Plus,
  AlertCircle,
  Check
} from 'lucide-react'
import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const CreateExam = () => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    date: '',
    time: '',
    duration: '',
    compatibilityChecks: [],
    sebFile: null,
    instructions: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(1)

  const { createExam, uploadSEBConfig } = useExams()
  const navigate = useNavigate()

  const steps = [
    { id: 1, name: 'Basic Info', icon: BookOpen, description: 'Exam details' },
    { id: 2, name: 'Schedule', icon: Calendar, description: 'Date & time' },
    { id: 3, name: 'Security', icon: Shield, description: 'SEB & checks' },
    { id: 4, name: 'Instructions', icon: FileText, description: 'Student guide' }
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const handleCompatibilityCheck = (checkKey) => {
    setFormData(prev => ({
      ...prev,
      compatibilityChecks: prev.compatibilityChecks.includes(checkKey)
        ? prev.compatibilityChecks.filter(c => c !== checkKey)
        : [...prev.compatibilityChecks, checkKey]
    }))
    
    if (errors.compatibilityChecks) {
      setErrors(prev => ({ ...prev, compatibilityChecks: null }))
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setFormData(prev => ({ ...prev, sebFile: file }))
    
    if (errors.sebFile) {
      setErrors(prev => ({ ...prev, sebFile: null }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validation = validateExamForm(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      const examData = {
        title: formData.title,
        subject: formData.subject,
        description: formData.description,
        scheduled_at: `${formData.date}T${formData.time}:00`,
        duration: parseInt(formData.duration),
        compatibility_checks: formData.compatibilityChecks,
        instructions: formData.instructions
      }

      const result = await createExam(examData)
      
      if (result.success) {
        const examId = result.data.id
        
        if (formData.sebFile) {
          const uploadResult = await uploadSEBConfig(
            examId, 
            formData.sebFile, 
            setUploadProgress
          )
          
          if (!uploadResult.success) {
            toast.error('Exam created but SEB config upload failed')
          }
        }
        
        toast.success('Exam created successfully!')
        navigate(`/teacher/exam/${examId}`)
      } else {
        toast.error(result.error || 'Failed to create exam')
      }
    } catch (err) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
      setUploadProgress(0)
    }
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/teacher/dashboard')}
            className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Create New Exam</h1>
            <p className="text-xl text-gray-600">Set up your secure exam in just a few steps</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between max-w-3xl mx-auto mb-12">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      currentStep >= step.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-white border-2 border-gray-300 text-gray-400'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <div className={`text-sm font-medium ${currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'}`}>
                      {step.name}
                    </div>
                    <div className="text-xs text-gray-400">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-4 transition-colors duration-300 ${
                      currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
                  <p className="text-gray-600">Enter the essential details for your exam</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Exam Title *
                  </label>
                  <input
                    name="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="e.g., Advanced Mathematics Final Exam"
                  />
                  {errors.title && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.title}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.subject ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="e.g., Mathematics, Physics, Computer Science"
                  />
                  {errors.subject && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.subject}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none hover:border-gray-400"
                    placeholder="Provide additional details about the exam content and format"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Schedule */}
          {currentStep === 2 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Schedule & Duration</h2>
                  <p className="text-gray-600">Set when the exam will be available</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Exam Date *
                    </label>
                    <input
                      name="date"
                      type="date"
                      required
                      value={formData.date}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.dateTime ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Start Time *
                    </label>
                    <input
                      name="time"
                      type="time"
                      required
                      value={formData.time}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.dateTime ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                    />
                  </div>
                </div>

                {errors.dateTime && (
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.dateTime}
                  </p>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Duration (minutes) *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      name="duration"
                      type="number"
                      required
                      min="15"
                      max="480"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.duration ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Enter duration in minutes"
                    />
                  </div>
                  {errors.duration && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.duration}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">
                    Minimum 15 minutes, maximum 8 hours (480 minutes)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Security */}
          {currentStep === 3 && (
            <div className="space-y-8">
              {/* SEB Configuration */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">SEB Configuration</h2>
                    <p className="text-gray-600">Upload your Safe Exam Browser config file</p>
                  </div>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <div>
                    <label htmlFor="sebFile" className="cursor-pointer">
                      <span className="text-blue-600 hover:text-blue-500 font-medium">
                        Click to upload
                      </span>{' '}
                      <span className="text-gray-600">or drag and drop your .seb file here</span>
                    </label>
                    <input
                      id="sebFile"
                      name="sebFile"
                      type="file"
                      accept=".seb"
                      required
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Safe Exam Browser configuration files only (.seb)
                  </p>
                  
                  {formData.sebFile && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-center text-green-700">
                        <Check className="w-5 h-5 mr-2" />
                        File selected: {formData.sebFile.name}
                      </div>
                    </div>
                  )}
                  
                  {errors.sebFile && (
                    <p className="mt-2 text-sm text-red-600 flex items-center justify-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.sebFile}
                    </p>
                  )}
                </div>

                {uploadProgress > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Uploading configuration...</span>
                      <span className="text-blue-600 font-medium">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Compatibility Checks */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
                    <Settings className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Compatibility Checks</h2>
                    <p className="text-gray-600">Select system requirements for students</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {Object.values(COMPATIBILITY_CHECKS).map((check) => (
                    <div
                      key={check.key}
                      className={`border-2 rounded-xl p-4 transition-all duration-200 cursor-pointer hover:shadow-sm ${
                        formData.compatibilityChecks.includes(check.key)
                          ? 'border-blue-200 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleCompatibilityCheck(check.key)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1">
                          {formData.compatibilityChecks.includes(check.key) ? (
                            <CheckSquare className="w-6 h-6 text-blue-600" />
                          ) : (
                            <Square className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 mb-1">{check.label}</div>
                          <div className="text-sm text-gray-600 leading-relaxed">{check.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {errors.compatibilityChecks && (
                  <p className="mt-4 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.compatibilityChecks}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Instructions */}
          {currentStep === 4 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mr-4">
                  <FileText className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Student Instructions</h2>
                  <p className="text-gray-600">Provide guidance for students taking the exam</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Instructions (Optional)
                </label>
                <textarea
                  name="instructions"
                  rows={8}
                  value={formData.instructions}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none hover:border-gray-400"
                  placeholder="Enter any special instructions, requirements, or notes for students taking this exam..."
                />
                <p className="mt-2 text-sm text-gray-500">
                  These instructions will be displayed to students before they start the exam
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`inline-flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </button>

            <div className="text-center">
              <span className="text-sm text-gray-500">
                Step {currentStep} of {steps.length}
              </span>
            </div>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Next
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Creating Exam...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Exam
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </main>

      <Footer />
    </div>
  )
}

export default CreateExam;