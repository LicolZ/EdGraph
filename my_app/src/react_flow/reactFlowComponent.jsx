import React from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
} from 'reactflow';
import ButtonNode from './buttonNode';

import 'reactflow/dist/style.css';
import '../App.css';

const nodeTypes = {
  buttonNode: ButtonNode,
};

export default function ReactFlowComponent({ nodes, edges, onConnect, onNodesChange, onEdgesChange }) {

  return (
    <div id="topicsContainer">
      <ReactFlow
        nodeTypes={nodeTypes} 
        nodes={nodes} 
        edges={edges}
        onConnect={onConnect}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      >
        <MiniMap
          nodeStrokeColor={(n) => '#FFF'}
          nodeColor={(n) => '#1A192B'}
          nodeBorderRadius={2}
        />
        <Controls />
        <Background color="#aaa" gap={25} />
      </ReactFlow>
    </div>
  );
}
