// NeuralNavivate/my_app/src/App.jsx

import React, { useCallback, useState, useEffect } from 'react';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import { Helmet } from 'react-helmet'; 
import { addEdge, useNodesState, useEdgesState, } from 'reactflow'; // Import addEdge from reactflow
import ReactFlowComponent from './react_flow/reactFlowComponent';
import Authentication from './user/Authentication';
import { renderUserButton, signOut } from './user/userUtils';
import { createNode, createEdgesFromRelationships } from './react_flow/reactFlowNodesEdges';
import Profile from './user/Profile';
import UserContext from './user/UserContext';

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
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
};

  
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );


  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'userEmail') {
        const userEmail = e.newValue;
        setUser((prevState) => ({
          ...prevState,
          email: userEmail || prevState.email,
        }));
      } else if (e.key === 'name') {
        const userName = e.newValue;
        setUser((prevState) => ({
          ...prevState,
          name: userName || prevState.name,
        }));
      } else if (e.key === 'about') {
        const userAbout = e.newValue;
        setUser((prevState) => ({
          ...prevState,
          about: userAbout || prevState.about,
        }));
      }
    };
  
    window.addEventListener('storage', handleStorageChange);
  
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('name');
    const userAbout = localStorage.getItem('about');
    setUser({
      email: userEmail || '',
      name: userName || '',
      about: userAbout || '',
    });
  }, []);

  const toggleDropdown = useCallback(() => {
    setShowDropdown((prevShow) => !prevShow);
  }, []);


  // handlers for opening and closing modals

  const handleOpen = useCallback(() => {
    setOpenModal(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpenModal(false);
  }, []);

  const handleOpenProfile = useCallback(() => {
    setOpenProfileModal(true);
    setShowDropdown(false);
  }, []);

  const handleCloseProfile = useCallback(() => {
    setOpenProfileModal(false);
  }, []);



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
        {renderUserButton(user, handleOpen, toggleDropdown, showDropdown, signOut, setUser, handleOpenProfile, handleCloseProfile)}
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
      <UserContext.Provider value={user}>
        <ReactFlowComponent 
          nodes={nodes}
          edges={edges}
          onConnect={onConnect}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
        />
      </UserContext.Provider>
      <Modal
        show={openModal}
        onHide={handleClose}
        className="signin-signup-modal"
      >
        <button id="loginButton" onClick={handleClose}>X</button>
        <Modal.Header>
          <Modal.Title className="signin-signup-modal-title">Neural Navigate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Authentication setUser={setUser} closeModal={handleClose} setShowDropdown={setShowDropdown}/>
        </Modal.Body>
      </Modal>

      {/* My Profile modal */}
      <Modal
        show={openProfileModal}
        onHide={handleCloseProfile}
        className="user-profile-modal"
      >
        <Profile user={user} closeModal={handleCloseProfile} setShowDropdown={setShowDropdown} onUserUpdate={handleUserUpdate}/>
        
      </Modal>

    </div>
  );
}

export function App() {
  return (
    <FileUploadComponent />
  );
}