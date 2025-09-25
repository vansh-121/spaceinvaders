import React from 'react';
import { PLAYER_WIDTH, PLAYER_HEIGHT, GAME_HEIGHT } from '../constants';

interface PlayerProps {
  x: number;
}

const Player: React.FC<PlayerProps> = ({ x }) => {
  return (
    <div
      className="absolute bg-cyan-400"
      style={{
        left: x,
        bottom: 20,
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
        clipPath: 'polygon(50% 0%, 15% 100%, 85% 100%)',
        boxShadow: '0 0 15px #22d3ee, 0 0 25px #22d3ee',
      }}
    />
  );
};

export default Player;
