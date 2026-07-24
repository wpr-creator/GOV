#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const portraitManifest = JSON.parse(await fs.readFile(path.join(root, "assets", "presidents", "portraits.json"), "utf8"));
const outputPath = path.join(root, "assets", "presidents", "president-facts.json");
const pewReligionSource = "https://www.pewresearch.org/religion/2009/01/15/the-religious-affiliations-of-us-presidents/";
const millerSource = "https://millercenter.org/president";
const nameAliases = new Map([["Franklin Delano Roosevelt", "Franklin D. Roosevelt"]]);
const birthplaceOverrides = {
  "James Monroe": "Westmoreland County, Virginia",
  "John Tyler": "Charles City County, Virginia",
  "James Buchanan": "Cove Gap, Pennsylvania",
  "Abraham Lincoln": "Hodgenville, Kentucky",
  "Grover Cleveland": "Caldwell, New Jersey",
  "Jimmy Carter": "Plains, Georgia",
  "Ronald Reagan": "Tampico, Illinois",
  "Barack Obama": "Honolulu, Hawaii",
  "Donald Trump": "Queens, New York"
};

const supplementalText = `
George Washington|1|No college degree; trained as a surveyor|Episcopalian|Created the presidential cabinet; Set the two-term precedent; Kept the nation neutral in the European war
John Adams|2|Harvard College|Unitarian|Strengthened the Navy; Avoided full war with France; Signed the controversial Alien and Sedition Acts
Thomas Jefferson|3|College of William and Mary|No formal affiliation; influenced by Deism and Unitarianism|Completed the Louisiana Purchase; Sponsored the Lewis and Clark expedition; Used the controversial Embargo Act
James Madison|4|College of New Jersey, now Princeton|Episcopalian|Led the country during the War of 1812; Supported rebuilding national finances; Approved the Second Bank of the United States
James Monroe|5|College of William and Mary; studied law under Jefferson|Episcopalian|Issued the Monroe Doctrine; Signed the Missouri Compromise; Oversaw the acquisition of Florida
John Quincy Adams|6|Harvard College|Unitarian|Promoted roads, canals, science, and education; Supported a national observatory; Faced strong congressional opposition
Andrew Jackson|7|Limited formal schooling; studied law|Presbyterian|Expanded presidential power; Vetoed the national bank; Enforced the destructive Indian Removal policy
Martin Van Buren|8|Local schools; legal apprenticeship|Dutch Reformed|Created the Independent Treasury; Defended party organization; Struggled with the Panic of 1837
William Henry Harrison|9|Hampden-Sydney College and medical study at Pennsylvania; no degree|Episcopalian|Delivered the longest inaugural address; Served only 31 days; His death tested presidential succession
John Tyler|10|College of William and Mary|Episcopalian|Established that the vice president fully becomes president; Supported Texas annexation; Broke with his own Whig Party
James K. Polk|11|University of North Carolina|Presbyterian|Settled the Oregon boundary; Expanded U.S. territory after the Mexican-American War; Created an independent treasury
Zachary Taylor|12|Limited formal schooling; career military training|Episcopalian|Opposed expanding slavery into western territories; Threatened force against secession; Died after 16 months
Millard Fillmore|13|Limited formal schooling; legal apprenticeship|Unitarian|Signed the Compromise of 1850; Enforced the Fugitive Slave Act; Sent the expedition that opened relations with Japan
Franklin Pierce|14|Bowdoin College|Episcopalian|Signed the Gadsden Purchase; Signed the Kansas-Nebraska Act; Saw sectional violence intensify
James Buchanan|15|Dickinson College|Presbyterian|Supported the proslavery Lecompton Constitution; Failed to stop the secession crisis; Remained in office as seven states seceded
Abraham Lincoln|16|About one year of formal schooling; self-educated in law|No formal affiliation|Preserved the Union; Issued the Emancipation Proclamation; Advanced the Thirteenth Amendment
Andrew Johnson|17|No formal schooling; self-educated|No formal affiliation|Completed the Alaska purchase; Clashed with Congress over Reconstruction; Became the first impeached president
Ulysses S. Grant|18|United States Military Academy at West Point|Methodist|Enforced civil rights during Reconstruction; Suppressed the Ku Klux Klan; Signed the law creating Yellowstone
Rutherford B. Hayes|19|Kenyon College and Harvard Law School|Methodist|Promoted civil-service reform; Withdrew federal troops from the South; Tried to reconcile postwar divisions
James A. Garfield|20|Williams College|Disciples of Christ|Challenged the patronage system; Defended federal education and civil rights; Was assassinated months after taking office
Chester A. Arthur|21|Union College; studied law|Episcopalian|Signed the Pendleton Civil Service Act; Modernized the Navy; Signed the Chinese Exclusion Act
Grover Cleveland|22 and 24|No college degree; studied law|Presbyterian|Served two nonconsecutive terms; Expanded federal regulation of railroads; Used the veto more than earlier presidents
Benjamin Harrison|23|Miami University; studied law|Presbyterian|Signed the Sherman Antitrust Act; Admitted six new states; Expanded protected national forests
William McKinley|25|Allegheny College and Albany Law School; no degree|Methodist|Led the nation in the Spanish-American War; Signed the Gold Standard Act; Oversaw overseas expansion
Theodore Roosevelt|26|Harvard College; attended Columbia Law School|Dutch Reformed|Broke up powerful trusts; Expanded conservation and national parks; Advanced construction of the Panama Canal
William Howard Taft|27|Yale College and Cincinnati Law School|Unitarian|Filed major antitrust cases; Supported the income-tax amendment; Later became chief justice
Woodrow Wilson|28|Princeton University and Johns Hopkins University; attended Virginia Law|Presbyterian|Created the Federal Reserve; Led the nation during World War I; Promoted the League of Nations while segregating federal offices
Warren G. Harding|29|Ohio Central College|Baptist|Created the federal Budget Bureau; Supported postwar arms-limitation treaties; His administration was damaged by major scandals
Calvin Coolidge|30|Amherst College; studied law|Congregationalist|Signed major tax reductions; Supported the Kellogg-Briand Pact; Signed restrictive immigration legislation
Herbert Hoover|31|Stanford University|Quaker|Expanded public works during the Depression; Created the Reconstruction Finance Corporation; Failed to stop the economic collapse
Franklin D. Roosevelt|32|Harvard College; attended Columbia Law School|Episcopalian|Created New Deal relief and reform programs; Led the nation through most of World War II; Ordered the incarceration of Japanese Americans
Harry S. Truman|33|High school; attended business and law courses without a degree|Baptist|Approved the Marshall Plan and NATO; Desegregated the armed forces; Authorized atomic bombs against Japan
Dwight D. Eisenhower|34|United States Military Academy at West Point|Presbyterian|Created the Interstate Highway System; Enforced school desegregation in Little Rock; Warned about the military-industrial complex
John F. Kennedy|35|Harvard College|Roman Catholic|Created the Peace Corps; Managed the Cuban Missile Crisis; Committed the nation to a Moon landing
Lyndon B. Johnson|36|Southwest Texas State Teachers College|Disciples of Christ|Signed the Civil Rights and Voting Rights Acts; Created Medicare and Medicaid; Escalated the Vietnam War
Richard Nixon|37|Whittier College and Duke Law School|Quaker|Opened relations with China; Created the Environmental Protection Agency; Resigned because of Watergate
Gerald Ford|38|University of Michigan and Yale Law School|Episcopalian|Helped stabilize government after Watergate; Signed the Helsinki Accords; Pardoned Richard Nixon
Jimmy Carter|39|United States Naval Academy|Baptist|Brokered the Camp David Accords; Signed the Panama Canal treaties; Made human rights central to foreign policy
Ronald Reagan|40|Eureka College|Presbyterian|Signed major tax reductions; Increased military spending; Negotiated arms reductions with the Soviet Union
George H. W. Bush|41|Yale University|Episcopalian|Led the coalition in the Gulf War; Signed the Americans with Disabilities Act; Managed the end of the Cold War
Bill Clinton|42|Georgetown University, Oxford University, and Yale Law School|Baptist|Presided over economic growth and budget surpluses; Signed NAFTA and welfare reform; Was impeached and acquitted
George W. Bush|43|Yale University and Harvard Business School|Methodist|Led the response to the September 11 attacks; Launched wars in Afghanistan and Iraq; Created PEPFAR and expanded Medicare
Barack Obama|44|Occidental College, Columbia University, and Harvard Law School|Protestant|Signed the Affordable Care Act; Led recovery from the Great Recession; Signed financial-reform legislation
Donald Trump|45 and 47|Fordham University and University of Pennsylvania|Nondenominational Christian; formerly Presbyterian|Signed major tax reductions; Appointed three Supreme Court justices; Brokered the Abraham Accords; Second term remains ongoing
Joe Biden|46|University of Delaware and Syracuse University College of Law|Roman Catholic|Signed major infrastructure and climate legislation; Signed the CHIPS and Science Act; Led U.S. support for Ukraine
`.trim();

