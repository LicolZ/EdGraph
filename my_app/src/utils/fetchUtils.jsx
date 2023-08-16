// NeuralNavivate/my_app/src/utils/fetchUtils.jsx

import axios from 'axios';
import { refreshToken } from './tokenUtils'; // Ensure this path is correct

const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

export const fetchSavedDefinitions = async (retryCount = 0) => {
    const token = localStorage.getItem('token');

    try {
        const response = await axios.get(`${baseUrl}/api/save-definition/`, { 
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data.definitions;
    } catch (error) {
        if (error.response.status === 401 && retryCount < 1) { // limit retries to once
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