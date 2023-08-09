import React from 'react';
import { Handle } from 'reactflow';
import '../App.css';

const ButtonNode = ({ data }) => {
  const handleClick = () => {
    console.log("Button clicked");
    window.open('http://www.licol.io', "_blank"); // will open the URL in a new tab
  }

  return (
    <div style={{ background: "#1A192B", border: '1px solid #FFF', borderRadius: '2px', padding: '0px', display: 'flex', alignItems: 'center' }}> {/* Changed padding to '0px' and added 'display: flex' and 'align-items: center' */}
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
    </div>
  );
}

export default ButtonNode;
