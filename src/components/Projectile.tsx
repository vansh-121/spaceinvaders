import React from 'react';
import { Projectile as ProjectileType } from '../types';

const Projectile: React.FC<ProjectileType> = ({ x, y, owner }) => {
  const color = owner === 'player' ? '#22d3ee' : '#f43f5e'; // Cyan for player, Red for invader
  return (
    <div
      className="absolute rounded-full"
      style={{
        left: x,
        top: y,
        width: 5,
        height: 10,
        backgroundColor: color,
        boxShadow: `0 0 8px ${color}, 0 0 12px ${color}`,
      }}
    />
  );
};

export default Projectile;
