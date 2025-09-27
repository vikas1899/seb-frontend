import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Teacher Pages
import Login from './pages/teacher/Login';
import Register from './pages/teacher/Register';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import CreateExam from './pages/teacher/CreateExam';
import EditExam from './pages/teacher/EditExam';
import ExamDetails from './pages/teacher/ExamDetails';

// Student Pages
import StudentPortal from './pages/student/StudentPortal';
import ExamPortal from './pages/student/ExamPortal';

// Components
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute from './components/common/PublicRoute'; // Make sure to import
import LoadingSpinner from './components/common/LoadingSpinner';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading SEB Exam Platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/teacher/dashboard" replace />} />

        {/* Public Teacher Routes */}
        <Route
          path="/teacher/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/teacher/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Student Routes */}
        <Route path="/student/exam/:examId" element={<StudentPortal />} />
        <Route path="/student/exam/:examId/portal" element={<ExamPortal />} />

        {/* Legacy student routes */}
        <Route path="/exam/:examId" element={<Navigate to="/student/exam/:examId" replace />} />
        <Route path="/exam/:examId/portal" element={<Navigate to="/student/exam/:examId/portal" replace />} />

        {/* Protected Teacher Routes */}
        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/create-exam"
          element={
            <ProtectedRoute>
              <CreateExam />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/exam/:id/edit"
          element={
            <ProtectedRoute>
              <EditExam />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/exam/:id"
          element={
            <ProtectedRoute>
              <ExamDetails />
            </ProtectedRoute>
          }
        />

        {/* 404 Page */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </div>
  );
}

export default App;