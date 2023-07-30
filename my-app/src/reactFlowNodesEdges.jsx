const nodesPerRow = 5; // number of nodes in one row
const nodeGap = 500; // Distance between nodes

function createNode(topic, index) {
  const rowIndex = Math.floor(index / nodesPerRow);
  const columnIndex = index % nodesPerRow;

  return {
    id: `node-${index}`,
    type: 'default',
    data: { label: topic },
    position: { x: columnIndex * nodeGap, y: rowIndex * nodeGap },
  };
}

const connectionExists = (source, target, elements) => {
  return elements.some(element => {
    return (
      (element.source === source && element.target === target) ||
      (element.source === target && element.target === source)
    );
  });
};

const createEdges = (newNodes, newElements) => {
  for (let i = 0; i < newNodes.length - 1; i++) {
    for (let j = i + 1; j < newNodes.length; j++) {
      const source = newNodes[i].id;
      const target = newNodes[j].id;
      if (!connectionExists(source, target, newElements)) {
        newElements.push({
          id: `edge-${source}-${target}`,
          source: source,
          target: target,
          animated: true,
        });
      }
    }
  }
  return newElements;
};

export { createNode, createEdges };
