# PRINCIPLES OF AMERICAN DEMOCRACY

A mobile-first, static Principles of American Democracy course site.

## Curriculum structure

- The course contains eight student-facing Government units.
- The California Grade Twelve Principles of American Democracy standards control the curriculum.
- Unit 3, Election Season, is placed in October before the November election.
- Standards codes appear in a compact unit-level location while lesson directions stay student-facing.
- School dates, rosters, assignments, and live resource links are intentionally not required for this preseason version.

## Files

- `index.html` — semantic page structure
- `styles.css` — visual system and responsive/accessibility behavior
- `course-data.js` — unit, lesson, standards, and plain-language glossary content
- `foundations-data.js` — documents, amendments, skill builders, and Madison debates
- `site-content.json` — current unit, exit ticket, upcoming assignments, Classroom link, and assignment-card unlocks
- `app.js` — navigation and interaction
- `assets/course-mark.svg` — original course mark
- `us-politics-events.json` — source-linked daily political-history database
- `scripts/validate-site.js` — local content and reference checks
- `docs/curriculum-inventory.md` — source-to-site curriculum inventory

## FOUNDATIONS

The permanent Foundations section contains:

- 10 essential documents in short excerpt / plain language / why it matters format
- all 27 amendments, filtered by current unit, Bill of Rights, voting, or complete list
- Read the Source, Build the Argument, and Use the Language skill builders
- four simplified Madison vs. Brutus constitutional debates
- a searchable glossary with short definitions and concrete examples

## Check the site

```sh
node scripts/validate-site.js
```

No build step or paid service is required. GitHub Pages can serve the repository root.
