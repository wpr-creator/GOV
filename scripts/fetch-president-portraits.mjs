#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

const presidents = [
  "George Washington", "John Adams", "Thomas Jefferson", "James Madison",
  "James Monroe", "John Quincy Adams", "Andrew Jackson", "Martin Van Buren",
  "William Henry Harrison", "John Tyler", "James K. Polk", "Zachary Taylor",
  "Millard Fillmore", "Franklin Pierce", "James Buchanan", "Abraham Lincoln",
  "Andrew Johnson", "Ulysses S. Grant", "Rutherford B. Hayes", "James A. Garfield",
  "Chester A. Arthur", "Grover Cleveland", "Benjamin Harrison", "William McKinley",
  "Theodore Roosevelt", "William Howard Taft", "Woodrow Wilson", "Warren G. Harding",
  "Calvin Coolidge", "Herbert Hoover", "Franklin D. Roosevelt", "Harry S. Truman",
  "Dwight D. Eisenhower", "John F. Kennedy", "Lyndon B. Johnson", "Richard Nixon",
  "Gerald Ford", "Jimmy Carter", "Ronald Reagan", "George H. W. Bush",
  "Bill Clinton", "George W. Bush", "Barack Obama", "Donald Trump", "Joe Biden"
];

const root = path.resolve(import.meta.dirname, "..");
const outputDir = path.join(root, "assets", "presidents");
const manifestPath = path.join(outputDir, "portraits.json");
const commonsApi = "https://commons.wikimedia.org/w/api.php";
const wikidataNameAliases = new Map([
  ["Franklin Delano Roosevelt", "Franklin D. Roosevelt"]
]);
const verifiedFileOverrides = new Map([
  ["Franklin D. Roosevelt", "Vincenzo Laviosa - Franklin D. Roosevelt - Google Art Project.jpg"]
]);

const slugify = value => value
  .toLowerCase()
  .replaceAll(".", "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

const stripHtml = value => String(value || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

function isPublicDomain(metadata) {
  const license = metadata.LicenseShortName?.value || "";
  const usage = metadata.UsageTerms?.value || "";
  return /public domain|cc0|pd-usgov/i.test(`${license} ${usage}`);
}

async function fetchWithRetry(url, options = {}) {
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    const response = await fetch(url, options);
    if (response.status !== 429) return response;
    await wait(attempt * 2500);
  }
  throw new Error(`Rate limited: ${url}`);
}

async function loadWikidataPortraits() {
  const query = `SELECT ?person ?personLabel ?image WHERE {
    ?person wdt:P39 wd:Q11696; wdt:P18 ?image.
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
  }`;
  const params = new URLSearchParams({ query });
  const response = await fetchWithRetry(`https://query.wikidata.org/sparql?${params}`, {
    headers: {
      Accept: "application/sparql-results+json",
      "User-Agent": "PrinciplesOfAmericanDemocracyCourseSite/1.0 (educational project)"
    }
  });
  if (!response.ok) throw new Error(`Wikidata query failed: ${response.status}`);
  const payload = await response.json();
  const byName = new Map();
  payload.results.bindings.forEach(binding => {
    const name = wikidataNameAliases.get(binding.personLabel.value) || binding.personLabel.value;
    if (!presidents.includes(name) || byName.has(name)) return;
    const fileName = verifiedFileOverrides.get(name) || decodeURIComponent(binding.image.value.split("/").at(-1));
    byName.set(name, { wikidata: binding.person.value, fileName });
  });
  return byName;
}

async function loadCommonsMetadata(records) {
  const output = new Map();
  const entries = [...records.entries()];
  for (let start = 0; start < entries.length; start += 20) {
    const batch = entries.slice(start, start + 20);
    const form = new URLSearchParams({
      action: "query",
      titles: batch.map(([, record]) => `File:${record.fileName}`).join("|"),
      prop: "imageinfo",
      iiprop: "url|mime|size|extmetadata",
      iiurlwidth: "900",
      format: "json",
      origin: "*"
    });
    const response = await fetchWithRetry(commonsApi, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "PrinciplesOfAmericanDemocracyCourseSite/1.0 (educational project)"
      },
      body: form
    });
    if (!response.ok) throw new Error(`Commons metadata request failed: ${response.status}`);
    const payload = await response.json();
    Object.values(payload.query?.pages || {}).forEach(page => {
      output.set(page.title.replace(/^File:/, "").replaceAll("_", " "), page);
    });
    await wait(1200);
  }
  return output;
}

