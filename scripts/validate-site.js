#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const crypto = require("crypto");

const root = path.resolve(__dirname, "..");
const errors = [];
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const civicSelfieHtml = fs.readFileSync(path.join(root, "civic-selfie.html"), "utf8");
const presidentialYearbookHtml = fs.readFileSync(path.join(root, "presidential-yearbook.html"), "utf8");
const config = JSON.parse(fs.readFileSync(path.join(root, "site-content.json"), "utf8"));
const publishedRoster = JSON.parse(fs.readFileSync(path.join(root, "content.json"), "utf8"));
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, "course-data.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "cp-rosters.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "foundations-data.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "constitution-explorer-data.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "rights-referee-data.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "election-2026-data.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "presidential-power-data.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "bill-journey-data.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "federalism-map-data.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "founding-power-data.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "roots-of-democracy-data.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "founding-ideals-review-data.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "prove-your-case", "case-data.js"), "utf8"), context);
const data = context.window.COURSE_DATA;
const cpRosters = context.window.CP_GOV_ROSTERS;
const foundations = context.window.FOUNDATIONS_DATA;
const explorerSituations = context.window.CONSTITUTION_EXPLORER_DATA;
const rightsCases = context.window.RIGHTS_REFEREE_DATA;
const electionData = context.window.ELECTION_2026_DATA;
const presidentialPowerCases = context.window.PRESIDENTIAL_POWER_DATA;
const billJourneyData = context.window.BILL_JOURNEY_DATA;
const federalismMapData = context.window.FEDERALISM_MAP_DATA;
const foundingPowerIdeas = context.window.FOUNDING_POWER_DATA;
const democracyRoots = context.window.DEMOCRACY_ROOTS;
const idealsReviewData = context.window.FOUNDING_IDEALS_REVIEW_DATA;
const proveCases = context.window.PROVE_CASES;
const foundationCases = context.window.FOUNDATIONS_DATA.cases;
const portraitManifest = JSON.parse(fs.readFileSync(path.join(root, "assets", "presidents", "portraits.json"), "utf8"));
const presidentFacts = JSON.parse(fs.readFileSync(path.join(root, "assets", "presidents", "president-facts.json"), "utf8"));

for (const file of ["index.html", "civic-selfie.html", "presidential-yearbook.html", "presidential-yearbook-assignments.js", "presidential-yearbook-reveal.js", "prove-your-case.html", "prove-your-case/case-data.js", "prove-your-case/case.js", "prove-your-case/case.css", "roots-of-democracy.html", "roots-of-democracy.css", "roots-of-democracy.js", "roots-of-democracy-data.js", "founding-ideals-review.html", "founding-ideals-review.css", "founding-ideals-review.js", "founding-ideals-review-data.js", "styles.css", "app.js", "course-data.js", "content.json", "cp-rosters.js", "exit-ticket-script.gs", "foundations-data.js", "documents/document-reader.css", "documents/declaration-of-independence.html", "documents/constitution-preamble.html", "documents/gettysburg-address.html", "constitution-explorer-data.js", "rights-referee-data.js", "election-2026-data.js", "presidential-power-data.js", "bill-journey-data.js", "federalism-map-data.js", "founding-power-data.js", "site-content.json", "us-politics-events.json", "assets/course-mark.svg", "assets/social-share.jpg", "assets/assignments/civic-selfie-example.png", "assets/assignments/presidential-yearbook-color-example.png", "assets/assignments/presidential-yearbook-word-example.png", "assets/cases/rights-referee-icons.svg", "assets/power/presidential-power-icons.svg", "assets/foundations/founding-power-icons.svg"]) {
  if (!fs.existsSync(path.join(root, file))) errors.push(`Missing required file: ${file}`);
}
for (const socialTag of [
  'property="og:image"',
  'property="og:image:width" content="1200"',
  'property="og:image:height" content="630"',
  'name="twitter:card" content="summary_large_image"',
  'name="twitter:image"'
]) {
  if (!html.includes(socialTag)) errors.push(`Missing social-sharing metadata: ${socialTag}`);
}
for (const removedAgendaFeature of ['data-view-link="agenda"', 'id="agenda" data-view="agenda"', 'id="agenda-page-title"', 'id="agenda-page-text"']) {
  if (html.includes(removedAgendaFeature)) errors.push(`The disabled student Agenda page remains visible: ${removedAgendaFeature}`);
}
for (const removedHelpFeature of ['href="#help"', 'id="help" data-view="help"', 'id="history-connection"', 'WHY IT MATTERS:']) {
  if (html.includes(removedHelpFeature) || fs.readFileSync(path.join(root, "app.js"), "utf8").includes(removedHelpFeature)) errors.push(`Removed home-page clutter remains: ${removedHelpFeature}`);
}
for (const homeElectionFeature of ['id="election-tracker-title"', 'MIDTERM ELECTION TRACKER', 'id="election-count"', 'id="home-election-link"', 'href="#election-2026"']) {
  if (!html.includes(homeElectionFeature)) errors.push(`The home-page election tracker is missing: ${homeElectionFeature}`);
}
for (const electionLinkBehavior of ['document.getElementById("home-election-link").addEventListener', 'showView("election-2026")']) {
  if (!fs.readFileSync(path.join(root, "app.js"), "utf8").includes(electionLinkBehavior)) errors.push(`The home election link behavior is missing: ${electionLinkBehavior}`);
}
for (const teacherAgendaFeature of ['id="admin-agenda-title"', 'id="admin-agenda-text"']) {
  if (!html.includes(teacherAgendaFeature)) errors.push(`The teacher Agenda controls are missing: ${teacherAgendaFeature}`);
}
for (const electionCountdownFeature of ['"America/Los_Angeles"', "Date.UTC(2026, 10, 3)", "renderAgendaDate"]) {
  if (!fs.readFileSync(path.join(root, "app.js"), "utf8").includes(electionCountdownFeature)) errors.push(`The election countdown behavior is missing: ${electionCountdownFeature}`);
}
for (const wallpaperFeature of ["portrait-rain", "portrait-rain-fall", "grayscale(1)"]) {
  if (!fs.readFileSync(path.join(root, "styles.css"), "utf8").includes(wallpaperFeature)) errors.push(`The presidential wallpaper is missing: ${wallpaperFeature}`);
}
for (const wallpaperScriptFeature of ["renderPortraitRain", "assets/presidents/", "barack-obama.jpg"]) {
  if (!fs.readFileSync(path.join(root, "app.js"), "utf8").includes(wallpaperScriptFeature)) errors.push(`The presidential wallpaper behavior is missing: ${wallpaperScriptFeature}`);
}
for (const accessibilityFeature of ['@media (max-width: 1100px)', "white-space: nowrap", 'responseLabel.htmlFor = "madison-response"', 'response.id = "madison-response"', 'document.createElement("h2")', "min-height: 44px"]) {
  const source = accessibilityFeature.includes("response") || accessibilityFeature.includes("document.createElement") ? fs.readFileSync(path.join(root, "app.js"), "utf8") : fs.readFileSync(path.join(root, "styles.css"), "utf8");
  if (!source.includes(accessibilityFeature)) errors.push(`The accessibility cleanup is missing: ${accessibilityFeature}`);
}
if (typeof config.agendaTitle !== "string" || typeof config.agendaText !== "string") errors.push("Agenda title and text must be editable strings.");

