import React from 'react';

export default function DrawLine(props) {
  const { cy: top, thickness: height, cx: left, angle, length: width } = props;
  if (!top) return null;
  return <div className="line" style={{ height, width, left, top, WebkitTransform: `rotate(${angle}deg)` }} />;
}
