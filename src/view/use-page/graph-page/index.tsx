import React from 'react';
// import Graph from '../componets/graph';
import Graph from '../componets/Network';

export default function GraphPage() {
  return (
    <div className="content"
      style={{
        padding: '20px',
        background: '#fff'
      }}
    >
      <Graph />
    </div>
  );
}
