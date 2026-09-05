import { useForm } from "react-hook-form";
import { calculateFOIR, getFOIRRules } from "../rules/foir";
import { getRateBand } from "../rules/rate";
import { getEligibilityVerdict } from "../rules/eligibility";
import { calculateEMI,getTenureOptionsByAge } from "../rules/emi";
import { getMaxAmount } from "../rules/amount";
import { calculateAPR } from "../rules/apr";
import { calculateProcessingFee } from "../data/loanFees";

export default function QuestionForm({ setResult }) {
 
  const {
    register,
    handleSubmit,
    watch,
    setError,

    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      loanPurpose: "",
      loanType: "",
      borrowerType: "",

      age: "",
      income: "",
      householdExpenses: "",
      existingEMI: "",
      loanAmount: "",
      incomeType:false,

      hasCreditScore: "",
      creditScore: null,

      recentBounce: false,
      emergencySavingsMonths: "",
      hasCollateral: false,
    },
  });

  const loanPurpose = watch("loanPurpose");
  const hasCreditScore = watch("hasCreditScore");
  const borrowerType = watch("borrowerType");
  const loanType = watch("loanType");

  function onSubmit(data) {
    const loanAmount = Math.max(0, Number(data.loanAmount));
    const income = Math.max(0, Number(data.income));
    const existingEMI = Math.max(0, Number(data.existingEMI));
    const age = Number(data.age);

    const creditScore =
      data.hasCreditScore === "true"
        ? Number(data.creditScore)
        : null;

    const recentBounce = data.recentBounce;
    const emergencySavingsMonths = data.emergencySavingsMonths === "" ? null : Number(data.emergencySavingsMonths);

    const hasCollateral = Boolean(data.hasCollateral);

    

    try {

      const loanAmount = Math.max(0, Number(data.loanAmount));
      const income =incomeType ?  Math.max(0, Number(data.income))/12 : Math.max(0, Number(data.income));
      const existingEMI = Math.max(0, Number(data.existingEMI));
      const householdExpenses = Math.max(
        0,
        Number(data.householdExpenses)
      );
      const age = Number(data.age);

      const borrowerType = data.borrowerType;
      const loanType = data.loanType;

      const creditScore = data.hasCreditScore === "true" ? Number(data.creditScore) : null;

      const recentBounce = Boolean(data.recentBounce);
      const hasCollateral = Boolean(data.hasCollateral);
      const emergencySavingsMonths = data.emergencySavingsMonths === "" || data.emergencySavingsMonths == null ? 0 : Number(data.emergencySavingsMonths);
      if ((loanType === "lap" || loanType === "homeloan" || loanType === "twoWheeler" || loanType === "gold") && !hasCollateral) {
        setError("hasCollateral", {
          type: "required",
          message: `Loan against ${loanType.toUpperCase()} requires collateral`,
        });
        return;
      }
      const foirRules = getFOIRRules(borrowerType);

      if (!foirRules) {
        throw new Error("Invalid borrower type.");
      }

      const lenderFOIRCap = foirRules.lender * 100;
      const safeFOIRCap = foirRules.safe * 100;


      const rateResult = getRateBand(loanType, creditScore, hasCollateral);

      const rateBand = rateResult.band;

      const lowPlanningRate = rateBand.low;
      const highPlanningRate = rateBand.high;

      const amountResult = getMaxAmount(income, existingEMI, highPlanningRate, 36, borrowerType);
      const requestedEMI = calculateEMI(loanAmount, highPlanningRate, 36);

      const requestedFOIR = calculateFOIR(income, existingEMI, requestedEMI);



      const safeEMICap = Math.max(0, income * foirRules.safe - existingEMI);

      const lenderEMICap = Math.max(0, income * foirRules.lender - existingEMI);

      const processingFee = calculateProcessingFee(loanAmount, loanType);

      const aprResultHigh = calculateAPR(loanAmount, highPlanningRate, 36, processingFee);
      const aprResultLow = calculateAPR(loanAmount, lowPlanningRate, 36, processingFee);


      const verdictResult = getEligibilityVerdict({ foir: requestedFOIR, creditScore, recentBounce, emergencySavingsMonths, foirCapSafe: safeFOIRCap});


      const stressIncome = income * 0.85;

      const stressFOIR = calculateFOIR(stressIncome, existingEMI, requestedEMI);

      const tenureOptionsByAge=getTenureOptionsByAge(age);

      const tenureOptions = tenureOptionsByAge.map((months) => {
        const emi = calculateEMI(loanAmount, highPlanningRate, months);

        return {
          months,
          emi: Math.round(emi),
          totalPayment: Math.round(emi * months),
          totalInterest: Math.round(
            emi * months - loanAmount
          ),
          withinSafeEMI: emi <= safeEMICap,
        };
      }
      );

      const result = {
        borrower: {
          age,
          borrowerType,
          income,
          householdExpenses,
          existingEMI,
          creditScore,
        },

        loan: {
          purpose: data.loanPurpose,
          type: loanType,
          requestedAmount: loanAmount,
        },

        affordability: {
          lenderFOIRCap: lenderFOIRCap.toFixed(2),
          safeFOIRCap: safeFOIRCap.toFixed(2),

          lenderEMICap: Math.round(lenderEMICap),
          safeEMICap: Math.round(safeEMICap),

          requestedEMI: Math.round(requestedEMI),
          requestedFOIR: Number(requestedFOIR.toFixed(2)),

          lenderLikelyAmount: amountResult.lenderLikelyAmount,

          borrowerSafeAmount: amountResult.borrowerSafeAmount,
          remainingAfterExpenses: Math.round(income - (householdExpenses + existingEMI + requestedEMI)),
        },

        rate: {
          low: rateBand.low,
          high: rateBand.high,
          planningRate: highPlanningRate,
          confidence: rateResult.confidence,
          reason: rateResult.reason,
        },

        apr: {
          low: Number(aprResultLow.apr),
          high: Number(aprResultHigh.apr),
          processingFee: Math.round(aprResultHigh.processingFee),
          gst: aprResultHigh.gst,
        },

        verdict: verdictResult,

        tenureOptions,

        stress: {
          incomeDropPercent: 15,
          stressIncome: Math.round(stressIncome),
          stressFOIR: Number(stressFOIR.toFixed(2)),
          safeFOIRCap: Math.round(safeFOIRCap),
        },

        explanation: {
          amount: amountResult.reason,

          emi:
            `Your safer monthly EMI ceiling is ₹${Math.round(
              safeEMICap
            ).toLocaleString("en-IN")} because existing EMIs are deducted from the ${safeFOIRCap}% safe FOIR limit.`,

          rate: rateResult.reason,

          stress:
            `If income falls by 15%, the requested EMI would use ${stressFOIR.toFixed(
              0
            )}% of monthly income.`,
        },
      };


      console.log("BORROWER COPILOT RESULT:", result);

      setResult(result);

    } catch (error) {
      console.error("Borrower Copilot calculation error:", error);
    }

  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      {/* LOAN PURPOSE */}
      <div className="form-field">
        <label>What do you need the loan for?</label>

        <div className="options">
          <label>
            <input
              type="radio"
              value="home"
              {...register("loanPurpose", {
                required: "Please select a purpose",
              })}
            />
            Home purchase or improvement
          </label>

          <label>
            <input
              type="radio"
              value="business"
              {...register("loanPurpose", {
                required: "Please select a purpose",
              })}
            />
            Business
          </label>

          <label>
            <input
              type="radio"
              value="vehicle"
              {...register("loanPurpose", {
                required: "Please select a purpose",
              })}
            />
            Vehicle
          </label>

          <label>
            <input
              type="radio"
              value="education"
              {...register("loanPurpose", {
                required: "Please select a purpose",
              })}
            />
            Education
          </label>

          <label>
            <input
              type="radio"
              value="medical"
              {...register("loanPurpose", {
                required: "Please select a purpose",
              })}
            />
            Medical expense
          </label>

          <label>
            <input
              type="radio"
              value="wedding"
              {...register("loanPurpose", {
                required: "Please select a purpose",
              })}
            />
            Wedding or family event
          </label>

          <label>
            <input
              type="radio"
              value="debt"
              {...register("loanPurpose", {
                required: "Please select a purpose",
              })}
            />
            Repay existing debt
          </label>

          <label>
            <input
              type="radio"
              value="other"
              {...register("loanPurpose", {
                required: "Please select a purpose",
              })}
            />
            Other
          </label>
        </div>

        {errors.loanPurpose && (
          <span className="error">{errors.loanPurpose.message}</span>
        )}
      </div>


      {/* LOAN TYPE */}
      <div className="form-field">
        <label>What type of loan are you considering?</label>

        <div className="options">
        {loanPurpose === "home" && (
          <label>
            <input
              type="radio"
              value="home"
              {...register("loanType", {
                required: "Please select a loan type",
              })}
            />
            Home loan
          </label>
        )}

        {loanPurpose === "business" && (
          <>
            <label>
              <input
                type="radio"
                value="business"
                {...register("loanType", {
                  required: "Please select a loan type",
                })}
              />
              Business loan
            </label>

            <label>
              <input
                type="radio"
                value="lap"
                {...register("loanType", {
                  required: "Please select a loan type",
                })}
              />
              Loan against property
            </label>
          </>
        )} 

        {loanPurpose === "vehicle" && (
          <label>
            <input
              type="radio"
              value="twoWheeler"
              {...register("loanType", {
                required: "Please select a loan type",
              })}
            />
            Two-wheeler loan
          </label>
        )}

        {(loanPurpose === "education" ||
          loanPurpose === "medical" ||
          loanPurpose === "wedding" ||
          loanPurpose === "debt") && (
          <label>
            <input
              type="radio"
              value="personal"
              {...register("loanType", {
                required: "Please select a loan type",
              })}
            />
            Personal loan
          </label>
        )}

        {loanPurpose === "other" && (
          <label>
            <input
              type="radio"
              value="personal"
              {...register("loanType", {
                required: "Please select a loan type",
              })}
              />
              Personal loan
            </label>
          )}  
        </div>

        {errors.loanType && (
          <span className="error">{errors.loanType.message}</span>
        )}
      </div>


      {/* LOAN AMOUNT */}
      <div className="form-field">
        <label>How much do you want to borrow?</label>

        <input
          type="number"
          {...register("loanAmount", {
            valueAsNumber: true,
            required: "Please enter the loan amount",
            min: {
              value: 1,
              message: "Loan amount must be greater than 0",
            },
          })}
        />

        {errors.loanAmount && (
          <span className="error">{errors.loanAmount.message}</span>
        )}
      </div>


      {/* INCOME */}
      <div className="form-field">
        <label>
          What is your  monthly/annual income ?
        </label>

        <label style={{fontSize:"0.7rem",opacity:0.8, display: "flex", alignItems: "center", gap: "0.3rem"}}>
          <input type="checkbox" {...register("incomeType")} />
          Check here if your income is annual
        </label>
        <input
          type="number"
          {...register("income", {
            valueAsNumber: true,
            required: "Please enter your income",
            min: {
              value: 1,
              message: "Income must be greater than 0",
            },
          })}
        />
        
        {errors.income && (
          <span className="error">{errors.income.message}</span>
        )}
      </div>


      {/* BORROWER TYPE */}
      <div className="form-field">
        <label>How do you earn your income?</label>

        <div className="options">
          <label>
            <input
              type="radio"
              value="salaried"
              {...register("borrowerType", {
                required: "Please select your income type",
              })}
            />
            Salaried
          </label>

          <label>
            <input
              type="radio"
              value="selfEmployed"
              {...register("borrowerType", {
                required: "Please select your income type",
              })}
            />
            Self-employed
          </label>

          <label>
            <input
              type="radio"
              value="informal"
              {...register("borrowerType", {
                required: "Please select your income type",
              })}
            />
            Informal / variable income
          </label>
        </div>

        {errors.borrowerType && (
          <span className="error">{errors.borrowerType.message}</span>
        )}
      </div>


      {/* HOUSEHOLD EXPENSES */}
      <div className="form-field">
        <label>
          How much do you spend on essential household expenses each month?
        </label>

        <input
          type="number"
          {...register("householdExpenses")}
        />
      </div>


      {/* EXISTING EMI */}
      <div className="form-field">
        <label>
          How much do you currently pay toward loans each month?
        </label>

        <input
          type="number"
          {...register("existingEMI")}
        />

        {errors.existingEMI && (
          <span className="error">{errors.existingEMI.message}</span>
        )}
      </div>


      {/* AGE */}
      <div className="form-field">
        <label>How old are you?</label>

        <input
          type="number"
          {...register("age", {
            valueAsNumber: true,
            required: "Please enter your age",
            min: {
              value: 18,
              message: "Age must be at least 18",
            },
            max: {
              value: 80,
              message: "Please enter a valid age",
            },
          })}
        />

        {errors.age && (
          <span className="error">{errors.age.message}</span>
        )}
      </div>


      {/* CREDIT SCORE */}
      <div className="form-field">
        <label>Do you know your credit score?</label>

        <div className="options">
          <label>
            <input
              type="radio"
              value="true"
              {...register("hasCreditScore", {
                required: "Please select an option",
              })}
            />
            Yes
          </label>

          <label>
            <input
              type="radio"
              value="false"
              {...register("hasCreditScore", {
                required: "Please select an option",
              })}
            />
            No
          </label>
        </div>

        {errors.hasCreditScore && (
          <span className="error">
            {errors.hasCreditScore.message}
          </span>
        )}

        {/* SHOW ONLY AFTER YES */}
        {hasCreditScore === "true" && (
          <div className="credit-score">
            <p>
              Credit score:{" "}
              <strong>{watch("creditScore") || 300}</strong>
            </p>

            <input
              type="range"
              min="300"
              max="900"
              step="1"
              defaultValue="750"
              {...register("creditScore", {
                valueAsNumber: true,
                required: "Please select your credit score",
              })}
            />

            {errors.creditScore && (
              <span className="error">
                {errors.creditScore.message}
              </span>
            )}
          </div>
        )}
      </div>


      {/* ADAPTIVE: EMERGENCY SAVINGS */}
      <div className="form-field">
        <label>
          How many months of essential expenses could your savings cover?
        </label>

        <input
          type="number"
          step="0.5"
          min="0"
          {...register("emergencySavingsMonths")}
        />
      </div>


      {/* ADAPTIVE: COLLATERAL */}
      {(loanType === "business" || loanType === "lap" || loanType === "homeloan" || loanType === "gold" || loanType === "twoWheeler") && (
        <div className="form-field">
          <label>
            Do you have property or another asset that could be used as
            collateral?
          </label>
          {errors.hasCollateral && (
            <span className="error">
              {errors.hasCollateral.message}
            </span>
          )}
          <div className="options">
            <label>
              <input
                type="checkbox"
                {...register("hasCollateral")}
              />
              Yes
            </label>
          </div>
        </div>
      )}


      {/* RECENT BOUNCE */}
      <div className="form-field">
        <label>
          Have you missed or bounced an EMI in the last few months?
        </label>

        <input
          type="checkbox"
          {...register("recentBounce")}
        />

        <span> Yes</span>
      </div>


      <button disabled={isSubmitting} type="submit">
        {isSubmitting ? "Calculating your eligibility..." : "Continue"}
      </button>
    </form>
  );
}