# CP Government & CP Economics

A mobile-first, static course site for the 2026–27 school year.

## The one teacher setting

Open `course-config.json` and change `currentUnit`:

```json
{
  "currentUnit": "gov-0"
}
```

Use `gov-0` through `gov-7`. The selected unit and all earlier units open; later units stay locked. This is the only file needed to advance the course.

## Curriculum structure

- Semester 1 contains eight student-facing Government units.
- Every pacing-guide topic, essential question, activity, assessment, and standards mapping is retained inside those units.
- Semester 2 has a clearly marked Economics space, but no Economics sequence has been invented. The supplied standards and pacing files both end with Government content.
- School dates, rosters, assignments, and live resource links are intentionally not required for this preseason version.

## Files

- `index.html` — semantic page structure
- `styles.css` — visual system and responsive/accessibility behavior
- `course-data.js` — unit, lesson, standards, and visual-vocabulary content
- `course-config.json` — current-unit unlock control
- `app.js` — navigation and interaction
- `assets/course-mark.svg` — original course mark
- `scripts/validate-site.js` — local content and reference checks
- `docs/curriculum-inventory.md` — source-to-site curriculum inventory

## Check the site

```sh
node scripts/validate-site.js
```

No build step or paid service is required. GitHub Pages can serve the repository root.
