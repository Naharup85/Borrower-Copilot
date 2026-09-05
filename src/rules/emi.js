export const calculateEMI = (principal, annualRate, tenureMonths) => {
    const monthlyRate = (annualRate / 12) / 100
    
    if (monthlyRate === 0) {
        return principal / tenureMonths;
    }

    return (principal * monthlyRate * ((1 + monthlyRate) ** tenureMonths)) / (((1 + monthlyRate) ** tenureMonths) - 1)
}
