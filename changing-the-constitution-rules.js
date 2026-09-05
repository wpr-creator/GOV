const ARTICLE_V_RULES = Object.freeze({
  congressProposal(houseVotes, senateVotes) {
    return houseVotes >= 290 && senateVotes >= 67;
  },
  statesProposal(stateLegislatures) {
    return stateLegislatures >= 34;
  },
  ratification(states) {
    return states >= 38;
  },
  articlesAmendment(states, totalStates = 13) {
    return states === totalStates;
  }
});
if (typeof window !== "undefined") window.ARTICLE_V_RULES = ARTICLE_V_RULES;
if (typeof module !== "undefined") module.exports = ARTICLE_V_RULES;
