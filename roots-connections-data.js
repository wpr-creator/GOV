window.ROOTS_CONNECTIONS_DATA = {
  ideals: {
    "NATURAL RIGHTS": { symbol: "🕊️", meaning: "People are born with rights." },
    "SOCIAL CONTRACT": { symbol: "🤝", meaning: "People give government power so it will protect them." },
    "POPULAR SOVEREIGNTY": { symbol: "🗳️", meaning: "Government power comes from the people." },
    "LIMITED GOVERNMENT": { symbol: "🛑", meaning: "Law limits what government may do." },
    "CONSENT OF THE GOVERNED": { symbol: "✅", meaning: "Government needs the people’s permission." },
    "REPUBLICANISM": { symbol: "🏛️", meaning: "People elect representatives to govern." }
  },
  roots: [
    {
      id: "greece", name: "ANCIENT GREECE", symbol: "🗣️",
      rootIdea: "Citizens participated by debating issues and voting on public decisions.",
      usMeaning: "In the United States, people participate by voting, discussing issues, and paying attention to public decisions.",
      rounds: [
        { answer: "POPULAR SOVEREIGNTY", options: ["LIMITED GOVERNMENT", "POPULAR SOVEREIGNTY", "REPUBLICANISM"] },
        { answer: "CONSENT OF THE GOVERNED", options: ["CONSENT OF THE GOVERNED", "SOCIAL CONTRACT", "NATURAL RIGHTS"] }
      ]
    },
    {
      id: "rome", name: "ANCIENT ROME", symbol: "🏛️",
      rootIdea: "Citizens elected representatives to make public decisions in a republic.",
      usMeaning: "The United States is a republic in which voters elect representatives and hold them accountable.",
      rounds: [{ answer: "REPUBLICANISM", options: ["NATURAL RIGHTS", "LIMITED GOVERNMENT", "REPUBLICANISM"] }]
    },
    {
      id: "english-traditions", name: "ENGLISH CONSTITUTIONAL TRADITIONS", symbol: "📜",
      rootIdea: "Rulers had to obey the law, and written rules placed limits on government power.",
      usMeaning: "In the United States, presidents, governors, police officers, and other officials must follow the Constitution and the law.",
      rounds: [{ answer: "LIMITED GOVERNMENT", options: ["LIMITED GOVERNMENT", "POPULAR SOVEREIGNTY", "REPUBLICANISM"] }]
    },
    {
      id: "locke", name: "JOHN LOCKE", symbol: "🔐",
      rootIdea: "People have rights and give government authority so it will protect those rights.",
      usMeaning: "Government receives authority from the people and exists to protect their rights. If government fails, people may change it through elections and other lawful action.",
      rounds: [
        { answer: "NATURAL RIGHTS", options: ["NATURAL RIGHTS", "LIMITED GOVERNMENT", "REPUBLICANISM"] },
        { answer: "SOCIAL CONTRACT", options: ["POPULAR SOVEREIGNTY", "SOCIAL CONTRACT", "LIMITED GOVERNMENT"] },
        { answer: "CONSENT OF THE GOVERNED", options: ["REPUBLICANISM", "LIMITED GOVERNMENT", "CONSENT OF THE GOVERNED"] }
      ]
    },
    {
      id: "montesquieu", name: "MONTESQUIEU", symbol: "⚖️",
      rootIdea: "Government power should be divided so no person or group controls everything.",
      usMeaning: "The U.S. Constitution divides power among the legislative, executive, and judicial branches.",
      rounds: [{ answer: "LIMITED GOVERNMENT", options: ["NATURAL RIGHTS", "LIMITED GOVERNMENT", "CONSENT OF THE GOVERNED"] }]
    },
    {
      id: "machiavelli", name: "NICCOLÒ MACHIAVELLI", symbol: "🛡️",
      rootIdea: "Republics need active citizens, strong laws, and ways to hold leaders accountable.",
      usMeaning: "In the United States, laws, participation, and accountability help control abuses of power.",
      rounds: [
        { answer: "REPUBLICANISM", options: ["REPUBLICANISM", "LIMITED GOVERNMENT", "SOCIAL CONTRACT"] },
        { answer: "POPULAR SOVEREIGNTY", options: ["NATURAL RIGHTS", "CONSENT OF THE GOVERNED", "POPULAR SOVEREIGNTY"] }
      ]
    },
    {
      id: "blackstone", name: "WILLIAM BLACKSTONE", symbol: "📚",
      rootIdea: "Law should protect individual rights and apply to citizens and government officials.",
      usMeaning: "The U.S. legal system is expected to protect rights, provide fair legal processes, and apply the law to citizens and government officials.",
      rounds: [
        { answer: "NATURAL RIGHTS", options: ["SOCIAL CONTRACT", "NATURAL RIGHTS", "POPULAR SOVEREIGNTY"] },
        { answer: "LIMITED GOVERNMENT", options: ["LIMITED GOVERNMENT", "CONSENT OF THE GOVERNED", "REPUBLICANISM"] }
      ]
    }
  ]
};
