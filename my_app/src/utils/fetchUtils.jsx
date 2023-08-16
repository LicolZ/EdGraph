// NeuralNavivate/my_app/src/utils/fetchUtils.jsx

import axios from 'axios';

export const fetchSavedDefinitions = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get('YOUR_BACKEND_ENDPOINT_FOR_SAVED_DEFINITIONS', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data.definitions;
    } catch (error) {
        console.error("Error:", error);
        alert('Error fetching saved definitions.');
        return [];
    }
};
