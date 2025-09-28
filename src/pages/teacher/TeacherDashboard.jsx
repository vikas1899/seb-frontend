import React from 'react'
import { Link } from 'react-router-dom'
import { useExams, useDashboard } from '../../hooks/useExams'
import { 
  Plus, 
  BookOpen, 
  Calendar, 
  Users, 
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Settings,
  BarChart3
} from 'lucide-react'
import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import ExamCard from '../../components/teacher/ExamCard'
import { formatDate } from '../../utils/helpers'

const TeacherDashboard = () => {
  const { exams, loading: examsLoading, error: examsError, refetch } = useExams()
  const { dashboardData, loading: dashboardLoading } = useDashboard()

  const stats = dashboardData || {
    totalExams: 0,
    activeExams: 0,
    completedExams: 0,
    totalAttempts: 0
  }

  const recentExams = exams.slice(0, 6)

  const statCards = [
    {
      name: 'Total Exams',
      value: stats.totalExams,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      change: '+12%',
      changeType: 'increase'
    },
    {
      name: 'Active Exams',
      value: stats.activeExams,
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      change: '+8%',
      changeType: 'increase'
    },
    {
      name: 'Completed',
      value: stats.completedExams,
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      change: '+24%',
      changeType: 'increase'
    },
    {
      name: 'Total Attempts',
      value: stats.totalAttempts,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      change: '+18%',
      changeType: 'increase'
    }
  ]

  const quickActions = [
    {
      title: 'Create New Exam',
      description: 'Set up a new secure exam with advanced settings',
      icon: Plus,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      href: '/teacher/create-exam'
    },
    {
      title: 'Manage Exams',
      description: 'View, edit, and organize your existing exams',
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      href: '/teacher/exams'
    },
    {
      title: 'View Analytics',
      description: 'Analyze exam performance and student results',
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      href: '/teacher/analytics'
    },
    {
      title: 'Settings',
      description: 'Configure your account and platform preferences',
      icon: Settings,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      href: '/teacher/settings'
    }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
                <p className="text-blue-100 text-lg">
                  Ready to create and manage your secure exams?
                </p>
              </div>
              <Link
                to="/teacher/create-exam"
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-sm"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Exam
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => (
            <div key={stat.name} className={`bg-white rounded-xl border ${stat.borderColor} p-6 hover:shadow-md transition-shadow`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardLoading ? (
                      <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      stat.value
                    )}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Exams Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Recent Exams</h2>
              <p className="text-gray-600 mt-1">Your latest exam activities</p>
            </div>
            <Link
              to="/teacher/exams"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              View all exams
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {examsLoading ? (
            <div className="flex items-center justify-center py-12 bg-white rounded-xl border border-gray-200">
              <LoadingSpinner size="lg" text="Loading exams..." />
            </div>
          ) : examsError ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <ErrorMessage error={examsError} onRetry={refetch} />
            </div>
          ) : recentExams.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No exams yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Get started by creating your first secure exam. It's quick and easy!
              </p>
              <Link 
                to="/teacher/create-exam" 
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Exam
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentExams.map((exam) => (
                <div key={exam.id} className="transform hover:scale-105 transition-transform">
                  <ExamCard exam={exam} onUpdate={refetch} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Quick Actions</h3>
            <p className="text-gray-600 mt-1">
              Common tasks to help you manage your exams efficiently
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                to={action.href}
                className={`group flex flex-col items-start p-6 border ${action.borderColor} rounded-xl hover:shadow-md transition-all duration-200 hover:-translate-y-1`}
              >
                <div className={`p-3 rounded-xl ${action.bgColor} mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className={`w-6 h-6 ${action.color}`} />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {action.title}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {action.description}
                </p>
                <div className="flex items-center mt-4 text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Get started
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Recent Activity</h3>
            <p className="text-gray-600 mt-1">Latest updates from your exams</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-4"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  New exam attempt submitted for "Advanced Mathematics"
                </p>
                <p className="text-sm text-gray-600">2 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-4"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  "Physics Quiz" exam has been completed by all students
                </p>
                <p className="text-sm text-gray-600">1 hour ago</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-orange-50 border border-orange-200 rounded-xl">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-4"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  System update: Enhanced security features now available
                </p>
                <p className="text-sm text-gray-600">3 hours ago</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Link 
              to="/teacher/activity" 
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              View all activity
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default TeacherDashboard;