import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase/supabaseClient';
import { useNavigate } from 'react-router-dom';
import './AccountPage.css';
import Navbar from '../components/Navbar';

function AccountPage() {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [newAvatar, setNewAvatar] = useState(null); // Temporary new avatar for preview
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [college, setCollege] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.user) {
        setUser(session.session.user);
        fetchUserProfile(session.session.user.id);
      } else {
        navigate('/login');
      }
      setLoading(false);
    };

    fetchUser();
  }, [navigate]);

  const fetchUserProfile = async (userId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/userprofiles/${userId}/`);
      if (!response.ok) throw new Error('Failed to fetch user profile.');

      const data = await response.json();
      setAvatar(data.avatar ? `http://127.0.0.1:8000${data.avatar}` : '/static/default-avatar.png');
      setName(data.name || '');
      setCity(data.city || '');
      setCollege(data.college || '');
      setMobile(data.mobile || '');
      setEmail(data.email || '');
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setNewAvatar(fileUrl);
    }
  };

  const saveAvatar = async () => {
    const fileInput = document.querySelector('input[type="file"]');
    const file = fileInput.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);

      try {
        const response = await fetch(`http://127.0.0.1:8000/api/userprofiles/${user.id}/`, {
          method: 'PATCH',
          body: formData,
        });

        if (!response.ok) throw new Error('Failed to save avatar.');
        fetchUserProfile(user.id);
        setNewAvatar(null);
        alert('Avatar updated successfully!');
      } catch (error) {
        console.error('Error saving avatar:', error);
        alert('Failed to save avatar. Please try again.');
      }
    }
  };

  const saveChanges = async () => {
    if (password && password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const profileUpdates = { name, city, college, mobile };
      const profileResponse = await fetch(`http://127.0.0.1:8000/api/userprofiles/${user.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileUpdates),
      });
      if (!profileResponse.ok) throw new Error('Failed to update profile.');

      if (email) {
        const { error: emailError } = await supabase.auth.updateUser({ email });
        if (emailError) throw emailError;
      }

      if (password) {
        const { error: passwordError } = await supabase.auth.updateUser({ password });
        if (passwordError) throw passwordError;
      }

      alert('Profile updated successfully.');
      fetchUserProfile(user.id);
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Error saving changes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="account-page">
      <Navbar />
      <div className="account-container">
        {/* Avatar Section */}
        <div className="avatar-section">
          <img
            src={newAvatar || avatar}
            alt="User Avatar"
          />
          <input id="file-upload" type="file" onChange={handleAvatarUpload} accept="image/*" />
          {!newAvatar && <label htmlFor="file-upload">Upload Avatar</label>}
          {newAvatar && (
            <button className="save-avatar-button" onClick={saveAvatar}>
              Save Avatar
            </button>
          )}
        </div>

        {/* User Details Form */}
        <div className="user-details">
          <div className="form-container">
            <div className="form-row">
              <label>Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="form-row">
              <label>City</label>
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div className="form-row">
              <label>College</label>
              <input type="text" value={college} onChange={(e) => setCollege(e.target.value)} />
            </div>
            <div className="form-row">
              <label>Mobile</label>
              <input type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} />
            </div>
            <div className="form-row">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-row">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="form-row">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="button-row">
              <button className="save-button" onClick={saveChanges}>
                Save Changes
              </button>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;




