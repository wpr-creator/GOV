#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const errors = [];
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const civicSelfieHtml = fs.readFileSync(path.join(root, "civic-selfie.html"), "utf8");
const presidentialYearbookHtml = fs.readFileSync(path.join(root, "presidential-yearbook.html"), "utf8");
const config = JSON.parse(fs.readFileSync(path.join(root, "site-content.json"), "utf8"));
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, "course-data.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "foundations-data.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "constitution-explorer-data.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "rights-referee-data.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "election-2026-data.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "presidential-power-data.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "bill-journey-data.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "federalism-map-data.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "founding-power-data.js"), "utf8"), context);
const data = context.window.COURSE_DATA;
const foundations = context.window.FOUNDATIONS_DATA;
const explorerSituations = context.window.CONSTITUTION_EXPLORER_DATA;
const rightsCases = context.window.RIGHTS_REFEREE_DATA;
const electionData = context.window.ELECTION_2026_DATA;
const presidentialPowerCases = context.window.PRESIDENTIAL_POWER_DATA;
const billJourneyData = context.window.BILL_JOURNEY_DATA;
const federalismMapData = context.window.FEDERALISM_MAP_DATA;
const foundingPowerIdeas = context.window.FOUNDING_POWER_DATA;
const foundationCases = context.window.FOUNDATIONS_DATA.cases;
const portraitManifest = JSON.parse(fs.readFileSync(path.join(root, "assets", "presidents", "portraits.json"), "utf8"));
const presidentFacts = JSON.parse(fs.readFileSync(path.join(root, "assets", "presidents", "president-facts.json"), "utf8"));

for (const file of ["index.html", "civic-selfie.html", "presidential-yearbook.html", "presidential-yearbook-assignments.js", "presidential-yearbook-reveal.js", "styles.css", "app.js", "course-data.js", "foundations-data.js", "constitution-explorer-data.js", "rights-referee-data.js", "election-2026-data.js", "presidential-power-data.js", "bill-journey-data.js", "federalism-map-data.js", "founding-power-data.js", "site-content.json", "us-politics-events.json", "assets/course-mark.svg", "assets/social-share.jpg", "assets/assignments/civic-selfie-example.png", "assets/assignments/presidential-yearbook-color-example.png", "assets/assignments/presidential-yearbook-word-example.png", "assets/cases/rights-referee-icons.svg", "assets/power/presidential-power-icons.svg", "assets/foundations/founding-power-icons.svg"]) {
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
  "0.6 — Show Your Work"
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
  "mr-smith-reflection|0.4 — GOVERNMENT TAKES THE STAGE|MR. SMITH GOES TO WASHINGTON EXTENSION",
  "presidential-yearbook|0.5 — PORTRAIT DAY|THE PRESIDENTIAL YEARBOOK",
  "presidential-library|0.5 — PORTRAIT DAY|PRESIDENTIAL LIBRARY",
  "civics-field-test|0.6 — SHOW YOUR WORK|CIVICS FIELD GUIDE TEST",
  "unit-0-synthesis|0.6 — SHOW YOUR WORK|PROVE YOUR CASE"
];
if (firstBell?.resources?.map(resource => `${resource.id}|${resource.lesson}|${resource.title}`).join("\n") !== expectedFirstBellAssignments.join("\n")) {
  errors.push("First Bell assignments are missing, mislabeled, or out of lesson order.");
}
const appCode = fs.readFileSync(path.join(root, "app.js"), "utf8");
for (const completionFeature of [
  'const UNIT_ZERO_COMPLETION_KEY = "gov-unit0-completion-v1";',
  "createUnitZeroCheck(resource, unlocked)",
  "localStorage.setItem(UNIT_ZERO_COMPLETION_KEY",
  'check.setAttribute("aria-pressed"',
  '"Mark incomplete" : "Mark complete"'
]) {
  if (!appCode.includes(completionFeature)) errors.push(`Unit 0 completion behavior is missing: ${completionFeature}`);
}
const primaryStyles = fs.readFileSync(path.join(root, "styles.css"), "utf8");
for (const completionSelector of [".unit-zero-resource-item", ".unit-zero-check", '.unit-zero-check[aria-pressed="true"]', ".unit-zero-check:focus-visible", ".unit-zero-check:disabled"]) {
  if (!primaryStyles.includes(completionSelector)) errors.push(`Unit 0 completion styling is missing: ${completionSelector}`);
}
if (!html.includes("styles.css?v=20260812-case-guides") || !html.includes("app.js?v=20260812-case-guides") || !html.includes("course-data.js?v=20260811-unit0-assignments")) {
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
  if (!resource.url && config.assignmentUnlocks?.[resource.id]) {
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
if (unitOne?.resources?.map(resource => resource.id).join("|") !== "founding-power") {
  errors.push("Where Does Power Come From? must be a Unit 1 resource.");
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
if (!Array.isArray(data.words) || data.words.length !== 63) errors.push(`Expected 63 plain-language glossary terms; found ${data.words?.length || 0}.`);
data.words?.forEach((word, index) => {
  if (word.length !== 5 || word.some(value => !String(value).trim()) || !data.units.some(unit => unit.id === word[4])) {
    errors.push(`Glossary term ${index + 1} is incomplete or has an unknown unit.`);
  }
});
if (!data.units.some(unit => unit.id === config.currentUnit)) errors.push(`Unknown currentUnit: ${config.currentUnit}`);
data.units.forEach(unit => {
  if (typeof config.unitUnlocks?.[unit.id] !== "boolean") errors.push(`Unit ${unit.id} needs a true or false unlock setting.`);
});
if (!config.unitUnlocks?.[config.currentUnit]) errors.push("The current unit must also be open in unitUnlocks.");
if (!config.assignmentUrls || typeof config.assignmentUrls !== "object") errors.push("assignmentUrls must be an object.");
data.units.forEach(unit => {
  for (const key of ["id", "number", "title", "question", "standards", "lessons"]) {
    if (!unit[key] || !unit[key].length) errors.push(`${unit.id || "Unknown unit"} is missing ${key}.`);
  }
  unit.lessons.forEach((lesson, index) => {
    if (lesson.length !== 5 || lesson.some(value => !String(value).trim())) errors.push(`${unit.id} lesson ${index + 1} is incomplete.`);
  });
});

if (foundations.documents.length !== 10) errors.push(`Expected 10 foundational documents; found ${foundations.documents.length}.`);
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
