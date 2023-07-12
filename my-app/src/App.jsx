import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet'; 
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
              <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300&display=swap" rel="stylesheet"/>
            </Helmet>
            <h1 id="upload-text">Upload your Machine Learning & AI Research Paper</h1>
            <input type="file" accept=".pdf" onChange={event => setFile(event.target.files[0])} />
            <button onClick={submitFile}>Generate Graph</button>
            <div id="topicsContainer">
                {/* Topics will be generated here */}
            </div>
        </div>
    );
}

export default FileUploadComponent;
