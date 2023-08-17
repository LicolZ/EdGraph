// NeuralNavivate/my_app/src/user/TopicDefinitions.jsx

import React from 'react';
import { Modal } from 'react-bootstrap';
import axios from 'axios'; 
import { refreshToken } from '../utils/tokenUtils';

const TopicDefinitions = ({ show, closeModal, definition, user, topic }) => {
  const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

  const handleSave = async (retryCount = 0) => {
    let token = localStorage.getItem('token');

    try {
      const response = await axios.post(`${baseUrl}/api/save-definition/`, {
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
    }
    closeModal();
  }


// topic definitions modal

  return (
    <Modal show={show} onHide={closeModal} className="topic-definitions-modal">
      <Modal.Body className="topic-definitions-modal-text">
        {definition}
      </Modal.Body>
      <button id="loginButton" onClick={closeModal}>X</button>
      <button className="topic-definitions-modal-save-button" onClick={handleSave}>Save</button>
    </Modal>
  );
}


export default TopicDefinitions;
