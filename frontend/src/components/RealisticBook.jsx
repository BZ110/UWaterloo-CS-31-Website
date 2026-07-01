import TopBookmarks from './TopBookmarks';
import RightAlphabetTabs from './RightAlphabetTabs';

const RealisticBook = ({
  leftContent,
  rightContent,
  activeSection,
  onSectionChange,
  activeLetter,
  availableLetters,
  onLetterClick,
  mode,
}) => {
  return (
    <main className={`book-stage mode-${mode}`}>
      <div className="book-frame">
        <TopBookmarks
          activeSection={activeSection}
          onSectionChange={onSectionChange}
        />

        <div className="book-cover" aria-hidden="true">
          <span className="cover-corner corner-tl" />
          <span className="cover-corner corner-tr" />
          <span className="cover-corner corner-bl" />
          <span className="cover-corner corner-br" />
        </div>

        <div className="page-stack page-stack-left" aria-hidden="true" />
        <div className="page-stack page-stack-right" aria-hidden="true" />
        <RightAlphabetTabs
          activeLetter={activeLetter}
          availableLetters={availableLetters}
          onLetterClick={onLetterClick}
        />
        <div className="page-stack-bottom" aria-hidden="true" />
        <div className="page-stack-turn page-stack-turn-left" aria-hidden="true" />
        <div className="page-stack-turn page-stack-turn-right" aria-hidden="true" />
        <div className="book-ribbon" aria-hidden="true" />

        <div className="paper-spread">
          <section className="book-page left-book-page">{leftContent}</section>
          <div className="book-crease" aria-hidden="true" />
          <section className="book-page right-book-page">{rightContent}</section>
        </div>
      </div>
    </main>
  );
};

export default RealisticBook;
