export default function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      // Static film grain — no animation loop (keeps the main thread free for smooth scroll).
      // Multiply blend gives the cream paper a subtle premium "tooth" without darkening content.
      // Hidden on mobile: fixed + mixBlendMode forces GPU compositing on every scroll frame → jank.
      className="hidden md:block fixed inset-0 z-[9995] pointer-events-none select-none"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "200px 200px",
        opacity: 0.05,
        mixBlendMode: "multiply",
      }}
    />
  );
}

