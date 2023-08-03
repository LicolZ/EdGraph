// SignIn.jsx
import React, { useState } from 'react';
import axios from 'axios';

export default function SignIn({switchForm}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

  const submitForm = async (e) => {
    e.preventDefault(); // to prevent form from submitting and page refresh
    const response = await axios.post(`${baseUrl}/api/signin`, {
      email,
      password,
    });
    // TODO: implement handling of the response
    // need to store the token and set the user as authenticated in app state
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
