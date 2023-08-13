// NeuralNavivate/my_app/src/user/Profile.jsx

import React, { useState, useEffect } from 'react';

export default function Profile({ user, closeModal, setShowDropdown }) {
    const [name, setName] = useState(user.name || '');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState(user.gender || '');
    const [about, setAbout] = useState(user.about || '');

    const handleSave = () => {
        // Handle the saving process here
        closeModal();
    }

    const adjustTextareaHeight = (target) => {
        target.style.height = 'inherit'; // Reset height first
        const computed = window.getComputedStyle(target);
        const height = parseInt(computed.getPropertyValue('border-top-width'), 10)
                     + parseInt(computed.getPropertyValue('border-bottom-width'), 10)
                     + target.scrollHeight;
                     
        target.style.height = height + 'px';
    }

    useEffect(() => {
        const textareaElement = document.querySelector('.user-profile-modal-input-fields textarea');
        if (textareaElement) adjustTextareaHeight(textareaElement);
    }, []);
    
    

    if (!user) {
        return null;  // Replace null with some fallback JSX if needed.
    }

    return (
        <div className="user-profile-modal">
            <h2 className="user-profile-modal-title">My Profile</h2>
            
            <div className="user-profile-modal-input-fields">
                <label>Name</label>
                <input className="form-control" type="text" value={user.email.split('@')[0]} onChange={(e) => setName(e.target.value)} />
            </div>
            
            <div className="user-profile-modal-input-fields">
                <label>Email</label>
                <input className="form-control" type="email" value={user.email} readOnly />
            </div>
            
            <div className="user-profile-modal-input-fields">
                <label>Password</label>
                <div className="password-container">
                    <button className="change-password-button">Change Password</button>
                </div>
            </div>
            <div className="user-profile-modal-input-fields">
                <label>Gender</label>
                <div className="custom-select">
                    <select value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>
            
            <div className="user-profile-modal-input-fields">
                <label>About me</label>
                <textarea 
                    className="form-control" 
                    value={about} 
                    onChange={(e) => {
                        setAbout(e.target.value);
                        adjustTextareaHeight(e.target);
                    }} 
                    placeholder="Tell us about yourself (interests, experience, etc.)"
                ></textarea>
            </div>

            <button className="user-profile-modal-save-button" onClick={handleSave}>Save</button>
            <button id="loginButton" onClick={closeModal}>X</button>
        </div>
    );
}
