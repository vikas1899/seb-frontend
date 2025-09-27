import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { validateLoginForm } from '../../utils/validation'
import { Eye, EyeOff, Mail, Lock, BookOpen } from 'lucide-react'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [unsplashImage, setUnsplashImage] = useState('')

  const { login, isAuthenticated, loading, error, clearError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/teacher/dashboard'

  // Fetch Unsplash random image on mount
  useEffect(() => {
    const url = 'https://source.unsplash.com/random/800x800?technology'
    setUnsplashImage(url + '&' + new Date().getTime())
  }, [])


  // Clear auth errors on mount
  useEffect(() => {
    clearError()
  }, [clearError])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validation = validateLoginForm(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      const result = await login(formData)

      if (result.success) {
        toast.success('Login successful!')
        navigate(from, { replace: true })
      } else {
        toast.error(result.error || 'Login failed')
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                SEB Exam Platform
              </h2>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`input pl-10 ${
                      errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`input pl-10 pr-10 ${
                      errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Remember me and Forgot password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <Link
                    to="/teacher/forgot-password"
                    className="font-medium text-primary-600 hover:text-primary-500"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              {/* Submit button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary w-full"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Signing in...</span>
                    </div>
                  ) : (
                    'Sign in'
                  )}
                </button>
                <div className=' flex  flex-row justify-center-safe'>
                   <p className="mt-2 text-sm text-blue-600 ">
              
              <Link
                to="http://localhost:5173/teacher/register"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                create a new account
              </Link>
            </p>
                </div>
              </div>

              {/* Auth error */}
              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Right side - Image/Info */}
      <div
        className="hidden lg:block relative w-0 flex-1"
        style={{
          backgroundImage: unsplashImage
            ? `linear-gradient(135deg, var(--color-primary-600, #4f46e5) 0%, var(--color-primary-800, #312e81) 100%), url(${unsplashImage})`
            : 'linear-gradient(135deg, var(--color-primary-600, #4f46e5) 0%, var(--color-primary-800, #312e81) 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
        }}
      >
        <div className="flex items-center justify-center h-full p-12">
          <div className="text-center text-white">
            <h3 className="text-3xl font-bold mb-4">
              Secure Exam Platform
            </h3>
            <p className="text-xl text-primary-100 mb-8">
              Create and manage secure online exams with Safe Exam Browser integration
            </p>
            <div className="grid grid-cols-1 gap-6 text-primary-100">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-300 rounded-full"></div>
                <span>SEB Integration for secure testing</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-300 rounded-full"></div>
                <span>Compatibility checks and system validation</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-300 rounded-full"></div>
                <span>Easy exam creation and management</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;