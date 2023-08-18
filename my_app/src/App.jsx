// NeuralNavivate/my_app/src/App.jsx

// external imports
import React, { useCallback, useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { addEdge, useNodesState, useEdgesState } from 'reactflow';

// internal imports
import ReactFlowComponent from './components/ReactFlowComponent';
import AuthenticationComponent from './components/AuthenticationComponent';
import { renderUserButton, signOut } from './utils/userUtils';
import SavedDefinitionsComponent from './components/SavedDefinitionsComponent';
import { fetchSavedDefinitions } from './utils/fetchUtils';
import { generateGraph } from './utils/graphUtils';
import Profile from './components/MyProfileComponent';
import UserContext from './user/UserContext';

// styles imports
import './App.css';
import './index.css';

export default function NeuralNavigateApp() {

  // states
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [user, setUser] = useState(null);

  const [showDropdown, setShowDropdown] = useState(false);

  const [modals, setModals] = useState({
    signInUpModal: false,
    myProfileModal: false,
    savedDefinitionsModal: false
  });
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
    generateGraph(file, setNodes, setEdges, setLoading);
  };

  const handleOpenSignInUpModal = useCallback(() => {
    setModals(prev => ({ ...prev, signInUpModal: true }));
  }, []);

  const handleCloseSignInUpModal = useCallback(() => {
      setModals(prev => ({ ...prev, signInUpModal: false }));
  }, []);

  const handleOpenMyProfileModal = useCallback(() => {
      setModals(prev => ({ ...prev, myProfileModal: true }));
      setShowDropdown(false);
  }, []);

  const handleCloseMyProfileModal = useCallback(() => {
      setModals(prev => ({ ...prev, myProfileModal: false }));
  }, []);


  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  // open Saved Definitions modal and fetch saved definitions
  const handleOpenSavedDefinitions = async () => {
    setModals(prev => ({ ...prev, savedDefinitionsModal: true }));
    const definitions = await fetchSavedDefinitions();
    setSavedDefinitions(definitions);
  };

  const handleCloseSavedDefinitionsModal = useCallback(() => {
      setModals(prev => ({ ...prev, savedDefinitionsModal: false }));
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

      {/* Authentication modal */}
      <Modal
        show={modals.signInUpModal}
        onHide={handleCloseSignInUpModal}
        className="signin-signup-modal"
      >
        <AuthenticationComponent 
          setUser={setUser} 
          closeModal={handleCloseSignInUpModal} 
          setShowDropdown={setShowDropdown}
        />
      </Modal>

      {/* My Profile modal */}
      <Modal
        show={modals.myProfileModal}
        onHide={handleCloseMyProfileModal}
        className="user-profile-modal"
      >
        <Profile 
          user={user} 
          closeModal={handleCloseMyProfileModal} 
          setShowDropdown={setShowDropdown} 
          onUserUpdate={handleUserUpdate}
        />
      </Modal>

      {/* Saved Definition modal */}
      <SavedDefinitionsComponent
        show={modals.savedDefinitionsModal} 
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
    <NeuralNavigateApp />
  );
}