export function BackgroundVideo() {
  return (
    <div className="arcade-hero-video-wrap arcade-bg-video-wrap" aria-hidden>
      <video
        className="arcade-hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/videos/retro-loop.mp4" type="video/mp4" />
      </video>
      <div className="arcade-bg-video-overlay" />
    </div>
  );
}
