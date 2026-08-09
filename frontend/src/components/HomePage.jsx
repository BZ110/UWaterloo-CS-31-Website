const HomePage = ({ onNavigate }) => {
  return (
    <div className="home-page">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="home-video"
        src="/background-disabled.mp4"
        aria-hidden="true"
      />
      <div className="home-video-fallback" aria-hidden="true" />
      <div className="home-shade" aria-hidden="true" />

      <main className="home-content">
        <div className="home-rule" aria-hidden="true" />
        <p className="home-kicker">Class Directory</p>
        <h1>Waterloo CS '31</h1>
        <p className="home-subtitle">
          A living registry of classmates, projects, curiosities, and tiny
          academic legends.
        </p>

        <div className="home-actions">
          <button type="button" className="primary-home-action" onClick={() => onNavigate('directory')}>
            Open Directory
          </button>
          <a className="secondary-home-action" href="https://webring.cs31.ca">
            Webring
          </a>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
