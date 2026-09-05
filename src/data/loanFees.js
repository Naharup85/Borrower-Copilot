export const PROCESSING_FEES = {
  home: {
    type: "percentage",
    value: 0.5,
  },

  lap: {
    type: "percentage",
    value: 1,
  },

  personal: {
    type: "percentage",
    value: 2,
  },

  business: {
    type: "percentage",
    value: 1.5,
  },

  twoWheeler: {
    type: "percentage",
    value: 2,
  },

  gold: {
    type: "percentage",
    value: 1,
  },
};
export function calculateProcessingFee(loanAmount, loanType) {
  const fee = PROCESSING_FEES[loanType];
  if (!fee){
    throw new Error("Invalid loan type");
  }

  return loanAmount * (fee.value / 100);
}