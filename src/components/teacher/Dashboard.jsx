import React from 'react'
import { Link } from 'react-router-dom'
import { useDashboard } from '../../hooks/useExams'
import { formatDate, formatTime } from '../../utils/helpers'
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Users,
  BookOpen,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Activity
} from 'lucide-react'
import LoadingSpinner from '../common/LoadingSpinner'

const Dashboard = () => {
  const { dashboardData, loading } = useDashboard()

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  const stats = dashboardData || {
    totalExams: 0,
    activeExams: 0,
    completedExams: 0,
    totalAttempts: 0,
    averageScore: 0,
    recentActivity: [],
    upcomingExams: [],
    popularSubjects: []
  }

  const statCards = [
    {
      name: 'Total Exams',
      value: stats.totalExams,
      change: '+12%',
      changeType: 'increase',
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Active Exams',
      value: stats.activeExams,
      change: '+5%',
      changeType: 'increase',
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: 'Total Attempts',
      value: stats.totalAttempts,
      change: '+23%',
      changeType: 'increase',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      name: 'Average Score',
      value: `${stats.averageScore || 0}%`,
      change: stats.averageScore > 75 ? '+2%' : '-1%',
      changeType: stats.averageScore > 75 ? 'increase' : 'decrease',
      icon: BarChart3,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="card">
            <div className="card-content p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
                <div className={`flex items-center text-sm ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.changeType === 'increase' ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {stat.change}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Activity</h3>
            <p className="card-description">Latest exam activities and student interactions</p>
          </div>
          <div className="card-content">
            {stats.recentActivity && stats.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {stats.recentActivity.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'exam_created' ? 'bg-green-100' :
                      activity.type === 'exam_completed' ? 'bg-blue-100' :
                      activity.type === 'student_joined' ? 'bg-purple-100' :
                      'bg-gray-100'
                    }`}>
                      {activity.type === 'exam_created' ? (
                        <BookOpen className="w-4 h-4 text-green-600" />
                      ) : activity.type === 'exam_completed' ? (
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Users className="w-4 h-4 text-purple-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">{formatTime(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Activity className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No recent activity</p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Exams */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Upcoming Exams</h3>
            <p className="card-description">Exams scheduled for the next 7 days</p>
          </div>
          <div className="card-content">
            {stats.upcomingExams && stats.upcomingExams.length > 0 ? (
              <div className="space-y-4">
                {stats.upcomingExams.slice(0, 4).map((exam) => (
                  <div key={exam.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Calendar className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{exam.title}</p>
                        <p className="text-xs text-gray-600">{exam.subject}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900">{formatDate(exam.scheduled_at)}</p>
                      <p className="text-xs text-gray-500">{formatTime(exam.scheduled_at)}</p>
                    </div>
                  </div>
                ))}
                <Link
                  to="/teacher/exams"
                  className="block text-center text-sm text-primary-600 hover:text-primary-500 font-medium pt-2"
                >
                  View all exams →
                </Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No upcoming exams</p>
                <Link
                  to="/teacher/create-exam"
                  className="text-sm text-primary-600 hover:text-primary-500 font-medium"
                >
                  Schedule an exam →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Popular Subjects */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Popular Subjects</h3>
            <p className="card-description">Most frequently used subjects</p>
          </div>
          <div className="card-content">
            {stats.popularSubjects && stats.popularSubjects.length > 0 ? (
              <div className="space-y-3">
                {stats.popularSubjects.slice(0, 5).map((subject, index) => (
                  <div key={subject.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                      <span className="text-sm text-gray-900">{subject.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-primary-600 h-1.5 rounded-full"
                          style={{ width: `${(subject.count / stats.totalExams) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{subject.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <BookOpen className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Exam Status Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Exam Status</h3>
            <p className="card-description">Distribution of exam statuses</p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-900">Completed</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{stats.completedExams}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-900">Active</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{stats.activeExams}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span className="text-sm text-gray-900">Scheduled</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {stats.totalExams - stats.activeExams - stats.completedExams}
                </span>
              </div>
              
              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Total</span>
                  <span className="text-sm font-medium text-gray-900">{stats.totalExams}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quick Stats</h3>
            <p className="card-description">Key performance metrics</p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg. Exam Duration</span>
                <span className="text-sm font-medium text-gray-900">
                  {stats.averageDuration ? `${stats.averageDuration} min` : 'N/A'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pass Rate</span>
                <span className="text-sm font-medium text-gray-900">
                  {stats.passRate ? `${stats.passRate}%` : 'N/A'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg. Attempts per Exam</span>
                <span className="text-sm font-medium text-gray-900">
                  {stats.totalExams > 0 ? Math.round(stats.totalAttempts / stats.totalExams) : 0}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Most Active Day</span>
                <span className="text-sm font-medium text-gray-900">
                  {stats.mostActiveDay || 'Monday'}
                </span>
              </div>
              
              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">This Month</span>
                  <span className="text-sm font-medium text-primary-600">
                    {stats.monthlyAttempts || 0} attempts
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts and Notifications */}
      {(stats.pendingIssues || stats.systemNotifications) && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Alerts & Notifications</h3>
            <p className="card-description">Important updates and system messages</p>
          </div>
          <div className="card-content">
            <div className="space-y-3">
              {stats.pendingIssues && stats.pendingIssues.length > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-900">
                      {stats.pendingIssues.length} pending issue(s) require attention
                    </span>
                  </div>
                </div>
              )}
              
              {stats.systemNotifications && stats.systemNotifications.map((notification, index) => (
                <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm text-blue-900">{notification.message}</p>
                      <p className="text-xs text-blue-600 mt-1">{formatTime(notification.timestamp)}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {(!stats.pendingIssues || stats.pendingIssues.length === 0) && 
               (!stats.systemNotifications || stats.systemNotifications.length === 0) && (
                <div className="text-center py-4">
                  <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">All systems running smoothly</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard;