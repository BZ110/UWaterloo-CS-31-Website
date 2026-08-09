function getInitials(fullName) {
  const parts = fullName.trim().split(/\s+/);
  const first = parts[0]?.charAt(0) || '';
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
  return `${first}${last}`.toUpperCase();
}

function getFirstName(student) {
  return student.fullName.trim().split(/\s+/)[0] || student.fullName;
}

function groupByFirstNameLetter(students) {
  return students.reduce((groups, student) => {
    const letter = getFirstName(student).charAt(0).toUpperCase();
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
  activeProfileId,
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
        activeProfileId={activeProfileId}
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
      </div>

      {activeStudent.quote && (
        <section className="right-section quote-section">
          <h3>
            <SectionIcon type="quote" />
            In their words
          </h3>
          <blockquote>
            <p>“{activeStudent.quote}”</p>
            <cite>- {activeStudent.fullName}</cite>
          </blockquote>
        </section>
      )}

      <div className="profile-details">
        <ProfileDetails student={activeStudent} />
      </div>

      <ConnectRow student={activeStudent} />

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
    </div>

    {students.length ? (
      <div className="roster-stack">
        {students.map((student) => (
          <RosterCard
            key={student.id}
            student={student}
            onClick={() => onStudentSelect(student)}
          />
        ))}
      </div>
    ) : (
      <EmptyRoster />
    )}

    {students.length > 0 && rosterPage === maxRosterPage && (
      <div className="roster-endnote">End of this section.</div>
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
      <span className="roster-card-meta-expanded">{student.pronouns} / {student.programLabel}</span>
      <span className="roster-card-desc-expanded">{student.shortDesc}</span>
    </span>
  </button>
);

const IndexRightPage = ({ students, activeProfileId, onStudentSelect, pageNumber }) => {
  const groups = groupByFirstNameLetter(students);
  const letters = Object.keys(groups).sort();
  const getPageNumberForStudent = (student) => {
    const studentIndex = students.findIndex((item) => item.id === student.id);
    return 1 + Math.max(0, studentIndex) * 2;
  };

  return (
    <div className="page-content index-right-page">
      <div className="page-topline right-align">
        <span>Jump to a student by first name</span>
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
                    student.id === activeProfileId ? 'is-active' : ''
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

const ProfileDetails = ({ student }) => {
  const details = [
    ['Class', student.classYear],
    ['Interests', student.interests],
    ['Favourite subject', student.favouriteSubject],
    ['Clubs & communities', student.clubs],
    ['Co-op sequence', student.coopSequence],
    ['Hobbies', student.hobbies],
    ['Fun fact', student.funFacts],
    ['Future goal', student.dreamCompany],
  ].filter(([, value]) => value);

  return details.map(([label, value]) => <DetailRow key={label} label={label} value={value} />);
};

const ConnectRow = ({ student }) => {
  const links = [
    student.email && ['Email', `mailto:${student.email}`],
    student.instagram && ['Instagram', student.instagram],
    student.linkedIn && ['LinkedIn', student.linkedIn],
    student.website && ['Website', student.website],
    student.github && ['GitHub', student.github],
  ].filter(Boolean);

  if (!links.length) return null;

  return (
    <div className="connect-row">
      <span>Connect</span>
      {links.map(([label, href]) => (
        <a
          key={label}
          href={href}
          target={href.startsWith('mailto:') ? undefined : '_blank'}
          rel={href.startsWith('mailto:') ? undefined : 'noreferrer'}
        >
          {label}
        </a>
      ))}
    </div>
  );
};

const EmptyRoster = () => (
  <div className="empty-roster">
    <p className="section-kicker">Open book</p>
    <h2>Make the first page yours.</h2>
    <p>Profiles are added through a small, public pull request.</p>
    <a href="https://github.com/BZ110/UWaterloo-CS-31-Website#join-the-directory">
      Add your profile &rarr;
    </a>
  </div>
);

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

const DetailRow = ({ label, value }) => (
  <div className="detail-row">
    <span>{label}</span>
    <p>{value}</p>
  </div>
);

const PageNumber = ({ pageNumber }) => (
  <div className="page-number" aria-hidden="true">
    {pageNumber}
  </div>
);

export default RightPage;
