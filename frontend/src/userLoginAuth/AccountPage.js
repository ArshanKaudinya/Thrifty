import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase/supabaseClient';
import { useNavigate } from 'react-router-dom';
import './AccountPage.css';
import Navbar from '../components/Navbar';

function AccountPage() {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [newAvatar, setNewAvatar] = useState(null); // Temporarily store the new avatar
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.user) {
        setUser(session.session.user);
        fetchAvatar(session.session.user.id); // Call fetchAvatar after getting the user
      } else {
        navigate('/login');
      }
      setLoading(false);
    };

    getUser();
  }, [navigate]);

  // Function to fetch the current avatar from the Django backend
  const fetchAvatar = async (userId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/userprofiles/${userId}/`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data from Django API');
      }
      const data = await response.json();
  
      // Set avatar or default avatar
      setAvatar(data.avatar ? `http://127.0.0.1:8000${data.avatar}` : '/static/default-avatar.png');
  
      // Set user metadata
      setUser((prevUser) => ({
        ...prevUser,
        user_metadata: {
          name: data.name || 'N/A',
          phone: data.phone || 'N/A',
          college: data.college || 'N/A',
          city: data.city || 'N/A',
        },
        email: data.email,
        created_at: data.date_joined,
      }));
    } catch (error) {
      console.error('Error fetching user data:', error);
      setAvatar('/static/default-avatar.png'); // Default avatar in case of failure
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    navigate('/login');
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file); // Create a temporary URL for preview
      setNewAvatar(fileUrl); // Temporarily set the new avatar for preview
    }
  };

  const saveAvatar = async () => {
    const fileInput = document.querySelector('input[type="file"]');
    const file = fileInput.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('avatar', file); // Add the file to the form data

      try {
        const response = await fetch(`http://127.0.0.1:8000/api/userprofiles/${user.id}/`, {
          method: 'PATCH',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to save avatar to Django backend');
        }

        // Refresh the avatar after saving
        fetchAvatar(user.id);
        setNewAvatar(null); // Clear the new avatar preview after saving
        alert('Avatar updated successfully!');
      } catch (error) {
        console.error('Error saving avatar:', error);
        alert('Failed to save avatar. Please try again.');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="account-page">
      <Navbar />
  
      <div className="avatar-section">
        <img
          src={newAvatar || avatar}
          alt="User Avatar"
          style={{ width: '180px', borderRadius: '50%' }}
        />
        <input id="file-upload" type="file" onChange={handleAvatarUpload} accept="image/*" />
        {!newAvatar && (
          <label htmlFor="file-upload">Upload Avatar</label>
        )}
        {newAvatar && (
          <button className="save-avatar-button" onClick={saveAvatar}>
            Save Avatar
          </button>
        )}
      </div>
  
      {/* User Details Section */}
      <div className="user-details">
        <p><strong>Name:</strong> {user?.user_metadata?.name || 'N/A'}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Date Joined:</strong> {new Date(user?.created_at).toLocaleString()}</p>
        <p><strong>Phone Number:</strong> {user?.user_metadata?.phone || 'N/A'}</p>
        <p><strong>College:</strong> {user?.user_metadata?.college || 'N/A'}</p>
        <p><strong>City:</strong> {user?.user_metadata?.city || 'N/A'}</p>
      </div>
  
      {/* Logout Button */}
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );    
}

export default AccountPage;



