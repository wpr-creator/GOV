window.FEDERALISM_MAP_DATA = {
  levels: [
    { id: "federal", label: "FEDERAL", meaning: "The national government acts for the whole country." },
    { id: "state", label: "STATE", meaning: "California uses powers kept by the states." },
    { id: "local", label: "LOCAL", meaning: "Cities, counties, and school districts use authority created by state law." },
    { id: "tribal", label: "TRIBAL", meaning: "A tribal nation governs through its own sovereign authority." },
    { id: "shared", label: "SHARED", meaning: "More than one government has a role." }
  ],
  locations: [
    {
      id: "school", mapLabel: "PUBLIC SCHOOL", icon: "SCHOOL", levels: ["local", "state", "federal", "shared"],
      who: "The school district runs the school. California sets major education rules and standards. The federal government protects civil rights and provides targeted funding.",
      what: "Local leaders hire staff and operate schools. The state sets graduation rules and academic standards. Federal laws protect equal access and students with disabilities.",
      why: "Education is mainly a state and local responsibility, but federal law and funding reach schools when the country has a national responsibility.",
      connection: "One school can answer to three levels of government at the same time.",
      sourceLabel: "U.S. DEPARTMENT OF EDUCATION", source: "https://www.ed.gov/about/ed-overview/federal-role-in-education"
    },
    {
      id: "street", mapLabel: "NEIGHBORHOOD STREET", icon: "STREET", levels: ["local"],
      who: "The City of San Diego maintains most city streets, sidewalks, traffic signals, and street trees.",
      what: "City workers repair pavement, operate signals, maintain sidewalks, and respond to many street-service requests.",
      why: "A city government is close to the people using these streets every day and can manage local conditions.",
      connection: "Local does not mean unimportant. Many government services people notice most are local.",
      sourceLabel: "CITY OF SAN DIEGO TRANSPORTATION", source: "https://www.sandiego.gov/transportation"
    },
    {
      id: "freeway", mapLabel: "FREEWAY", icon: "FREEWAY", levels: ["state", "federal", "shared"],
      who: "California operates and maintains the state highway system. Federal transportation programs help fund many projects and attach federal requirements.",
      what: "Caltrans plans, builds, operates, and maintains state highways. Federal money can support eligible construction and repair.",
      why: "The state manages one connected highway system, while the federal government helps connect and fund transportation across the country.",
      connection: "The government doing the work and the government helping pay are not always the same.",
      sourceLabel: "CALTRANS", source: "https://dot.ca.gov/programs/transportation-planning/division-of-transportation-planning/state-planning/transportation-economics/transportation-funding-in-ca"
    },
    {
      id: "post-office", mapLabel: "POST OFFICE", icon: "MAIL", levels: ["federal"],
      who: "The United States Postal Service is an independent establishment of the federal executive branch.",
      what: "It delivers mail and packages through one national network.",
      why: "The Constitution gives Congress power over post offices, and a national system connects addresses across state and local borders.",
      connection: "A neighborhood post office is part of a federal system.",
      sourceLabel: "UNITED STATES POSTAL SERVICE", source: "https://about.usps.com/who/government-relations/assets/establishment-as-independent-agency.pdf"
    },
    {
      id: "elections", mapLabel: "VOTE CENTER", icon: "VOTE", levels: ["local", "state", "federal", "shared"],
      who: "The San Diego County Registrar of Voters runs election operations. California writes many election rules. Federal law protects voting rights and governs federal elections.",
      what: "The county registers voters, prepares ballots, operates vote centers, counts votes, and reports results for federal, state, and local contests.",
      why: "Elections are administered close to voters, but they operate inside state and federal law.",
      connection: "The ballot may list federal offices, but county workers run the election.",
      sourceLabel: "COUNTY OF SAN DIEGO", source: "https://www.sandiegocounty.gov/departments/"
    },
    {
      id: "courts", mapLabel: "COURTHOUSES", icon: "COURT", levels: ["state", "federal"],
      who: "California courts decide cases involving state law. Federal courts decide cases involving federal law, the Constitution, and certain disputes listed in federal law.",
      what: "The two court systems have different judges, rules, and jurisdiction. Some cases can move from a state court to the United States Supreme Court when a federal question is involved.",
      why: "Federalism creates separate state and national legal systems instead of one single court system.",
      connection: "The word courthouse does not tell you which government’s court is inside.",
      sourceLabel: "UNITED STATES COURTS", source: "https://www.uscourts.gov/about-federal-courts/court-role-and-structure"
    },
    {
      id: "border", mapLabel: "BORDER CROSSING", icon: "BORDER", levels: ["federal"],
      who: "United States Customs and Border Protection, a federal agency, operates ports of entry.",
      what: "Federal officers inspect people and goods entering the United States and enforce federal customs and immigration laws at the border.",
      why: "Relations with other countries, immigration, and entry into the United States are national responsibilities.",
      connection: "The border is physically next to San Diego, but the city does not control who enters the country.",
      sourceLabel: "U.S. CUSTOMS AND BORDER PROTECTION", source: "https://www.cbp.gov/about"
    },
    {
      id: "tribal", mapLabel: "TRIBAL NATION", icon: "TRIBAL", levels: ["tribal", "federal", "shared"],
      who: "A federally recognized tribal nation has inherent powers of self-government. It also has a government-to-government relationship with the United States.",
      what: "Tribal governments can make and enforce laws, determine citizenship, tax, regulate activities, and govern their lands, subject to limits in federal law.",
      why: "A tribal nation is not simply another city or county. Its authority comes from tribal sovereignty, not from power handed down by California.",
      connection: "San Diego County includes tribal governments with their own political authority.",
      sourceLabel: "U.S. INDIAN AFFAIRS", source: "https://www.bia.gov/frequently-asked-questions"
    },
    {
      id: "emergency", mapLabel: "MAJOR EMERGENCY", icon: "EMERGENCY", levels: ["local", "state", "federal", "shared"],
      who: "Local firefighters, police, and emergency services usually respond first. County agencies coordinate across communities. California and the federal government can add people, money, equipment, and specialized help.",
      what: "Responsibility grows with the size of the emergency. A local incident may stay local. A major wildfire or earthquake can require several governments.",
      why: "No single level always has enough reach or resources for every emergency.",
      connection: "Federalism can create layers of help, but those layers must communicate.",
      sourceLabel: "COUNTY OF SAN DIEGO", source: "https://www.sandiegocounty.gov/content/sdc/oes.html"
    }
  ]
};
