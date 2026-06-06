const MinigamePage = ({ onNavigate }) => {
  return (
    <div className="minigame-page">
      <div className="minigame-bg" aria-hidden="true" />
      <main className="minigame-panel">
        <div className="minigame-orbit" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p className="section-kicker">Coming Soon</p>
        <h1>The Alchemist's Trial</h1>
        <p>
          A small class minigame is being prepared. The door is visible, the
          lock is polished, and the key is still in development.
        </p>
        <div className="minigame-actions">
          <button type="button" onClick={() => onNavigate('home')}>
            Return Home
          </button>
          <button type="button" onClick={() => onNavigate('directory')}>
            Open Directory
          </button>
        </div>
      </main>
    </div>
  );
};

export default MinigamePage;
