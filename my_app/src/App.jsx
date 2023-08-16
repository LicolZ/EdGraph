// NeuralNavivate/my_app/src/App.jsx

import React, { useCallback, useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { Helmet } from 'react-helmet'; 
import { addEdge, useNodesState, useEdgesState, } from 'reactflow'; // Import addEdge from reactflow
import ReactFlowComponent from './react_flow/reactFlowComponent';
import Authentication from './user/Authentication';
import { renderUserButton, signOut } from './utils/userUtils';

import SavedDefinitionsComponent from './components/SavedDefinitionsComponent';
import { fetchSavedDefinitions } from './utils/fetchUtils';

import { submitFile } from './utils/fileUpload';

import Profile from './user/Profile';
import UserContext from './user/UserContext';

import './App.css';
import './index.css';

export default function FileUploadComponent() {

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [user, setUser] = useState(null);

  const [showDropdown, setShowDropdown] = useState(false);

  const [openSignInUpModal, setOpenSignInUpModal] = useState(false);

  const [openMyProfileModal, setOpenMyProfileModal] = useState(false);

  const [openSavedDefinitionsModal, setOpenSavedDefinitionsModal] = useState(false);
  const [savedDefinitions, setSavedDefinitions] = useState([]);

  
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // dropdown for logged in user
  const toggleDropdown = useCallback(() => {
    setShowDropdown((prevShow) => !prevShow);
  }, []);


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


  // handlers

  const handleFileUpload = () => {
    submitFile(file, setNodes, setEdges, setLoading);
  };

  const handleOpenSignInUpModal = useCallback(() => {
    setOpenSignInUpModal(true);
  }, []);

  const handleCloseSignInUpModal = useCallback(() => {
    setOpenSignInUpModal(false);
  }, []);

  const handleOpenMyProfileModal = useCallback(() => {
    setOpenMyProfileModal(true);
    setShowDropdown(false);
  }, []);

  const handleCloseMyProfileModal = useCallback(() => {
    setOpenMyProfileModal(false);
  }, []);


  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  // open Saved Definitions modal and fetch saved definitions
  const handleOpenSavedDefinitions = async () => {
    const definitions = await fetchSavedDefinitions();
    setSavedDefinitions(definitions);
    setOpenSavedDefinitionsModal(true);
  };

  const handleCloseSavedDefinitionsModal = useCallback(() => {
    setOpenSavedDefinitionsModal(false);
  }, []);


  return (
    <div className="container">
      <div style={{ textAlign: 'right' }}>
        {renderUserButton(user, handleOpenSignInUpModal, toggleDropdown, showDropdown, signOut, setUser, handleOpenMyProfileModal, handleCloseMyProfileModal, handleOpenSavedDefinitions, handleCloseSavedDefinitionsModal)}
      </div>
      <Helmet>
        <title>NeuralNavigate</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300&display=swap" rel="stylesheet" />
      </Helmet>
      <h1 id="upload-text">Upload your Machine Learning & AI Research Paper</h1>
      <div className="upload-section">
        <input type="file" accept=".pdf" onChange={event => setFile(event.target.files[0])} />
        <button id="generateGraphButton" onClick={handleFileUpload}>
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
        show={openSignInUpModal}
        onHide={handleCloseSignInUpModal}
        className="signin-signup-modal"
      >
        <button id="loginButton" onClick={handleCloseSignInUpModal}>X</button>
        <Modal.Header>
          <Modal.Title className="signin-signup-modal-title">Neural Navigate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Authentication setUser={setUser} closeModal={handleCloseSignInUpModal} setShowDropdown={setShowDropdown}/>
        </Modal.Body>
      </Modal>

      {/* My Profile modal */}
      <Modal
        show={openMyProfileModal}
        onHide={handleCloseMyProfileModal}
        className="user-profile-modal"
      >
        <Profile user={user} closeModal={handleCloseMyProfileModal} setShowDropdown={setShowDropdown} onUserUpdate={handleUserUpdate}/>
        
      </Modal>

      {/* Saved Definition modal */}
      <SavedDefinitionsComponent
        show={openSavedDefinitionsModal} 
        onHide={handleCloseSavedDefinitionsModal}
        definitions={savedDefinitions} 
        setDefinitions={setSavedDefinitions}
        closeModal={handleCloseSavedDefinitionsModal}
      />

    </div>
  );
}

export function App() {
  return (
    <FileUploadComponent />
  );
}