if (portraitManifest.count !== 45 || portraitManifest.portraits?.length !== 45 || portraitManifest.failures?.length) {
  errors.push("Expected 45 verified presidential portraits with no sourcing failures.");
}
portraitManifest.portraits?.forEach(portrait => {
  if (!/public domain|cc0|pd-usgov/i.test(portrait.license || "")) {
    errors.push(`${portrait.name || "Unknown president"} does not have a verified public-domain license.`);
  }
  if (!portrait.file || !fs.existsSync(path.join(root, "assets", "presidents", portrait.file))) {
    errors.push(`Missing local portrait for ${portrait.name || "Unknown president"}.`);
  }
});
if (presidentFacts.count !== 45 || presidentFacts.presidents?.length !== 45) {
  errors.push("Expected 45 complete president fact cards.");
}
const expectedPresidentSequence = [
  ["George Washington", "1", "1789–1797"],
  ["John Adams", "2", "1797–1801"],
  ["Thomas Jefferson", "3", "1801–1809"],
  ["James Madison", "4", "1809–1817"],
  ["James Monroe", "5", "1817–1825"],
  ["John Quincy Adams", "6", "1825–1829"],
  ["Andrew Jackson", "7", "1829–1837"],
  ["Martin Van Buren", "8", "1837–1841"],
  ["William Henry Harrison", "9", "1841"],
  ["John Tyler", "10", "1841–1845"],
  ["James K. Polk", "11", "1845–1849"],
  ["Zachary Taylor", "12", "1849–1850"],
  ["Millard Fillmore", "13", "1850–1853"],
  ["Franklin Pierce", "14", "1853–1857"],
  ["James Buchanan", "15", "1857–1861"],
  ["Abraham Lincoln", "16", "1861–1865"],
  ["Andrew Johnson", "17", "1865–1869"],
  ["Ulysses S. Grant", "18", "1869–1877"],
  ["Rutherford B. Hayes", "19", "1877–1881"],
  ["James A. Garfield", "20", "1881"],
  ["Chester A. Arthur", "21", "1881–1885"],
  ["Grover Cleveland", "22 and 24", "1885–1889; 1893–1897"],
  ["Benjamin Harrison", "23", "1889–1893"],
  ["William McKinley", "25", "1897–1901"],
  ["Theodore Roosevelt", "26", "1901–1909"],
  ["William Howard Taft", "27", "1909–1913"],
  ["Woodrow Wilson", "28", "1913–1921"],
  ["Warren G. Harding", "29", "1921–1923"],
  ["Calvin Coolidge", "30", "1923–1929"],
  ["Herbert Hoover", "31", "1929–1933"],
  ["Franklin D. Roosevelt", "32", "1933–1945"],
  ["Harry S. Truman", "33", "1945–1953"],
  ["Dwight D. Eisenhower", "34", "1953–1961"],
  ["John F. Kennedy", "35", "1961–1963"],
  ["Lyndon B. Johnson", "36", "1963–1969"],
  ["Richard Nixon", "37", "1969–1974"],
  ["Gerald Ford", "38", "1974–1977"],
  ["Jimmy Carter", "39", "1977–1981"],
  ["Ronald Reagan", "40", "1981–1989"],
  ["George H. W. Bush", "41", "1989–1993"],
  ["Bill Clinton", "42", "1993–2001"],
  ["George W. Bush", "43", "2001–2009"],
  ["Barack Obama", "44", "2009–2017"],
  ["Donald Trump", "45 and 47", "2017–2021; 2025–present"],
  ["Joe Biden", "46", "2021–2025"]
];
expectedPresidentSequence.forEach(([name, order, yearsInOffice], index) => {
  const president = presidentFacts.presidents?.[index];
  if (!president || president.name !== name || president.order !== order || president.yearsInOffice !== yearsInOffice) {
    errors.push(`President ${index + 1} must be ${name}, order ${order}, serving ${yearsInOffice}.`);
  }
});
presidentFacts.presidents?.forEach(president => {
  for (const key of ["name", "order", "yearsInOffice", "portrait", "birthplace", "religion", "education", "careerBeforePresidency"]) {
    if (!president[key]) errors.push(`${president.name || "Unknown president"} is missing ${key}.`);
  }
  if (president.keyAccomplishments?.length < 3) errors.push(`${president.name} needs at least three key accomplishments or actions.`);
  if (president.importantQuotes?.length < 2 || president.importantQuotes.length > 3) {
    errors.push(`${president.name} needs two or three quote choices.`);
  }
  president.importantQuotes?.forEach((quote, index) => {
    if (!quote?.text || !quote?.sourceLabel || !/^https:\/\//.test(quote?.sourceUrl || "")) {
      errors.push(`${president.name} quote ${index + 1} needs text and a secure, labeled source.`);
    }
    if ((quote?.text || "").trim().split(/\s+/).length < 3) {
      errors.push(`${president.name} quote ${index + 1} is too short to give students meaningful context.`);
    }
  });
  if (president.presentDayConnection) {
    if (!president.presentDayConnection.text || !president.presentDayConnection.sourceLabel || !/^https:\/\//.test(president.presentDayConnection.sourceUrl || "")) {
      errors.push(`${president.name} has an incomplete present-day connection.`);
    }
  }
});

