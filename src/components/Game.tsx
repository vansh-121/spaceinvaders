import React, { useState, useEffect, useCallback } from 'react';
import Player from './Player';
import Invader from './Invader';
import Projectile from './Projectile';
import GameOverScreen from './GameOverScreen';
import { GameState, Invader as InvaderType, Projectile as ProjectileType } from '../types';
import { GAME_WIDTH, GAME_HEIGHT, PLAYER_WIDTH, INVADER_ROWS, INVADER_COLS, INVADER_SPACING } from '../constants';

const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [playerX, setPlayerX] = useState((GAME_WIDTH - PLAYER_WIDTH) / 2);
  const [projectiles, setProjectiles] = useState<ProjectileType[]>([]);
  const [invaders, setInvaders] = useState<InvaderType[]>([]);
  const [invaderDirection, setInvaderDirection] = useState<'left' | 'right'>('right');
  const [invaderSpeed, setInvaderSpeed] = useState(1);
  const [keys, setKeys] = useState<Record<string, boolean>>({});

  const initializeGame = useCallback(() => {
    setPlayerX((GAME_WIDTH - PLAYER_WIDTH) / 2);
    const newInvaders: InvaderType[] = [];
    for (let row = 0; row < INVADER_ROWS; row++) {
      for (let col = 0; col < INVADER_COLS; col++) {
        newInvaders.push({
          id: `${row}-${col}`,
          x: col * (INVADER_SPACING + 30) + 50,
          y: row * INVADER_SPACING + 50,
          width: 30,
          height: 30,
          type: row % 3,
        });
      }
    }
    setInvaders(newInvaders);
    setProjectiles([]);
    setScore(0);
    setLives(3);
    setInvaderDirection('right');
    setInvaderSpeed(1);
    setGameState('playing');
  }, []);

  useEffect(() => {
    if (gameState === 'start') {
      const handleStart = (e: KeyboardEvent) => {
        if (e.code === 'Enter') {
          initializeGame();
        }
      };
      window.addEventListener('keydown', handleStart);
      return () => window.removeEventListener('keydown', handleStart);
    }
  }, [gameState, initializeGame]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => setKeys(prev => ({ ...prev, [e.code]: true }));
    const handleKeyUp = (e: KeyboardEvent) => setKeys(prev => ({ ...prev, [e.code]: false }));
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') return;

    // Player movement
    if (keys['ArrowLeft'] && playerX > 0) {
      setPlayerX(x => x - 5);
    }
    if (keys['ArrowRight'] && playerX < GAME_WIDTH - PLAYER_WIDTH) {
      setPlayerX(x => x + 5);
    }

    // Player shooting
    if (keys['Space']) {
      const now = Date.now();
      const lastShot = projectiles.filter(p => p.owner === 'player').pop()?.timestamp ?? 0;
      if (now - lastShot > 300) { // Fire rate limit
        setProjectiles(p => [
          ...p,
          { id: now, x: playerX + PLAYER_WIDTH / 2 - 2.5, y: GAME_HEIGHT - 50, owner: 'player', timestamp: now },
        ]);
      }
    }

    // Update projectiles
    setProjectiles(prev =>
      prev
        .map(p => ({ ...p, y: p.y + (p.owner === 'player' ? -8 : 4) }))
        .filter(p => p.y > 0 && p.y < GAME_HEIGHT)
    );

    // Update invaders
    let isWallHit = false;
    for (const invader of invaders) {
      if (
        (invaderDirection === 'right' && invader.x + invader.width >= GAME_WIDTH) ||
        (invaderDirection === 'left' && invader.x <= 0)
      ) {
        isWallHit = true;
        break;
      }
    }

    if (isWallHit) {
      const newDirection = invaderDirection === 'right' ? 'left' : 'right';
      setInvaderDirection(newDirection);
      setInvaders(prev =>
        prev.map(inv => ({
          ...inv,
          y: inv.y + 20,
        }))
      );
    } else {
      setInvaders(prev =>
        prev.map(inv => ({
          ...inv,
          x: inv.x + (invaderDirection === 'right' ? invaderSpeed : -invaderSpeed),
        }))
      );
    }
    
    // Invader shooting
    if (Math.random() < 0.02 && invaders.length > 0) {
        const shootingInvader = invaders[Math.floor(Math.random() * invaders.length)];
        setProjectiles(p => [
            ...p,
            { id: Date.now(), x: shootingInvader.x + shootingInvader.width / 2 - 2.5, y: shootingInvader.y + shootingInvader.height, owner: 'invader', timestamp: Date.now() },
        ]);
    }

    // Collision detection
    setProjectiles(currentProjectiles => {
        let newProjectiles = [...currentProjectiles];
        let newInvaders = [...invaders];
        let scoreToAdd = 0;
        let playerHit = false;

        for (let i = newProjectiles.length - 1; i >= 0; i--) {
            const p = newProjectiles[i];
            if (p.owner === 'player') {
                for (let j = newInvaders.length - 1; j >= 0; j--) {
                    const invader = newInvaders[j];
                    if (
                        p.x < invader.x + invader.width &&
                        p.x + 5 > invader.x &&
                        p.y < invader.y + invader.height &&
                        p.y + 10 > invader.y
                    ) {
                        newProjectiles.splice(i, 1);
                        newInvaders.splice(j, 1);
                        scoreToAdd += 10;
                        break; 
                    }
                }
            } else { // invader projectile
                if (
                    !playerHit &&
                    p.x < playerX + PLAYER_WIDTH &&
                    p.x + 5 > playerX &&
                    p.y < GAME_HEIGHT - 30 &&
                    p.y + 10 > GAME_HEIGHT - 50
                ) {
                    newProjectiles.splice(i, 1);
                    playerHit = true;
                }
            }
        }

        if (scoreToAdd > 0) {
            setScore(s => s + scoreToAdd);
            setInvaders(newInvaders);
            setInvaderSpeed(s => s * 1.01);
        }
        
        if (playerHit) {
            setLives(l => l - 1);
        }

        // Check game over conditions
        if (lives - (playerHit ? 1 : 0) <= 0 || newInvaders.some(inv => inv.y >= GAME_HEIGHT - 50)) {
            setGameState('gameOver');
        }
        if (newInvaders.length === 0) {
            setGameState('win');
        }

        return newProjectiles;
    });

  }, [gameState, keys, playerX, projectiles, invaders, invaderDirection, invaderSpeed, lives]);

  useEffect(() => {
    const gameInterval = setInterval(gameLoop, 1000 / 60);
    return () => clearInterval(gameInterval);
  }, [gameLoop]);

  return (
    <div
      className="relative bg-black bg-opacity-50 border-2 border-cyan-400 rounded-lg shadow-2xl shadow-cyan-500/20"
      style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
    >
      {gameState === 'playing' && (
        <>
          <div className="absolute top-2 left-4 text-lg text-cyan-300">SCORE: {score}</div>
          <div className="absolute top-2 right-4 text-lg text-cyan-300">LIVES: {lives}</div>
          <Player x={playerX} />
          {invaders.map(invader => (
            <Invader key={invader.id} {...invader} />
          ))}
          {projectiles.map(p => (
            <Projectile key={p.id} {...p} />
          ))}
        </>
      )}
      {gameState === 'start' && (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <h2 className="text-4xl text-cyan-300 mb-4 animate-pulse">Press Enter to Start</h2>
            <div className="text-neutral-400">
                <p>Arrow Keys to Move</p>
                <p>Spacebar to Shoot</p>
            </div>
        </div>
      )}
      {(gameState === 'gameOver' || gameState === 'win') && (
        <GameOverScreen status={gameState} score={score} onRestart={initializeGame} />
      )}
    </div>
  );
};

export default Game;
