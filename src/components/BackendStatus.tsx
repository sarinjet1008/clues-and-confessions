import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';

interface BackendStatusProps {
  onHealthCheck?: (isHealthy: boolean) => void;
}

export const BackendStatus: React.FC<BackendStatusProps> = ({ onHealthCheck }) => {
  const [status, setStatus] = useState<'checking' | 'healthy' | 'unhealthy'>('checking');
  const [error, setError] = useState<string>('');

  const checkHealth = async () => {
    setStatus('checking');
    setError('');
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/health`);
      if (response.ok) {
        setStatus('healthy');
        onHealthCheck?.(true);
      } else {
        setStatus('unhealthy');
        setError(`Server responded with status: ${response.status}`);
        onHealthCheck?.(false);
      }
    } catch (error) {
      setStatus('unhealthy');
      setError('Cannot connect to backend server');
      onHealthCheck?.(false);
    }
  };

  useEffect(() => {
    checkHealth();
    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  if (status === 'healthy') {
    return (
      <div className="flex items-center space-x-2 text-green-600 text-sm">
        <CheckCircle className="w-4 h-4" />
        <span>Backend Connected</span>
      </div>
    );
  }

  if (status === 'checking') {
    return (
      <div className="flex items-center space-x-2 text-blue-600 text-sm">
        <Loader className="w-4 h-4 animate-spin" />
        <span>Checking Backend...</span>
      </div>
    );
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-center space-x-2 text-red-600 mb-2">
        <AlertCircle className="w-5 h-5" />
        <span className="font-medium">Backend Server Not Available</span>
      </div>
      <p className="text-red-700 text-sm mb-3">
        {error || 'Cannot connect to the backend server'}
      </p>
      <div className="text-sm text-red-600">
        <p className="mb-2">To fix this issue:</p>
        <ol className="list-decimal list-inside space-y-1 text-xs">
          <li>Make sure you have an OpenAI API key in your .env file</li>
          <li>Run <code className="bg-red-100 px-1 rounded">npm run backend</code> in a separate terminal</li>
          <li>Or run <code className="bg-red-100 px-1 rounded">npm start</code> to start both frontend and backend</li>
        </ol>
      </div>
      <button
        onClick={checkHealth}
        className="mt-3 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
      >
        Retry Connection
      </button>
    </div>
  );
};