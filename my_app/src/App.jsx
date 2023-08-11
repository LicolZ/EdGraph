// App.jsx
import React, { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import axios from 'axios';
import { Helmet } from 'react-helmet'; 
import 'reactflow/dist/style.css';
import { Modal } from 'react-bootstrap'; // import React Bootstrap's Modal and Button

import { createNode, createEdgesFromRelationships } from './react-flow/reactFlowNodesEdges';

import ButtonNode from './react-flow/buttonNode';

// import SignIn/SignUp components
import Authentication from './user/Authentication';
import './App.css';
import './index.css';

// import signed-in user components
import { renderUserButton } from './user/userUtils';



const nodeTypes = {
  buttonNode: ButtonNode,
};

export default function FileUploadComponent() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [openModal, setOpenModal] = useState(false); // state for opening and closing modal
  const [user, setUser] = useState(null); // contain user data when user is signed in, null when user is signed out
  const [showDropdown, setShowDropdown] = useState(false);

  // first useEffect - for updating the user state from local storage on storage events
  useEffect(() => {
    const handleStorageChange = () => {
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        console.log("Setting user from storage change:", userEmail);
        setUser({ email: userEmail });
      } else {
        console.log("Resetting user from storage change.");
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


  // second useEffect - for setting the initial user state from local storage
  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      console.log("Setting initial user:", userEmail);
      setUser({ email: userEmail });
    }
  }, []);


  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );


  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };


  const submitFile = () => {
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

  // function to handle opening modal
  const handleOpen = () => {
    setOpenModal(true);
  };

  // function to handle closing modal
  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <>
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
        <div id="topicsContainer">
          <ReactFlow
            nodeTypes={nodeTypes} 
            nodes={nodes} 
            edges={edges}
            onConnect={onConnect}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
          >
            <MiniMap
              nodeStrokeColor={(n) => '#FFF'}
              nodeColor={(n) => '#1A192B'}
              nodeBorderRadius={2}
            />
            <Controls />
            <Background color="#aaa" gap={16} />
          </ReactFlow>
        </div>
      </div>
    
      {/* modal for SignIn/SignUp */}
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
    </>
  );
}

export function App() {
  return (
    <FileUploadComponent />
  );
}


