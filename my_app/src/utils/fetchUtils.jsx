// NeuralNavivate/my_app/src/utils/fetchUtils.jsx

import axios from 'axios';
import { refreshToken } from './tokenUtils'; // Ensure this path is correct


export const fetchSavedDefinitions = async (retryCount = 0) => {
    const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
    const token = localStorage.getItem('token');
    console.log(token)
    try {
        
        const response = await axios.get(`${baseUrl}/api/get-saved-definitions/`, { 
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log("called")
        return response.data.definitions;
    } catch (error) {
        if (error.response && error.response.status === 401 && retryCount < 1) { // limit retries to once
            const refreshSuccess = await refreshToken();
            if (refreshSuccess) {
                return fetchSavedDefinitions(retryCount + 1);  // retry once
            }
        }
        console.error("Error:", error);
        alert('Error fetching saved definitions.');
        return [];
    }
};