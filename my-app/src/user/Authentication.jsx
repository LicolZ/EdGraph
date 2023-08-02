// Authentication.jsx
import React from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';

export default function Authentication() {
  return (
    <div className="auth-container">
      <SignIn />
      <div className="auth-divider"></div>
      <SignUp />
    </div>
  );
}