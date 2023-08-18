// NeuralNavivate/my_app/src/components/MyProfileComponent.jsx

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { refreshToken } from '../utils/tokenUtils';


export default function MyProfile({ user, closeModal, onUserUpdate }) {
    
    const [userState, setUserState] = useState(user);
    const [name, setName] = useState(user ? user.name || user.email.split('@')[0] : '');
    const [about, setAbout] = useState(user ? user.about : '');
    const textareaRef = useRef(null);
    const modalRef = useRef(null); // Reference for modal positioning
    const [textareaHeight] = useState('auto');
    const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';


    useEffect(() => {
        setUserState(user);

        // async function within the useEffect to handle refreshToken
        const initiateRefreshToken = async () => {
            await refreshToken();
        };

        initiateRefreshToken();

    }, [user]);
    
    const handleSave = async (retryCount = 0) => {
        
        let token = localStorage.getItem('token');
    
        try {
            const response = await axios.put(`${baseUrl}/update-profile/`, {
                name: name,
                about: about,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (response.status === 200) {
                localStorage.setItem('name', response.data.user.name);
                localStorage.setItem('about', response.data.user.about);
                
                // Update the local state with the updated user data
                setName(response.data.user.name);
                setAbout(response.data.user.about);
    
                // if storing user data in a parent component or context, update that as well
                if (onUserUpdate) {
                    onUserUpdate(response.data.user);
                }
            }
        } catch (error) {
            if (error.response.status === 401 && retryCount < 1) { // limit retries to once
                const refreshSuccess = await refreshToken();
                if (refreshSuccess) {
                    handleSave(retryCount + 1);  // retry once
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
