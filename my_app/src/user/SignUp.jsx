// SignUp.jsx
import React, { useState } from 'react';
import axios from 'axios';

export default function SignUp({ switchForm }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
  const [error, setError] = useState(null);

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseUrl}/api/signup/`, {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        // Here you can redirect or perform some action on successful sign up
        // For example: 
        // history.push('/dashboard');
      } else if (response.data.error) {
        setError(response.data.error);
      }
    } catch (error) {
        if (error.response && error.response.data.error) {
            setError(error.response.data.error);
        } else {
            console.error("Error signing up", error);
        }
    }
  };

  return (
    <form onSubmit={submitForm} className="signup-form">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="form-control"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="form-control"
      />

      {error && <div className="signup-error-message">{error}</div>}
      
      <button type="submit" className="signup-button">
        Sign Up
      </button>
      <div className="signin-options">
        <a href="/forgot-password" className="forgot-password">
          Forgot Password?
        </a>
        <span onClick={() => switchForm(false)} className="signup">
          Sign In
        </span>
      </div>
    </form>
  );
}

