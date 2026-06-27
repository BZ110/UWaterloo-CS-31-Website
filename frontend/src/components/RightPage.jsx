function getInitials(fullName) {
  const parts = fullName.trim().split(/\s+/);
  const first = parts[0]?.charAt(0) || '';
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
  return `${first}${last}`.toUpperCase();
}

function getSurname(student) {
  return student.fullName.trim().split(/\s+/).slice(-1)[0] || student.fullName;
}

function groupBySurnameLetter(students) {
  return students.reduce((groups, student) => {
    const letter = getSurname(student).charAt(0).toUpperCase();
    return {
      ...groups,
      [letter]: [...(groups[letter] || []), student],
    };
  }, {});
}

const RightPage = ({
  mode,
  students,
  rosterStudents,
  activeStudent,
  activeStudentId,
  selectedIndex,
  rosterPage,
  maxRosterPage,
  canNext,
  canRosterNext,
  onNext,
  onRosterNext,
  onStudentSelect,
  pageNumber,
}) => {
  if (mode === 'overview') {
    return (
      <RosterPage
        students={rosterStudents}
        rosterPage={rosterPage}
        maxRosterPage={maxRosterPage}
        canMove={canRosterNext}
        onMove={onRosterNext}
        onStudentSelect={onStudentSelect}
        pageNumber={pageNumber}
      />
    );
  }

  if (mode === 'index') {
    return (
      <IndexRightPage
        students={students}
        activeStudentId={activeStudentId}
        onStudentSelect={onStudentSelect}
        pageNumber={pageNumber}
      />
    );
  }

  if (!activeStudent) {
    return (
      <div className="page-content empty-page">
        <p>No student selected.</p>
      </div>
    );
  }

  return (
    <div className="page-content profile-right-page">
      <div className="page-topline right-align">
        <button
          type="button"
          onClick={onNext}
          className="quiet-page-button"
          disabled={!canNext}
        >
          Next &rarr;
        </button>
        <span>- {pageNumber} -</span>
      </div>

      {/* Reinstated original section structure taking its own row */}
      <section className="right-section quote-section">
        <h3>
          <SectionIcon type="quote" />
          Quote
        </h3>
        <blockquote>
          <p>"{activeStudent.quote}"</p>
          <cite>- {activeStudent.fullName}</cite>
        </blockquote>
      </section>

      {/* Custom styled breakdown grid using color-token lines */}
      <div className="profile-details">
        <DetailRow label="Co-op Sequence" value={activeStudent.coopSequence} />
        <DetailRow label="Hobbies" value={activeStudent.hobbies} />
        <DetailRow label="Fun Facts" value={activeStudent.funFacts} />
        <DetailRow label="Dream Company" value={activeStudent.dreamCompany} />
      </div>

      {/* Social anchors bar positioned neatly at the footer of the page */}
      <div className="connect-row">
        <span>Connect</span>
        <a href={`mailto:${activeStudent.email}`}>Email</a>
        <a href={activeStudent.instagram} target="_blank" rel="noreferrer">
          Instagram
        </a>
        <a href={activeStudent.linkedIn} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a href={activeStudent.website} target="_blank" rel="noreferrer">
          Website
        </a>
      </div>

      <PageNumber pageNumber={pageNumber} />
    </div>
  );
};

const RosterPage = ({
  students,
  rosterPage,
  maxRosterPage,
  canMove,
  onMove,
  onStudentSelect,
  pageNumber,
}) => (
  <div className="page-content roster-page right-roster-page">
    <div className="page-topline right-align">
      <button
        type="button"
        onClick={onMove}
        className="quiet-page-button"
        disabled={!canMove}
      >
        Next spread &rarr;
      </button>
      <span>- {pageNumber} -</span>
    </div>

    <div className="roster-stack">
      {students.map((student) => (
        <RosterCard
          key={student.id}
          student={student}
          onClick={() => onStudentSelect(student)}
        />
      ))}
    </div>

    {rosterPage === maxRosterPage && (
      <div className="roster-endnote">
        End of this section.
      </div>
    )}

    <PageNumber pageNumber={pageNumber} />
  </div>
);

const RosterCard = ({ student, onClick }) => (
  <button type="button" className="roster-card-expanded" onClick={onClick}>
    <span
      className="roster-card-portrait-expanded"
      style={{ backgroundColor: student.color }}
      aria-hidden="true"
    >
      {student.photoUrl ? <img src={student.photoUrl} alt="" /> : getInitials(student.fullName)}
    </span>
    <span className="roster-card-copy-expanded">
      <span className="roster-card-name-expanded">{student.fullName}</span>
      <span className="roster-card-meta-expanded">{student.pronouns} / {student.studentId}</span>
      <span className="roster-card-desc-expanded">{student.shortDesc}</span>
    </span>
  </button>
);

const IndexRightPage = ({ students, activeStudentId, onStudentSelect, pageNumber }) => {
  const groups = groupBySurnameLetter(students);
  const letters = Object.keys(groups).sort();
  const getPageNumberForStudent = (student) => {
    const studentIndex = students.findIndex((item) => item.id === student.id);
    return 1 + Math.max(0, studentIndex) * 2;
  };

  return (
    <div className="page-content index-right-page">
      <div className="page-topline right-align">
        <span>Jump to a student by surname</span>
        <span>- {pageNumber} -</span>
      </div>

      <div className="index-list">
        {letters.map((letter) => (
          <section key={letter} className="index-letter-group">
            <h3>{letter}</h3>
            <div>
              {groups[letter].map((student) => (
                <button
                  key={student.id}
                  type="button"
                  className={`index-entry ${
                    student.id === activeStudentId ? 'is-active' : ''
                  }`}
                  onClick={() => onStudentSelect(student)}
                >
                  <span>{student.fullName}</span>
                  <span>p.{getPageNumberForStudent(student)}</span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      <PageNumber pageNumber={pageNumber} />
    </div>
  );
};

const SectionIcon = ({ type }) => {
  const paths = {
    quote: 'M9 8H5v4h3v4H4V8h5Zm11 0h-4v4h3v4h-4V8h5Z',
  };

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d={paths[type]} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const DetailRow = ({ label, value, isLong = false }) => (
  <div className={`detail-row ${isLong ? 'is-long' : ''}`}>
    <span>{label}</span>
    <p>{value || '—'}</p>
  </div>
);

const PageNumber = ({ pageNumber }) => (
  <div className="page-number" aria-hidden="true">
    {pageNumber}
  </div>
);

export default RightPage;