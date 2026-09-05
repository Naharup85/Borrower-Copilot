export const calculateEMI = (principal, annualRate, tenureMonths) => {
    if (monthlyRate === 0) {
        return principal / tenureMonths;
    }
    const monthlyRate = (annualRate / 12) / 100

    return (principal * monthlyRate * ((1 + monthlyRate) ** tenureMonths)) / (((1 + monthlyRate) ** tenureMonths) - 1)
}