const supplemental = new Map(supplementalText.split("\n").map(line => {
  const [name, order, education, religion, accomplishments] = line.split("|");
  return [name, { order, education, religion, accomplishments: accomplishments.split("; ") }];
}));

const clean = value => String(value || "")
  .replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/&nbsp;|&#160;/gi, " ")
  .replace(/&amp;/gi, "&")
  .replace(/&#8217;|&rsquo;/gi, "’")
  .replace(/&#8220;|&ldquo;/gi, "“")
  .replace(/&#8221;|&rdquo;/gi, "”")
  .replace(/\s+/g, " ")
  .trim();

const slug = name => name.toLowerCase().replaceAll(".", "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const profileOverrides = {
  "James K. Polk": "james-knox-polk",
  "James A. Garfield": "james-abram-garfield",
  "Chester A. Arthur": "chester-alan-arthur",
  "Herbert Hoover": "herbert-clark-hoover",
  "John F. Kennedy": "john-fitzgerald-kennedy",
  "Richard Nixon": "richard-m-nixon",
  "Gerald Ford": "gerald-r-ford",
  "Jimmy Carter": "james-earl-carter",
  "Ronald Reagan": "ronald-w-reagan",
  "Bill Clinton": "william-j-clinton",
  "Donald Trump": "donald-j-trump",
  "Joe Biden": "joseph-r-biden"
};
const verifiedQuoteFallbacks = {
  "John Tyler": "I can never consent to being dictated to.",
  "Zachary Taylor": "I have no private purpose to accomplish, no party objectives to build up, no enemies to punish.",
  "Rutherford B. Hayes": "He serves his party best who serves the country best.",
  "Richard Nixon": "The greatest honor history can bestow is the title of peacemaker.",
  "Jimmy Carter": "We must adjust to changing times and still hold to unchanging principles.",
  "Ronald Reagan": "Government is not the solution to our problem; government is the problem.",
  "George H. W. Bush": "We can find meaning and reward by serving some purpose higher than ourselves.",
  "Barack Obama": "Yes, we can.",
  "Donald Trump": "We will make America great again.",
  "Joe Biden": "This is America’s day. This is democracy’s day."
};

async function fetchProfile(url) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": "PrinciplesOfAmericanDemocracyCourseSite/1.0" },
        signal: AbortSignal.timeout(15000)
      });
      if (response.ok) return response.text();
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise(resolve => setTimeout(resolve, attempt * 1000));
  }
  throw lastError;
}

