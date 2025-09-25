import React from 'react';
import { Invader as InvaderType } from '../types';

const invaderColors = ['#f472b6', '#a78bfa', '#60a5fa']; // Pink, Purple, Blue

const Invader: React.FC<InvaderType> = ({ x, y, width, height, type }) => {
  const color = invaderColors[type % invaderColors.length];
  return (
    <div
      className="absolute"
      style={{
        left: x,
        top: y,
        width,
        height,
        backgroundColor: color,
        boxShadow: `0 0 10px ${color}, 0 0 15px ${color}`,
        borderRadius: '4px',
      }}
    />
  );
};

export default Invader;
