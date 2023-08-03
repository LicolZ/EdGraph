// reactFlowNodesEdges.jsx

let edgeIdCounter = 0;

const nodesPerRow = 5; // number of nodes in one row
const nodeGap = 500; // Distance between nodes

export function createNode(topic, index) {
  const rowIndex = Math.floor(index / nodesPerRow);
  const columnIndex = index % nodesPerRow;

  return {
    id: `node-${index}`,
    type: 'buttonNode',
    data: { label: topic.trim() }, // Trim leading and trailing whitespace
    position: { x: columnIndex * nodeGap, y: rowIndex * nodeGap },
  };
}

export function createEdgesFromRelationships(relationships, nodes) {
  const edges = [];
  for (let i = 0; i < relationships.length; i++) {
    const [sourceTopic, targetTopic] = relationships[i];
    const cleanedSourceTopic = sourceTopic.trim();
    const cleanedTargetTopic = targetTopic.trim();

    const sourceNode = nodes.find((node) => node.data.label.toLowerCase() === cleanedSourceTopic.toLowerCase());
    const targetNode = nodes.find((node) => node.data.label.toLowerCase() === cleanedTargetTopic.toLowerCase());

    if (sourceNode && targetNode) {
      edges.push({ id: `e${sourceNode.id}-${targetNode.id}-${edgeIdCounter++}`, source: sourceNode.id, target: targetNode.id, arrowHeadType: 'arrowclosed', animated: true });
    }
  }
  return edges;
}


