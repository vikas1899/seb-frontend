import { useState, useCallback } from 'react';
import { studentService } from '../services/studentService';
import { getDeviceInfo } from '../utils/helpers';
import toast from 'react-hot-toast';

export const useCompatibilityCheck = (examId) => {
  const [checks, setChecks] = useState({});
  const [loading, setLoading] = useState(false);

  const runCheck = useCallback(async (checkType) => {
    setLoading(true);
    let result = { passed: false, error: null };

    try {
        let response;
        switch (checkType) {
            case 'internet_speed':
                response = await studentService.testInternetSpeed();
                if(response.success) result = { ...response.data, passed: true };
                else result.error = response.error;
                break;
            case 'device_compatibility':
                const deviceInfo = getDeviceInfo();
                response = await studentService.testDeviceCompatibility(deviceInfo);
                if(response.success) result = { ...response.data, passed: true };
                else result.error = response.error;
                break;
            case 'audio_check':
                // This would typically involve user interaction to record and playback audio
                // For this example, we'll simulate a successful check
                result = { passed: true, device_available: true, test_passed: true };
                break;
            case 'video_check':
                // This would also involve user interaction with the webcam
                // We'll simulate success here as well
                result = { passed: true, device_available: true, test_passed: true };
                break;
            default:
                throw new Error(`Unknown check type: ${checkType}`);
        }
        
        await studentService.submitCompatibilityCheck(examId, checkType, result);
        setChecks(prev => ({ ...prev, [checkType]: result }));

    } catch (error) {
        result.error = error.message || 'Check failed';
        setChecks(prev => ({ ...prev, [checkType]: result }));
        toast.error(`Failed to run ${checkType} check.`);
    } finally {
        setLoading(false);
    }
  }, [examId]);

  const runAllChecks = useCallback(async (requirements) => {
    setLoading(true);
    for (const checkType of requirements) {
        await runCheck(checkType);
    }
    setLoading(false);
  }, [runCheck]);

  const cleanup = () => {
    // Cleanup any resources like camera or microphone streams if they were used
  };

  return { checks, loading, runCheck, runAllChecks, cleanup };
};