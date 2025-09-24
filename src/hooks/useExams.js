import { useState, useEffect, useCallback } from 'react';
import { examService } from '../services/examService';
import toast from 'react-hot-toast';

export const useExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExams = useCallback(async () => {
    setLoading(true);
    try {
      const response = await examService.getExams();
      if (response.success) {
        setExams(response.data);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('Failed to fetch exams');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  const createExam = async (examData) => {
    const result = await examService.createExam(examData);
    if (result.success) {
        toast.success('Exam created successfully!');
        fetchExams();
    } else {
        toast.error(result.error || 'Failed to create exam');
    }
    return result;
  };

  const updateExam = async (examId, examData) => {
    const result = await examService.updateExam(examId, examData);
    if (result.success) {
        toast.success('Exam updated successfully!');
        fetchExams();
    } else {
        toast.error(result.error || 'Failed to update exam');
    }
    return result;
  };
  
  const deleteExam = async (examId) => {
    const result = await examService.deleteExam(examId);
    if (result.success) {
        toast.success('Exam deleted successfully!');
        fetchExams();
    } else {
        toast.error(result.error || 'Failed to delete exam');
    }
    return result;
  };

  const uploadSEBConfig = async (examId, file, onProgress) => {
      const result = await examService.uploadSEBConfig(examId, file, onProgress);
      if(!result.success){
          toast.error(result.error || 'Failed to upload SEB config');
      }
      return result;
  }


  return { exams, loading, error, refetch: fetchExams, createExam, updateExam, deleteExam, uploadSEBConfig };
};

export const useExam = (examId) => {
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchExam = useCallback(async () => {
        if(!examId) return;
        setLoading(true);
        try {
            const response = await examService.getExam(examId);
            if(response.success){
                setExam(response.data);
            } else {
                setError(response.error);
            }
        } catch (err) {
            setError('Failed to fetch exam details');
        } finally {
            setLoading(false);
        }
    }, [examId]);

    useEffect(() => {
        fetchExam();
    }, [fetchExam]);

    return { exam, loading, error, refetch: fetchExam };
}

export const useDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await examService.getDashboardData();
            if(response.success){
                setDashboardData(response.data);
            } else {
                setError(response.error);
            }
        } catch (err) {
            setError('Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    return { dashboardData, loading, error, refetch: fetchDashboardData };
}