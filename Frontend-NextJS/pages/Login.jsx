import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const Login = () => {
  const { loginWithEmail, loginWithGoogle, user, role, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  // After redirect/popup completes, navigate based on resolved role
  useEffect(() => {
    if (authLoading) return;
    if (user) {
      const goTo = role === 'admin' ? '/admin' : '/profile';
      navigate(goTo, { replace: true });
    }
  }, [user, role, authLoading, navigate]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const lower = email.toLowerCase();
      await loginWithEmail(email, password);
      const isAdmin = ['indiacustomerhelp05@gmail.com', 'newmess1231@gmail.com', 'abhishekuniyal282@gmail.com'].includes(lower);
      navigate(isAdmin ? '/admin' : '/profile', { replace: true });
    } catch (err) {
      const code = err?.code || '';
      const msg = code.replace('auth/', '').replace(/-/g, ' ');
      setError(msg ? `Login failed: ${msg}` : (err.message || 'Failed to login'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      console.log('[Login] Starting Google sign-in...');
      const user = await loginWithGoogle();
      
      if (!user) {
        console.log('[Login] No user returned (redirect flow)');
        // Show message that user is being redirected
        setError('Redirecting to Google... Please complete the sign-in process.');
        return; // User will be redirected, no need to navigate
      }
      
      console.log('[Login] Google sign-in successful:', user.email);
      const lower = (user?.email || '').toLowerCase();
      const isAdmin = ['indiacustomerhelp05@gmail.com', 'newmess1231@gmail.com', 'abhishekuniyal282@gmail.com'].includes(lower);
      
      console.log('[Login] User is admin:', isAdmin);
      console.log('[Login] Navigating to:', isAdmin ? '/admin' : '/profile');
      
      navigate(isAdmin ? '/admin' : '/profile', { replace: true });
    } catch (err) {
      console.error('[Login] Google sign-in error:', err);
      
      // Handle specific COOP and popup errors
      if (err.message?.includes('Cross-Origin-Opener-Policy') || 
          err.message?.includes('COOP') ||
          err.code === 'auth/popup-blocked' ||
          err.code === 'auth/popup-closed-by-user') {
        setError('Popup blocked by browser. Please allow popups or try again.');
      } else {
        const code = err?.code || '';
        const msg = code.replace('auth/', '').replace(/-/g, ' ');
        setError(msg ? `Google sign-in failed: ${msg}` : (err.message || 'Failed to login with Google'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white shadow rounded p-6">
        <h1 className="text-2xl font-semibold mb-6 text-center">Login</h1>
        {error && (
          <div className={`mb-4 text-sm rounded p-2 border ${
            error.includes('Redirecting') 
              ? 'text-blue-700 bg-blue-50 border-blue-200' 
              : 'text-red-700 bg-red-50 border-red-200'
          }`}>
            {error}
          </div>
        )}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2 disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-4">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white border hover:bg-gray-50 text-gray-800 rounded py-2 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-gray-600 border-t-transparent rounded-full"></div>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;



