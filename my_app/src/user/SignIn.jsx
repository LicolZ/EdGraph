// SignIn.jsx

import React, { useState } from 'react';
import axios from 'axios';

export default function SignIn({switchForm}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseUrl}/api/signin/`, {
        email,
        password,
      });
      const token = response.data.token;
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('userEmail', email);  // save the email
      } else {
        const errors = Object.values(response.data).flat().join(' ');
        setError(errors);
      }
    } catch (error) {
      if (error.response) {
        const errors = Object.values(error.response.data).flat().join(' ');
        setError(errors);
      } else {
        console.error("Error signing in", error);
      }
    }
  };

  return (
    <form onSubmit={submitForm} className="signin-form">
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
      {error && <div className="signup-signin-error-message">{error}</div>}
      <button type="submit" className="signin-button">
        Sign In
      </button>
      <div className="signin-options">
        <a href="/forgot-password" className="forgot-password">
          Forgot Password?
        </a>
        <span onClick={() => switchForm(true)} className="signup">
          Sign Up
        </span>
      </div>
    </form>
  );
}
