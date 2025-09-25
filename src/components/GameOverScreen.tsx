import React from 'react';

interface GameOverScreenProps {
  status: 'gameOver' | 'win';
  score: number;
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ status, score, onRestart }) => {
  const title = status === 'win' ? 'YOU WIN!' : 'GAME OVER';
  const color = status === 'win' ? 'text-cyan-300' : 'text-red-500';

  return (
    <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center text-center z-30">
      <h2 className={`text-6xl font-bold mb-4 ${color}`} style={{ textShadow: `0 0 10px currentColor` }}>
        {title}
      </h2>
      <p className="text-2xl mb-8">Final Score: {score}</p>
      <button
        onClick={onRestart}
        className="px-8 py-4 bg-neutral-800 border-2 border-cyan-400 text-cyan-400 text-xl rounded-lg uppercase tracking-widest
                   hover:bg-cyan-400 hover:text-black hover:shadow-lg hover:shadow-cyan-400/50 transition-all duration-300"
      >
        Play Again
      </button>
    </div>
  );
};

export default GameOverScreen;
