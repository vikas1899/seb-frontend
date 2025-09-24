import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, BookOpen, Calendar, Users, CheckCircle, Clock } from 'lucide-react';
import { useExams, useDashboard } from '../../hooks/useExams';
import Header from '../common/Header';
import Footer from '../common/Footer';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import ExamCard from './ExamCard';

const Dashboard = () => {
  const { exams, loading: examsLoading, error: examsError, refetch } = useExams();
  const { dashboardData, loading: dashboardLoading } = useDashboard();

  const stats = dashboardData || {
    totalExams: 0,
    activeExams: 0,
    completedExams: 0,
    totalAttempts: 0,
  };

  const recentExams = exams.slice(0, 6);

  const statCards = [
    { name: 'Total Exams', value: stats.totalExams, icon: BookOpen, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { name: 'Active Exams', value: stats.activeExams, icon: Clock, color: 'text-green-600', bgColor: 'bg-green-50' },
    { name: 'Completed', value: stats.completedExams, icon: CheckCircle, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { name: 'Total Attempts', value: stats.totalAttempts, icon: Users, color: 'text-orange-600', bgColor: 'bg-orange-50' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Manage your exams and view analytics</p>
            </div>
            <Link to="/teacher/create-exam" className="btn btn-primary inline-flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Create Exam</span>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => (
            <div key={stat.name} className="card">
              <div className="card-content p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardLoading ? '...' : stat.value}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Exams</h2>
            <Link to="/teacher/exams" className="text-sm text-primary-600 hover:text-primary-500 font-medium">
              View all exams →
            </Link>
          </div>
          {examsLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" text="Loading exams..." />
            </div>
          ) : examsError ? (
            <ErrorMessage error={examsError} onRetry={refetch} />
          ) : recentExams.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No exams yet</h3>
              <p className="text-gray-600 mb-6">Get started by creating your first exam</p>
              <Link to="/teacher/create-exam" className="btn btn-primary">
                Create Your First Exam
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentExams.map((exam) => (
                <ExamCard key={exam.id} exam={exam} onUpdate={refetch} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;