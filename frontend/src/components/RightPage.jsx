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
  carouselStart,
  carouselSize,
  canNext,
  canRosterNext,
  canCarouselPrev,
  canCarouselNext,
  onNext,
  onRosterNext,
  onStudentSelect,
  onOpenIndex,
  onCarouselPrev,
  onCarouselNext,
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

  const visibleClassmates = students.slice(
    carouselStart,
    carouselStart + carouselSize
  );

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

      <section className="right-section">
        <h3>
          <SectionIcon type="achievement" />
          Achievements
        </h3>
        <ul className="achievement-list">
          {activeStudent.achievements.map((achievement) => (
            <li key={achievement}>{achievement}</li>
          ))}
        </ul>
      </section>

      <div className="split-section">
        <section className="right-section timetable-section">
          <h3>
            <SectionIcon type="calendar" />
            Timetable Highlights
          </h3>
          <div className="timetable-list">
            {activeStudent.timetable.map((entry) => (
              <div key={`${entry.day}-${entry.subject}`}>
                <span>{entry.day}</span>
                <p>{entry.subject}</p>
              </div>
            ))}
          </div>
        </section>

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
      </div>

      <section className="classmates-section">
        <div className="classmates-header">
          <h3>
            <SectionIcon type="people" />
            Classmates
          </h3>
          <button type="button" onClick={onOpenIndex}>
            View all classmates &rarr;
          </button>
        </div>

        <div className="classmate-carousel">
          <button
            type="button"
            className="circle-page-button"
            onClick={onCarouselPrev}
            disabled={!canCarouselPrev}
            aria-label="Previous classmates"
          >
            &larr;
          </button>

          <div className="classmate-track">
            {visibleClassmates.map((student) => (
              <ClassmateCard
                key={student.id}
                student={student}
                isActive={student.id === activeStudentId}
                onClick={() => onStudentSelect(student)}
              />
            ))}
          </div>

          <button
            type="button"
            className="circle-page-button"
            onClick={onCarouselNext}
            disabled={!canCarouselNext}
            aria-label="Next classmates"
          >
            &rarr;
          </button>
        </div>
      </section>

      <NearbyEntries
        students={students}
        selectedIndex={selectedIndex}
        activeStudentId={activeStudentId}
        onStudentSelect={onStudentSelect}
      />

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

    <div className="roster-title">
      <p className="section-kicker">Spread {rosterPage + 1}</p>
      <h2>Quick scan</h2>
      <p>Names, interests, and first impressions before the close-up pages.</p>
    </div>

    <div className="roster-grid">
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
  <button type="button" className="roster-card" onClick={onClick}>
    <span
      className="roster-card-portrait"
      style={{ backgroundColor: student.color }}
      aria-hidden="true"
    >
      {student.photoUrl ? <img src={student.photoUrl} alt="" /> : getInitials(student.fullName)}
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

const IndexRightPage = ({ students, activeStudentId, onStudentSelect, pageNumber }) => {
  const groups = groupBySurnameLetter(students);
  const letters = Object.keys(groups).sort();

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
              {groups[letter].map((student, index) => (
                <button
                  key={student.id}
                  type="button"
                  className={`index-entry ${
                    student.id === activeStudentId ? 'is-active' : ''
                  }`}
                  onClick={() => onStudentSelect(student)}
                >
                  <span>{student.fullName}</span>
                  <span>p.{124 + index * 2}</span>
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

const ClassmateCard = ({ student, isActive, onClick }) => (
  <button
    type="button"
    className={`classmate-card ${isActive ? 'is-active' : ''}`}
    onClick={onClick}
    aria-current={isActive ? 'true' : undefined}
  >
    <span
      className="classmate-portrait"
      style={{ backgroundColor: student.color }}
      aria-hidden="true"
    >
      {student.photoUrl ? <img src={student.photoUrl} alt="" /> : getInitials(student.fullName)}
    </span>
    <span className="classmate-name">{student.fullName}</span>
  </button>
);

const NearbyEntries = ({ students, selectedIndex, activeStudentId, onStudentSelect }) => {
  const start = Math.max(0, selectedIndex - 2);
  const nearby = students.slice(start, start + 5);

  return (
    <section className="nearby-section">
      <div className="nearby-header">
        <h3>Nearby Entries</h3>
        <span>Sorted by surname</span>
      </div>
      <div className="nearby-list">
        {nearby.map((student, offset) => (
          <button
            key={student.id}
            type="button"
            className={student.id === activeStudentId ? 'is-active' : ''}
            onClick={() => onStudentSelect(student)}
          >
            <span>{getSurname(student)}, {student.fullName.split(/\s+/)[0]}</span>
            <span>p.{124 + (start + offset) * 2}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

const SectionIcon = ({ type }) => {
  const paths = {
    achievement:
      'M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.4 7.2 18l.9-5.4-3.9-3.8 5.4-.8L12 3Z',
    calendar:
      'M6 4v3m12-3v3M4.5 9.5h15M5 6h14v14H5V6Z',
    quote:
      'M9 8H5v4h3v4H4V8h5Zm11 0h-4v4h3v4h-4V8h5Z',
    people:
      'M8 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm8-.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2.5 20a5.5 5.5 0 0 1 11 0m1.5-1.5A4.6 4.6 0 0 1 21.5 20',
  };

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d={paths[type]} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const PageNumber = ({ pageNumber }) => (
  <div className="page-number" aria-hidden="true">
    {pageNumber}
  </div>
);

export default RightPage;
