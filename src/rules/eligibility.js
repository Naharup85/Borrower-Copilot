
export function getEligibilityVerdict(answers) {
  const {foir,creditScore,recentBounce,emergencySavingsMonths,foirCapSafe,} = answers;

  if(foir > 60) {
    return {
      verdict: "Don't borrow",
      reason: `Your existing and proposed obligations would use ${foir.toFixed(
        0
      )}% of your income. This leaves too little room for essential expenses and unexpected costs.`,
    };
  }


  if(recentBounce && foir > foirCapSafe) {
    return {
      verdict: "Don't borrow",
      reason:
        "A recent EMI bounce combined with high debt obligations indicates significant repayment stress. Taking additional debt may increase the risk of missing future payments.",
    };
  }

  if(emergencySavingsMonths !== null && emergencySavingsMonths < 1 && foir > 40) {
    return {
      verdict: "Borrow less",
      reason:
        "You have less than one month of emergency savings while your debt obligations are already high. Borrowing the full amount would leave very little financial cushion.",
    };
  }

  if(foir > foirCapSafe) {
    return {
      verdict: "Borrow less",
      reason: `The requested loan would push your obligations above your safe FOIR limit of ${foirCapSafe}%. A smaller loan would reduce the monthly repayment burden.`,
    };
  }

  if(creditScore !== null && creditScore < 650) {
    return {
      verdict: "Borrow",
      reason:
        "Your current debt burden is within the affordability limit, but your credit score may result in fewer loan options or a higher interest rate.",
    };
  }

  return {
    verdict: "Borrow",
    reason:
      "Your debt obligations remain within the safe affordability limit, and no major repayment-risk signal was identified from the information provided.",
  };
}