[html, civicSelfieHtml, presidentialYearbookHtml].forEach(pageHtml => {
  for (const match of pageHtml.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const ref = match[1];
    if (/^(https?:|#|mailto:|tel:)/.test(ref)) continue;
    const target = path.join(root, ref.split(/[?#]/)[0]);
    if (!fs.existsSync(target)) errors.push(`Broken local reference: ${ref}`);
  }
});
for (const civicSelfieFeature of ["Civic Selfie", "Build both sides", "civic-selfie-example.png", "prefers-reduced-motion", 'href="./#gov-0"', "FIRST BELL"]) {
  if (!civicSelfieHtml.includes(civicSelfieFeature)) errors.push(`Civic Selfie page is missing: ${civicSelfieFeature}`);
}

for (const backLink of ['href="#home"']) {
  if (!html.includes(backLink)) errors.push(`Course views are missing a back link: ${backLink}`);
}

for (const fragment of ["<main", "<nav", "Skip to the course", "prefers-reduced-motion"]) {
  const source = fragment === "prefers-reduced-motion" ? fs.readFileSync(path.join(root, "styles.css"), "utf8") : html;
  if (!source.includes(fragment)) errors.push(`Missing accessibility feature: ${fragment}`);
}
for (const removedUnitOutline of ["LEARNING PATH", "FOCUSED TOPICS", "WHAT WILL I DO?", "FINISH WITH:"]) {
  if (fs.readFileSync(path.join(root, "app.js"), "utf8").includes(removedUnitOutline)) {
    errors.push(`Unit pages still contain the removed lesson outline: ${removedUnitOutline}`);
  }
}

if (!Array.isArray(data.units) || data.units.length !== 8) errors.push("Expected 8 Government units.");
const lessonCount = data.units.reduce((count, unit) => count + unit.lessons.length, 0);
if (lessonCount !== 40) errors.push(`Expected 40 focused Government topics; found ${lessonCount}.`);
const expectedUnitTitles = ["First Bell", "Foundations of American Democracy", "Building the Constitution", "Election Season", "Checks and Balances", "Rights in Real Life", "Government Around the World", "Constitutional Tensions"];
if (data.units.some((unit, index) => unit.title !== expectedUnitTitles[index])) {
  errors.push("Government units are missing or out of the approved sequence.");
}
if (data.units.find(unit => unit.id === "gov-3")?.timing !== "October") {
  errors.push("Election Season must remain marked for October.");
}
const firstBell = data.units.find(unit => unit.id === "gov-0");
if (firstBell?.question !== "Who makes the rules—and what changes when we start paying attention?") {
  errors.push("First Bell has the wrong essential question.");
}
const expectedFirstBellLessons = [
  "0.1 — Class Is in Session",
  "0.2 — Read the Fine Print",
  "0.3 — Pack Your Field Guides",
  "0.4 — Government Takes the Stage",
  "0.5 — Portrait Day",
  "0.6 — The Court Is in Session"
];
if (firstBell?.lessons.some((lesson, index) => lesson[0] !== expectedFirstBellLessons[index])) {
  errors.push("First Bell lessons are missing or out of order.");
}
const expectedFirstBellAssignments = [
  "classroom|0.1 — CLASS IS IN SESSION|JOIN GOOGLE CLASSROOM",
  "course-site|0.1 — CLASS IS IN SESSION|BOOKMARK COURSE WEBSITE",
  "syllabus|0.2 — READ THE FINE PRINT|CLASS SYLLABUS",
  "self-guided-tour|0.2 — READ THE FINE PRINT|SELF-GUIDED TOUR",
  "civic-selfie|0.2 — READ THE FINE PRINT|CIVIC SELFIE",
  "pew-typology|0.3 — PACK YOUR FIELD GUIDES|PEW POLITICAL TYPOLOGY",
  "typology-reflection|0.3 — PACK YOUR FIELD GUIDES|TYPOLOGY REFLECTION: BETWEEN THE LINES",
  "civics-field-guide|0.4 — GOVERNMENT TAKES THE STAGE|CIVICS FIELD GUIDE",
  "mr-smith-reflection|ASSESSMENTS|MR. SMITH GOES TO WASHINGTON EXTENSION",
  "presidential-yearbook|0.5 — PORTRAIT DAY|THE PRESIDENTIAL YEARBOOK",
  "presidential-library|0.5 — PORTRAIT DAY|PRESIDENTIAL LIBRARY",
  "civics-field-test|ASSESSMENTS|CIVICS FIELD GUIDE TEST",
  "unit-0-synthesis|0.6 — THE COURT IS IN SESSION|PROVE YOUR CASE"
];
if (firstBell?.resources?.map(resource => `${resource.id}|${resource.lesson}|${resource.title}`).join("\n") !== expectedFirstBellAssignments.join("\n")) {
  errors.push("First Bell assignments are missing, mislabeled, or out of lesson order.");
}
for (const assessmentId of ["mr-smith-reflection", "civics-field-test"]) {
  const assessment = firstBell?.resources?.find(resource => resource.id === assessmentId);
  if (assessment?.url !== "" || assessment?.note !== "SEE MR. ROGERS" || assessment?.awaitingLink !== true || config.assignmentUrls?.[assessmentId] !== "") {
    errors.push(`Unit 0 assessment must be visible without a link and say See Mr. Rogers: ${assessmentId}`);
  }
}
const appCode = fs.readFileSync(path.join(root, "app.js"), "utf8");
for (const completionFeature of [
  'const UNIT_ZERO_COMPLETION_KEY = "gov-unit0-completion-v1";',
  "createCompletionCheck(resource, unlocked)",
  "localStorage.setItem(UNIT_ZERO_COMPLETION_KEY",
  'check.setAttribute("aria-pressed"',
  '"Mark incomplete" : "Mark complete"'
]) {
  if (!appCode.includes(completionFeature)) errors.push(`Unit 0 completion behavior is missing: ${completionFeature}`);
}
const primaryStyles = fs.readFileSync(path.join(root, "styles.css"), "utf8");
for (const completionSelector of [".unit-resource-item", ".unit-completion-check", '.unit-completion-check[aria-pressed="true"]', ".unit-completion-check:focus-visible", ".unit-completion-check:disabled"]) {
  if (!primaryStyles.includes(completionSelector)) errors.push(`Unit 0 completion styling is missing: ${completionSelector}`);
}
for (const categorySelector of [".resource-text", ".resource-assignment", ".resource-notes", ".resource-assessment", ".resource-kind"]) {
  if (!primaryStyles.includes(categorySelector)) errors.push(`The resource color key is missing: ${categorySelector}`);
}
if (appCode.includes("unit-start-cue")) errors.push("The removed unit start strip remains in the page renderer.");
if (!html.includes("styles.css?v=20260831-dark-civic-cards") || !html.includes("app.js?v=20260831-notes-practice") || !html.includes("course-data.js?v=20260831-notes-practice") || !html.includes("foundations-data.js?v=20260823-unit-1-launch")) {
  errors.push("The changed Unit 0 CSS and JavaScript need the current cache version.");
}
for (const yearbookFeature of ["THE PRESIDENTIAL YEARBOOK", "PRESIDENTIAL REVEAL", "REVEAL MY PRESIDENT", "THE FRONT", "THE BACK", "GEORGE WASHINGTON", "Created the presidential Cabinet", "./#gov-0", "./#presidents", "presidential-yearbook-color-example.png", "presidential-yearbook-word-example.png"]) {
  if (!presidentialYearbookHtml.includes(yearbookFeature)) errors.push(`The Presidential Yearbook page is missing: ${yearbookFeature}`);
}
for (const yearbookMigrationFeature of ['previewAssignmentUrls["presidential-yearbook"] === "#presidents"', 'delete previewAssignmentUrls["presidential-yearbook"]']) {
  if (!fs.readFileSync(path.join(root, "app.js"), "utf8").includes(yearbookMigrationFeature)) {
    errors.push(`The Presidential Yearbook legacy-link migration is missing: ${yearbookMigrationFeature}`);
  }
}
data.units.flatMap(unit => unit.resources || []).forEach(resource => {
  if (typeof config.assignmentUnlocks?.[resource.id] !== "boolean") {
    errors.push(`Unit resource ${resource.id} needs a true or false unlock setting.`);
  }
  if (!resource.url && config.assignmentUnlocks?.[resource.id] && !resource.awaitingLink) {
    errors.push(`Unit resource ${resource.id} cannot be open without a link.`);
  }
});
const validCourseHashes = new Set([
  ...Array.from(html.matchAll(/\sid="([^"]+)"/g), match => `#${match[1]}`),
  ...data.units.map(unit => `#${unit.id}`),
  "#presidents"
]);
function validateCourseResourceUrl(label, url) {
  if (!url || /^https?:\/\//.test(url)) return;
  if (url.startsWith("#")) {
    if (!validCourseHashes.has(url)) errors.push(`${label} uses an unknown course route: ${url}`);
    return;
  }
  const localTarget = url.split(/[?#]/)[0];
  if (!fs.existsSync(path.join(root, localTarget))) errors.push(`${label} uses a missing local page: ${url}`);
}
data.units.flatMap(unit => unit.resources || []).forEach(resource => validateCourseResourceUrl(`Unit resource ${resource.id}`, resource.url));
Object.entries(config.assignmentUrls || {}).forEach(([id, url]) => validateCourseResourceUrl(`Configured assignment ${id}`, url));
const unitTwo = data.units.find(unit => unit.id === "gov-2");
if (unitTwo?.resources?.map(resource => resource.id).join("|") !== "federalism-map|constitution-explorer|madison-vs-brutus") {
  errors.push("Unit 2 must include The Federalism Map, Constitution Explorer, and Madison vs. Brutus.");
}
const unitOne = data.units.find(unit => unit.id === "gov-1");
const expectedUnitOneResources = "if-you-ran-the-place|founding-ideals-review|declaration-text|constitution-preamble|gettysburg-text|declaration-annotation|we-the-people|unit-1-guided-notes|roots-activity|unit-1-03-guided-notes|history-lesson";
if (unitOne?.resources?.map(resource => resource.id).join("|") !== expectedUnitOneResources) {
  errors.push("Unit 1 must include the intended 1.01–1.03 resources in order.");
}
const weThePeople = unitOne?.resources?.find(resource => resource.id === "we-the-people");
const weThePeopleUrl = "https://docs.google.com/document/d/1dmSVCh_E25a9eKVJ57mPFZafeykSWMrBYqJi61CjsKI/edit?usp=sharing";
if (weThePeople?.url !== weThePeopleUrl || config.assignmentUrls?.["we-the-people"] !== weThePeopleUrl) {
  errors.push("We the People must use the assigned CP Government project document.");
}
if (config.assignmentUnlocks?.["we-the-people"] !== false || config.assignmentUnlockAt?.["we-the-people"] !== "2026-08-26T08:30:00-07:00") {
  errors.push("We the People must unlock Wednesday, August 26, 2026 at 8:30 AM Pacific Time.");
}
const rootsActivity = unitOne?.resources?.find(resource => resource.id === "roots-activity");
if (rootsActivity?.url !== "roots-of-democracy.html" || config.assignmentUrls?.["roots-activity"] !== "roots-of-democracy.html" || config.assignmentUnlocks?.["roots-activity"] !== true) {
  errors.push("The Unit 1 Roots Activity must exist and remain open.");
}
if (rootsActivity?.title !== "ROOTS OF AMERICAN DEMOCRACY" || rootsActivity?.kind !== "activity-notes" || rootsActivity?.note) {
  errors.push("The open 1.02 page must be one combined Roots of American Democracy activity-and-notes card.");
}
if (unitOne?.resources?.some(resource => resource.id === "unit-1-02-guided-notes") || "unit-1-02-guided-notes" in (config.assignmentUrls || {}) || "unit-1-02-guided-notes" in (config.assignmentUnlocks || {})) {
  errors.push("The separate 1.02 Guided Notes card must remain removed.");
}
const ranThePlace = unitOne?.resources?.find(resource => resource.id === "if-you-ran-the-place");
if (ranThePlace?.lesson !== "UNIT 1 PROJECT" || ranThePlace?.title !== "IF YOU RAN THE PLACE" || ranThePlace?.kind !== "project" || ranThePlace?.url !== "" || config.assignmentUrls?.["if-you-ran-the-place"] !== "" || config.assignmentUnlocks?.["if-you-ran-the-place"] !== false) {
  errors.push("If You Ran the Place must be a locked coming-soon project above lesson 1.01.");
}
const historyLesson = unitOne?.resources?.find(resource => resource.id === "history-lesson");
if (historyLesson?.url !== "history-lesson.html" || config.assignmentUrls?.["history-lesson"] !== "history-lesson.html" || config.assignmentUnlocks?.["history-lesson"] !== false) {
  errors.push("The Unit 1 History Lesson must exist and remain locked.");
}
const idealsReview = unitOne?.resources?.find(resource => resource.id === "founding-ideals-review");
if (idealsReview?.url !== "founding-ideals-review.html" || idealsReview?.kind !== "practice" || config.assignmentUrls?.["founding-ideals-review"] !== "founding-ideals-review.html" || config.assignmentUnlocks?.["founding-ideals-review"] !== true) {
  errors.push("The open Six Ideals Review practice must appear in lesson 1.01.");
}
for (const categoryLabel of ["ASSESSMENTS", "ASSIGNMENTS & PROJECTS", "GUIDED NOTES & PRACTICE", "READINGS & RESOURCES"]) {
  if (!appCode.includes(categoryLabel)) errors.push(`Lesson resource categories are missing: ${categoryLabel}`);
}
if (!primaryStyles.includes(".unit-resource-category") || primaryStyles.includes('.unit-resource-item[data-resource-id="founding-ideals-review"]')) {
  errors.push("Lesson cards must use consistent category rows without a special centered review card.");
}
const expectedIdealNames = ["NATURAL RIGHTS", "EQUALITY", "SOCIAL CONTRACT", "POPULAR SOVEREIGNTY", "LIMITED GOVERNMENT", "REPUBLICANISM"];
if (idealsReviewData?.ideals?.map(ideal => ideal.name).join("|") !== expectedIdealNames.join("|")) errors.push("The review must include all six intended democratic ideals.");
if (idealsReviewData?.missions?.map(mission => mission.id).join("|") !== "declaration|constitution|gettysburg") errors.push("The review must contain Declaration, Constitution, and Gettysburg missions.");
const reviewQuestions = idealsReviewData?.missions?.flatMap(mission => mission.questions || []) || [];
if (reviewQuestions.length !== 12) errors.push(`The review must contain 12 evidence questions; found ${reviewQuestions.length}.`);
reviewQuestions.forEach(question => {
  if (!question.excerpt || !question.answer || !question.explanation || !question.hint || question.options?.length !== 3 || !question.options.includes(question.answer)) errors.push(`Review question ${question.id || "unknown"} is incomplete.`);
});
const reviewAnswerPositions = reviewQuestions.reduce((counts, question) => {
  counts[question.options.indexOf(question.answer)] += 1;
  return counts;
}, [0, 0, 0]);
if (reviewAnswerPositions.join("|") !== "4|4|4") errors.push(`Review answers must be balanced across all three positions; found ${reviewAnswerPositions.join("|")}.`);
const historyNotes = unitOne?.resources?.find(resource => resource.id === "unit-1-03-guided-notes");
if (historyNotes?.url !== "" || historyNotes?.awaitingLink !== true || historyNotes?.note || config.assignmentUnlocks?.["unit-1-03-guided-notes"] !== false) {
  errors.push("The 1.03 Guided Notes card must remain a locked link placeholder.");
}
for (const resource of unitOne?.resources || []) {
  if (resource.note) errors.push(`Unit 1 resource ${resource.id} must use only its plain type label.`);
}
const historyReader = fs.readFileSync(path.join(root, "history-lesson.html"), "utf8");
for (const marker of ["THE ARTICLES OF CONFEDERATION", "FIVE MAJOR FLAWS", "SHAYS’ REBELLION", "MAJOR COMPROMISES", "THE RATIFICATION BATTLE", "BILL OF RIGHTS", "FEDERALIST 10, 51, AND 78", "BRUTUS 1"]) {
  if (!historyReader.includes(marker)) errors.push(`The History Lesson is missing: ${marker}`);
}
if ((historyReader.match(/<article class="moment/g) || []).length !== 10) errors.push("The History Lesson must contain ten timeline moments.");
const historyImages = [...historyReader.matchAll(/<img src="(assets\/history-lesson\/[^"]+\.jpg)" alt="([^"]+)"/g)];
if (historyImages.length !== 10) errors.push("The History Lesson must contain ten local woodcut timeline illustrations with alt text.");
historyImages.forEach(([, imagePath, imageAlt]) => {
  if (!fs.existsSync(path.join(root, imagePath))) errors.push(`Missing History Lesson illustration: ${imagePath}`);
  if (imageAlt.length < 25) errors.push(`History Lesson illustration needs useful alt text: ${imagePath}`);
});
const expectedRootNames = ["ANCIENT GREECE", "ANCIENT ROME", "ENGLISH CONSTITUTIONAL TRADITIONS", "JOHN LOCKE", "MONTESQUIEU", "NICCOLÒ MACHIAVELLI", "WILLIAM BLACKSTONE"];
if (!Array.isArray(democracyRoots) || democracyRoots.map(rootData => rootData.name).join("|") !== expectedRootNames.join("|")) {
  errors.push("The Roots Activity needs all seven historical roots in the intended order.");
}
democracyRoots?.forEach((rootData, index) => {
  for (const key of ["id", "name", "icon", "imageAlt", "influence", "unitedStates", "treeIdeas"]) {
    if (!rootData[key] || (Array.isArray(rootData[key]) && !rootData[key].length)) errors.push(`Democracy root ${index + 1} is missing ${key}.`);
  }
});
const rootsHtml = fs.readFileSync(path.join(root, "roots-of-democracy.html"), "utf8");
const rootsCode = fs.readFileSync(path.join(root, "roots-of-democracy.js"), "utf8");
for (const marker of ["SIX DEMOCRATIC IDEALS", "NATURAL RIGHTS", "SOCIAL CONTRACT", "POPULAR SOVEREIGNTY", "LIMITED GOVERNMENT", "CONSENT OF THE GOVERNED", "REPUBLICANISM", "prefers-reduced-motion"]) {
  const source = marker === "prefers-reduced-motion" ? fs.readFileSync(path.join(root, "roots-of-democracy.css"), "utf8") : rootsHtml;
  if (!source.includes(marker)) errors.push(`The Roots Activity is missing: ${marker}`);
}
for (const marker of ["aria-pressed", "aria-label", "root-progress", "TURN OVER"]) {
  if (!rootsCode.includes(marker)) errors.push(`The Roots Activity interaction is missing: ${marker}`);
}
if (!Array.isArray(foundingPowerIdeas) || foundingPowerIdeas.length !== 7) {
  errors.push(`Expected 7 founding-power sources; found ${foundingPowerIdeas?.length || 0}.`);
}
foundingPowerIdeas?.forEach((idea, index) => {
  for (const key of ["document", "thinker", "year", "excerpt", "wordHelp", "ideas", "explanation", "sourceLabel", "source"]) {
    if (!idea[key] || (Array.isArray(idea[key]) && !idea[key].length)) errors.push(`Founding-power source ${index + 1} is missing ${key}.`);
  }
  if (!idea.image && !idea.icon) errors.push(`Founding-power source ${index + 1} needs an image or icon.`);
  if (idea.image && !idea.imageAlt) errors.push(`Founding-power source ${index + 1} needs image alt text.`);
  if (idea.icon && !idea.iconAlt) errors.push(`Founding-power source ${index + 1} needs icon alt text.`);
  if (!/^https:\/\//.test(idea.source || "")) {
    errors.push(`Founding-power source ${index + 1} has an incomplete source.`);
  }
  if (idea.image && !fs.existsSync(path.join(root, idea.image))) {
    errors.push(`Founding-power source ${index + 1} is missing its local artifact image.`);
  }
});
for (const foundingFeature of ['id="founding-power" data-view="founding-power"', "WHERE DOES POWER COME FROM?", "founding-power-icons.svg", "founding-story", "IMAGINE YOU LIVE UNDER A KING", "DEMOCRATIC IDEALS", "HOW POWER IS LIMITED"]) {
  const source = ["founding-power-icons.svg", "founding-story", "IMAGINE YOU LIVE UNDER A KING", "DEMOCRATIC IDEALS", "HOW POWER IS LIMITED"].includes(foundingFeature) ? fs.readFileSync(path.join(root, "app.js"), "utf8") : html;
  if (!source.includes(foundingFeature)) errors.push(`The founding-power activity is missing: ${foundingFeature}`);
}
for (const fragment of ['data-view-link="skills"', 'id="skills" data-view="skills"', 'data-foundation-tab="presidents"', 'id="foundation-presidents"', 'id="madison" data-view="madison"']) {
  if (!html.includes(fragment)) errors.push(`Course navigation is missing: ${fragment}`);
}
for (const presidentLibraryFeature of ['routeName === "presidents"', 'switchFoundationTab("presidents")', 'id="president-search"', 'id="president-grid"']) {
  const source = presidentLibraryFeature.startsWith("id=") ? html : fs.readFileSync(path.join(root, "app.js"), "utf8");
  if (!source.includes(presidentLibraryFeature)) errors.push(`The Presidential Library tab is missing: ${presidentLibraryFeature}`);
}
for (const presidentialTermFeature of ['function expandPresidentialTerms', 'order: "22", yearsInOffice: "1885–1889"', 'order: "24", yearsInOffice: "1893–1897"', 'order: "45", yearsInOffice: "2017–2021"', 'order: "47", yearsInOffice: "2025–present"', "PRESIDENCIES"]) {
  const source = presidentialTermFeature === "PRESIDENCIES" ? html : fs.readFileSync(path.join(root, "app.js"), "utf8");
  if (!source.includes(presidentialTermFeature)) errors.push(`The separate presidential-term cards are missing: ${presidentialTermFeature}`);
}
if (html.includes('class="foundation-feature"') || html.includes('id="presidents" data-view="presidents"')) {
  errors.push("Foundations still contains the old Presidential Library promotion or duplicate page.");
}
for (const adminPublishFeature of ["admin-github-token", "admin-publish", "GITHUB_TOKEN_STORAGE_KEY", "GITHUB_CONTENT_URL", "SAVE & PUBLISH"]) {
  const source = adminPublishFeature === "admin-github-token" || adminPublishFeature === "admin-publish" ? html : fs.readFileSync(path.join(root, "app.js"), "utf8");
  if (!source.includes(adminPublishFeature)) errors.push(`Direct settings publishing is missing: ${adminPublishFeature}`);
}
for (const removedFoundationTab of ['data-foundation-tab="skills"', 'data-foundation-tab="madison"']) {
  if (html.includes(removedFoundationTab)) errors.push(`Foundations still contains the removed tab: ${removedFoundationTab}`);
}
for (const unitSourceFeature of ["UNIT SOURCES", "unit-source-grid", "BILL OF RIGHTS · AMENDMENTS 1–10", 'href="#gov-2"']) {
  const source = unitSourceFeature === 'href="#gov-2"' ? html : fs.readFileSync(path.join(root, unitSourceFeature === "unit-source-grid" ? "styles.css" : "app.js"), "utf8");
  if (!source.includes(unitSourceFeature)) errors.push(`Unit source shelf is missing: ${unitSourceFeature}`);
}
if (!Array.isArray(explorerSituations) || explorerSituations.length !== 6) {
  errors.push(`Expected 6 Constitution Explorer situations; found ${explorerSituations?.length || 0}.`);
}
explorerSituations?.forEach((situation, index) => {
  if (!situation.situation || !situation.question || situation.options?.length !== 4 || !Number.isInteger(situation.answer) || !situation.power || !situation.check || !situation.source) {
    errors.push(`Constitution Explorer situation ${index + 1} is incomplete.`);
  }
});
for (const explorerFeature of ['id="constitution-explorer" data-view="constitution-explorer"', "CONSTITUTION EXPLORER", "explorer-feedback"]) {
  const source = explorerFeature === "explorer-feedback" ? fs.readFileSync(path.join(root, "styles.css"), "utf8") : html;
  if (!source.includes(explorerFeature)) errors.push(`Constitution Explorer is missing: ${explorerFeature}`);
}
if (!Array.isArray(rightsCases) || rightsCases.length !== 6) errors.push(`Expected 6 Rights Referee cases; found ${rightsCases?.length || 0}.`);
rightsCases?.forEach((caseData, index) => {
  for (const key of ["caseName", "year", "icon", "iconAlt", "facts", "question", "ruling", "keyFact", "amendment", "source"]) {
    if (!caseData[key]) errors.push(`Rights Referee case ${index + 1} is missing ${key}.`);
  }
  if (caseData.options?.length !== 2 || !Number.isInteger(caseData.answer) || !/^https:\/\//.test(caseData.source || "")) {
    errors.push(`Rights Referee case ${index + 1} has incomplete choices or source.`);
  }
});
if (data.units.find(unit => unit.id === "gov-5")?.resources?.[0]?.id !== "rights-referee") {
  errors.push("Rights Referee must be a Unit 5 resource.");
}
if (data.units.find(unit => unit.id === "gov-3")?.resources?.[0]?.id !== "california-ballot-2026") {
  errors.push("The 2026 California Ballot must be a Unit 3 resource.");
}
if (electionData.location?.zip !== "92114" || electionData.location?.district !== "CALIFORNIA DISTRICT 52") {
  errors.push("The 2026 ballot must identify ZIP 92114 as California District 52.");
}
if (electionData.races?.length !== 2 || electionData.races.some(race => race.candidates?.length !== 2)) {
  errors.push("The 2026 ballot needs the governor race and the local congressional race with two candidates each.");
}
const propositionNumbers = electionData.propositions?.map(proposition => proposition.number).join("|");
if (propositionNumbers !== "1|2|3|4|5|37|38|39|40|41|42|43|44|45") {
  errors.push("The 2026 ballot must include all 14 certified California propositions in number order.");
}
if (electionData.propositions.filter(proposition => proposition.featured).some(proposition => !proposition.yes || !proposition.no)) {
  errors.push("Each featured proposition needs plain-language YES and NO effects.");
}
for (const electionFeature of ['id="election-2026" data-view="election-2026"', "CALIFORNIA BALLOT", "proposition-card"]) {
  const source = electionFeature === "proposition-card" ? fs.readFileSync(path.join(root, "styles.css"), "utf8") : html;
  if (!source.includes(electionFeature)) errors.push(`The 2026 ballot is missing: ${electionFeature}`);
}
for (const rightsFeature of ['id="rights-referee" data-view="rights-referee"', "RIGHTS REFEREE", "rights-referee-icons.svg"]) {
  const source = rightsFeature === "rights-referee-icons.svg" ? fs.readFileSync(path.join(root, "app.js"), "utf8") : html;
  if (!source.includes(rightsFeature)) errors.push(`Rights Referee is missing: ${rightsFeature}`);
}
if (data.units.find(unit => unit.id === "gov-4")?.resources?.map(resource => resource.id).join("|") !== "bill-journey|presidential-power") {
  errors.push("Unit 4 must include How a Bill Becomes a Law and Can the President Do That?.");
}
if (!Array.isArray(presidentialPowerCases) || presidentialPowerCases.length !== 6) {
  errors.push(`Expected 6 presidential-power actions; found ${presidentialPowerCases?.length || 0}.`);
}
presidentialPowerCases?.forEach((caseData, index) => {
  for (const key of ["president", "year", "icon", "iconAlt", "action", "question", "ruling", "power", "check", "sourceLabel", "source"]) {
    if (!caseData[key]) errors.push(`Presidential-power action ${index + 1} is missing ${key}.`);
  }
  if (caseData.options?.length !== 2 || !Number.isInteger(caseData.answer) || !/^https:\/\//.test(caseData.source || "")) {
    errors.push(`Presidential-power action ${index + 1} has incomplete choices or source.`);
  }
});
for (const powerFeature of ['id="presidential-power" data-view="presidential-power"', "CAN THE PRESIDENT DO THAT?", "presidential-power-icons.svg"]) {
  const source = powerFeature === "presidential-power-icons.svg" ? fs.readFileSync(path.join(root, "app.js"), "utf8") : html;
  if (!source.includes(powerFeature)) errors.push(`The presidential-power activity is missing: ${powerFeature}`);
}
if (!Array.isArray(billJourneyData?.proposals) || billJourneyData.proposals.length !== 4) {
  errors.push("How a Bill Becomes a Law needs four proposal choices.");
}
if (!Array.isArray(billJourneyData?.stages) || billJourneyData.stages.map(stage => stage.id).join("|") !== "introduce|committee|first-vote|second-vote|conference|president|override") {
  errors.push("The bill journey is missing or has an incorrect stage sequence.");
}
billJourneyData?.stages?.forEach((stage, index) => {
  if (!stage.title || !stage.explanation || !stage.prompt || stage.choices?.length < 2) {
    errors.push(`Bill journey stage ${index + 1} is incomplete.`);
  }
});
for (const billFeature of ['id="bill-journey" data-view="bill-journey"', "HOW A BILL BECOMES A LAW", "renderBillJourney", "bill-folder"]) {
  const source = billFeature === "renderBillJourney" ? fs.readFileSync(path.join(root, "app.js"), "utf8") : billFeature === "bill-folder" ? fs.readFileSync(path.join(root, "styles.css"), "utf8") : html;
  if (!source.includes(billFeature)) errors.push(`How a Bill Becomes a Law is missing: ${billFeature}`);
}
if (!Array.isArray(federalismMapData?.levels) || federalismMapData.levels.map(level => level.id).join("|") !== "federal|state|local|tribal|shared") {
  errors.push("The Federalism Map needs federal, state, local, tribal, and shared power keys.");
}
if (!Array.isArray(federalismMapData?.locations) || federalismMapData.locations.length !== 9) {
  errors.push("The Federalism Map needs nine community locations.");
}
federalismMapData?.locations?.forEach((location, index) => {
  for (const key of ["id", "mapLabel", "who", "what", "why", "connection", "sourceLabel", "source"]) {
    if (!location[key]) errors.push(`Federalism Map location ${index + 1} is missing ${key}.`);
  }
  if (!location.levels?.length || !location.levels.every(level => federalismMapData.levels.some(item => item.id === level)) || !/^https:\/\//.test(location.source || "")) {
    errors.push(`Federalism Map location ${index + 1} has incomplete levels or source.`);
  }
});
for (const mapFeature of ['id="federalism-map" data-view="federalism-map"', "THE FEDERALISM MAP", "renderFederalismMap", "community-map"]) {
  const source = mapFeature === "renderFederalismMap" ? fs.readFileSync(path.join(root, "app.js"), "utf8") : mapFeature === "community-map" ? fs.readFileSync(path.join(root, "styles.css"), "utf8") : html;
  if (!source.includes(mapFeature)) errors.push(`The Federalism Map is missing: ${mapFeature}`);
}
const teacherFacingLessonTerms = /\b(CER|retrieval check|constructed response|targeted reteach|reassessment evidence|assessed content|supplied information)\b/i;
data.units.forEach(unit => unit.lessons.forEach(lesson => {
  if (lesson.some(value => teacherFacingLessonTerms.test(String(value)))) {
    errors.push(`${unit.number} contains teacher-facing lesson language.`);
  }
}));
if (!Array.isArray(data.words) || data.words.length !== 70) errors.push(`Expected 70 plain-language glossary terms; found ${data.words?.length || 0}.`);
const requiredUnitOneTerms = ["Natural rights", "Social contract", "Popular sovereignty", "Limited government", "Consent of the governed", "Republicanism", "Equality", "Direct democracy", "Republic", "Enlightenment"];
for (const term of requiredUnitOneTerms) {
  const entry = data.words?.find(word => word[0] === term);
  if (!entry) errors.push(`Missing required Unit 1 glossary term: ${term}.`);
  else if (entry[4] !== "gov-1") errors.push(`Required glossary term must belong to Unit 1: ${term}.`);
}
data.words?.forEach((word, index) => {
  if (word.length !== 5 || word.some(value => !String(value).trim()) || !data.units.some(unit => unit.id === word[4])) {
    errors.push(`Glossary term ${index + 1} is incomplete or has an unknown unit.`);
  }
});
if (!data.units.some(unit => unit.id === config.currentUnit)) errors.push(`Unknown currentUnit: ${config.currentUnit}`);
const expectedUpcoming = [
  "WE THE PEOPLE PROJECT|OPENS WEDNESDAY · 8:30 AM",
  "ROOTS OF AMERICAN DEMOCRACY WORKSHEET|COMING SOON"
];
if (config.upcoming?.map(item => `${item.title}|${item.date}`).join("\n") !== expectedUpcoming.join("\n")) {
  errors.push("The homepage upcoming activities must show the two current Unit 1 activities.");
}
data.units.forEach(unit => {
  if (typeof config.unitUnlocks?.[unit.id] !== "boolean") errors.push(`Unit ${unit.id} needs a true or false unlock setting.`);
});
if (!config.unitUnlocks?.[config.currentUnit]) errors.push("The current unit must also be open in unitUnlocks.");
if (config.exitQuestion && !/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(config.exitEndpoint || "")) errors.push("An active exit ticket must use a deployed GOV Apps Script endpoint.");
if (!config.assignmentUrls || typeof config.assignmentUrls !== "object") errors.push("assignmentUrls must be an object.");
data.units.forEach(unit => {
  for (const key of ["id", "number", "title", "question", "standards", "lessons"]) {
    if (!unit[key] || !unit[key].length) errors.push(`${unit.id || "Unknown unit"} is missing ${key}.`);
  }
  unit.lessons.forEach((lesson, index) => {
    if (lesson.length !== 5 || lesson.some(value => !String(value).trim())) errors.push(`${unit.id} lesson ${index + 1} is incomplete.`);
  });
});

if (foundations.documents.length !== 12) errors.push(`Expected 12 foundational documents; found ${foundations.documents.length}.`);
const gettysburg = foundations.documents.find(documentData => documentData.id === "gettysburg");
if (!gettysburg || gettysburg.title !== "Gettysburg Address" || gettysburg.year !== "1863") errors.push("The Gettysburg Address document guide is missing or incomplete.");
const visibleDocuments = foundations.documents.filter(documentData => documentData.file);
if (visibleDocuments.length !== 3 || visibleDocuments.map(documentData => documentData.id).sort().join(",") !== "declaration,gettysburg,preamble") {
  errors.push("Only the Declaration of Independence, Preamble, and Gettysburg Address may be visible in the document library.");
}
for (const documentData of visibleDocuments) {
  if (!fs.existsSync(path.join(root, documentData.file))) errors.push(`Missing full document reader: ${documentData.file}`);
}
const declarationReader = fs.readFileSync(path.join(root, "documents", "declaration-of-independence.html"), "utf8");
const preambleReader = fs.readFileSync(path.join(root, "documents", "constitution-preamble.html"), "utf8");
const gettysburgReader = fs.readFileSync(path.join(root, "documents", "gettysburg-address.html"), "utf8");
const declarationEvidenceHeading = declarationReader.indexOf("3 &middot; THE EVIDENCE AGAINST THE KING");
const declarationEvidenceLead = declarationReader.indexOf("The history of the present King of Great Britain");
const declarationFirstGrievance = declarationReader.indexOf("He has refused his Assent to Laws");
if (!(declarationEvidenceHeading < declarationEvidenceLead && declarationEvidenceLead < declarationFirstGrievance)) {
  errors.push("The Declaration's evidence lead must begin section 3 before the grievances.");
}
if (declarationReader.includes('class="highlight"')) errors.push("The Declaration reader must not highlight or underline original text.");
if (!declarationReader.includes('class="support"')) errors.push("The Declaration reader must keep its side annotations.");
for (const marker of ["READ THE FULL DOCUMENT", "foundations.documents.filter(documentData => documentData.file)"]) {
  if (!fs.readFileSync(path.join(root, "app.js"), "utf8").includes(marker)) errors.push(`The direct full-document card behavior is missing: ${marker}`);
}
for (const [name, reader, markers] of [
  ["Declaration", declarationReader, ["When in the Course of human events", "He has refused his Assent to Laws", "we mutually pledge to each other our Lives", "WORD HELP"]],
  ["Preamble", preambleReader, ["We the People of the United States", "secure the Blessings of Liberty", "Posterity", "WORD HELP"]],
  ["Gettysburg", gettysburgReader, ["Four score and seven years ago", "government of the people, by the people, for the people", "WORD HELP"]]
]) {
  markers.forEach(marker => { if (!reader.includes(marker)) errors.push(`${name} full-text reader is missing: ${marker}`); });
  if (/\b(?:AP|EXAM|STANDARD)\b/.test(reader)) errors.push(`${name} reader contains AP or test-facing clutter.`);
}
for (const promise of ["FORM A MORE PERFECT UNION", "ESTABLISH JUSTICE", "INSURE DOMESTIC TRANQUILITY", "PROVIDE FOR THE COMMON DEFENCE", "PROMOTE THE GENERAL WELFARE", "SECURE THE BLESSINGS OF LIBERTY"]) {
  if (!preambleReader.includes(promise)) errors.push(`Preamble reader is missing its promise: ${promise}`);
}
if ((preambleReader.match(/class="promise-card"/g) || []).length !== 6) errors.push("The Preamble reader must explain exactly six promises.");
if ((preambleReader.match(/<b>MEANING<\/b>/g) || []).length !== 6 || (preambleReader.match(/<b>EXAMPLE<\/b>/g) || []).length !== 6) errors.push("Every Preamble promise needs one meaning and one example.");

if (!cpRosters || Object.keys(cpRosters).sort().join(",") !== "1B,2A") errors.push("Final CP fallback rosters must contain only periods 1B and 2A.");
if (!Array.isArray(publishedRoster.periods) || publishedRoster.periods.map(period => period.id).join(",") !== "1B,2A") errors.push("Published CP rosters must contain periods 1B and 2A in order.");
const publishedByPeriod = Object.fromEntries((publishedRoster.periods || []).map(period => [period.id, period.students]));
const rosterCounts = { "1B": 35, "2A": 23 };
const rosterKeys = [];
Object.entries(rosterCounts).forEach(([period, count]) => {
  if (!Array.isArray(cpRosters?.[period]) || cpRosters[period].length !== count) errors.push(`Final roster ${period} must contain ${count} students.`);
  if (!Array.isArray(publishedByPeriod[period]) || publishedByPeriod[period].length !== count) errors.push(`Published roster ${period} must contain ${count} students.`);
  publishedByPeriod[period]?.forEach(name => {
    rosterKeys.push(`${period}|${name}`);
    if (name !== name.trim() || !name.includes(",")) errors.push(`Malformed student name in period ${period}: ${name}`);
  });
});
if (new Set(rosterKeys).size !== rosterKeys.length) errors.push("The final CP rosters contain a duplicate student record.");
if (JSON.stringify(publishedByPeriod) !== JSON.stringify(cpRosters)) errors.push("Published and fallback CP rosters are out of sync.");
const rosterFingerprint = crypto.createHash("sha256").update(JSON.stringify(publishedRoster.periods)).digest("hex");
if (rosterFingerprint !== "6db6adb3d4ca2575bee57e83f4bc8dfa050e6e806a63b49aca1c2f4aa911414f") errors.push("Published CP rosters no longer match the final supplied 1B/2A list.");
if (publishedByPeriod["1B"]?.[0] !== "Ali, Harun F." || publishedByPeriod["1B"]?.at(-1) !== "Vargas-Toledo, Javier E.") errors.push("Period 1B first or last student is incorrect.");
if (publishedByPeriod["2A"]?.[0] !== "Amargo, Kianna F." || publishedByPeriod["2A"]?.at(-1) !== "Wilson, Teddi R.") errors.push("Period 2A first or last student is incorrect.");
if (!html.includes("cp-rosters.js?v=20260826-exit-ticket") || !html.includes("app.js?v=20260831-notes-practice") || !html.includes("styles.css?v=20260831-dark-civic-cards")) errors.push("Exit-ticket cache versions are not current.");
for (const control of ['id="exit-form"', 'id="exit-period"', 'id="exit-student"', 'id="exit-response"', 'minlength="5"', 'class="exit-submit" type="submit" disabled', 'id="exit-status" role="status"']) {
  if (!html.includes(control)) errors.push(`Exit-ticket form control changed or missing: ${control}`);
}
if (!(html.indexOf('class="now-panel"') < html.indexOf('class="dashboard-card exit-card"') && html.indexOf('class="dashboard-card exit-card"') < html.indexOf('class="home-dashboard"'))) errors.push("The exit ticket must appear directly below the current-unit card.");
for (const marker of ['fetch("content.json", { cache: "no-store" })', "populateExitStudents", "validateExitTicket", "submittedAt: new Date().toISOString()", "body: JSON.stringify(payload)"]) {
  if (!appCode.includes(marker)) errors.push(`Exit-ticket behavior changed or missing: ${marker}`);
}
const exitScript = fs.readFileSync(path.join(root, "exit-ticket-script.gs"), "utf8");
for (const marker of ["ROSTER_TAB = 'Rosters'", "studentIsOnRoster", "Student name does not match the selected period.", "1xEPilYXFU_pQKEZfGj9M2V3CZmflhHGkU3GdKBXcWOk", "Period 1B", "Period 2A", "All Responses", "writeToTab(ss, TABS[period], row)"]) {
  if (!exitScript.includes(marker)) errors.push(`Exit-ticket collector is missing final-roster support: ${marker}`);
}
if (!Array.isArray(foundationCases) || foundationCases.length !== 9) errors.push(`Expected 9 student-friendly court case guides; found ${foundationCases?.length || 0}.`);
foundationCases?.forEach((caseData, index) => {
  for (const key of ["slug", "title", "year", "topic", "question"]) {
    if (!caseData[key]) errors.push(`Court case guide ${index + 1} is missing ${key}.`);
  }
  if (!fs.existsSync(path.join(root, "cases", `${caseData.slug}.html`))) errors.push(`Missing individual page for ${caseData.title}.`);
});
if (foundationCases?.some((caseData, index) => index && Number(caseData.year) < Number(foundationCases[index - 1].year))) {
  errors.push("Court case guides must remain in chronological order.");
}
const caseGuideCode = fs.readFileSync(path.join(root, "cases", "case-guides-data.js"), "utf8");
const caseGuideContext = { window: {} };
vm.createContext(caseGuideContext);
vm.runInContext(caseGuideCode, caseGuideContext);
if (caseGuideContext.window.CP_CASE_GUIDES?.length !== 9) errors.push("Court case page data must contain all 9 guides.");
for (const forbiddenCase of ["Marbury v. Madison", "McCulloch v. Maryland"]) {
  if (caseGuideCode.includes(forbiddenCase)) errors.push(`The CP case collection must not include ${forbiddenCase}.`);
}
if (foundations.amendments.length !== 27) errors.push(`Expected all 27 amendments; found ${foundations.amendments.length}.`);
if (foundations.debates.length !== 4) errors.push(`Expected 4 Madison debates; found ${foundations.debates.length}.`);
if (foundations.skills.length !== 3 || foundations.skills.some(skill => skill.levels.length !== 3)) {
  errors.push("Expected 3 skill builders with 3 levels each.");
}
foundations.documents.forEach(documentData => {
  for (const key of ["id", "title", "standards", "bigIdea", "excerpt", "plain", "why", "question"]) {
    if (!documentData[key]) errors.push(`Foundational document ${documentData.id || "unknown"} is missing ${key}.`);
  }
});
foundations.amendments.forEach((amendment, index) => {
  if (amendment[0] !== index + 1 || amendment.length !== 6 || !amendment[5]) errors.push(`Amendment ${index + 1} is incomplete or out of order.`);
});
for (const skillId of ["source", "argument", "language"]) {
  if (![1, 2, 3].includes(config.foundationUnlocks?.[skillId])) errors.push(`Invalid foundation unlock for ${skillId}.`);
}

function validateProveYourCase() {
  const expected = ["miranda", "riley", "mahanoy", "carpenter", "earls", "miller"];
  const proveCaseSource = fs.readFileSync(path.join(root, "prove-your-case", "case-data.js"), "utf8") + fs.readFileSync(path.join(root, "prove-your-case.html"), "utf8") + expected.map(id => {
    const item = proveCases?.find(entry => entry.id === id);
    return item?.file && fs.existsSync(path.join(root, "prove-your-case", item.file)) ? fs.readFileSync(path.join(root, "prove-your-case", item.file), "utf8") : "";
  }).join("\n");
  const resource = data.units.flatMap(unit => unit.resources || []).find(item => item.id === "unit-0-synthesis");
  if (resource?.url !== "prove-your-case.html" || config.assignmentUrls?.["unit-0-synthesis"] !== "prove-your-case.html") errors.push("Prove Your Case resource must link to its case hub.");
  if (!Array.isArray(proveCases) || proveCases.length !== expected.length) errors.push("Prove Your Case must contain exactly six case files.");
  expected.forEach(id => {
    const item = proveCases?.find(entry => entry.id === id);
    if (!item) { errors.push(`Missing Prove Your Case data: ${id}`); return; }
    for (const field of ["file", "name", "year", "topic", "amendments", "image", "alt", "teaser", "question", "worksheet", "story", "notice", "constitution", "toolbox", "sideA", "sideB", "prompts", "ruling", "aftermath"]) if (!item[field]) errors.push(`Incomplete Prove Your Case ${id}: ${field}`);
    for (const field of ["actor", "personAction", "action", "question"]) if (!item.worksheet?.[field]) errors.push(`Incomplete Prove Your Case worksheet help ${id}: ${field}`);
    if (!/^Does the Constitution allow the government to\b/.test(item.worksheet?.question || "")) errors.push(`Prove Your Case ${id} worksheet question must complete the worksheet sentence starter.`);
    for (const field of ["rule", "decide", "remember", "terms"]) if (!item.toolbox?.[field]) errors.push(`Incomplete Prove Your Case toolbox ${id}: ${field}`);
    if (item.toolbox?.terms?.length !== 3) errors.push(`Prove Your Case ${id} must define exactly three legal terms.`);
    if (!fs.existsSync(path.join(root, "prove-your-case", item.file))) errors.push(`Missing Prove Your Case page: ${item.file}`);
    const caseHtml = fs.existsSync(path.join(root, "prove-your-case", item.file)) ? fs.readFileSync(path.join(root, "prove-your-case", item.file), "utf8") : "";
    for (const marker of ["case-path", "story-step", "constitution-step", "toolbox-rule", "toolbox-decide", "toolbox-remember", "toolbox-terms", "ARE YOU STUCK OR NEED SOME IDEAS FOR YOUR ARGUMENT?", "EVIDENCE THIS SIDE CAN USE", "A ruling is a legal decision", "Government should be allowed to ___ only when ___"]) {
      if (!caseHtml.includes(marker)) errors.push(`Prove Your Case ${id} is missing page component: ${marker}`);
    }
    if (caseHtml.indexOf('id="ruling-step"') > caseHtml.indexOf('id="arguments-step"')) errors.push(`Prove Your Case ${id} must place the student ruling before optional argument ideas.`);
    if (!caseHtml.includes('<details class="case-stage arguments-stage"') || caseHtml.includes('<details class="case-stage arguments-stage" id="arguments-step" open')) errors.push(`Prove Your Case ${id} argument ideas must begin hidden in a details control.`);
    const localImage = item.image.replace(/^\.\.\//, "");
    if (!fs.existsSync(path.join(root, localImage))) errors.push(`Missing Prove Your Case illustration: ${localImage}`);
    if (config.proveCaseUnlocks?.[id] !== true) errors.push(`Prove Your Case result must be open: ${id}`);
    if (!/^https:\/\//.test(item.ruling?.source || "")) errors.push(`Invalid Prove Your Case decision source: ${id}`);
    for (const field of ["status", "text", "source"]) if (!item.aftermath?.[field]) errors.push(`Incomplete Prove Your Case aftermath ${id}: ${field}`);
    if (!/^https:\/\//.test(item.aftermath?.source || "")) errors.push(`Invalid Prove Your Case aftermath source: ${id}`);
  });
  for (const phrase of ["personal archive", "search rule", "Your teacher will", "custodial interrogation", "Court.s decision"]) {
    if (proveCaseSource.includes(phrase)) errors.push(`Prove Your Case contains unclear or teacher-facing wording: ${phrase}`);
  }
  for (const marker of ["admin-prove-case-unlocks", "data-prove-case-unlock", "proveCaseUnlocks"]) {
    if (!html.includes(marker) && !fs.readFileSync(path.join(root, "app.js"), "utf8").includes(marker)) errors.push(`Missing Prove Your Case teacher control: ${marker}`);
  }
}

validateProveYourCase();

function validatePresidentialYearbookAssignments() {
  const dataCode = fs.readFileSync(path.join(root, "presidential-yearbook-assignments.js"), "utf8");
  const revealCode = fs.readFileSync(path.join(root, "presidential-yearbook-reveal.js"), "utf8");
  const revealContext = { window: {} };
  vm.createContext(revealContext);
  vm.runInContext(dataCode, revealContext);
  const assignments = revealContext.window.PRESIDENTIAL_YEARBOOK_ASSIGNMENTS;
  const expectedCounts = { "1B": 35, "2A": 25 };
  const requiredFields = ["period", "student", "presidentNumber", "president", "term", "libraryUrl", "status"];

  if (/Math\.random\s*\(/.test(dataCode + revealCode + presidentialYearbookHtml)) {
    errors.push("Presidential Yearbook assignments must never be randomized in the browser.");
  }
  for (const marker of ["PRESIDENTIAL REVEAL", "REVEAL MY PRESIDENT", "presidential-yearbook-assignments.js", "presidential-yearbook-reveal.js", "prefers-reduced-motion: reduce"]) {
    if (!presidentialYearbookHtml.includes(marker)) errors.push(`Presidential Yearbook reveal is missing: ${marker}`);
  }
  if (presidentialYearbookHtml.includes("ASSIGNED PRESIDENTS") || presidentialYearbookHtml.includes("COMING SOON")) {
    errors.push("The Assigned Presidents placeholder is still present.");
  }
  if (!Array.isArray(assignments) || assignments.length !== 60) {
    errors.push(`Expected 60 finalized CP assignments; found ${assignments?.length || 0}.`);
    return;
  }
  assignments.forEach((assignment, index) => {
    requiredFields.forEach(field => {
      if (assignment[field] === undefined || assignment[field] === null || assignment[field] === "") {
        errors.push(`Incomplete Presidential Yearbook assignment at record ${index + 1}: ${field}`);
      }
    });
    if (!Object.hasOwn(expectedCounts, assignment.period)) errors.push(`Non-CP period in Presidential Yearbook assignments: ${assignment.period}`);
    if (assignment.libraryUrl !== "./#presidents") errors.push(`Incorrect CP Presidential Library link for ${assignment.student}.`);
    if (assignment.status !== "Assigned") errors.push(`Incorrect assignment status for ${assignment.student}.`);
  });
  const studentKeys = assignments.map(assignment => `${assignment.period}|${assignment.student}`);
  if (new Set(studentKeys).size !== assignments.length) errors.push("Duplicate CP student assignment record detected.");
  const carrilloAssignment = assignments.find(assignment => assignment.period === "1B" && assignment.student === "Carrillo, Luis F.");
  if (!carrilloAssignment || carrilloAssignment.presidentNumber !== 21 || carrilloAssignment.president !== "Chester A. Arthur" || carrilloAssignment.term !== "1881–1885") {
    errors.push("Carrillo, Luis F. must remain assigned to Chester A. Arthur, presidency #21.");
  }
  Object.entries(expectedCounts).forEach(([period, count]) => {
    const periodAssignments = assignments.filter(assignment => assignment.period === period);
    if (periodAssignments.length !== count) errors.push(`CP period ${period} must contain ${count} assignments.`);
    const numbers = periodAssignments.map(assignment => assignment.presidentNumber);
    if (new Set(numbers).size !== numbers.length) errors.push(`Duplicate presidency number within CP period ${period}.`);
    [22, 24, 45, 47].forEach(number => {
      if (!numbers.includes(number)) errors.push(`CP period ${period} is missing separate presidency #${number}.`);
    });
  });
  const presidencyChecks = new Map([
    [22, ["Grover Cleveland", "1885–1889"]],
    [24, ["Grover Cleveland", "1893–1897"]],
    [45, ["Donald Trump", "2017–2021"]],
    [47, ["Donald Trump", "2025–present"]]
  ]);
  presidencyChecks.forEach(([name, term], number) => {
    const matching = assignments.filter(assignment => assignment.presidentNumber === number);
    if (!matching.length || matching.some(assignment => assignment.president !== name || assignment.term !== term)) {
      errors.push(`Presidency #${number} is missing or incorrectly identified.`);
    }
  });
  for (const forbidden of ["1A", "2B", "AP Government", "github.io/APG"]) {
    if (dataCode.includes(forbidden) || revealCode.includes(forbidden) || presidentialYearbookHtml.includes(forbidden)) {
      errors.push(`AP-only content found in CP Presidential Reveal: ${forbidden}`);
    }
  }
}

validatePresidentialYearbookAssignments();

try { new vm.Script(fs.readFileSync(path.join(root, "app.js"), "utf8")); }
catch (error) { errors.push(`Invalid app.js: ${error.message}`); }

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Site validation passed: ${data.units.length} units, ${lessonCount} focused topics, ${data.words.length} glossary terms, ${foundations.documents.length} documents, ${foundations.amendments.length} amendments, ${foundations.debates.length} debates, and ${foundations.skills.length} skill builders.`);
