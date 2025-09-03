import React, { useState, useEffect } from 'react';
import SeoService from '../services/seoService.js';

const SeoDebugger = () => {
  const [debugInfo, setDebugInfo] = useState({});
  const [testResults, setTestResults] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Collect debug information
    const info = {
      userAgent: navigator.userAgent,
      location: window.location.href,
      origin: window.location.origin,
      pathname: window.location.pathname,
      environment: {
        VITE_API_BASE_URL: import.meta?.env?.VITE_API_BASE_URL,
        MODE: import.meta?.env?.MODE,
        PROD: import.meta?.env?.PROD,
        DEV: import.meta?.env?.DEV,
      },
      localStorage: {
        'seo:debug': localStorage.getItem('seo:debug'),
        'seo:disable': localStorage.getItem('seo:disable'),
      },
      timestamp: new Date().toISOString(),
    };
    setDebugInfo(info);
  }, []);

  const runSeoTest = async () => {
    setTestResults({ status: 'running', message: 'Testing SEO API...' });
    
    try {
      console.log('[SeoDebugger] Starting SEO API test...');
      
      // Test 1: Basic route SEO
      const routeResult = await SeoService.get({ 
        type: 'route', 
        identifier: '/', 
        path: '/' 
      });
      
      console.log('[SeoDebugger] Route SEO result:', routeResult);
      
      // Test 2: Company SEO
      const companyResult = await SeoService.get({ 
        type: 'company', 
        identifier: 'amazon',
        tab: 'overview'
      });
      
      console.log('[SeoDebugger] Company SEO result:', companyResult);
      
      setTestResults({
        status: 'success',
        routeSeo: routeResult,
        companySeo: companyResult,
        message: 'SEO API tests completed successfully'
      });
      
    } catch (error) {
      console.error('[SeoDebugger] SEO test failed:', error);
      setTestResults({
        status: 'error',
        error: error.message,
        message: 'SEO API test failed'
      });
    }
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  if (!isVisible) {
    return (
      <button
        onClick={toggleVisibility}
        style={{
          position: 'fixed',
          top: '10px',
          left: '10px',
          zIndex: 9999,
          background: 'red',
          color: 'white',
          padding: '10px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        SEO Debug
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        zIndex: 9999,
        background: 'white',
        border: '2px solid red',
        borderRadius: '5px',
        padding: '15px',
        maxWidth: '500px',
        maxHeight: '80vh',
        overflow: 'auto',
        fontSize: '12px',
        fontFamily: 'monospace'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3 style={{ margin: 0, color: 'red' }}>SEO Debugger</h3>
        <button onClick={toggleVisibility} style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}>
          Close
        </button>
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <button 
          onClick={runSeoTest}
          style={{ 
            background: testResults.status === 'running' ? 'orange' : 'green', 
            color: 'white', 
            border: 'none', 
            padding: '8px 15px', 
            borderRadius: '3px', 
            cursor: 'pointer',
            marginBottom: '10px'
          }}
          disabled={testResults.status === 'running'}
        >
          {testResults.status === 'running' ? 'Testing...' : 'Test SEO API'}
        </button>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 5px 0', color: 'blue' }}>Environment Info:</h4>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '3px', overflow: 'auto' }}>
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </div>

      {testResults.status && (
        <div style={{ marginBottom: '15px' }}>
          <h4 style={{ margin: '0 0 5px 0', color: testResults.status === 'success' ? 'green' : 'red' }}>
            Test Results: {testResults.status}
          </h4>
          <div style={{ 
            background: testResults.status === 'success' ? '#e8f5e8' : '#ffe8e8', 
            padding: '10px', 
            borderRadius: '3px',
            border: `1px solid ${testResults.status === 'success' ? 'green' : 'red'}`
          }}>
            <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>{testResults.message}</p>
            {testResults.error && (
              <p style={{ margin: '0 0 10px 0', color: 'red' }}>Error: {testResults.error}</p>
            )}
            {testResults.routeSeo && (
              <div style={{ marginBottom: '10px' }}>
                <strong>Route SEO:</strong>
                <pre style={{ background: 'white', padding: '5px', borderRadius: '3px', fontSize: '10px', overflow: 'auto' }}>
                  {JSON.stringify(testResults.routeSeo, null, 2)}
                </pre>
              </div>
            )}
            {testResults.companySeo && (
              <div>
                <strong>Company SEO:</strong>
                <pre style={{ background: 'white', padding: '5px', borderRadius: '3px', fontSize: '10px', overflow: 'auto' }}>
                  {JSON.stringify(testResults.companySeo, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 5px 0', color: 'purple' }}>Quick Actions:</h4>
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              localStorage.setItem('seo:debug', '1');
              window.location.reload();
            }}
            style={{ background: 'purple', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer', fontSize: '10px' }}
          >
            Enable SEO Debug
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('seo:debug');
              window.location.reload();
            }}
            style={{ background: 'gray', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer', fontSize: '10px' }}
          >
            Disable SEO Debug
          </button>
          <button
            onClick={() => {
              localStorage.setItem('seo:disable', '1');
              window.location.reload();
            }}
            style={{ background: 'orange', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer', fontSize: '10px' }}
          >
            Disable SEO
          </button>
        </div>
      </div>

      <div style={{ fontSize: '10px', color: 'gray' }}>
        <p>This debugger helps identify SEO loading issues in production.</p>
        <p>Check the browser console for detailed logs.</p>
      </div>
    </div>
  );
};

export default SeoDebugger;
