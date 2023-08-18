// NeuralNavivate/my_app/src/user/Authentication.jsx

import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import SignIn from './SignIn';
import SignUp from './SignUp';

export default function Authentication({ setUser, closeModal, setShowDropdown }) {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="signin-signup-modal">
      <button id="loginButton" onClick={closeModal}>X</button>
      <Modal.Header>
        <Modal.Title className="signin-signup-modal-title">Neural Navigate</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isSignUp ? 
          <SignUp 
            switchForm={setIsSignUp} 
            setUser={setUser} 
            closeModal={closeModal} 
            setShowDropdown={setShowDropdown} 
          /> 
          : 
          <SignIn 
            switchForm={setIsSignUp} 
            setUser={setUser} 
            closeModal={closeModal} 
            setShowDropdown={setShowDropdown}
          />}
      </Modal.Body>
    </div>
  );
}
