import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const Login = () => {
  const { loginWithEmail, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const lower = email.toLowerCase();
      await loginWithEmail(email, password);
      const isAdmin = lower === 'indiacustomerhelp05@gmail.com';
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
      const user = await loginWithGoogle();
      const lower = (user?.email || '').toLowerCase();
      const isAdmin = lower === 'indiacustomerhelp05@gmail.com';
      navigate(isAdmin ? '/admin' : '/profile', { replace: true });
    } catch (err) {
      const code = err?.code || '';
      const msg = code.replace('auth/', '').replace(/-/g, ' ');
      setError(msg ? `Google sign-in failed: ${msg}` : (err.message || 'Failed to login with Google'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white shadow rounded p-6">
        <h1 className="text-2xl font-semibold mb-6 text-center">Login</h1>
        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{error}</div>
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
            <span>Continue with Google</span>
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



