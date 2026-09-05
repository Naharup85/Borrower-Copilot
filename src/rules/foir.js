const FOIR_RULES = {
  salaried: {
    lender: 0.55,
    safe: 0.40,
  },
  selfEmployed: {
    lender: 0.45,
    safe: 0.35,
  },
  informal: {
    lender: 0.35,
    safe: 0.25,
  },
};

export function calculateFOIR(income, existingEMI, proposedEMI) {
  if (income <= 0) return 0;

  return ((existingEMI + proposedEMI) / income) * 100;
}

export function getFOIRRules(borrowerType) {
  return FOIR_RULES[borrowerType];
}