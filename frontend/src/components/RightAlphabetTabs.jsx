const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const RightAlphabetTabs = ({ activeLetter, availableLetters, onLetterClick }) => {
  return (
    <nav className="alphabet-tabs" aria-label="Jump by first name">
      {letters.map((letter) => {
        const isEnabled = availableLetters.has(letter);
        const isActive = activeLetter === letter;

        return (
          <button
            key={letter}
            type="button"
            className={`alphabet-tab ${isActive ? 'is-active' : ''}`}
            onClick={() => onLetterClick(letter)}
            disabled={!isEnabled}
            aria-pressed={isActive}
            aria-label={
              isEnabled
                ? `Jump to first names beginning with ${letter}`
                : `No first names beginning with ${letter}`
            }
          >
            {letter}
          </button>
        );
      })}
    </nav>
  );
};

export default RightAlphabetTabs;
