window.BILL_JOURNEY_DATA = {
  proposals: [
    {
      id: "privacy",
      title: "PHONE PRIVACY BILL",
      shortTitle: "PHONE PRIVACY",
      purpose: "Require apps to clearly ask before selling a user’s location data.",
      amendment: "Give small companies one year to follow the new rule.",
      concern: "The president supports privacy but is concerned about the cost for small companies."
    },
    {
      id: "meals",
      title: "SCHOOL MEALS BILL",
      shortTitle: "SCHOOL MEALS",
      purpose: "Give states grants to provide free breakfast at public schools.",
      amendment: "Begin with schools where at least half of students qualify for meal assistance.",
      concern: "The president supports school meals but wants Congress to identify how the grants will be funded."
    },
    {
      id: "alerts",
      title: "DISASTER ALERTS BILL",
      shortTitle: "DISASTER ALERTS",
      purpose: "Make emergency phone alerts available in more languages.",
      amendment: "Start with the ten most widely spoken languages in each state.",
      concern: "The president supports the goal but wants a clear deadline for putting the system in place."
    },
    {
      id: "veterans",
      title: "VETERANS CARE BILL",
      shortTitle: "VETERANS CARE",
      purpose: "Add evening mental-health appointments at veterans’ clinics.",
      amendment: "Test the expanded hours in areas with the longest appointment waits.",
      concern: "The president supports expanded care but wants the first year to operate as a pilot program."
    }
  ],
  stages: [
    {
      id: "introduce",
      place: "START",
      title: "INTRODUCE THE BILL",
      explanation: "A member of Congress agrees to sponsor the idea and formally introduces it. Most bills may begin in either chamber. Bills that raise government revenue must begin in the House.",
      prompt: "WHERE SHOULD YOUR BILL BEGIN?",
      choices: [
        { label: "HOUSE OF REPRESENTATIVES", result: "Your representative introduces the bill. It receives an H.R. number and goes to a House committee.", stamp: "INTRODUCED IN THE HOUSE", chamber: "House" },
        { label: "SENATE", result: "A senator introduces the bill. It receives an S. number and goes to a Senate committee.", stamp: "INTRODUCED IN THE SENATE", chamber: "Senate" }
      ]
    },
    {
      id: "committee",
      place: "COMMITTEE",
      title: "WORK ON THE DETAILS",
      explanation: "A smaller group of lawmakers studies the bill. Members can hold a hearing, change the wording, approve it, or stop it.",
      prompt: "THE COMMITTEE HEARS A CONCERN. WHAT HAPPENS TO THE BILL?",
      choices: [
        { label: "ADD A PRACTICAL CHANGE", result: "The committee marks up the bill and approves the revised version. Your bill can move to the full chamber.", stamp: "CHANGED IN COMMITTEE", amend: true },
        { label: "KEEP THE ORIGINAL WORDING", result: "The committee approves the original version. Your bill can move to the full chamber.", stamp: "APPROVED BY COMMITTEE" },
        { label: "SET IT ASIDE", result: "The committee takes no further action. Most bills stop this way, without receiving a vote from the full chamber.", stamp: "STOPPED IN COMMITTEE", stop: true }
      ]
    },
    {
      id: "first-vote",
      place: "FIRST CHAMBER",
      title: "DEBATE AND VOTE",
      explanation: "Members debate the bill and may offer more changes. A simple majority must vote yes for it to pass.",
      prompt: "CALL THE VOTE.",
      choices: [
        { label: "PASS THE BILL", result: "A majority votes yes. The bill travels across the Capitol to the other chamber.", stamp: "PASSED FIRST CHAMBER" },
        { label: "REJECT THE BILL", result: "A majority does not support the bill. It stops in this chamber.", stamp: "FAILED FIRST CHAMBER", stop: true }
      ]
    },
    {
      id: "second-vote",
      place: "OTHER CHAMBER",
      title: "A SECOND PATH",
      explanation: "The other chamber sends the bill through its own committee, debate, and vote. It may pass the bill as written or approve a different version.",
      prompt: "WHAT VERSION DOES THE OTHER CHAMBER PASS?",
      choices: [
        { label: "THE SAME VERSION", result: "Both chambers have approved exactly the same words. The bill is ready for the president.", stamp: "BOTH CHAMBERS AGREE", agreement: true },
        { label: "A CHANGED VERSION", result: "The two versions do not match. Lawmakers must settle their differences before the bill can go to the president.", stamp: "CHAMBERS DISAGREE", conference: true }
      ]
    },
    {
      id: "conference",
      place: "CONFERENCE",
      title: "REACH ONE AGREEMENT",
      explanation: "House and Senate negotiators create one compromise. Both chambers must approve that exact version.",
      prompt: "CAN BOTH CHAMBERS ACCEPT THE COMPROMISE?",
      choices: [
        { label: "YES. APPROVE THE COMPROMISE.", result: "The House and Senate approve the identical compromise. The final bill is enrolled and sent to the president.", stamp: "COMPROMISE APPROVED" },
        { label: "NO. END THE NEGOTIATIONS.", result: "The chambers cannot agree on one version. The bill stops before reaching the president.", stamp: "NO AGREEMENT", stop: true }
      ]
    },
    {
      id: "president",
      place: "WHITE HOUSE",
      title: "THE PRESIDENT DECIDES",
      explanation: "The president can sign the bill or veto it. Congress can try to override a veto with a two-thirds vote in both chambers.",
      prompt: "WHAT SHOULD HAPPEN AT THE PRESIDENT’S DESK?",
      choices: [
        { label: "SIGN THE BILL", result: "The president signs it. Your proposal becomes a federal law.", stamp: "SIGNED INTO LAW", law: true },
        { label: "VETO THE BILL", result: "The president rejects the bill and explains the objections. Congress now decides whether to attempt an override.", stamp: "VETOED", veto: true }
      ]
    },
    {
      id: "override",
      place: "CONGRESS",
      title: "THE FINAL CHECK",
      explanation: "A veto does not always end the process. Two-thirds of the House and two-thirds of the Senate must vote to override it.",
      prompt: "DOES CONGRESS HAVE A TWO-THIRDS MAJORITY IN BOTH CHAMBERS?",
      choices: [
        { label: "YES. OVERRIDE THE VETO.", result: "Both chambers reach two-thirds. The bill becomes law without the president’s signature.", stamp: "VETO OVERRIDDEN", law: true },
        { label: "NO. THE VETO STANDS.", result: "Congress cannot reach two-thirds in both chambers. The bill does not become law.", stamp: "VETO SUSTAINED", stop: true }
      ]
    }
  ]
};
