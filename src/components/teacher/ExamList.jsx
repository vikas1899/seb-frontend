import React from 'react';
import { useExams } from '../../hooks/useExams';
import ExamCard from './ExamCard';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const ExamList = () => {
  const { exams, loading, error, refetch } = useExams();

  if (loading) return <LoadingSpinner size="lg" text="Loading exams..." />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;

  return (
    <div>
      {exams.length === 0 ? (
        <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No exams found</h3>
            <p className="text-gray-600 mb-6">Create your first exam to get started.</p>
            <Link to="/teacher/create-exam" className="btn btn-primary">
            Create Exam
            </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} onUpdate={refetch} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExamList;