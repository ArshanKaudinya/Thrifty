import React, { useState } from 'react';
import { supabase } from '../services/supabase/supabaseClient'; // Adjust the path as needed
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';
import Navbar from '../components/Navbar';


function RegisterPage() {
  const [formData, setFormData] = useState({
    id: '',
    email: '',
    name: '',
    college: '',
    city: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: supabaseError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password, // Supabase requires a password for registration
      });


      if (supabaseError) {
        setError(supabaseError.message);
        setLoading(false);
        return;
      }

      const supabaseUserId = data?.user?.id;
      if (!supabaseUserId) {
        setError('Failed to retrieve user ID from Supabase.');
        setLoading(false);
        return;
      }

      // Step 2: Store additional data in Django
      const response = await fetch('http://127.0.0.1:8000/api/userprofiles/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: supabaseUserId, // Use Supabase ID as the primary key
          email: formData.email,
          name: formData.name,
          college: formData.college,
          city: formData.city,
        }),
      });

      if (response.ok) {
        alert('Registration successful! Please check your email to verify your account.');
        navigate('/login');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to store data in Django.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <Navbar />
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="mobile_number"
          placeholder="Mobile Number (Optional)"
          value={formData.mobile_number}
          onChange={handleChange}
        />
        <input
          type="text"
          name="college"
          placeholder="College (Optional)"
          value={formData.college}
          onChange={handleChange}
        />
        <input
          type="text"
          name="city"
          placeholder="City (Optional)"
          value={formData.city}
          onChange={handleChange}
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;


