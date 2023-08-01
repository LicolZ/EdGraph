// AuthDialog.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function AuthDialog({ onClose }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Implement sign-in logic here
    onClose();
  };

  return (
    <div>
      <h2>Log in</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" name="email" required />
        </label>
        <label>
          Password:
          <input type="password" name="password" required />
        </label>
        <button type="submit">Log in</button>
      </form>
      <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
      <button onClick={onClose}>Close</button>
    </div>
  );
}