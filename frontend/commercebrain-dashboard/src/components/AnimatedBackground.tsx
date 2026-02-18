export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 mesh-bg" />

      {/* Animated orbs */}
      <div
        className="absolute top-[10%] left-[15%] w-[500px] h-[500px] rounded-full opacity-30 blur-[100px]"
        style={{
          background: 'radial-gradient(circle, hsl(215 95% 58% / 0.4), transparent 70%)',
          animation: 'orb-float-1 20s ease-in-out infinite',
        }}
      />
      <div
        className="absolute top-[50%] right-[10%] w-[400px] h-[400px] rounded-full opacity-25 blur-[100px]"
        style={{
          background: 'radial-gradient(circle, hsl(260 60% 52% / 0.35), transparent 70%)',
          animation: 'orb-float-2 25s ease-in-out infinite',
        }}
      />
      <div
        className="absolute bottom-[10%] left-[40%] w-[350px] h-[350px] rounded-full opacity-20 blur-[80px]"
        style={{
          background: 'radial-gradient(circle, hsl(320 80% 58% / 0.3), transparent 70%)',
          animation: 'orb-float-3 18s ease-in-out infinite',
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(hsl(215 95% 58% / 0.04) 1px, transparent 1px), linear-gradient(90deg, hsl(215 95% 58% / 0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          animation: 'grid-pulse 4s ease-in-out infinite',
        }}
      />

      {/* Rising particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            left: `${Math.random() * 100}%`,
            background: i % 3 === 0
              ? 'hsl(215 95% 58% / 0.6)'
              : i % 3 === 1
              ? 'hsl(260 60% 52% / 0.5)'
              : 'hsl(320 80% 58% / 0.4)',
            boxShadow: `0 0 6px currentColor`,
            animation: `particle-rise ${8 + Math.random() * 12}s linear infinite`,
            animationDelay: `${Math.random() * 10}s`,
          }}
        />
      ))}
    </div>
  );
}
