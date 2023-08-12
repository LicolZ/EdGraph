// NeuralNavivate/my_app/src/user/Profile.jsx

import React, { useState } from 'react';

export default function Profile({ user, closeModal, setShowDropdown }) {
    const [name, setName] = useState(user.name || '');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState(user.gender || '');
    const [about, setAbout] = useState(user.about || '');

    const handleSave = () => {
        // Handle the saving process here
        closeModal();
    }

    if (!user) {
        return null;  // Replace null with some fallback JSX if needed.
    }

    return (
        <div className="user-profile-modal">
            <h2 className="user-profile-modal-title">My Profile</h2>
            <div>
                <label>Name</label>
                <input className="form-control" type="text" value={user.email.split('@')[0]} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
                <label>Email</label>
                <input className="form-control" type="email" value={user.email} readOnly />
            </div>
            <div>
                <label>Password</label>
                <input className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
                <label>Gender</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div>
                <label>About me</label>
                <textarea className="form-control" value={about} onChange={(e) => setAbout(e.target.value)}></textarea>
            </div>
            <button className="user-profile-modal-save-button" onClick={handleSave}>Save</button>
            <button id="loginButton" onClick={closeModal}>X</button>
        </div>
    );
}


// Tell us about yourself (interests, experience, etc.)