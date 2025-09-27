import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

// Teacher Pages
import Login from './pages/teacher/Login'
import Register from './pages/teacher/Register'
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import CreateExam from './pages/teacher/CreateExam'
import EditExam from './pages/teacher/EditExam'
import ExamDetails from './pages/teacher/ExamDetails'

// Student Pages
import StudentPortal from './pages/student/StudentPortal'
import ExamPortal from './pages/student/ExamPortal'

// Components
import ProtectedRoute from './components/common/ProtectedRoute'
import LoadingSpinner from './components/common/LoadingSpinner'

function App() {
  const { loading, isAuthenticated } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading SEB Exam Platform...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Root redirect */}
        <Route 
          path="/" 
          element={
            <Navigate 
              to={isAuthenticated ? "/teacher/dashboard" : "/teacher/login"} 
              replace 
            />
          } 
        />
        
        {/* Public Teacher Routes */}
        <Route path="/teacher/login" element={<Login />} />
        <Route path="/teacher/register" element={<Register />} />
        
        {/* Student Routes - No auth required */}
        <Route path="/student/exam/:examId" element={<StudentPortal />} />
        <Route path="/student/exam/:examId/portal" element={<ExamPortal />} />
        
        {/* Legacy student routes for backward compatibility */}
        <Route path="/exam/:examId" element={<Navigate to="/student/exam/:examId" replace />} />
        <Route path="/exam/:examId/portal" element={<Navigate to="/student/exam/:examId/portal" replace />} />
        
        {/* Protected Teacher Routes */}
        <Route path="/teacher/dashboard" element={
          <ProtectedRoute>
            <TeacherDashboard />
          </ProtectedRoute>
        } />
        <Route path="/teacher/create-exam" element={
          <ProtectedRoute>
            <CreateExam />
          </ProtectedRoute>
        } />
        <Route path="/teacher/exam/:id/edit" element={
          <ProtectedRoute>
            <EditExam />
          </ProtectedRoute>
        } />
        <Route path="/teacher/exam/:id" element={
          <ProtectedRoute>
            <ExamDetails />
          </ProtectedRoute>
        } />
        
        {/* 404 Page */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md mx-auto px-4">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h1>
              <p className="text-gray-600 mb-8">The page you're looking for doesn't exist or may have been moved.</p>
              <div className="space-y-3">
                <button 
                  onClick={() => window.history.back()} 
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go Back
                </button>
                <button 
                  onClick={() => window.location.href = '/'} 
                  className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        } />
      </Routes>
    </div>
  )
}

export default App;