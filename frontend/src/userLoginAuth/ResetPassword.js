import React, { useState, useEffect } from 'react';
import './ResetPassword.css';
import { supabase } from '../services/supabase/supabaseClient';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthStateChange = async () => {
      const { error } = await supabase.auth.onAuthStateChange(async (event) => {
        if (event === 'PASSWORD_RECOVERY') {
          setSuccessMessage('You can now reset your password.');
        }
      });

      if (error) {
        console.error('Error with auth state change:', error.message);
      }
    };

    handleAuthStateChange();
  }, []);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccessMessage('Password reset successfully! You have also been logged in!');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      <Navbar />
      <h1 className="reset-password-text">Reset Password</h1>
      <form onSubmit={handlePasswordReset}>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
    </div>
  );
}

export default ResetPassword;
