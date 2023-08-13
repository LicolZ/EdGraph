// NeuralNavivate/my_app/src/user/Profile.jsx

import React, { useState, useLayoutEffect, useRef } from 'react';

export default function Profile({ user, closeModal, setShowDropdown }) {
    
    const [name, setName] = useState(user ? user.name || user.email.split('@')[0] : '');
    const [gender, setGender] = useState(user ? user.gender : '');
    const [about, setAbout] = useState(user ? user.about : '');
    const [textareaHeight, setTextareaHeight] = useState('auto');
    const textareaRef = useRef(null);

    const handleSave = () => {
        // Handle the saving process here
        closeModal();
    }

    useLayoutEffect(() => {
        if (textareaRef.current) {
            setTextareaHeight(`${textareaRef.current.scrollHeight}px`);
        }
    }, [about]);

    if (!user) {
        return null;  // replace null with some fallback JSX if needed.
    }

    
    const adjustTextareaHeight = (target) => {
        target.style.height = 'auto'; // reset height to auto before calculating the desired height
        target.style.height = `${target.scrollHeight}px`;
    }
    
    return (
        <div className="user-profile-modal">
            <h2 className="user-profile-modal-title">My Profile</h2>
            
            <div className="user-profile-modal-input-fields">
                <label>Name</label>
                <input className="form-control" type="text" value={name} onChange={(e) => setName(e.target.value)} />
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
                <label>About Me</label>
                <textarea 
                    ref={textareaRef}
                    style={{ height: textareaHeight }}
                    className="form-control user-profile-modal-input-fields textarea" 
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
