import React, { useState } from 'react';
import axios from 'axios';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

    const submitForm = async () => {
        const response = await axios.post(`${baseUrl}/api/signin`, {
          email,
          password,
        });
        // TODO: implement handling of the response
    // need to store the token and set the user as authenticated in  app state
    };
    
    return (
        <div>
            <input
                type = "password"
                value = {password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button onClick={submitForm}>Sign In</button>            
        </div>
    );
}