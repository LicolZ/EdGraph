import React, { useState } from 'react';
import axios from 'axios';

function FileUploadComponent() {
    const [file, setFile] = useState(null);

    const submitFile = () => {
        const formData = new FormData();
        formData.append('file', file);

        axios.post('http://localhost:4000/process/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then(response => {
            // Handle response here
            console.log(response.data.topics);
        });
    };

    return (
        <div className="container">
            <h1>Upload your Machine Learning & AI Research Paper</h1>
            <input type="file" accept=".pdf" onChange={event => setFile(event.target.files[0])} />
            <button onClick={submitFile}>Generate Graph</button>
            <div id="topicsContainer">
                {/* Topics will be generated here */}
            </div>
        </div>
    );
}

export default FileUploadComponent;
