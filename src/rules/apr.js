import { calculateEMI } from "./emi";

const solveMonthlyIRR=(netDisbursed, emi, months) => {
  let r = 0.01;
  const tolerance = 1e-7;
  const maxIterations = 100;

  for (let i = 0; i < maxIterations; i++) {
    const factor = Math.pow(1 + r, -months);
    const annuityFactor = (1 - factor) / r;
    const npv = netDisbursed - emi * annuityFactor;
    const dAnnuity = (months * factor / (1 + r) * r - (1 - factor)) / (r * r);
    const dNpv = -emi * dAnnuity;
    const diff = npv / dNpv;
    r = r - diff;
    if (Math.abs(diff) < tolerance) {
      return r;
    }
  }

  return r;
};


export const calculateAPR = (principal, annualRate, tenureMonths, processingFee) => {

  if(principal<=0 || tenureMonths<=0){
    return {
      apr:"0.00",
      gst:0,
      processingFee:processingFee,
    }
  }

    const emi = calculateEMI(principal, annualRate, tenureMonths)
    const totalPayment = emi * tenureMonths
    const gstOnProcessingFee = processingFee * 0.18
    const totalFees = processingFee + gstOnProcessingFee

    const netDisbursed = principal-totalFees
    
    if(netDisbursed<=0){
      return{
        apr:"0.00",
        gst:Math.round(gstOnProcessingFee),
        processingFee:processingFee,
      }
    }
    const effectiveMonthlyRate=solveMonthlyIRR(principal-totalFees,emi,tenureMonths)
    const apr=effectiveMonthlyRate*12*100
    return {
        apr:apr.toFixed(2),
        gst:Math.round(gstOnProcessingFee),
        processingFee,
    }
}