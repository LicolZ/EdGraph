
// NeuralNavivate/my_app/src/utils/tokenUtils.js

import axios from 'axios';

const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

async function refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');

    try {
        const response = await axios.post(`${baseUrl}/api/token-refresh/`, {
            refresh: refreshToken
        });

        const newAccessToken = response.data.access;
        localStorage.setItem('token', newAccessToken);
        return true;
    } catch (error) {
        console.error("Error refreshing token:", error.response.data);
        return null;
    }
}

export { refreshToken };
