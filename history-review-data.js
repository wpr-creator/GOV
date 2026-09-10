window.HISTORY_REVIEW_DATA = {
  checkpoints: [
    {
      id: "articles",
      number: "01",
      title: "THE ARTICLES",
      question: "Sort what Congress could and could not do.",
      sort: {
        prompt: "Under the Articles, what could Congress do? What could it not do?",
        items: [
          { text: "DECLARE WAR AND MAKE PEACE", group: "could" },
          { text: "COIN MONEY", group: "could" },
          { text: "COLLECT TAXES DIRECTLY", group: "could-not" },
          { text: "REGULATE TRADE BETWEEN STATES", group: "could-not" },
          { text: "ENFORCE ITS OWN DECISIONS", group: "could-not" },
          { text: "CREATE A PRESIDENT OR NATIONAL COURTS", group: "could-not" }
        ],
        feedback: "The Articles created the first U.S. government, but the national government depended on the states. That made it difficult to raise money, manage trade, enforce decisions, and solve national problems."
      }
    },
    {
      id: "failures",
      number: "02",
      title: "WHY IT FAILED",
      question: "What could the government do—and what could it not do?",
      questions: [
        {
          prompt: "Which power did Congress have under the Articles?",
          options: ["Collect taxes directly", "Enforce its decisions", "Declare war and make peace"],
          answer: 2,
          feedback: "Congress could declare war, make peace, make treaties, coin money, and ask states for money and soldiers."
        },
        {
          prompt: "What was the main result of the Articles’ weaknesses?",
          options: ["The national government depended on the states and could not solve many problems on its own.", "The president became too powerful.", "National courts controlled the states."],
          answer: 0,
          feedback: "Congress lacked dependable money and power. Problems with taxes, trade, enforcement, courts, and money were difficult to solve."
        }
      ]
    },
    {
      id: "great-compromise",
      number: "03",
      title: "THE GREAT COMPROMISE",
      question: "How would large and small states be represented?",
      questions: [
        {
          prompt: "How did the Great Compromise organize Congress?",
          options: ["Every state received the same number of seats in both chambers.", "House seats depend on population, while every state has two senators.", "Only a state’s population determined all seats in Congress."],
          answer: 1,
          feedback: "The House addressed large-state concerns. The Senate protected the influence of small states."
        },
        {
          prompt: "Which chamber gives every state two members?",
          options: ["The House of Representatives", "The Supreme Court", "The Senate"],
          answer: 2,
          feedback: "Every state has two senators, no matter how large or small its population is."
        }
      ]
    },
    {
      id: "amending",
      number: "04",
      title: "AMENDING THE CONSTITUTION",
      question: "How can the Constitution be changed?",
      questions: [
        {
          prompt: "Why did Article V create an amendment process?",
          options: ["To make change possible without making it easy", "To let the president change the Constitution", "To require every state to approve every change"],
          answer: 0,
          feedback: "Article V requires broad support, but it does not require complete agreement from every state."
        },
        {
          prompt: "What support is normally needed to propose and ratify an amendment?",
          options: ["One-half of Congress and one-half of the states", "Two-thirds to propose and three-fourths of the states to ratify", "The president and the Supreme Court"],
          answer: 1,
          feedback: "Proposal normally needs two-thirds of both houses of Congress. Ratification needs three-fourths of the states."
        }
      ]
    },
    {
      id: "ratification",
      number: "05",
      title: "THE RATIFICATION DEBATE",
      question: "Was a stronger national government necessary—or dangerous?",
      questions: [
        {
          prompt: "What does ratify mean?",
          options: ["To reject a plan", "To revise a plan", "To formally approve a plan"],
          answer: 2,
          feedback: "Writing and signing the Constitution did not make it law. At least nine states had to ratify, or formally approve, it."
        },
        {
          prompt: "What best explains the Federalist and Anti-Federalist disagreement?",
          options: ["Federalists feared weak government; Anti-Federalists feared national government could become too powerful.", "Federalists opposed the Constitution; Anti-Federalists supported it.", "Both sides wanted the national government to have unlimited power."],
          answer: 0,
          feedback: "Both sides wanted to protect liberty. They disagreed about whether weak government or powerful national government was the greater danger."
        }
      ]
    },
    {
      id: "bill-of-rights",
      number: "06",
      title: "THE BILL OF RIGHTS",
      question: "What agreement helped secure ratification?",
      questions: [
        {
          prompt: "What did Anti-Federalists demand before trusting the new government?",
          options: ["A national king", "A written list protecting individual rights", "No state governments"],
          answer: 1,
          feedback: "Anti-Federalists wanted written protections against government power. Federalists promised that amendments would be considered."
        },
        {
          prompt: "How did the Bill of Rights help settle the ratification debate?",
          options: ["It returned the country to the Articles.", "It removed the national government’s power.", "It added written protections for individual freedoms to the stronger government."],
          answer: 2,
          feedback: "The Constitution created a stronger national government. The promised Bill of Rights helped gain support by adding written protections for liberty."
        }
      ]
    }
  ]
};
