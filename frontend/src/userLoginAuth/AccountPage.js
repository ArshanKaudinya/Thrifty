import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase/supabaseClient';
import { useNavigate } from 'react-router-dom';
import './AccountPage.css';
import Navbar from '../components/Navbar.js'

function AccountPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.user) {
        setUser(session.session.user);
      } else {
        navigate('/login'); 
      }
      setLoading(false);
    };
    getUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className='account-page'>
      <Navbar />
      <div className="account-page-container">
        <h1 className="welcome-header">Welcome, {user?.email}!</h1>
        <div className="user-details">
          <p><strong>User ID:</strong> {user?.id}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Created At:</strong> {new Date(user?.created_at).toLocaleString()}</p>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default AccountPage;
