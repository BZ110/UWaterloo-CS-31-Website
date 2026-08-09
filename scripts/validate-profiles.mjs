import { lstat, readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('..', import.meta.url)));
const PROFILE_DIR = join(ROOT, 'profiles');
const errors = [];
const MAX_FILE_BYTES = 12 * 1024;
const OPTIONAL_TEXT_FIELDS = [
  'pronunciation',
  'favoriteSubject',
  'coopSequence',
  'funFact',
  'dreamCompany',
  'quote',
];
const LIST_FIELDS = ['interests', 'clubs', 'hobbies'];
const ALLOWED_KEYS = new Set([
  'program',
  'name',
  'pronouns',
  'pronunciation',
  'headline',
  'bio',
  'classOf',
  'interests',
  'favoriteSubject',
  'clubs',
  'coopSequence',
  'hobbies',
  'funFact',
  'dreamCompany',
  'quote',
  'email',
  'photoUrl',
  'accent',
  'links',
]);
const LINK_KEYS = new Set(['github', 'instagram', 'linkedIn', 'website']);

function addError(file, message) {
  errors.push(`${file}: ${message}`);
}

function validText(value, minimum, maximum) {
  return typeof value === 'string' && value.trim().length >= minimum && value.trim().length <= maximum;
}

function validHttpsUrl(value) {
  if (!validText(value, 8, 2048)) return false;
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

function validateList(file, data, field, required = false) {
  const value = data[field];
  if (value == null && !required) return;
  if (!Array.isArray(value) || value.length < 1 || value.length > 8) {
    addError(file, `${field} must be a list with 1–8 entries.`);
    return;
  }
  value.forEach((item, index) => {
    if (!validText(item, 2, 80)) addError(file, `${field}[${index}] must be 2–80 characters.`);
  });
}

function validateProfile(file, data) {
  if (!data || Array.isArray(data) || typeof data !== 'object') {
    addError(file, 'must contain one JSON object.');
    return;
  }

  Object.keys(data).forEach((key) => {
    if (!ALLOWED_KEYS.has(key)) {
      addError(file, key === 'studentId' ? 'studentId is private and is never accepted.' : `unknown field "${key}".`);
    }
  });

  if (!['cs', 'swe'].includes(data.program)) addError(file, 'program must be "cs" or "swe".');
  if (!validText(data.name, 2, 80)) addError(file, 'name must be 2–80 characters.');
  if (!validText(data.pronouns, 2, 40)) addError(file, 'pronouns must be 2–40 characters.');
  if (!validText(data.headline, 8, 180)) addError(file, 'headline must be 8–180 characters.');
  if (!validText(data.bio, 24, 1400)) addError(file, 'bio must be 24–1400 characters.');
  if (data.classOf !== 2031) addError(file, 'classOf must be 2031.');
  if (typeof data.accent !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(data.accent)) {
    addError(file, 'accent must be a six-digit hex colour such as #b8e3ff.');
  }

  validateList(file, data, 'interests', true);
  validateList(file, data, 'clubs');
  validateList(file, data, 'hobbies');
  OPTIONAL_TEXT_FIELDS.forEach((field) => {
    if (data[field] != null && !validText(data[field], 2, 240)) {
      addError(file, `${field} must be 2–240 characters when supplied.`);
    }
  });

  if (data.email != null && (!validText(data.email, 5, 254) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))) {
    addError(file, 'email must be a valid public email address when supplied.');
  }
  if (data.photoUrl != null && !validHttpsUrl(data.photoUrl)) addError(file, 'photoUrl must be an https URL.');

  if (data.links != null) {
    if (!data.links || Array.isArray(data.links) || typeof data.links !== 'object') {
      addError(file, 'links must be an object.');
    } else {
      Object.entries(data.links).forEach(([key, value]) => {
        if (!LINK_KEYS.has(key)) addError(file, `links.${key} is not supported.`);
        else if (!validHttpsUrl(value)) addError(file, `links.${key} must be an https URL.`);
      });
    }
  }
}

if (process.env.PR_SAFE && process.env.PR_SAFE !== 'true') {
  addError('pull request', 'profile submissions may add only profiles/<your-github-username>.json.');
}

const files = (await readdir(PROFILE_DIR)).filter((file) => file.endsWith('.json')).sort();
const names = new Set();

for (const file of files) {
  if (!/^[a-z0-9-]+\.json$/.test(file)) {
    addError(file, 'filename must be lowercase kebab-case and end in .json.');
  }
  const username = file.replace(/\.json$/, '');
  if (names.has(username)) addError(file, 'duplicates an existing profile filename.');
  names.add(username);

  const path = join(PROFILE_DIR, file);
  const stat = await lstat(path);
  if (!stat.isFile()) {
    addError(file, 'must be a regular file.');
    continue;
  }
  if (stat.size > MAX_FILE_BYTES) {
    addError(file, `is too large; profiles must stay below ${MAX_FILE_BYTES} bytes.`);
    continue;
  }

  let data;
  try {
    data = JSON.parse(await readFile(path, 'utf8'));
  } catch {
    addError(file, 'is not valid JSON.');
    continue;
  }
  validateProfile(file, data);
}

const passed = errors.length === 0;
const output = passed
  ? `✓ ${files.length} profile${files.length === 1 ? '' : 's'} valid.`
  : `✗ ${errors.length} profile validation problem${errors.length === 1 ? '' : 's'}:\n${errors.map((error) => `  - ${error}`).join('\n')}`;

if (process.env.PR_COMMENT_FILE) {
  const body = passed
    ? '## Directory profile check\n\nYour profile passed the directory checks. It is ready for the review window.'
    : `## Directory profile check\n\nI could not accept this profile yet:\n\n${errors.map((error) => `- ${error}`).join('\n')}\n\nAdd only your own \`profiles/<github-username>.json\` file, then update the pull request.`;
  await writeFile(process.env.PR_COMMENT_FILE, `<!-- cs31-profile-bot -->\n${body}\n`);
}

console.log(output);
if (!passed) process.exit(1);