async function removePreviousGeneratedFiles() {
  try {
    const previous = JSON.parse(await fs.readFile(manifestPath, "utf8"));
    for (const portrait of previous.portraits || []) {
      if (/^[a-z0-9-]+\.(?:jpg|png|webp)$/.test(portrait.file)) {
        await fs.rm(path.join(outputDir, portrait.file), { force: true });
      }
    }
  } catch {
    // There may be no previous manifest on the first clean run.
  }
}

async function download(name, wikidataRecord, page) {
  const info = page.imageinfo?.[0];
  const metadata = info?.extmetadata || {};
  if (!info?.thumburl) throw new Error("No downloadable thumbnail");
  if (!isPublicDomain(metadata)) {
    throw new Error(`License is not verified as public domain: ${metadata.LicenseShortName?.value || "unknown"}`);
  }
  const extension = info.mime === "image/png" ? "png" : info.mime === "image/webp" ? "webp" : "jpg";
  const filename = `${slugify(name)}.${extension}`;
  const response = await fetchWithRetry(info.thumburl, {
    headers: { "User-Agent": "PrinciplesOfAmericanDemocracyCourseSite/1.0 (educational project)" }
  });
  if (!response.ok) throw new Error(`Image download failed: ${response.status}`);
  await fs.writeFile(path.join(outputDir, filename), Buffer.from(await response.arrayBuffer()));
  return {
    name,
    file: filename,
    wikidata: wikidataRecord.wikidata,
    commonsTitle: page.title,
    commonsPage: info.descriptionurl,
    originalFile: info.url,
    downloadedFile: info.thumburl,
    license: metadata.LicenseShortName?.value || metadata.UsageTerms?.value || "Public domain",
    creator: stripHtml(metadata.Artist?.value || metadata.Credit?.value || "Not listed"),
    source: stripHtml(metadata.Credit?.value || metadata.Source?.value || "Wikimedia Commons"),
    description: stripHtml(metadata.ImageDescription?.value || metadata.ObjectName?.value || ""),
    retrieved: new Date().toISOString().slice(0, 10)
  };
}

await fs.mkdir(outputDir, { recursive: true });
await removePreviousGeneratedFiles();

const wikidataPortraits = await loadWikidataPortraits();
const commonsMetadata = await loadCommonsMetadata(wikidataPortraits);
const portraits = [];
const failures = [];

for (const name of presidents) {
  try {
    const wikidataRecord = wikidataPortraits.get(name);
    if (!wikidataRecord) throw new Error("No Wikidata portrait record");
    const normalizedFileName = wikidataRecord.fileName.replaceAll("_", " ");
    const page = commonsMetadata.get(normalizedFileName);
    if (!page) throw new Error(`Commons file not found: ${wikidataRecord.fileName}`);
    const portrait = await download(name, wikidataRecord, page);
    portraits.push(portrait);
    console.log(`✓ ${name}: ${portrait.commonsTitle}`);
  } catch (error) {
    failures.push({ name, error: error.message });
    console.error(`✗ ${name}: ${error.message}`);
  }
}

await fs.writeFile(manifestPath, `${JSON.stringify({
  note: "Portraits come from the image attached to each president's Wikidata record. A file is saved only when Wikimedia Commons metadata identifies it as public domain, PD-USGov, or CC0. Review the linked source page before reuse outside this course site.",
  generated: new Date().toISOString(),
  count: portraits.length,
  portraits,
  failures
}, null, 2)}\n`);

console.log(`Saved ${portraits.length} verified portraits to ${path.relative(root, outputDir)}.`);
if (failures.length) {
  console.error(`${failures.length} portraits require a separately verified source.`);
  process.exitCode = 1;
}
