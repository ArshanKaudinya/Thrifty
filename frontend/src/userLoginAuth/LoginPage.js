import React, { useState } from 'react';
import './LoginPage.css';
import { supabase } from '../services/supabase/supabaseClient';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false); // Toggle between login and reset modes
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const { user, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        console.log('Logged in user:', user);
        navigate('/account'); // Redirect to account page
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:3000/reset-password', // Adjust for production
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccessMessage('Password reset link sent to your email.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Navbar />
      <h1 className="login-text">{isResetMode ? 'Reset Password' : 'Login'}</h1>
      <form onSubmit={isResetMode ? handleResetPassword : handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {!isResetMode && (
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        )}
        <button type="submit" disabled={isLoading}>
          {isLoading ? (isResetMode ? 'Sending Link...' : 'Logging in...') : isResetMode ? 'Send Link' : 'Login'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      {!isResetMode && (
        <p>
          Don't have an account? <a href="/register">Register</a>
        </p>
      )}
      <p>
        {isResetMode ? (
          <a href="#" onClick={() => setIsResetMode(false)}>
            Back to Login
          </a>
        ) : (
          <a href="#" onClick={() => setIsResetMode(true)}>
            Forgot Password?
          </a>
        )}
      </p>
    </div>
  );
}

export default LoginPage;

