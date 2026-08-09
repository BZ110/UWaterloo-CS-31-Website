import { useEffect, useMemo, useRef, useState } from 'react';

const navItems = [
  {
    id: 'home',
    label: 'Home',
    icon: (
      <path
        d="M3.5 11.5 12 4l8.5 7.5M5.5 10.5V20h5v-5.5h3V20h5v-9.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    id: 'directory',
    label: 'Directory',
    icon: (
      <path
        d="M8 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8-1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM3.5 20a4.5 4.5 0 0 1 9 0m2-1.5a3.8 3.8 0 0 1 6 1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    id: 'webring',
    label: 'Webring',
    href: 'https://webring.cs31.ca',
    icon: (
      <>
        <circle cx="8" cy="12" r="4.5" />
        <circle cx="16" cy="12" r="4.5" />
        <path d="M10.5 12h3" strokeLinecap="round" />
      </>
    ),
  },
];

function getInitials(fullName) {
  const parts = fullName.trim().split(/\s+/);
  const first = parts[0]?.charAt(0) || '';
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
  return `${first}${last}`.toUpperCase();
}

const TopNav = ({ view, onNavigate, allStudents, onSearchSelect }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef(null);

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return [];

    return allStudents
      .filter((student) =>
        `${student.fullName} ${student.studentId} ${student.section}`
          .toLowerCase()
          .includes(normalizedQuery)
      )
      .slice(0, 6);
  }, [allStudents, query]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  const handleSelect = (student) => {
    setQuery('');
    setIsFocused(false);
    onSearchSelect(student);
  };

  return (
    <nav className="top-nav" aria-label="Primary">
      <button
        className="brand-lockup"
        type="button"
        onClick={() => onNavigate('home')}
        aria-label="Go to home"
      >

        <span className="brand-copy">
          <span className="brand-title">Waterloo CS '31</span>
          <span className="brand-subtitle">Class Directory</span>
        </span>
      </button>

      <div className="nav-search" ref={searchRef}>
        <svg
          className="search-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path
            d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
            strokeLinecap="round"
          />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search students by name..."
          aria-label="Search students by name"
        />

        {isFocused && query.trim() && (
          <div className="search-results" role="listbox">
            {results.length > 0 ? (
              results.map((student) => (
                <button
                  key={student.id}
                  type="button"
                  className="search-result"
                  onClick={() => handleSelect(student)}
                  role="option"
                >
                  <span
                    className="search-avatar"
                    style={{ backgroundColor: student.color }}
                    aria-hidden="true"
                  >
                    {getInitials(student.fullName)}
                  </span>
                  <span className="search-result-copy">
                    <span className="search-result-name">{student.fullName}</span>
                    <span className="search-result-meta">
                      {student.section.toUpperCase()} / {student.studentId}
                    </span>
                  </span>
                </button>
              ))
            ) : (
              <div className="search-empty">No matching students</div>
            )}
          </div>
        )}
      </div>

      <div className="nav-actions">
        {navItems.map((item) => {
          if (item.href) {
            return (
              <a
                key={item.id}
                className="nav-action"
                href={item.href}
                aria-label={item.label}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  {item.icon}
                </svg>
                <span>{item.label}</span>
              </a>
            );
          }

          const isActive = view === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`nav-action ${isActive ? 'is-active' : ''}`}
              onClick={() => onNavigate(item.id)}
              aria-label={item.label}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                {item.icon}
              </svg>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default TopNav;
