// SignIn.jsx
import React, { useState } from 'react';
import axios from 'axios';

export default function SignIn({switchForm}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
            // store the token somewhere, e.g., in local storage or context
            localStorage.setItem('token', token);
        }
        // redirect or perform some action on successful login
    } catch (error) {
        // handle error
        console.error("Error signing in", error);
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
      <button type="submit" className="signin-button">
        Sign In
      </button>
      <div className="signin-options">
        <a href="/forgot-password" className="forgot-password">
          Forgot Password?
        </a>
        <span onClick={() => switchForm(true)} className="signup"> {/* use switchForm when Sign Up is clicked */}
            Sign Up
        </span>
      </div>
    </form>
  );
}

