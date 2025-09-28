// src/hooks/useCompatibilityCheck.js
import { useState, useCallback } from 'react';
import { studentService } from '../services/studentService';
import { getDeviceInfo } from '../utils/helpers';
import toast from 'react-hot-toast';

export const useCompatibilityCheck = (examLink, studentIdentifier) => {
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
                if(response.success) {
                    result = { ...response.data, passed: true };
                    // Submit to backend
                    await studentService.submitCompatibilityCheck(
                        examLink, 
                        studentIdentifier, 
                        checkType, 
                        response.data
                    );
                } else {
                    result.error = response.error;
                }
                break;
                
            case 'device_compatibility':
                const deviceInfo = getDeviceInfo();
                response = await studentService.testDeviceCompatibility(deviceInfo);
                if(response.success) {
                    result = { ...response.data, passed: true };
                    // Submit to backend
                    await studentService.submitCompatibilityCheck(
                        examLink, 
                        studentIdentifier, 
                        checkType, 
                        response.data
                    );
                } else {
                    result.error = response.error;
                }
                break;
                
            case 'audio_check':
                // Test audio - simulate for now
                result = { passed: true, device_available: true, test_passed: true };
                await studentService.submitCompatibilityCheck(
                    examLink, 
                    studentIdentifier, 
                    checkType, 
                    result
                );
                break;
                
            case 'video_check':
                // Test video - simulate for now
                result = { passed: true, device_available: true, test_passed: true };
                await studentService.submitCompatibilityCheck(
                    examLink, 
                    studentIdentifier, 
                    checkType, 
                    result
                );
                break;
                
            default:
                throw new Error(`Unknown check type: ${checkType}`);
        }
        
        setChecks(prev => ({ ...prev, [checkType]: result }));

    } catch (error) {
        result.error = error.message || 'Check failed';
        result.passed = false;
        setChecks(prev => ({ ...prev, [checkType]: result }));
        toast.error(`Failed to run ${checkType} check.`);
    } finally {
        setLoading(false);
    }
  }, [examLink, studentIdentifier]);

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