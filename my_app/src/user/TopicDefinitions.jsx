// NeuralNavivate/my_app/src/user/TopicDefinitions.jsx


import React from 'react';
import { Modal } from 'react-bootstrap';

const TopicDefinitions = ({ show, handleClose, definition }) => {
  return (
    <Modal show={show} onHide={handleClose} className="topic-definitions-modal">
      <Modal.Body className="topic-definitions-modal-text">
        {definition}
      </Modal.Body>
      <button id="loginButton" onClick={handleClose}>X</button>
      <button className="topic-definitions-modal-save-button" onClick={handleClose}>Save</button>
    </Modal>
  );
}


export default TopicDefinitions;
