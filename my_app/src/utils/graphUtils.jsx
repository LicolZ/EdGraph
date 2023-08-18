// NeuralNavivate/my_app/src/utils/graphUtils.js

import axios from 'axios';
import { createNode, createEdgesFromRelationships } from '../react_flow/reactFlowNodesEdges';

export async function generateGraph(file, setNodes, setEdges, setLoading) {
    if (!file) return;
    
    setLoading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    
    const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
    
    try {
        const response = await axios.post(`${baseUrl}/process/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        const topics = response.data.topics;
        const newNodes = topics.map((topic, i) => createNode(topic, i));
        const newEdges = createEdgesFromRelationships(response.data.relationships, newNodes);
        
        setNodes(newNodes);
        setEdges(newEdges);
    } catch (error) {
        console.error("Error during file upload:", error);
    } finally {
        setLoading(false);
    }
}
