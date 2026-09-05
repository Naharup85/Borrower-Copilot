import { useForm } from "react-hook-form"
import { calculateFOIR ,getFOIRRules} from "../rules/foir"
import { getRateBand } from "../rules/rate";
import { getEligibilityVerdict } from "../rules/eligibility";
import { calculateEMI } from "../rules/emi";
import { getMaxAmount } from "../rules/amount";
import { calculateAPR } from "../rules/apr";
import {calculateProcessingFee} from "../data/loanFees";
export default function QuestionForm({setResult}) {


  const {
    register,
    handleSubmit,
    formState: {errors,isSubmitting,isSubmitSuccessful},
    watch
  } = useForm({
    defaultValues: {
      loanType: "",
      borrowerType: "",
      creditScore: null,
      recentBounce: false,
      emergencySavingsMonths: null,
      income: 0,
      loanAmount: 0,
      existingEMI: 0,
      tenureMonths: 12,
      hasCollateral: false,
    },
  })


  function onSubmit(data) {
    console.log("user data",data)
    const rate=getRateBand(data.loanType,data.creditScore,data.hasCollateral);
    const annualRate=rate.band.low;
    const amount=getMaxAmount(data.income,data.existingEMI,annualRate,data.tenureMonths,data.borrowerType);
    const requestedEMI=calculateEMI(data.loanAmount,annualRate,data.tenureMonths)
    const foir=calculateFOIR(data.income,data.existingEMI,requestedEMI);
    const foirCapSafe=getFOIRRules(data.borrowerType).safe*100; 
    const eligibility=getEligibilityVerdict({foir,creditScore: data.creditScore,recentBounce: data.recentBounce,emergencySavingsMonths: data.emergencySavingsMonths,foirCapSafe: foirCapSafe});
    const processingFee=calculateProcessingFee(data.loanAmount,data.loanType)
    const apr=calculateAPR(data.loanAmount,annualRate,data.tenureMonths,processingFee);
    const safeEMI=calculateEMI(amount.borrowerSafeAmount,annualRate,data.tenureMonths)

    setResult({
      rate:rate.band,
      apr,
      amount,
      foir,
      eligibility,
      foirCapSafe,
      requestedEMI,
      safeEMI,
    })


  }


  return(
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>Loan Type
        <input type="radio" value="home" {...register("loanType", {required: "Please select a loan type"})} />Home
        <input type="radio" value="lap" {...register("loanType", {required: "Please select a loan type"})} />LAP
        <input type="radio" value="gold" {...register("loanType", {required: "Please select a loan type"})} />Gold
        <input type="radio" value="personal" {...register("loanType", {required: "Please select a loan type"})} />Personal
        <input type="radio" value="business" {...register("loanType", {required: "Please select a loan type"})} />Business
        <input type="radio" value="twoWheeler" {...register("loanType", {required: "Please select a loan type"})} />Two Wheeler
        {errors.loanType && <span>{errors.loanType.message}</span>}
      </label>  
      <label>Borrower Type
        <input type="radio" value="salaried" {...register("borrowerType", {required: "Please select a borrower type"})} />Salaried
        <input type="radio" value="selfEmployed" {...register("borrowerType", {required: "Please select a borrower type"})} />Self Employed
        <input type="radio" value="informal" {...register("borrowerType", {required: "Please select a borrower type"})} />Informal
        {errors.borrowerType && <span>{errors.borrowerType.message}</span>}
      </label>
      <label>Credit Score
        <span className="credit-score-display">{watch("creditScore")}</span>
        <input type="range" min={300} max={900} step={1}  {...register("creditScore", {valueAsNumber:true, required: "Please enter a credit score"})} />
        {errors.creditScore && <span>{errors.creditScore.message}</span>}
      </label>
      <label>Recent Bounce
        <input type="checkbox" {...register("recentBounce")} />
        {errors.recentBounce && <span>{errors.recentBounce.message}</span>}
      </label>
      <label>Emergency Savings Months
        <span className="emergency-savings-months-display">{watch("emergencySavingsMonths")}</span>
        <input type="range" min={0} max={100} step={1} {...register("emergencySavingsMonths", {valueAsNumber: true,required: "Please enter the number of emergency savings months"})} />
        {errors.emergencySavingsMonths && <span>{errors.emergencySavingsMonths.message}</span>}
      </label>
      <label>Income
        <span className="income-display">{watch("income")}</span>
        <input type="range" min={0} max={1000000} step={1000} {...register("income", {valueAsNumber: true,required: "Please enter income"})} />        
        {errors.income && <span>{errors.income.message}</span>}
      </label>
      <label>Existing EMI
        <span className="existing-emi-display">{watch("existingEMI")}</span>
        <input type="range"   min={0} max={1000000} step={1000} {...register("existingEMI", {valueAsNumber: true,required: "Please enter existing EMI"})} />
        {errors.existingEMI && <span>{errors.existingEMI.message}</span>}
      </label>
      <label>Loan Amount Wanted
        <span className="loan-amount-display">{watch("loanAmount")}</span>
        <input type="range" min={1} max={1000000} step={1000} {...register("loanAmount", {valueAsNumber: true,required: "Please enter the loan amount"})} />
        {errors.loanAmount && <span>{errors.loanAmount.message}</span>}
    </label>
      <label>Tenure Months
        <span className="tenure-months-display">{watch("tenureMonths")}</span>
        <input type="range" min={1} max={100} step={1}  {...register("tenureMonths", {valueAsNumber: true,required: "Please enter tenure months"})} />
        {errors.tenureMonths && <span>{errors.tenureMonths.message}</span>}
      </label>
      <label>Has Collateral
        <input type="checkbox" {...register("hasCollateral")} />
        {errors.hasCollateral && <span>{errors.hasCollateral.message}</span>}
      </label>
      <button type="submit">Submit</button>
    </form>
  )
}
    