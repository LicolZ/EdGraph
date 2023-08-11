// NeuralNavivate/my_app/src/App.jsx

import React, { useCallback, useState, useEffect } from 'react';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import { Helmet } from 'react-helmet'; 
import { addEdge, useNodesState, useEdgesState, } from 'reactflow'; // Import addEdge from reactflow
import ReactFlowComponent from './react_flow/reactFlowComponent';
import Authentication from './user/Authentication';
import { renderUserButton } from './user/userUtils';
import { createNode, createEdgesFromRelationships } from './react_flow/reactFlowNodesEdges';
import './App.css';
import './index.css';

export default function FileUploadComponent() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [openModal, setOpenModal] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  useEffect(() => {
    const handleStorageChange = () => {
      const userEmail = localStorage.getItem('userEmail');
      setUser(userEmail ? { email: userEmail } : null);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      setUser({ email: userEmail });
    }
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const submitFile = () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
    axios.post(`${baseUrl}/process/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => {
      const topics = response.data.topics;
      const newNodes = topics.map((topic, i) => createNode(topic, i));
      const newEdges = createEdgesFromRelationships(response.data.relationships, newNodes);
      setNodes(newNodes);
      setEdges(newEdges);
    })
    .finally(() => setLoading(false));
  };

  return (
    <div className="container">
      <div style={{ textAlign: 'right' }}>
        {renderUserButton(user, handleOpen, toggleDropdown, showDropdown)}
      </div>
      <Helmet>
        <title>NeuralNavigate</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300&display=swap" rel="stylesheet" />
      </Helmet>
      <h1 id="upload-text">Upload your Machine Learning & AI Research Paper</h1>
      <div className="upload-section">
        <input type="file" accept=".pdf" onChange={event => setFile(event.target.files[0])} />
        <button id="generateGraphButton" onClick={submitFile}>
          {loading ? "Loading..." : "Generate Graph"}
        </button>
      </div>
      <ReactFlowComponent 
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      />
      <Modal
        show={openModal}
        onHide={handleClose}
        className="modal"
      >
        <button id="loginButton" onClick={handleClose}>X</button>
        <Modal.Header>
          <Modal.Title className="modal-title">Neural Navigate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Authentication />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export function App() {
  return (
    <FileUploadComponent />
  );
}