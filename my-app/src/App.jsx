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

import './App.css';
import './index.css';

const nodesPerRow = 5; // number of nodes in one row

function createNode(topic, index) {
  const rowIndex = Math.floor(index / nodesPerRow);
  const columnIndex = index % nodesPerRow;
  const nodeGap = 500; // Distance between nodes

  return {
    id: `node-${index}`,
    type: 'default',
    data: { label: topic },
    position: { x: columnIndex * nodeGap, y: rowIndex * nodeGap },
  };
}

const connectionExists = (source, target, elements) => {
  return elements.some(element => {
    return (
      (element.source === source && element.target === target) ||
      (element.source === target && element.target === source)
    );
  });
};

const createEdges = (newNodes, newElements) => {
  for (let i = 0; i < newNodes.length - 1; i++) {
    for (let j = i + 1; j < newNodes.length; j++) {
      const source = newNodes[i].id;
      const target = newNodes[j].id;
      if (!connectionExists(source, target, newElements)) {
        newElements.push({
          id: `edge-${source}-${target}`,
          source: source,
          target: target,
          animated: true,
        });
      }
    }
  }
  return newElements;
};

export default function FileUploadComponent() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

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
      let newElements = [...newNodes];
      newElements = createEdges(newNodes, newElements);
      setNodes(newNodes);
      setEdges(newElements);
    })
    .finally(() => setLoading(false));
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
  );
}