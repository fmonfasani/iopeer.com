import React from 'react';

const Skeleton = ({ shape = 'line', size = '', animation = 'pulse', className = '' }) => {
  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded';
  const animationClass = animation ? `animate-${animation}` : '';
  return <div className={`bg-gray-200 ${shapeClass} ${animationClass} ${size} ${className}`.trim()} />;
};

export default Skeleton;
