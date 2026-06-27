import { useMemo, useRef, useState } from 'react';
import HomePage from './components/HomePage';
import TopNav from './components/TopNav';
import RealisticBook from './components/RealisticBook';
import LeftPage from './components/LeftPage';
import RightPage from './components/RightPage';
import MinigamePage from './components/MinigamePage';
import { allStudents, csStudents, sweStudents } from './data/mockData';

const TRANSITION_MS = 680;
const CAROUSEL_SIZE = 5;
const STUDENTS_PER_PAGE = 6;

const sortedBySurname = (students) =>
  [...students].sort((a, b) =>
    getSurname(a).localeCompare(getSurname(b)) ||
    a.fullName.localeCompare(b.fullName)
  );

const sectionStudents = {
  cs: sortedBySurname(csStudents),
  swe: sortedBySurname(sweStudents),
};

const uniqueStudents = Array.from(
  new Map(allStudents.map((student) => [student.id, student])).values()
);

function getSurname(student) {
  return student.fullName.trim().split(/\s+/).slice(-1)[0] || student.fullName;
}

function getInitialLetter(student) {
  return getSurname(student).charAt(0).toUpperCase();
}

function getCarouselStartFor(student, students) {
  const index = students.findIndex((item) => item.id === student.id);
  if (index < 0) return 0;

  const maxStart = Math.max(0, students.length - CAROUSEL_SIZE);
  return Math.min(Math.max(index - 2, 0), maxStart);
}

