function getNameParts(fullName) {
  const parts = fullName.trim().split(/\s+/);
  return {
    first: parts[0] || '',
    last: parts.slice(1).join(' ') || parts[0] || '',
  };
}

function getInitials(fullName) {
  const parts = fullName.trim().split(/\s+/);
  const first = parts[0]?.charAt(0) || '';
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
  return `${first}${last}`.toUpperCase();
}

function groupLetters(students) {
  return Array.from(
    new Set(
      students.map((student) =>
        student.fullName.trim().split(/\s+/).slice(-1)[0].charAt(0).toUpperCase()
      )
    )
  ).sort();
}

const LeftPage = ({
  mode,
  student,
  students,
  rosterStudents,
  section,
  rosterPage,
  maxRosterPage,
  canPrev,
  canRosterPrev,
  onPrev,
  onRosterPrev,
  onBrowseAll,
  onStudentSelect,
  onSpeakName,
  canSpeak,
  pageNumber,
}) => {
  if (mode === 'overview') {
    return (
      <RosterPage
        side="left"
        section={section}
        students={rosterStudents}
        rosterPage={rosterPage}
        maxRosterPage={maxRosterPage}
        canMove={canRosterPrev}
        onMove={onRosterPrev}
        onStudentSelect={onStudentSelect}
        pageNumber={pageNumber}
      />
    );
  }

  if (mode === 'index') {
    const letters = groupLetters(students);

    return (
      <div className="page-content index-left-page">
        <div className="page-topline">
          <button type="button" onClick={onBrowseAll} className="quiet-page-button">
            Browse all
          </button>
          <span>{section.toUpperCase()} registry</span>
        </div>

        <div className="index-title-block">
          <p className="section-kicker">People Index</p>
          <h2>{section.toUpperCase()} Classmates</h2>
          <p>
            Browse by surname, jump back into a profile, or use the alphabet
            tabs along the book edge.
          </p>
        </div>

        <dl className="index-stats">
          <div>
            <dt>Entries</dt>
            <dd>{students.length}</dd>
          </div>
          <div>
            <dt>Letters</dt>
            <dd>{letters.join(', ')}</dd>
          </div>
        </dl>

        <div className="index-note">
          <span aria-hidden="true">WC</span>
          <p>
            Search results and index entries are section-scoped now, so CS and
            SWE classmates no longer appear as duplicates.
          </p>
        </div>

        <PageNumber pageNumber={pageNumber} />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="page-content empty-page">
        <p>Select a student from the registry.</p>
      </div>
    );
  }

  const name = getNameParts(student.fullName);

  return (
    <div className="page-content profile-left-page">
      <div className="page-topline">
        <button
          type="button"
          onClick={onPrev}
          className="quiet-page-button"
          disabled={!canPrev}
        >
          &larr; Previous
        </button>
        <button type="button" onClick={onBrowseAll} className="quiet-page-button">
          Browse all
        </button>
      </div>

      <div className="profile-hero">
        <div className="portrait-frame">
          {student.photoUrl ? (
            <img src={student.photoUrl} alt="" className="portrait-image" />
          ) : (
            <div
              className="portrait-fallback"
              style={{ backgroundColor: student.color }}
              aria-hidden="true"
            >
              {getInitials(student.fullName)}
            </div>
          )}
        </div>

        <div className="identity-block">
          <h2 aria-label={student.fullName}>
            <span>{name.first}</span>
            <span>{name.last}</span>
          </h2>
          <button
            type="button"
            className="speak-button"
            onClick={onSpeakName}
            disabled={!canSpeak}
            aria-label={
              canSpeak
                ? `Pronounce ${student.fullName}`
                : 'Speech synthesis unavailable'
            }
            title={canSpeak ? `Pronounce ${student.fullName}` : 'Unavailable'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path
                d="M4 14v-4h3l4-4v12l-4-4H4Zm11-5a4 4 0 0 1 0 6m2.7-8.7a7.8 7.8 0 0 1 0 11.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <p className="phonetic">{student.phonetic}</p>
          <p className="definition">
            <strong>noun.</strong>
            {student.shortDesc}
          </p>
        </div>
      </div>

      <div className="profile-details">
        <DetailRow label="Class / Year" value={student.classYear} />
        <DetailRow label="Student ID" value={student.studentId} />
        <DetailRow label="Interests" value={student.interests} />
        <DetailRow label="Favourite Subject" value={student.favouriteSubject} />
        <DetailRow label="Clubs" value={student.clubs} />
        <DetailRow label="Bio" value={student.longDesc} isLong />
      </div>

      <div className="connect-row">
        <span>Connect</span>
        <a href={`mailto:${student.email}`}>Email</a>
        <a href={student.instagram} target="_blank" rel="noreferrer">
          Instagram
        </a>
        <a href={student.linkedIn} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a href={student.website} target="_blank" rel="noreferrer">
          Website
        </a>
      </div>

      <PageNumber pageNumber={pageNumber} />
    </div>
  );
};

const RosterPage = ({
  side,
  section,
  students,
  rosterPage,
  maxRosterPage,
  canMove,
  onMove,
  onStudentSelect,
  pageNumber,
}) => (
  <div className="page-content roster-page">
    <div className="page-topline">
      <button
        type="button"
        onClick={onMove}
        className="quiet-page-button"
        disabled={!canMove}
      >
        &larr; Previous spread
      </button>
      <span>
        {section.toUpperCase()} roster {rosterPage + 1}/{maxRosterPage + 1}
      </span>
    </div>

    <div className="roster-title">
      <p className="section-kicker">Classmates First</p>
      <h2>{side === 'left' ? 'Browse the class' : 'Meet the cohort'}</h2>
      <p>A compact first pass through the people who make up this section.</p>
    </div>

    <div className="roster-grid">
      {students.map((rosterStudent) => (
        <RosterCard
          key={rosterStudent.id}
          student={rosterStudent}
          onClick={() => onStudentSelect(rosterStudent)}
        />
      ))}
    </div>

    <PageNumber pageNumber={pageNumber} />
  </div>
);

const RosterCard = ({ student, onClick }) => (
  <button type="button" className="roster-card" onClick={onClick}>
    <span
      className="roster-card-portrait"
      style={{ backgroundColor: student.color }}
      aria-hidden="true"
    >
      {student.photoUrl ? (
        <img src={student.photoUrl} alt="" />
      ) : (
        getInitials(student.fullName)
      )}
    </span>
    <span className="roster-card-copy">
      <span className="roster-card-name">{student.fullName}</span>
      <span className="roster-card-meta">
        {student.pronouns} / {student.studentId}
      </span>
      <span className="roster-card-desc">{student.shortDesc}</span>
    </span>
  </button>
);

const DetailRow = ({ label, value, isLong = false }) => (
  <div className={`detail-row ${isLong ? 'is-long' : ''}`}>
    <span>{label}</span>
    <p>{value}</p>
  </div>
);

const PageNumber = ({ pageNumber }) => (
  <div className="page-number" aria-hidden="true">
    {pageNumber}
  </div>
);

export default LeftPage;
