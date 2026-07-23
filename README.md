# PRINCIPLES OF AMERICAN DEMOCRACY

A mobile-first, static Principles of American Democracy course site for the 2026–27 school year.

## TEACHER EDIT MODE

Type `dev` anywhere on the page when an input is not selected. The hidden edit panel controls:

- the current released unit
- the exit-ticket question
- upcoming assignments
- the Google Classroom link

`SAVE PREVIEW` stores changes only in the current browser. `COPY JSON` copies the finished settings so they can replace `site-content.json` for publication.

The selected unit and all earlier units open; later units stay locked.

## Curriculum structure

- The course contains eight student-facing Government units.
- Every pacing-guide topic, essential question, activity, assessment, and standards mapping is retained inside those units.
- School dates, rosters, assignments, and live resource links are intentionally not required for this preseason version.

## Files

- `index.html` — semantic page structure
- `styles.css` — visual system and responsive/accessibility behavior
- `course-data.js` — unit, lesson, standards, and visual-vocabulary content
- `foundations-data.js` — documents, amendments, skill builders, and Madison debates
- `site-content.json` — current unit, exit ticket, upcoming assignments, and Classroom link
- `app.js` — navigation and interaction
- `assets/course-mark.svg` — original course mark
- `us-politics-events.json` — source-linked daily political-history database

## FOUNDATIONS

The permanent Foundations section contains:

- 10 essential documents in short excerpt / plain language / why it matters format
- all 27 amendments, filtered by current unit, Bill of Rights, voting, or complete list
- Read the Source, Build the Argument, and Use the Language skill builders
- four simplified What Would Madison Say? constitutional debates

Skill Builder Level 1 is always open. In `dev` mode, set each skill to open through Level 1, 2, or 3. Those choices are included when `site-content.json` is copied.
- `scripts/validate-site.js` — local content and reference checks
- `docs/curriculum-inventory.md` — source-to-site curriculum inventory

## Check the site

```sh
node scripts/validate-site.js
```

No build step or paid service is required. GitHub Pages can serve the repository root.
