const profileModules = import.meta.glob('../../../profiles/*.json', {
  eager: true,
  import: 'default',
});

const formatList = (items) => (Array.isArray(items) ? items.join(' · ') : '');

const sourceName = (path) => path.split('/').pop().replace(/\.json$/, '');

const toStudent = ([path, profile]) => {
  const username = sourceName(path);
  const classOf = profile.classOf || 2031;

  return {
    id: `profile-${username}`,
    section: profile.program,
    fullName: profile.name,
    pronouns: profile.pronouns,
    phonetic: profile.pronunciation || '',
    shortDesc: profile.headline,
    classYear: `Class of ${classOf}`,
    interests: formatList(profile.interests),
    favouriteSubject: profile.favoriteSubject || '',
    clubs: formatList(profile.clubs),
    longDesc: profile.bio,
    photoUrl: profile.photoUrl || '',
    color: profile.accent || '#b8e3ff',
    quote: profile.quote || '',
    coopSequence: profile.coopSequence || '',
    hobbies: formatList(profile.hobbies),
    funFacts: profile.funFact || '',
    dreamCompany: profile.dreamCompany || '',
    email: profile.email || '',
    instagram: profile.links?.instagram || '',
    linkedIn: profile.links?.linkedIn || '',
    website: profile.links?.website || '',
    github: profile.links?.github || '',
    programLabel: `${profile.program.toUpperCase()} · Class of ${classOf}`,
  };
};

export const allStudents = Object.entries(profileModules)
  .map(toStudent)
  .sort((a, b) => a.fullName.localeCompare(b.fullName));

export const csStudents = allStudents.filter((student) => student.section === 'cs');
export const sweStudents = allStudents.filter((student) => student.section === 'swe');
