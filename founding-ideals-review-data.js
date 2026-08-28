window.FOUNDING_IDEALS_REVIEW_DATA = {
  ideals: [
    { id: "natural-rights", name: "NATURAL RIGHTS", meaning: "Rights every person has because they are human, including life and liberty." },
    { id: "equality", name: "EQUALITY", meaning: "No person is naturally born with the right to rule another." },
    { id: "social-contract", name: "SOCIAL CONTRACT", meaning: "People accept government authority in exchange for order and protection of their rights." },
    { id: "popular-sovereignty", name: "POPULAR SOVEREIGNTY", meaning: "The people are the source of government power." },
    { id: "limited-government", name: "LIMITED GOVERNMENT", meaning: "Government power is restricted by law and cannot be absolute." },
    { id: "republicanism", name: "REPUBLICANISM", meaning: "People govern through elected representatives." }
  ],
  missions: [
    {
      id: "declaration",
      number: "01",
      title: "DECLARATION MISSION",
      description: "Find the ideals used to explain independence.",
      questions: [
        {
          id: "dec-rights",
          source: "DECLARATION OF INDEPENDENCE · 1776",
          excerpt: "They are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty and the pursuit of Happiness.",
          options: ["natural-rights", "limited-government", "republicanism"],
          answer: "natural-rights",
          hint: "Look for rights people have before government gives them anything.",
          explanation: "The Declaration says people already have rights, including life and liberty. That is the idea of natural rights."
        },
        {
          id: "dec-equality",
          source: "DECLARATION OF INDEPENDENCE · 1776",
          excerpt: "We hold these truths to be self-evident, that all men are created equal.",
          options: ["equality", "social-contract", "republicanism"],
          answer: "equality",
          hint: "Focus on the words “created equal.”",
          explanation: "The claim that people are created equal rejects the idea that anyone is born with a natural right to rule others."
        },
        {
          id: "dec-contract",
          source: "DECLARATION OF INDEPENDENCE · 1776",
          excerpt: "That to secure these rights, Governments are instituted among Men.",
          options: ["social-contract", "equality", "limited-government"],
          answer: "social-contract",
          hint: "Ask why people create government in this sentence.",
          explanation: "People create government for a purpose: to protect their rights. That agreement is the social contract."
        },
        {
          id: "dec-sovereignty",
          source: "DECLARATION OF INDEPENDENCE · 1776",
          excerpt: "Governments are instituted among Men, deriving their just powers from the consent of the governed.",
          options: ["popular-sovereignty", "natural-rights", "republicanism"],
          answer: "popular-sovereignty",
          hint: "Who gives government its power?",
          explanation: "Government receives legitimate power from the people it governs. The people are the source of power."
        }
      ]
    },
    {
      id: "constitution",
      number: "02",
      title: "CONSTITUTION MISSION",
      description: "Find the ideals built into the new government.",
      questions: [
        {
          id: "con-people",
          source: "CONSTITUTION · PREAMBLE · 1787",
          excerpt: "We the People of the United States ... do ordain and establish this Constitution.",
          options: ["popular-sovereignty", "limited-government", "equality"],
          answer: "popular-sovereignty",
          hint: "Who is creating the Constitution?",
          explanation: "“We the People” presents the people—not a king—as the source of the Constitution’s authority."
        },
        {
          id: "con-contract",
          source: "CONSTITUTION · PREAMBLE · 1787",
          excerpt: "Establish Justice, insure domestic Tranquility ... and secure the Blessings of Liberty.",
          options: ["social-contract", "republicanism", "equality"],
          answer: "social-contract",
          hint: "This list explains what people expect government to do for them.",
          explanation: "The Preamble lists what the government is created to provide, including justice, order, and liberty. That reflects a social contract."
        },
        {
          id: "con-limits",
          source: "CONSTITUTION · ARTICLE I · 1787",
          excerpt: "All legislative Powers herein granted shall be vested in a Congress of the United States.",
          options: ["limited-government", "natural-rights", "equality"],
          answer: "limited-government",
          hint: "Focus on “powers herein granted.” Congress receives powers from the Constitution.",
          explanation: "Congress does not receive unlimited power. Its authority comes from powers granted by the Constitution."
        },
        {
          id: "con-house",
          source: "CONSTITUTION · ARTICLE I · 1787",
          excerpt: "The House of Representatives shall be composed of Members chosen every second Year by the People of the several States.",
          options: ["republicanism", "social-contract", "natural-rights"],
          answer: "republicanism",
          hint: "The people choose someone to govern and make laws for them.",
          explanation: "Voters choose representatives to serve in the House. That is republicanism."
        },
        {
          id: "con-republic",
          source: "CONSTITUTION · ARTICLE IV · 1787",
          excerpt: "The United States shall guarantee to every State in this Union a Republican Form of Government.",
          options: ["republicanism", "popular-sovereignty", "limited-government"],
          answer: "republicanism",
          hint: "A republican government uses elected representatives.",
          explanation: "The Constitution promises every state a republican government in which people govern through representatives."
        }
      ]
    },
    {
      id: "gettysburg",
      number: "03",
      title: "GETTYSBURG MISSION",
      description: "Find how Lincoln renewed the founding ideals.",
      questions: [
        {
          id: "get-equality",
          source: "GETTYSBURG ADDRESS · 1863",
          excerpt: "A new nation, conceived in Liberty, and dedicated to the proposition that all men are created equal.",
          options: ["equality", "republicanism", "social-contract"],
          answer: "equality",
          hint: "Focus on the proposition—the central claim—to which the nation was dedicated.",
          explanation: "Lincoln repeats the Declaration’s claim that all people are created equal."
        },
        {
          id: "get-rights",
          source: "GETTYSBURG ADDRESS · 1863",
          excerpt: "That this nation, under God, shall have a new birth of freedom.",
          options: ["natural-rights", "limited-government", "republicanism"],
          answer: "natural-rights",
          hint: "Which ideal is most directly connected to freedom and liberty?",
          explanation: "Lincoln’s “new birth of freedom” connects the nation’s future to liberty, a natural right."
        },
        {
          id: "get-people",
          source: "GETTYSBURG ADDRESS · 1863",
          excerpt: "Government of the people, by the people, for the people, shall not perish from the earth.",
          options: ["popular-sovereignty", "equality", "social-contract"],
          answer: "popular-sovereignty",
          hint: "Who owns and directs this government?",
          explanation: "The repeated words “the people” show that government power begins with the people."
        }
      ]
    }
  ]
};
