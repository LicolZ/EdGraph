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


// const addEdge = (edgeParams, elements) => {
//   const { source, target } = edgeParams;

//   // Ensure the source and target nodes exist before creating the edge.
//   if (!elements.some((el) => el.id === source) || !elements.some((el) => el.id === target)) {
//     return elements;
//   }

//   // Create a new edge.
//   const newEdge = {
//     id: `edge-${source}-${target}`,
//     source: source,
//     target: target,
//     animated: true,
//     arrowHeadType: 'arrow',
//   };

//   return [...elements, newEdge];
// };

// export { createNode, addEdge };


// const connectionExists = (source, target, elements) => {
//   return elements.some(element => {
//     return (
//       (element.source === source && element.target === target) ||
//       (element.source === target && element.target === source)
//     );
//   });
// };

export function createEdgesFromRelationships(relationships, nodes) {
  const edges = [];
  for (const [sourceTopic, targetTopic] of relationships) {
    const cleanedSourceTopic = sourceTopic.trim();
    const cleanedTargetTopic = targetTopic.trim();

    const sourceNode = nodes.find((node) => node.data.label.toLowerCase() === cleanedSourceTopic.toLowerCase());
    const targetNode = nodes.find((node) => node.data.label.toLowerCase() === cleanedTargetTopic.toLowerCase());

    if (sourceNode && targetNode) {
      edges.push({ id: `e${sourceNode.id}-${targetNode.id}`, source: sourceNode.id, target: targetNode.id, arrowHeadType: 'arrowclosed', animated: true });
    }
    //  else {
    //   console.warn(`Could not create edge: ${cleanedSourceTopic} -> ${cleanedTargetTopic}`);
    //   if (!sourceNode) {
    //     console.warn(`sourceNode not found for topic: ${cleanedSourceTopic}`);
    //   }
    //   if (!targetNode) {
    //     console.warn(`targetNode not found for topic: ${cleanedTargetTopic}`);
    //   }
    // }
    
  }
  return edges;
}

