// NeuralNavivate/my_app/src/react-flow/buttonNode.jsx

import React, { useState, useContext } from 'react';
import { Handle } from 'reactflow';
import '../App.css';
import PropTypes from 'prop-types';
import axios from 'axios'; 

import TopicDefinitions from '../user/TopicDefinitions';
import UserContext from '../user/UserContext';

import { refreshToken } from '../utils/tokenUtils';


const ButtonNode = ({ data }) => {
  const user = useContext(UserContext);
  const [showDefinition, setShowDefinition] = useState(false);
  const [definition, setDefinition] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // NEW state for error message

  const fetchDefinition = async (label, retryCount = 0) => {

    const email = user?.email;
    const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
    let token = localStorage.getItem('token');
    

    try {
      const response = await axios.get(`${baseUrl}/api/get-definition/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }, 
        params: {
          topic: label,
          email: email
        }
      });

      const data = await response.data;
      if (data && data.definition) {
        return data.definition;
      } else {
          console.error("No definition found in response:", data);
          return null;
      }
      

    } catch (error) {
      if (error.response && error.response.status === 401 && retryCount < 1) {
        const refreshSuccess = await refreshToken();
        if (refreshSuccess) {
          return fetchDefinition(label, retryCount + 1);  // Retry once
        }
      }
      console.error("Error:", error);
      return null;
    }
  }

  const handleClick = async () => {
    setShowDefinition(true);
    const def = await fetchDefinition(data.label);
    if (def) {
      setDefinition(prev => prev + def); // Change the way you set state
      setErrorMessage(''); // clear any previous error messages
    } else {
      setErrorMessage('Failed to fetch definition. Please try again.'); // set an error message
    }
  }


  const handleClose = () => {
    setShowDefinition(false);
    setDefinition('');
    setErrorMessage(''); // clear any error messages
  }

  return (
    <div style={{ background: "#1A192B", border: '1px solid #FFF', borderRadius: '2px', padding: '0px', display: 'flex', alignItems: 'center' }}>
      <Handle
        type="target"
        position="left"
        style={{ background: '#555' }}
        onConnect={(params) => console.log('handle onConnect', params)}
      />
      <button className="buttonNodeButton" onClick={handleClick}>
        {data.label}
      </button>
      <Handle
        type="source"
        position="right"
        id="a"
        style={{ background: '#555' }}
      />
      
      <TopicDefinitions show={showDefinition} handleClose={handleClose} definition={definition} />
    </div>
  );
}

ButtonNode.propTypes = {
  data: PropTypes.object.isRequired
  // Add other prop validations if necessary.
};

export default ButtonNode;