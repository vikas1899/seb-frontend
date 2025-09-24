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
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/teacher/login" replace />} />
        <Route path="/teacher/login" element={<Login />} />
        <Route path="/teacher/register" element={<Register />} />
        
        {/* Student Routes - No auth required */}
        <Route path="/exam/:examId" element={<StudentPortal />} />
        <Route path="/exam/:examId/portal" element={<ExamPortal />} />
        
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
        
        {/* Catch all route */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Page Not Found</h1>
              <p className="mt-2 text-gray-600">The page you're looking for doesn't exist.</p>
            </div>
          </div>
        } />
      </Routes>
    </div>
  )
}

export default App