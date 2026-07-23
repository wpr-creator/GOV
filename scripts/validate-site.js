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

for (const file of ["index.html", "styles.css", "app.js", "course-data.js", "foundations-data.js", "site-content.json", "us-politics-events.json", "assets/course-mark.svg"]) {
  if (!fs.existsSync(path.join(root, file))) errors.push(`Missing required file: ${file}`);
}

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
if (lessonCount !== 38) errors.push(`Expected all 38 pacing entries; found ${lessonCount}.`);
if (!data.units.some(unit => unit.id === config.currentUnit)) errors.push(`Unknown currentUnit: ${config.currentUnit}`);
data.units.forEach(unit => {
  for (const key of ["id", "number", "title", "question", "standards", "overview", "lessons"]) {
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
console.log(`Site validation passed: ${data.units.length} units, ${lessonCount} pacing entries, ${foundations.documents.length} documents, ${foundations.amendments.length} amendments, ${foundations.debates.length} debates, and ${foundations.skills.length} skill builders.`);
