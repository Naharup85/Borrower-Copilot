export const calculateEMI = (principal, annualRate, tenureMonths) => {
    const monthlyRate = (annualRate / 12) / 100
    
    if (monthlyRate === 0) {
        return principal / tenureMonths;
    }

    return (principal * monthlyRate * ((1 + monthlyRate) ** tenureMonths)) / (((1 + monthlyRate) ** tenureMonths) - 1)
}

export function getTenureOptionsByAge(age) {
  if (age >= 65) return [12, 24, 36];
  if (age >= 60) return [24, 36, 48];
  if (age >= 50) return [24, 36, 48, 60];
  return [24, 36, 48, 60];
}