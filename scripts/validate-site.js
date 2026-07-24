#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const errors = [];
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const config = JSON.parse(fs.readFileSync(path.join(root, "site-content.json"), "utf8"));
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, "course-data.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "foundations-data.js"), "utf8"), context);
const data = context.window.COURSE_DATA;
const foundations = context.window.FOUNDATIONS_DATA;
const portraitManifest = JSON.parse(fs.readFileSync(path.join(root, "assets", "presidents", "portraits.json"), "utf8"));
const presidentFacts = JSON.parse(fs.readFileSync(path.join(root, "assets", "presidents", "president-facts.json"), "utf8"));

for (const file of ["index.html", "styles.css", "app.js", "course-data.js", "foundations-data.js", "site-content.json", "us-politics-events.json", "assets/course-mark.svg", "assets/social-share.jpg"]) {
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
  });
  if (president.presentDayConnection) {
    if (!president.presentDayConnection.text || !president.presentDayConnection.sourceLabel || !/^https:\/\//.test(president.presentDayConnection.sourceUrl || "")) {
      errors.push(`${president.name} has an incomplete present-day connection.`);
    }
  }
});

for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
  const ref = match[1];
  if (/^(https?:|#|mailto:|tel:)/.test(ref)) continue;
  const target = path.join(root, ref.split(/[?#]/)[0]);
  if (!fs.existsSync(target)) errors.push(`Broken local reference: ${ref}`);
}

for (const fragment of ["<main", "<nav", "Skip to the course", "prefers-reduced-motion"]) {
  const source = fragment === "prefers-reduced-motion" ? fs.readFileSync(path.join(root, "styles.css"), "utf8") : html;
  if (!source.includes(fragment)) errors.push(`Missing accessibility feature: ${fragment}`);
}

if (!Array.isArray(data.units) || data.units.length !== 8) errors.push("Expected 8 Government units.");
const lessonCount = data.units.reduce((count, unit) => count + unit.lessons.length, 0);
if (lessonCount !== 38) errors.push(`Expected 38 focused Government topics; found ${lessonCount}.`);
const expectedUnitTitles = ["First Bell", "Foundations of American Democracy", "Building the Constitution", "Election Season", "Checks and Balances", "Rights in Real Life", "Government Around the World", "Constitutional Tensions"];
if (data.units.some((unit, index) => unit.title !== expectedUnitTitles[index])) {
  errors.push("Government units are missing or out of the approved sequence.");
}
if (data.units.find(unit => unit.id === "gov-3")?.timing !== "October") {
  errors.push("Election Season must remain marked for October.");
}
const teacherFacingLessonTerms = /\b(CER|retrieval check|constructed response|targeted reteach|reassessment evidence|assessed content|supplied information)\b/i;
data.units.forEach(unit => unit.lessons.forEach(lesson => {
  if (lesson.some(value => teacherFacingLessonTerms.test(String(value)))) {
    errors.push(`${unit.number} contains teacher-facing lesson language.`);
  }
}));
if (!Array.isArray(data.words) || data.words.length !== 54) errors.push(`Expected 54 plain-language glossary terms; found ${data.words?.length || 0}.`);
data.words?.forEach((word, index) => {
  if (word.length !== 5 || word.some(value => !String(value).trim()) || !data.units.some(unit => unit.id === word[4])) {
    errors.push(`Glossary term ${index + 1} is incomplete or has an unknown unit.`);
  }
});
if (!data.units.some(unit => unit.id === config.currentUnit)) errors.push(`Unknown currentUnit: ${config.currentUnit}`);
data.units.forEach(unit => {
  for (const key of ["id", "number", "title", "question", "standards", "lessons"]) {
    if (!unit[key] || !unit[key].length) errors.push(`${unit.id || "Unknown unit"} is missing ${key}.`);
  }
  unit.lessons.forEach((lesson, index) => {
    if (lesson.length !== 5 || lesson.some(value => !String(value).trim())) errors.push(`${unit.id} lesson ${index + 1} is incomplete.`);
  });
});

if (foundations.documents.length !== 10) errors.push(`Expected 10 foundational documents; found ${foundations.documents.length}.`);
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

try { new vm.Script(fs.readFileSync(path.join(root, "app.js"), "utf8")); }
catch (error) { errors.push(`Invalid app.js: ${error.message}`); }

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Site validation passed: ${data.units.length} units, ${lessonCount} focused topics, ${data.words.length} glossary terms, ${foundations.documents.length} documents, ${foundations.amendments.length} amendments, ${foundations.debates.length} debates, and ${foundations.skills.length} skill builders.`);
