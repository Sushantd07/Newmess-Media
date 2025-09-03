import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

const AuthDebugger = () => {
  const { user, role, loading, loginWithGoogle, logout } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const info = {
      user: user ? {
        email: user.email,
        displayName: user.displayName,
        uid: user.uid,
        photoURL: user.photoURL,
        providerData: user.providerData?.map(p => p.providerId)
      } : null,
      role,
      loading,
      timestamp: new Date().toISOString(),
      adminEmails: [
        'indiacustomerhelp05@gmail.com',
        'newmess1231@gmail.com',
        'abhishekuniyal282@gmail.com'
      ]
    };
    setDebugInfo(info);
  }, [user, role, loading]);

  const handleGoogleLogin = async () => {
    try {
      console.log('[AuthDebugger] Testing Google login...');
      const result = await loginWithGoogle();
      console.log('[AuthDebugger] Google login result:', result);
    } catch (error) {
      console.error('[AuthDebugger] Google login error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      console.log('[AuthDebugger] Logout successful');
    } catch (error) {
      console.error('[AuthDebugger] Logout error:', error);
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          zIndex: 9999,
          background: 'blue',
          color: 'white',
          padding: '10px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        Auth Debug
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: 9999,
        background: 'white',
        border: '2px solid blue',
        borderRadius: '5px',
        padding: '15px',
        maxWidth: '400px',
        maxHeight: '80vh',
        overflow: 'auto',
        fontSize: '12px',
        fontFamily: 'monospace'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3 style={{ margin: 0, color: 'blue' }}>Auth Debugger</h3>
        <button onClick={() => setIsVisible(false)} style={{ background: 'blue', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}>
          Close
        </button>
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 5px 0', color: 'green' }}>Auth State:</h4>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '3px', overflow: 'auto' }}>
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 5px 0', color: 'purple' }}>Quick Actions:</h4>
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          <button
            onClick={handleGoogleLogin}
            style={{ background: 'green', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer', fontSize: '10px' }}
          >
            Test Google Login
          </button>
          <button
            onClick={handleLogout}
            style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer', fontSize: '10px' }}
          >
            Logout
          </button>
          <button
            onClick={() => window.location.reload()}
            style={{ background: 'orange', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer', fontSize: '10px' }}
          >
            Reload Page
          </button>
        </div>
      </div>

      <div style={{ fontSize: '10px', color: 'gray' }}>
        <p>Check the browser console for detailed auth logs.</p>
        <p>Admin emails: {debugInfo.adminEmails?.join(', ')}</p>
      </div>
    </div>
  );
};

export default AuthDebugger;
