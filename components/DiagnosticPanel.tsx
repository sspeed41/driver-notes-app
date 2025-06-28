import React, { useState } from 'react';
import { DriverNote } from '../types/interfaces';

interface DiagnosticPanelProps {
  recentNotes: DriverNote[];
  loadingRecentNotes: boolean;
  lastRefreshTime: Date | null;
  onRefresh: () => void;
}

const DiagnosticPanel: React.FC<DiagnosticPanelProps> = ({
  recentNotes,
  loadingRecentNotes,
  lastRefreshTime,
  onRefresh
}) => {
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [testingAPI, setTestingAPI] = useState(false);
  const [apiTestResult, setApiTestResult] = useState<string>('');

  const testAPIConnection = async () => {
    setTestingAPI(true);
    setApiTestResult('Testing...');
    
    try {
      const response = await fetch('/api/notes?t=' + Date.now());
      const data = await response.json();
      
      setApiTestResult(`✅ API Working! Status: ${response.status}, Notes: ${data.length}`);
    } catch (error) {
      setApiTestResult(`❌ API Error: ${error}`);
    } finally {
      setTestingAPI(false);
    }
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-yellow-800">
          🔧 Development Diagnostics
        </h3>
        <button
          onClick={() => setShowDiagnostics(!showDiagnostics)}
          className="text-yellow-600 hover:text-yellow-800 text-sm"
        >
          {showDiagnostics ? 'Hide' : 'Show'} Details
        </button>
      </div>
      
      {showDiagnostics && (
        <div className="mt-4 space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Recent Notes Count:</strong> {recentNotes.length}
            </div>
            <div>
              <strong>Loading State:</strong> {loadingRecentNotes ? '🔄 Loading' : '✅ Loaded'}
            </div>
            <div>
              <strong>Last Refresh:</strong> {lastRefreshTime ? lastRefreshTime.toLocaleTimeString() : 'Never'}
            </div>
            <div>
              <strong>Environment:</strong> {process.env.NODE_ENV}
            </div>
          </div>
          
          <div className="border-t border-yellow-200 pt-3">
            <div className="flex items-center space-x-3 mb-2">
              <button
                onClick={testAPIConnection}
                disabled={testingAPI}
                className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded text-xs hover:bg-yellow-300 disabled:opacity-50"
              >
                {testingAPI ? 'Testing...' : 'Test API'}
              </button>
              <button
                onClick={onRefresh}
                disabled={loadingRecentNotes}
                className="px-3 py-1 bg-blue-200 text-blue-800 rounded text-xs hover:bg-blue-300 disabled:opacity-50"
              >
                Force Refresh
              </button>
            </div>
            {apiTestResult && (
              <div className="text-xs bg-white p-2 rounded border">
                {apiTestResult}
              </div>
            )}
          </div>
          
          {recentNotes.length > 0 && (
            <div className="border-t border-yellow-200 pt-3">
              <strong>Sample Note Data:</strong>
              <pre className="text-xs bg-white p-2 rounded border mt-1 overflow-x-auto">
                {JSON.stringify(recentNotes[0], null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DiagnosticPanel; 