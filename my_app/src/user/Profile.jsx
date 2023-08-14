// NeuralNavivate/my_app/src/user/Profile.jsx

import React, { useState, useRef } from 'react';
import axios from 'axios';

export default function Profile({ user, closeModal, setShowDropdown, isVisible }) {
    
    const [name, setName] = useState(user ? user.name || user.email.split('@')[0] : '');
    const [gender, setGender] = useState(user ? user.gender : '');
    const [about, setAbout] = useState(user ? user.about : '');
    const [textareaHeight, setTextareaHeight] = useState('auto');
    const textareaRef = useRef(null);
    const modalRef = useRef(null); // Reference for modal positioning

    async function refreshToken() {
        const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
        const refreshToken = localStorage.getItem('refreshToken');  // Assuming you save the refresh token in local storage
    
        try {
            const response = await axios.post(`${baseUrl}/token/refresh/`, {
                refresh: refreshToken
            });
    
            const newAccessToken = response.data.access;
            localStorage.setItem('token', newAccessToken);
            return newAccessToken;
        } catch (error) {
            console.error("Error refreshing token:", error.response.data);
            return null;
        }
    }
    
    const handleSave = async () => {
        const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
        let token = localStorage.getItem('token');  // Assuming you save the JWT token in local storage
    
        try {
            const response = await axios.put(`${baseUrl}/update_profile/`, {
                name: name,
                about: about,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (response.status === 200) {
                console.log("Profile updated successfully!");
                // Update user state or local storage if needed
            }
        } catch (error) {
            if (error.response.status === 401) { // If token is expired
                // Attempt to refresh the token
                const newToken = await refreshToken();
                if (newToken) {
                    handleSave();  // Retry saving with the new token
                    return;
                }
            }
            console.error("Error updating profile:", error.response.data);
        }
    
        closeModal();
    }
    

    if (!user) {
        return null;  // replace null with some fallback JSX if needed.
    }
    
    const adjustTextareaHeight = (target) => {
        target.style.height = 'auto'; // reset height to auto before calculating the desired height
        target.style.height = `${target.scrollHeight}px`;
    }
    
    return (
        <div className="user-profile-modal" ref={modalRef}>
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
