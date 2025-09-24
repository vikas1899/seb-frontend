import React from 'react';
import { useParams } from 'react-router-dom';
import { useExams } from '../../hooks/useExams';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { formatDateTime } from '../../utils/helpers';
import Header from '../common/Header';
import Footer from '../common/Footer';

const ExamAttempts = () => {
  const { id } = useParams();
  const { exam, loading, error } = useExams(id);

  if (loading) return <LoadingSpinner size="lg" text="Loading attempts..." />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Exam Attempts for {exam?.title}</h1>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Started At</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed At</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {exam?.attempts?.map((attempt) => (
                    <tr key={attempt.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{attempt.student_identifier}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{attempt.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateTime(attempt.started_at)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{attempt.completed_at ? formatDateTime(attempt.completed_at) : 'N/A'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </main>
        <Footer />
    </div>
  );
};

export default ExamAttempts;