import {FOIR_RULES} from "../data/foirRules";

export function calculateFOIR(income, existingEMI, proposedEMI) {
  if (income <= 0) return 0;

  return ((existingEMI + proposedEMI) / income) * 100;
}

export function getFOIRRules(borrowerType) {
  return FOIR_RULES[borrowerType];
}