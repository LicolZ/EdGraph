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
import { Modal, Button } from 'react-bootstrap'; // import React Bootstrap's Modal and Button

import { createNode, createEdgesFromRelationships } from './reactFlowNodesEdges';

import ButtonNode from './buttonNode';

// import sign-in components
import SignIn from './user/SignIn';
import './App.css';
import './index.css';

const nodeTypes = {
  buttonNode: ButtonNode,
};

export default function FileUploadComponent() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [openModal, setOpenModal] = useState(false); // State for opening and closing modal

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

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

  // Function to handle opening modal
  const handleOpen = () => {
    setOpenModal(true);
  };

  // Function to handle closing modal
  const handleClose = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    const handleResize = () => {
      const title = document.getElementById("upload-text");
      if (title) {
        const windowWidth = window.innerWidth;
        if (windowWidth < 700) {
          title.style.fontSize = "16px";
        } else if (windowWidth < 1000) {
          title.style.fontSize = "22px";
        } else {
          title.style.fontSize = "30px";
        }
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="container">
      <div style={{ textAlign: 'right' }}>
        <Button id="loginButton" onClick={handleOpen}>Login</Button>
      </div>
      <Helmet>
        <title>NeuralNavigate</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300&display=swap" rel="stylesheet" />
      </Helmet>
      <h1 id="upload-text">Upload your Machine Learning & AI Research Paper</h1>
      <div className="upload-section">
        <input type="file" accept=".pdf" onChange={event => setFile(event.target.files[0])} />
        <button id="uploadButton" onClick={submitFile}>{loading ? "Loading..." : "Generate Graph"}</button>
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

      {/* Modal for SignIn */}
      <Modal
        show={openModal}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Sign In</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SignIn />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export function App() {
  return (
    <FileUploadComponent />
  );
}
