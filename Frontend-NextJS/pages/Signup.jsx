import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const Signup = () => {
  const { signupWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signupWithEmail(email, password, displayName);
      const isAdmin = ['indiacustomerhelp05@gmail.com', 'newmess1231@gmail.com', 'abhishekuniyal282@gmail.com'].includes(email?.toLowerCase());
      navigate(isAdmin ? '/admin' : '/profile', { replace: true });
    } catch (err) {
      const code = err?.code || '';
      const msg = code.replace('auth/', '').replace(/-/g, ' ');
      setError(msg ? `Signup failed: ${msg}` : (err.message || 'Failed to sign up'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white shadow rounded p-6">
        <h1 className="text-2xl font-semibold mb-6 text-center">Sign Up</h1>
        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{error}</div>
        )}
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Jane Doe"
            />
          </div>
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
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;



