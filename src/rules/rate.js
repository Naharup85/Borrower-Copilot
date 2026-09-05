import {getBaseRateBand} from "../data/rateBand";
import {BASE_RATE_BANDS} from "../data/rateBand";

export function getRateBand(loanType, creditScore, hasCollateral) {

  
  if(loanType === "business" && hasCollateral) {
    
    return {
      band: { ...BASE_RATE_BANDS.lap },
      confidence: "medium",
      reason:
        "Usable collateral may allow the loan to be priced closer to a secured LAP product.",
    };
  }

  const baseBand=getBaseRateBand(loanType)

  const band = { ...baseBand };


  if(creditScore === null || creditScore === undefined) {
    band.high += 3;
    return {
      band,
      confidence: "low",
      reason:
        "Credit score is unknown, so the rate range is wider and the borrower should expect pricing closer to the higher end until the score is verified.",
    };
  }

  if(creditScore >= 750) {
    band.high =
      band.low + (band.high - band.low) * 0.4;
    return {
      band,
      confidence: "high",
      reason: `Credit score ${creditScore} is 750+, so the borrower is expected to qualify toward the lower end of the base range.`,
    };
  }

  if(creditScore >= 700) {
    band.high =
      band.low + (band.high - band.low) * 0.6;
    return {
      band,
      confidence: "medium",
      reason: `Credit score ${creditScore} is 700–749, so the borrower is expected to fall around the middle of the base range.`,
    };
  }


  if(creditScore < 650) {
    band.low += 2;
    band.high += 4;
    return {
      band,
      confidence: "medium",
      reason: `Credit score ${creditScore} is below 650, so pricing is adjusted upward to reflect higher credit risk.`,
    };
  }


  return {
    band,
    confidence: "medium",
    reason: `Credit score ${creditScore} is 650–699, so the base rate range is retained.`,
  };
}