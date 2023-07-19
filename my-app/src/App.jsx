import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet'; 
import axios from 'axios';

function FileUploadComponent() {
    const [file, setFile] = useState(null);
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(false);


    const submitFile = () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        axios.post('http://localhost:4000/process/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then(response => {
            // handle response 
            setTopics(response.data.topics);
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
              <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300&display=swap" rel="stylesheet"/>
            </Helmet>
            <h1 id="upload-text">Upload your Machine Learning & AI Research Paper</h1>
            <input type="file" accept=".pdf" onChange={event => setFile(event.target.files[0])} />
            <button onClick={submitFile}>{loading ? "Loading..." : "Generate Graph"}</button>

            <div id="topicsContainer">
                {topics.map((topic, i) =>
                <button key={i} onClick={() => {/* Handle button click here */}}>
                  {topic}
                </button>
                
                )}
            </div>
        </div>
    );
}

export default FileUploadComponent;
