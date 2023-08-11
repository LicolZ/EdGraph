// NeuralNavivate/my_app/src/user/Authentication.jsx
import React, { useState } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';

export default function Authentication({ setUser }) {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="auth-container">
      {isSignUp ? <SignUp switchForm={setIsSignUp} setUser={setUser} /> : <SignIn switchForm={setIsSignUp} setUser={setUser} />}
    </div>
  );
}
