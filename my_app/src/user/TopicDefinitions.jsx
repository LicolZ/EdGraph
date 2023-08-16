// NeuralNavivate/my_app/src/user/TopicDefinitions.jsx


import React from 'react';
import { Modal } from 'react-bootstrap';
import axios from 'axios'; 



const TopicDefinitions = ({ show, handleClose, definition, user, topic }) => {
  const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

  async function refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');  // assuming I save the refresh token in local storage

    try {
        const response = await axios.post(`${baseUrl}/api/token-refresh/`, {
            refresh: refreshToken
        });            

        const newAccessToken = response.data.access;
        localStorage.setItem('token', newAccessToken);
        return true;
    } catch (error) {
        console.error("Error refreshing token:", error.response.data);
        return null;
    }
  }

  const handleSave = async (retryCount = 0) => {
    let token = localStorage.getItem('token');

    try {
      const response = await axios.post(`${baseUrl}/api/save_definition/`, {
        topic: topic,
        definition: definition
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.message === 'Definition saved successfully.') {
        alert('Definition saved!');
      } else {
        alert('Failed to save definition.');
      }
      handleClose();
    } catch (error) {
      if (error.response.status === 401 && retryCount < 1) { // limit retries to once
        const refreshSuccess = await refreshToken();
        if (refreshSuccess) {
            handleSave(retryCount + 1);  // retry once
            return;
        }
      }
      console.error("Error:", error);
      alert('Error saving definition.');
      handleClose();
    }
  }


// topic definitions modal

  return (
    <Modal show={show} onHide={handleClose} className="topic-definitions-modal">
      <Modal.Body className="topic-definitions-modal-text">
        {definition}
      </Modal.Body>
      <button id="loginButton" onClick={handleClose}>X</button>
      <button className="topic-definitions-modal-save-button" onClick={handleSave}>Save</button>
    </Modal>
  );
}


export default TopicDefinitions;
