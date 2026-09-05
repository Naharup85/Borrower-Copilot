import { calculateEMI } from "./emi";

export const calculateAPR = (principal, annualRate, tenureMonths, processingFee) => {

    console.log("apr", principal, annualRate, tenureMonths, processingFee)
    const tenureInDays = tenureMonths * 30
    const emi = calculateEMI(principal, annualRate, tenureMonths)
    const totalPayment = emi * tenureMonths
    const totalInterset = totalPayment - principal
    const gstOnProcessingFee = processingFee * 0.18
    const totalFees = processingFee + gstOnProcessingFee
    const effectiveRate = ((totalInterset+totalFees)/principal)*(365/tenureInDays)*100;
    console.log("apr", effectiveRate);
    
    return {
        apr:effectiveRate.toFixed(2),
        gst:Math.round(gstOnProcessingFee),
        processingFee,
    }
}