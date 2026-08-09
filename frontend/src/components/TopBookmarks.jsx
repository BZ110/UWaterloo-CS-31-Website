const labels = {
  cs: 'CS',
  swe: 'SWE',
};

const TopBookmarks = ({ activeSection, onSectionChange }) => {
  return (
    <div className="top-bookmarks" role="group" aria-label="Directory section">
      {Object.entries(labels).map(([section, label]) => (
        <button
          key={section}
          type="button"
          className={`section-bookmark section-bookmark-${section} ${
            activeSection === section ? 'is-active' : ''
          }`}
          onClick={() => onSectionChange(section)}
          aria-pressed={activeSection === section}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default TopBookmarks;
