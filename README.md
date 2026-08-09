# Waterloo CS/SWE '31 Directory

The source for [cs31.ca](https://cs31.ca): a class directory maintained by the people
in the Waterloo CS and SWE classes of 2031.

## Join the directory

Profiles are public and are added through pull requests. Please submit only your own
information and leave out anything you would not want indexed by a search engine. In
particular, **do not include student numbers**; the schema and bot reject them.

1. Fork this repository.
2. Copy [docs/profile-example.json](docs/profile-example.json) into
   `profiles/<your-github-username>.json`, using your lowercase GitHub username for the
   filename.
3. Fill in the public information you want displayed. `program`, `name`, `pronouns`,
   `headline`, `bio`, `classOf`, `interests`, and `accent` are required. The rest is
   optional.
4. Open a pull request that adds **only** your profile JSON file.

The profile bot validates the schema, ensures the filename belongs to the PR author,
and labels a safe submission `ready-to-merge`. It is merged after a 24-hour review
window unless a maintainer adds the `hold` label. Pull requests that change code,
documentation, or another person's profile receive normal human review instead.

To test a profile locally, run:

```sh
cd frontend
npm install
npm run validate:profiles
npm run dev
```

## Profile format

`profiles/*.json` is the source of truth. The frontend derives its display ID from the
filename, so there is no handwritten ID field and no private student-number field.
Use [profile.schema.json](profile.schema.json) for editor validation and the example
file as a starting point.

Public links belong in `links`; use full `https://` URLs. Email and a photo URL are
optional. Photos should be hosted somewhere public that you control. Keep descriptions
short enough for the book layout and only list clubs, interests, and work you are
comfortable sharing publicly.

## How deployments update

The production VM builds the `main` branch. It checks for merged code or profile changes
every 15 minutes and replaces the live static release only after a successful lint-free
production build. A broken profile PR therefore cannot take down the live directory.

## Development

The web app lives in [`frontend/`](frontend/). Its README intentionally points back here
so all contribution and profile instructions have one canonical home.
