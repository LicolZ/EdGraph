// LoginButton.jsx
import React, { useState } from 'react';
import AuthDialog from './AuthDialog';

export default function LoginButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsDialogOpen(true)}>Log in</button>
      {isDialogOpen && <AuthDialog onClose={() => setIsDialogOpen(false)} />}
    </>
  );
}