function App() {
  const [view, setView] = useState('home');
  const [nextView, setNextView] = useState(null);
  const [transitionPhase, setTransitionPhase] = useState('idle');
  const [section, setSection] = useState('cs');
  const [selectedStudentId, setSelectedStudentId] = useState(
    sectionStudents.cs[0]?.id ?? null
  );
  const [directoryMode, setDirectoryMode] = useState('overview');
  const [activeLetter, setActiveLetter] = useState(null);
  const [carouselStart, setCarouselStart] = useState(0);
  const [rosterPage, setRosterPage] = useState(0);
  const transitionTimer = useRef(null);

  const activeStudents = sectionStudents[section];
  const selectedStudent =
    activeStudents.find((student) => student.id === selectedStudentId) ||
    activeStudents[0] ||
    null;
  const selectedIndex = selectedStudent
    ? activeStudents.findIndex((student) => student.id === selectedStudent.id)
    : -1;

  const availableLetters = useMemo(
    () => new Set(activeStudents.map(getInitialLetter)),
    [activeStudents]
  );

  const canSpeak =
    typeof window !== 'undefined' && 'speechSynthesis' in window;
  const maxCarouselStart = Math.max(0, activeStudents.length - CAROUSEL_SIZE);
  const maxRosterPage = Math.max(
    0,
    Math.ceil(activeStudents.length / STUDENTS_PER_PAGE) - 1
  );
  const rosterStart = rosterPage * STUDENTS_PER_PAGE;
  const rosterStudents = activeStudents.slice(
    rosterStart,
    rosterStart + STUDENTS_PER_PAGE
  );
  const leftRosterStudents = rosterStudents.slice(0, Math.ceil(STUDENTS_PER_PAGE / 2));
  const rightRosterStudents = rosterStudents.slice(Math.ceil(STUDENTS_PER_PAGE / 2));
  const stageView = nextView || view;

  const navigate = (targetView) => {
    if (targetView === view && !nextView) return;
    if (nextView) return;

    if (transitionTimer.current) {
      window.clearTimeout(transitionTimer.current);
    }

    setNextView(targetView);
    setTransitionPhase(`${view}-to-${targetView}`);

    transitionTimer.current = window.setTimeout(() => {
      setView(targetView);
      setNextView(null);
      setTransitionPhase('idle');
      transitionTimer.current = null;
    }, TRANSITION_MS);
  };

  const selectStudent = (student) => {
    const nextSectionStudents = sectionStudents[student.section];

    setSection(student.section);
    setSelectedStudentId(student.id);
    setActiveLetter(getInitialLetter(student));
    setDirectoryMode('profile');
    setCarouselStart(getCarouselStartFor(student, nextSectionStudents));
    setRosterPage(
      Math.max(
        0,
        Math.floor(
          nextSectionStudents.findIndex((item) => item.id === student.id) /
            STUDENTS_PER_PAGE
        )
      )
    );
  };

  const selectStudentInCurrentSection = (student) => {
    const nextIndex = activeStudents.findIndex((item) => item.id === student.id);

    setSelectedStudentId(student.id);
    setActiveLetter(getInitialLetter(student));
    setDirectoryMode('profile');
    setCarouselStart(getCarouselStartFor(student, activeStudents));
    setRosterPage(Math.max(0, Math.floor(nextIndex / STUDENTS_PER_PAGE)));
  };

  const handleSectionChange = (nextSection) => {
    const nextStudents = sectionStudents[nextSection];
    const firstStudent = nextStudents[0] || null;

    setSection(nextSection);
    setSelectedStudentId(firstStudent?.id ?? null);
    setActiveLetter(null);
    setDirectoryMode('overview');
    setCarouselStart(0);
    setRosterPage(0);
  };

  const handleSearchSelect = (student) => {
    selectStudent(student);
    navigate('directory');
  };

  const handleLetterClick = (letter) => {
    if (!availableLetters.has(letter)) return;

    const match = activeStudents.find(
      (student) => getInitialLetter(student) === letter
    );

    if (match) {
      setActiveLetter(letter);
      setSelectedStudentId(match.id);
      setDirectoryMode('overview');
      setRosterPage(
        Math.floor(
          activeStudents.findIndex((student) => student.id === match.id) /
            STUDENTS_PER_PAGE
        )
      );
      setCarouselStart(getCarouselStartFor(match, activeStudents));
    }
  };

  const handlePrev = () => {
    if (selectedIndex <= 0) return;
    selectStudentInCurrentSection(activeStudents[selectedIndex - 1]);
  };

  const handleNext = () => {
    if (selectedIndex < 0 || selectedIndex >= activeStudents.length - 1) return;
    selectStudentInCurrentSection(activeStudents[selectedIndex + 1]);
  };

  const openIndex = () => {
    setDirectoryMode('overview');
    setActiveLetter(null);
  };

  const handleRosterPrev = () => {
    setRosterPage((current) => Math.max(0, current - 1));
    setActiveLetter(null);
  };

  const handleRosterNext = () => {
    setRosterPage((current) => Math.min(maxRosterPage, current + 1));
    setActiveLetter(null);
  };

  const handleCarouselPrev = () => {
    setCarouselStart((current) => Math.max(0, current - 1));
  };

  const handleCarouselNext = () => {
    setCarouselStart((current) => Math.min(maxCarouselStart, current + 1));
  };

  const speakName = () => {
    if (!selectedStudent || !canSpeak) return;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(selectedStudent.fullName));
  };

  const sceneClass = (name) => {
    const classes = ['scene', `${name}-scene`];

    if (!nextView && view === name) classes.push('scene-current');
    if (nextView && view === name) classes.push('scene-source');
    if (nextView === name) classes.push('scene-target');

    return classes.join(' ');
  };

  return (
    <div className={`app-shell view-${stageView} transition-${transitionPhase}`}>
      {(view === 'home' || nextView === 'home') && (
        <section className={sceneClass('home')} aria-hidden={stageView !== 'home'}>
          <HomePage onNavigate={navigate} />
        </section>
      )}

      {(view === 'directory' || nextView === 'directory') && (
        <section
          className={sceneClass('directory')}
          aria-hidden={stageView !== 'directory'}
        >
          <div className="directory-shell">
            <TopNav
              view={stageView}
              onNavigate={navigate}
              allStudents={uniqueStudents}
              onSearchSelect={handleSearchSelect}
            />

            <RealisticBook
              activeSection={section}
              onSectionChange={handleSectionChange}
              activeLetter={activeLetter}
              availableLetters={availableLetters}
              onLetterClick={handleLetterClick}
              mode={directoryMode}
              leftContent={
                <LeftPage
                  mode={directoryMode}
                  student={selectedStudent}
                  students={activeStudents}
                  rosterStudents={leftRosterStudents}
                  section={section}
                  rosterPage={rosterPage}
                  maxRosterPage={maxRosterPage}
                  canPrev={selectedIndex > 0}
                  canRosterPrev={rosterPage > 0}
                  onPrev={handlePrev}
                  onRosterPrev={handleRosterPrev}
                  onBrowseAll={openIndex}
                  onStudentSelect={selectStudentInCurrentSection}
                  onSpeakName={speakName}
                  canSpeak={canSpeak}
                  pageNumber={
                    directoryMode === 'overview'
                      ? 1 + rosterPage * 2
                      : 1 + Math.max(selectedIndex, 0) * 2
                  }
                />
              }
              rightContent={
                <RightPage
                  mode={directoryMode}
                  students={activeStudents}
                  rosterStudents={rightRosterStudents}
                  activeStudent={selectedStudent}
                  activeStudentId={selectedStudent?.id}
                  selectedIndex={selectedIndex}
                  rosterPage={rosterPage}
                  maxRosterPage={maxRosterPage}
                  carouselStart={carouselStart}
                  carouselSize={CAROUSEL_SIZE}
                  canNext={
                    selectedIndex >= 0 && selectedIndex < activeStudents.length - 1
                  }
                  canRosterNext={rosterPage < maxRosterPage}
                  canCarouselPrev={carouselStart > 0}
                  canCarouselNext={carouselStart < maxCarouselStart}
                  onNext={handleNext}
                  onRosterNext={handleRosterNext}
                  onStudentSelect={selectStudentInCurrentSection}
                  onOpenIndex={openIndex}
                  onCarouselPrev={handleCarouselPrev}
                  onCarouselNext={handleCarouselNext}
                  pageNumber={
                    directoryMode === 'overview'
                      ? 2 + rosterPage * 2
                      : 2 + Math.max(selectedIndex, 0) * 2
                  }
                />
              }
            />
          </div>
        </section>
      )}

      {(view === 'minigame' || nextView === 'minigame') && (
        <section
          className={sceneClass('minigame')}
          aria-hidden={stageView !== 'minigame'}
        >
          <MinigamePage onNavigate={navigate} />
        </section>
      )}
    </div>
  );
}

export default App;
