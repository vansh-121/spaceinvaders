import Game from './components/Game';

function App() {
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] text-white font-mono overflow-hidden">
      <div className="absolute inset-0 z-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 5 + 5}s`,
            }}
          />
        ))}
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-[#0a0a0a] z-10" />
      <div className="z-20 text-center mb-8">
        <h1 className="text-5xl md:text-7xl font-bold text-cyan-300 tracking-widest uppercase" style={{ textShadow: '0 0 10px #22d3ee, 0 0 20px #22d3ee' }}>
          Space Invaders
        </h1>
        <p className="text-neutral-400 mt-2">A Retro-Futuristic Arcade Shooter</p>
      </div>
      <Game />
    </main>
  );
}

export default App;
