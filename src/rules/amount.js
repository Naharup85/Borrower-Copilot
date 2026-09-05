import { getFOIRRules } from "./foir";

function emiToPrincipal(emi, annualRate, tenureMonths) {
  if (emi <= 0 || tenureMonths <= 0) {
    return 0;
  }
  if (annualRate === 0) {
    return emi * tenureMonths;
  }
  const monthlyRate = annualRate / 12 / 100;
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  return (emi * (factor - 1)) / (monthlyRate * factor);
}



export function getMaxAmount(income,existingEMI,annualRate,tenureMonths,borrowerType) {
  const rules = getFOIRRules(borrowerType);

  if(!rules){
    throw new Error("Invalid borrower type");
  }

  if (income <= 0 || existingEMI < 0 || annualRate <=0 || tenureMonths<=0) {
    throw new Error("Invalid loan calculation inputs");
  }
  
  const lenderMaxEMI = Math.max(0,income * rules.lender - existingEMI);
  const borrowerSafeEMI = Math.max(0,income * rules.safe - existingEMI);

  const lenderLikelyAmount = emiToPrincipal(lenderMaxEMI,annualRate,tenureMonths);
  const borrowerSafeAmount = emiToPrincipal(borrowerSafeEMI,annualRate,tenureMonths);


  return {
    lenderLikelyAmount: Math.round(lenderLikelyAmount),
    borrowerSafeAmount: Math.round(borrowerSafeAmount),
    lenderMaxEMI: Math.round(lenderMaxEMI),
    borrowerSafeEMI: Math.round(borrowerSafeEMI),
    reason:
      `A lender may sanction around ₹${Math.round(
        lenderLikelyAmount
      ).toLocaleString("en-IN")} based on a ${(rules.lender * 100).toFixed(
        0
      )}% FOIR limit. ` +
      `However, ₹${Math.round(
        borrowerSafeAmount
      ).toLocaleString("en-IN")} is the safer amount because it keeps total obligations within a ${(rules.safe * 100).toFixed(
        0
      )}% FOIR limit.`
  };
}