// NeuralNavivate/my_app/src/user/SavedDefinitions.jsx

import React from 'react';
import { Modal } from 'react-bootstrap';
import '../App.css';

const SavedDefinitions = ({ show, onHide, definitions, closeModal }) => {
    return (
        <Modal
            show={show}
            onHide={onHide}
            className="saved-definitions-modal"
        >
            <Modal.Header>
                <h2 className="saved-definitions-modal-title">Saved Definitions</h2>
                <button id="loginButton" onClick={closeModal}>X</button>
            </Modal.Header>
            <Modal.Body>
                <ul>
                    {definitions.map((definition, index) => (
                        <li key={index}>{definition}</li>
                    ))}
                </ul>
            </Modal.Body>
        </Modal>
    );
}

export default SavedDefinitions;