async function loadWikidataBirthplaces() {
  const query = `SELECT ?personLabel ?birthplaceLabel WHERE {
    ?person wdt:P39 wd:Q11696; wdt:P19 ?birthplace.
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
  }`;
  const params = new URLSearchParams({ query });
  const response = await fetch(`https://query.wikidata.org/sparql?${params}`, {
    headers: {
      Accept: "application/sparql-results+json",
      "User-Agent": "PrinciplesOfAmericanDemocracyCourseSite/1.0"
    },
    signal: AbortSignal.timeout(20000)
  });
  if (!response.ok) throw new Error(`Wikidata birthplace query failed: ${response.status}`);
  const payload = await response.json();
  return new Map(payload.results.bindings.map(binding => [
    nameAliases.get(binding.personLabel.value) || binding.personLabel.value,
    binding.birthplaceLabel.value
  ]));
}

function section(html, heading) {
  const match = html.match(new RegExp(`<h3>${heading}<\\/h3>([\\s\\S]*?)(?:<hr\\s*\\/?>|<h3>)`, "i"));
  return match?.[1] || "";
}

function chooseQuote(html) {
  const paragraphs = [...section(html, "Quotes").matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map(match => clean(match[1]))
    .filter(Boolean);
  for (const paragraph of paragraphs) {
    const direct = paragraph.match(/[“"]([^”"]{12,180})[”"]/);
    if (direct && direct[1].split(/\s+/).length <= 28 && !/can.?t tell a lie/i.test(direct[1])) return direct[1];
  }
  return "";
}

function tableValues(html) {
  const rows = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map(match =>
    [...match[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(cell => clean(cell[1]))
  );
  return {
    term: rows[1]?.[0] || "",
    born: rows[1]?.[2] || "",
    career: rows[3]?.[2] || ""
  };
}

async function buildCard(portrait) {
  const extra = supplemental.get(portrait.name);
  if (!extra) throw new Error(`Missing supplemental facts for ${portrait.name}`);
  const profileSlug = profileOverrides[portrait.name] || slug(portrait.name);
  const profileUrl = `https://ourwhitehouse.org/${profileSlug}/`;
  const html = await fetchProfile(profileUrl);
  const table = tableValues(html);
  const card = {
    name: portrait.name,
    order: extra.order,
    yearsInOffice: portrait.name === "Donald Trump" ? "2017–2021; 2025–present" : table.term.replaceAll("-", "–"),
    portrait: `assets/presidents/${portrait.file}`,
    birthplace: birthplaceOverrides[portrait.name] || wikidataBirthplaces.get(portrait.name) || table.born.replace(/^.*?,? in /, ""),
    religion: extra.religion,
    education: extra.education,
    careerBeforePresidency: table.career,
    keyAccomplishments: extra.accomplishments,
    importantQuote: chooseQuote(html) || verifiedQuoteFallbacks[portrait.name] || "",
    sources: {
      biographyAndQuote: profileUrl,
      lifeBeforePresidency: millerSource,
      religiousAffiliation: pewReligionSource,
      portrait: portrait.commonsPage
    }
  };
  console.log(`✓ ${portrait.name}`);
  return card;
}

const wikidataBirthplaces = await loadWikidataBirthplaces();
const cards = [];
for (let start = 0; start < portraitManifest.portraits.length; start += 5) {
  const batch = portraitManifest.portraits.slice(start, start + 5);
  cards.push(...await Promise.all(batch.map(buildCard)));
}

await fs.writeFile(outputPath, `${JSON.stringify({
  note: "Student-ready facts for the Portrait Day design activity. Accomplishment lists include major achievements, consequential actions, and important controversies when needed for historical accuracy.",
  generated: new Date().toISOString(),
  count: cards.length,
  presidents: cards
}, null, 2)}\n`);

console.log(`Saved ${cards.length} president fact cards.`);
