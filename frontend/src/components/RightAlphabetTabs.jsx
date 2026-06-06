const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const RightAlphabetTabs = ({ activeLetter, availableLetters, onLetterClick }) => {
  return (
    <div className="alphabet-tabs" aria-label="Jump by surname">
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
            aria-label={
              isEnabled
                ? `Jump to surnames beginning with ${letter}`
                : `No surnames beginning with ${letter}`
            }
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
};

export default RightAlphabetTabs;
