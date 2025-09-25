export type GameState = 'start' | 'playing' | 'gameOver' | 'win';

export interface Projectile {
  id: number;
  x: number;
  y: number;
  owner: 'player' | 'invader';
  timestamp: number;
}

export interface Invader {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: number;
}
