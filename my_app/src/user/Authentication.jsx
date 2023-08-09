// Authentication.jsx
import React, { useState } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';

export default function Authentication() {
  const [isSignUp, setIsSignUp] = useState(false); // add this state to manage the current form

  return (
    <div className="auth-container">
      {isSignUp ? <SignUp switchForm={setIsSignUp} /> : <SignIn switchForm={setIsSignUp} />}
    </div>
  );
}

