import { useForm } from "react-hook-form";
import { calculateFOIR, getFOIRRules } from "../rules/foir";
import { getRateBand } from "../rules/rate";
import { getEligibilityVerdict } from "../rules/eligibility";
import { calculateEMI } from "../rules/emi";
import { getMaxAmount } from "../rules/amount";
import { calculateAPR } from "../rules/apr";
import { calculateProcessingFee } from "../data/loanFees";

export default function QuestionForm({ setResult }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
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

      hasCreditScore: "",
      creditScore: null,

      recentBounce: false,
      emergencySavingsMonths: "",
      hasCollateral: false,
    },
  });

  const hasCreditScore = watch("hasCreditScore");
  const borrowerType = watch("borrowerType");
  const loanType = watch("loanType");

  function onSubmit(data) {
    console.log("Form data:", data);

    const loanAmount = Math.max(0, Number(data.loanAmount));
    const income = Math.max(0, Number(data.income));
    const existingEMI = Math.max(0, Number(data.existingEMI));
    const age = Number(data.age);

    const creditScore =
      data.hasCreditScore === "true"
        ? Number(data.creditScore)
        : null;

    const recentBounce = data.recentBounce;
    const emergencySavingsMonths =
      data.emergencySavingsMonths === ""
        ? null
        : Number(data.emergencySavingsMonths);

    const hasCollateral = data.hasCollateral;

    console.log({
      loanAmount,
      income,
      existingEMI,
      age,
      creditScore,
      recentBounce,
      emergencySavingsMonths,
      hasCollateral,
      loanType: data.loanType,
      borrowerType: data.borrowerType,
      loanPurpose: data.loanPurpose,
      householdExpenses: Number(data.householdExpenses),
    });

    // We will connect your rules here after the form works correctly.
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

          <label>
            <input
              type="radio"
              value="gold"
              {...register("loanType", {
                required: "Please select a loan type",
              })}
            />
            Gold loan
          </label>

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
              value="twoWheeler"
              {...register("loanType", {
                required: "Please select a loan type",
              })}
            />
            Two-wheeler loan
          </label>
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
          What is your typical monthly income after taxes and deductions?
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
          {...register("householdExpenses", {
            valueAsNumber: true,
            required: "Please enter your household expenses",
            min: {
              value: 0,
              message: "Expenses cannot be negative",
            },
          })}
        />

        {errors.householdExpenses && (
          <span className="error">
            {errors.householdExpenses.message}
          </span>
        )}
      </div>


      {/* EXISTING EMI */}
      <div className="form-field">
        <label>
          How much do you currently pay toward loans each month?
        </label>

        <input
          type="number"
          {...register("existingEMI", {
            valueAsNumber: true,
            required: "Please enter your existing EMI",
            min: {
              value: 0,
              message: "Existing EMI cannot be negative",
            },
          })}
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
          {...register("emergencySavingsMonths", {
            valueAsNumber: true,
            required: "Please enter your emergency savings",
            min: {
              value: 0,
              message: "Savings months cannot be negative",
            },
          })}
        />
      </div>


      {/* ADAPTIVE: COLLATERAL */}
      {(loanType === "business" || loanType === "lap") && (
        <div className="form-field">
          <label>
            Do you have property or another asset that could be used as
            collateral?
          </label>

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


      <button type="submit">
        Continue
      </button>
    </form>
  );
}