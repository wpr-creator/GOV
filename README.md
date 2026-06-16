# Mr. Rogers — Principles of American Democracy Website
## Repo: https://github.com/wpr-creator/GOV

This is the CP Government course site. It uses the same structure as the AP Gov site, but it removes AP-specific links and uses a separate course identity.

## How to update your site each week

### THE ONLY FILE YOU NEED TO EDIT WEEKLY: content.json

Open `content.json` on GitHub, click the pencil icon, and change:

- `current_unit` → your current unit name
- `week` → the week label
- `exit_ticket` → this week's exit ticket question
- `materials` → add new materials at the top
- `upcoming` → update due dates, quizzes, essays, projects, or reminders
- `periods` → update rosters as needed

Click **Commit changes** and the site should update shortly after GitHub Pages rebuilds.

---

## File structure

```text
GOV/
├── index.html              ← the website design and code
├── content.json            ← weekly course updates
├── exit-ticket-script.gs   ← paste into Google Apps Script one time
└── README.md               ← this guide
```

---

## First-time setup checklist

- [ ] Upload `index.html`, `content.json`, `exit-ticket-script.gs`, and `README.md` to the root of the GOV repo
- [ ] Turn on GitHub Pages: Settings → Pages → Deploy from branch → main → /(root)
- [ ] Create a Google Sheet for exit tickets
- [ ] Copy the Sheet URL
- [ ] Go to script.google.com → New Project
- [ ] Paste everything from `exit-ticket-script.gs`
- [ ] Replace `YOUR_GOOGLE_SHEET_URL_HERE` with your Sheet URL
- [ ] Deploy as a Web App
- [ ] Copy the Web App URL
- [ ] In `index.html`, replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with that Web App URL

---

## Google Sheet columns

Submissions appear automatically with these columns:

`Date | Period | Student Name | Question | Response | Timestamp`

Use filters in Google Sheets to view one period, one student, or one question at a time.

---

## Notes for this CP Government site

This site is for **Principles of American Democracy**, not AP Government. Keep AP-specific resources like AP Classroom and College Board on the AP Gov site only.

Suggested course links:

- Google Classroom
- Newsela
- iCivics
- Bill of Rights Institute
- USA.gov
