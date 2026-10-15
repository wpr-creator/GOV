window.ELECTION_2026_DATA = {
  updated: "OCTOBER 7, 2026",
  electionDate: "NOVEMBER 3, 2026",
  registrationDeadline: "OCTOBER 19, 2026",
  ballotMailingDeadline: "OCTOBER 5, 2026",
  location: {
    exampleZip: "92114",
    defaultZip: "92114",
    district: "CALIFORNIA DISTRICT 52",
    note: "Enter your ZIP code. Then use the official lookup for your exact ballot. A ZIP code can include more than one voting district.",
    lookupSource: "https://www.sdvote.com/content/rov/en/sample-ballot-info-lookup.html"
  },
  races: [
    {
      office: "CALIFORNIA GOVERNOR",
      question: "WHO SHOULD LEAD CALIFORNIA’S EXECUTIVE BRANCH?",
      note: "The governor leads most state agencies, proposes a state budget, and may sign or veto bills passed by the Legislature. The governor also directs state resources during emergencies. The term is four years.",
      candidates: [
        { name: "XAVIER BECERRA", party: "DEMOCRATIC", fact: "Becerra served as U.S. secretary of health and human services and as California attorney general. Earlier, he represented a Los Angeles-area district in the U.S. House of Representatives." },
        { name: "STEVE HILTON", party: "REPUBLICAN", fact: "Hilton worked as a policy adviser to former United Kingdom Prime Minister David Cameron and later hosted a television program on Fox News. He has not previously held elected office." }
      ],
      source: "https://voterguide.sos.ca.gov/candidates/governor-candidate-statements.htm"
    },
    {
      office: "U.S. HOUSE · DISTRICT 52",
      question: "WHO SHOULD REPRESENT THIS AREA IN CONGRESS?",
      note: "A U.S. representative helps write and vote on federal laws, taxes, and spending. Each House member represents one district and serves a two-year term.",
      local: true,
      candidates: [
        { name: "JUAN VARGAS", party: "DEMOCRATIC", fact: "Vargas is the current U.S. representative for District 52. He previously served on the San Diego City Council and in the California Assembly and State Senate." },
        { name: "JEFF BELLE", party: "REPUBLICAN", fact: "Belle’s official ballot designation is business owner. He is challenging the current representative for this seat." }
      ],
      source: "https://elections.cdn.sos.ca.gov/statewide-elections/2026-general/cert-list-candidates.pdf"
    },
    {
      office: "SAN DIEGO CITY COUNCIL · DISTRICT 4",
      question: "WHO SHOULD REPRESENT DISTRICT 4 ON THE CITY COUNCIL?",
      note: "City Council members make local laws, approve the city budget, and represent their district. District 4 includes communities such as Encanto, Lincoln Park, Oak Park, Paradise Hills, and Valencia Park.",
      local: true,
      candidates: [
        { name: "HENRY FOSTER III", party: "NONPARTISAN", fact: "Foster is the current District 4 councilmember and is seeking reelection." },
        { name: "MARTHA ABRAHAM", party: "NONPARTISAN", fact: "Abraham’s official ballot designation is Neonatal ICU Nurse/Mother." }
      ],
      source: "https://www.sandiego.gov/city-clerk/elections/city/electioninfo"
    }
  ],
  propositions: [
    {
      number: 1,
      title: "AFFORDABLE HOMES",
      short: "HELPS BUILD AFFORDABLE HOMES AND HELPS VETERANS BUY HOMES.",
      explanation: "California borrows $11.25 billion now and pays it back over time. The money helps build or fix homes people can afford and helps veterans buy homes.",
      yes: "THE STATE BORROWS THE MONEY AND USES IT FOR THESE HOUSING PROGRAMS.",
      no: "THE STATE DOES NOT BORROW THIS MONEY FOR THESE PROGRAMS.",
      source: "https://voterguide.sos.ca.gov/propositions/1/index.htm"
    },
    {
      number: 2,
      title: "SAVE FOR A TOUGH YEAR",
      short: "MAKES CALIFORNIA SAVE MORE WHEN IT HAS EXTRA MONEY, SO IT CAN KEEP SERVICES GOING WHEN LESS MONEY COMES IN.",
      explanation: "Like a family saving part of a paycheck for an emergency, the state would set more money aside during good years. It would also keep making extra payments on money it owes until 2040.",
      yes: "THE STATE SAVES MORE IN GOOD YEARS AND MAKES EXTRA PAYMENTS ON SOME OLD DEBTS FOR LONGER.",
      no: "THE STATE KEEPS ITS CURRENT SAVING RULES AND PAYMENT PLAN FOR MONEY IT OWES.",
      source: "https://voterguide.sos.ca.gov/propositions/2/index.htm"
    },
    {
      number: 3,
      title: "KEEP THE EXTRA TAX ON TOP EARNERS",
      short: "KEEPS THE EXTRA INCOME TAX ON CALIFORNIANS WHO EARN THE MOST FROM ENDING IN 2031.",
      explanation: "California has charged higher income taxes to its highest earners since 2012. This measure keeps that extra tax in place to help pay for schools and other state services.",
      yes: "THE EXTRA TAX CONTINUES AFTER 2030.",
      no: "THE EXTRA TAX ENDS IN 2031, AS CURRENT LAW SAYS.",
      source: "https://voterguide.sos.ca.gov/propositions/3/index.htm"
    },
    {
      number: 4,
      title: "PUBLIC HELP FOR CAMPAIGNS",
      short: "LETS THE STATE OR A CITY CHOOSE TO HELP SOME CANDIDATES PAY FOR THEIR CAMPAIGNS.",
      explanation: "A government could choose to give public money to candidates who meet the rules. The money could not come from funds set aside for schools, roads, or public safety. This measure allows these programs but does not start one.",
      yes: "STATE AND LOCAL GOVERNMENTS MAY CREATE THESE PROGRAMS.",
      no: "THE STATE AND MOST CITIES CANNOT CREATE THESE PROGRAMS.",
      source: "https://voterguide.sos.ca.gov/propositions/4/index.htm"
    },
    {
      number: 5,
      title: "WHAT HAPPENS AFTER A RECALL?",
      short: "CHANGES HOW A REPLACEMENT IS CHOSEN IF VOTERS REMOVE A STATE OFFICIAL.",
      explanation: "Today, voters decide whether to remove the official and choose a replacement on the same ballot. This measure separates those choices: voters first decide whether to remove the official, then the empty job is filled later.",
      yes: "VOTERS DECIDE ONLY WHETHER TO REMOVE THE OFFICIAL. A NEW ELECTION OR AN APPOINTMENT CHOOSES THE REPLACEMENT LATER.",
      no: "VOTERS KEEP CHOOSING A REPLACEMENT ON THE SAME BALLOT AS THE RECALL VOTE.",
      source: "https://voterguide.sos.ca.gov/propositions/5/index.htm"
    },
    {
      number: 37,
      title: "HELP WITH A HOME DOWN PAYMENT",
      short: "GIVES SOME FAMILIES A STATE LOAN TO HELP PAY FOR PART OF A NEW HOME. THEY PAY IT BACK OVER TIME.",
      explanation: "A qualifying family could borrow from the state to cover part of a new home’s price. The family would need to put some money down and repay the state loan over time.",
      yes: "THE STATE STARTS THIS LOAN PROGRAM FOR QUALIFYING HOMEBUYERS.",
      no: "THE STATE DOES NOT START THIS LOAN PROGRAM.",
      source: "https://voterguide.sos.ca.gov/propositions/37/index.htm"
    },
    {
      number: 38,
      title: "RESEARCH TO FIGHT DISEASE",
      short: "HELPS CALIFORNIA RESEARCHERS STUDY HOW THE BODY FIGHTS DISEASE AND DEVELOP NEW TREATMENTS.",
      explanation: "The state borrows $8.4 billion and pays it back over time. Half goes to one research group connected to the University of California; the rest supports research at universities and other nonprofit centers.",
      yes: "THE STATE BORROWS THE MONEY AND USES IT FOR THIS MEDICAL RESEARCH.",
      no: "THE STATE DOES NOT BORROW THIS MONEY FOR THE RESEARCH.",
      source: "https://voterguide.sos.ca.gov/propositions/38/index.htm"
    },
    {
      number: 39,
      title: "SHOW ID WHEN YOU VOTE",
      short: "REQUIRES VOTERS TO SHOW ID IN PERSON OR WRITE PART OF AN ID NUMBER ON A MAIL BALLOT.",
      explanation: "Today, election workers check a voter’s signature. This measure changes that: in-person voters show government ID, and mail voters write the last four digits of an approved ID number on the envelope. Free voter ID cards would be available.",
      yes: "VOTERS PROVIDE THIS ID INFORMATION WHEN THEY VOTE.",
      no: "ELECTION WORKERS KEEP CHECKING VOTERS’ SIGNATURES.",
      source: "https://voterguide.sos.ca.gov/propositions/39/index.htm"
    },
    {
      number: 40,
      title: "ONE-TIME TAX ON BILLIONAIRES",
      short: "CHARGES A ONE-TIME TAX OF 5% TO PEOPLE WHO LIVED IN CALIFORNIA AND WERE WORTH OVER $1 BILLION ON JANUARY 1, 2026.",
      explanation: "The tax is based on the value of businesses, investments, art, and other valuable things a person owns. Homes and some retirement accounts are generally not included. Most of the money goes to health care.",
      yes: "THE STATE COLLECTS THE TAX. MOST GOES TO HEALTH CARE; SOME GOES TO FOOD HELP AND SCHOOLS.",
      no: "THE STATE DOES NOT COLLECT THIS TAX.",
      source: "https://voterguide.sos.ca.gov/propositions/40/index.htm"
    },
    {
      number: 41,
      title: "CHECK HOW TAX-FUNDED PROGRAMS WORK",
      short: "REQUIRES CHECKUPS ON SOME PROGRAMS PAID FOR BY NEW TAXES.",
      explanation: "An independent state office checks some programs before a new tax proposal goes to voters, then checks them every four years. It looks for ways to make the programs work better. Some of this money will count toward the state’s yearly limit on spending. If Prop 41 gets more YES votes than Prop 40, a court could stop Prop 40 from taking effect.",
      yes: "THE STATE ADDS THESE CHECKUPS. SOME OF THE MONEY COUNTS TOWARD THE STATE’S YEARLY SPENDING LIMIT.",
      no: "THE STATE KEEPS ITS CURRENT CHECKUP AND SPENDING RULES.",
      source: "https://voterguide.sos.ca.gov/propositions/41/index.htm"
    },
    {
      number: 42,
      title: "NO NEW TAX JUST FOR OWNING THINGS",
      short: "STOPS CALIFORNIA FROM ADDING A NEW TAX JUST BECAUSE SOMEONE OWNS THINGS LIKE STOCKS OR BUSINESS PROPERTY.",
      explanation: "The state could not create a new tax just for owning stocks, investment accounts, business property, or similar things. It would also be harder to make people pay a new tax for something that happened in the past. If Prop 42 gets more YES votes than Prop 40, a court could stop Prop 40 from taking effect.",
      yes: "CALIFORNIA CANNOT CREATE THESE NEW OWNERSHIP TAXES OR CERTAIN TAXES THAT REACH BACK INTO THE PAST.",
      no: "CALIFORNIA KEEPS THE OPTION TO CREATE THESE TAXES.",
      source: "https://voterguide.sos.ca.gov/propositions/42/index.htm"
    },
    {
      number: 43,
      title: "MORE VOTES FOR SOME LOCAL TAXES",
      short: "REQUIRES TWO OUT OF EVERY THREE VOTERS TO APPROVE SOME LOCAL TAXES FOR THINGS LIKE ROADS OR FIRE SERVICES.",
      explanation: "Some local taxes now pass when more than half of voters say yes. This measure raises the bar to two out of every three yes votes—even when voters, rather than local officials, put the tax on the ballot.",
      yes: "SOME LOCAL TAXES NEED TWO-THIRDS OF VOTERS TO SAY YES.",
      no: "SOME OF THESE TAXES CAN STILL PASS WITH MORE YES VOTES THAN NO VOTES.",
      source: "https://voterguide.sos.ca.gov/propositions/43/index.htm"
    },
    {
      number: 44,
      title: "MORE MONEY FOR PATIENT CARE",
      short: "REQUIRES SOME NONPROFIT CLINICS TO USE AT LEAST 90 CENTS OF EVERY DOLLAR FOR PATIENT CARE AND RELATED SERVICES.",
      explanation: "The rule applies to certain nonprofit clinics that provide basic health care in communities with too few medical services. They must use most of what they receive to care for patients and support those services.",
      yes: "COVERED CLINICS MUST USE AT LEAST 90 CENTS OF EACH DOLLAR FOR PATIENT CARE AND RELATED SERVICES.",
      no: "CLINICS DO NOT HAVE TO FOLLOW THIS NEW RULE.",
      source: "https://voterguide.sos.ca.gov/propositions/44/index.htm"
    },
    {
      number: 45,
      title: "FASTER REVIEW FOR SOME PROJECTS",
      short: "SPEEDS UP ENVIRONMENTAL CHECKS FOR SOME BUILDING AND PUBLIC WORKS PROJECTS.",
      explanation: "Before some projects move ahead, public agencies study how they could affect the environment. This measure shortens the time for those checks and limits some court challenges.",
      yes: "SOME PROJECTS GET FASTER CHECKS AND FEWER WAYS TO DELAY THEM IN COURT.",
      no: "THE CURRENT CHECKS AND COURT RULES STAY IN PLACE.",
      source: "https://voterguide.sos.ca.gov/propositions/45/index.htm"
    }
  ],
  sources: {
    officialMeasures: "https://www.sos.ca.gov/elections/ballot-measures/qualified-ballot-measures",
    voterGuide: "https://voterguide.sos.ca.gov/",
    candidates: "https://www.sos.ca.gov/elections/upcoming-elections/general-election-november-3-2026",
    dates: "https://www.sos.ca.gov/elections/upcoming-elections/general-election-november-3-2026/key-dates-deadlines"
  }
};
