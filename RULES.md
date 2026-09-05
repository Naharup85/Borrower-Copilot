# Borrower Copilot — Underwriting Rules & Assumptions

This document records the financial rules, thresholds, rate bands, fees, affordability calculations, verdict logic, and stress-test assumptions used by Borrower Copilot.

Each rule follows:

**What · Value · Why · Source / Judgement**

> **Important:** These are planning assumptions for the challenge, not lender underwriting policies or guaranteed loan terms.

---

## 1. Affordability & FOIR

FOIR means **Fixed Obligation to Income Ratio**.

Borrower Copilot uses net monthly income as the denominator and considers existing EMI plus proposed EMI as fixed debt obligations.

| What | Value | Why | Source / Judgement |
|---|---:|---|---|
| Salaried — Lender FOIR Cap | 55% | Represents a higher lender-oriented affordability ceiling for relatively stable salaried income. | My judgement / challenge assumption |
| Salaried — Borrower Safe FOIR Cap | 40% | Provides a larger buffer for household spending, savings, and unexpected expenses. | My judgement |
| Self-employed — Lender FOIR Cap | 45% | Uses a more conservative lender ceiling because business income can fluctuate. | My judgement / challenge assumption |
| Self-employed — Borrower Safe FOIR Cap | 35% | Provides additional room for seasonal business or cash-flow volatility. | My judgement |
| Informal / Gig — Lender FOIR Cap | 35% | Uses a lower ceiling because income can be less predictable. | My judgement / challenge assumption |
| Informal / Gig — Borrower Safe FOIR Cap | 25% | Creates a larger repayment buffer for volatile income. | My judgement |

### FOIR calculation

```text
FOIR = (Existing EMI + Proposed EMI) / Net Monthly Income × 100
```

The proposed EMI is calculated using the planning interest rate and selected tenure.

---

## 2. Household Expenses

Household expenses are **not subtracted from the FOIR formula**.

Instead, Borrower Copilot keeps household cash flow as a separate affordability signal.

```text
Cash remaining before proposed EMI
= Income - Household Expenses - Existing EMI
```

| What | Value | Why | Source / Judgement |
|---|---:|---|---|
| Household expense treatment | Separate cash-flow check | Prevents mixing living expenses into a debt-ratio calculation while still showing how much income remains before the new EMI. | My judgement |

The displayed surplus should therefore be described as:

> **Cash remaining after household expenses and existing EMI, before proposed EMI.**

---

## 3. Base Interest Rate Bands

The application uses the following planning bands.

| Loan Product | Low | High | Source / Judgement |
|---|---:|---:|---|
| Home Loan | 8.0% | 11.0% | Planning assumption |
| Loan Against Property (LAP) | 9.0% | 13.0% | Planning assumption |
| Gold Loan | 9.0% | 15.0% | Planning assumption |
| Personal Loan | 10.5% | 16.0% | Planning assumption |
| Business Loan | 14.0% | 20.0% | Planning assumption |
| Two-Wheeler Loan | 11.0% | 18.0% | Planning assumption |

These are benchmark ranges used by the application for planning. They are not guaranteed lender offers.

---

## 4. Credit Score Adjustments

Credit score affects both the displayed rate range and confidence.

### Unknown credit score

```text
Upper end of base range + 3 percentage points
Confidence = LOW
```

**Why:** An unknown bureau profile provides less evidence for precise pricing, so the application widens the range rather than assuming a good score.

**Source:** Product rule — "Unknown is never zero."

---

### Credit score 750+

```text
Upper end = lower end + 40% of the original spread
Confidence = HIGH
```

**Why:** A strong credit profile is treated as having greater negotiating leverage and a higher likelihood of competitive pricing.

**Source:** Planning assumption.

---

### Credit score 700–749

```text
Upper end = lower end + 60% of the original spread
Confidence = MEDIUM
```

**Why:** A good but not top-tier score is treated as supporting competitive pricing without assuming the best available rate.

**Source:** Planning assumption.

---

### Credit score 650–699

```text
Base range remains unchanged
Confidence = MEDIUM
```

**Why:** The application treats this as a middle-risk range without making an additional pricing adjustment.

**Source:** Planning assumption.

---

### Credit score below 650

```text
Low end + 2 percentage points
High end + 4 percentage points
Confidence = MEDIUM
```

**Why:** A weaker credit profile is treated as higher pricing risk.

**Source:** Planning assumption.

---

## 5. Collateral & Secured Lending

Collateral can materially change the risk profile of a loan.

For a business borrowing scenario with collateral, the application can use a secured/LAP-style pricing assumption.

```text
Business + collateral
→ LAP-style secured pricing assumption
```

The current pricing rule uses the LAP base band:

```text
9.0% – 13.0%
```

**Why:** Secured property-backed lending can be priced differently from unsecured business borrowing.

**Source / Judgement:** Product design assumption.

> Collateral availability does not guarantee approval. Property valuation, title checks, LTV, documentation, and lender policy would still apply in a real application.

---

## 6. Loan Against Property Collateral Requirement

A genuine LAP product requires acceptable property collateral.

Therefore:

```text
LAP + no collateral
→ should not be presented as a normal secured LAP approval
```

The UI should either:

- ask for collateral,
- prevent an invalid LAP route,
- or clearly explain that the borrower needs an alternative unsecured product.

**Why:** The product should not imply that a borrower can receive a property-backed loan without property collateral.

**Source / Judgement:** Product/domain integrity rule.

---

## 7. Processing Fees

The current application uses these processing-fee assumptions:

| Loan Product | Processing Fee |
|---|---:|
| Home Loan | 0.5% |
| LAP | 1.0% |
| Personal Loan | 2.0% |
| Business Loan | 1.5% |
| Two-Wheeler Loan | 2.0% |
| Gold Loan | 1.0% |

Calculation:

```text
Processing Fee = Loan Amount × Fee Percentage
```

**Source / Judgement:** Planning assumptions in `src/data/loanFees.js`.

> These percentages are benchmark assumptions for the application. Actual lender fees can differ and may include minimums, maximums, documentation charges, valuation charges, insurance, or other costs.

---

## 8. GST on Processing Fee

The application applies:

```text
GST = Processing Fee × 18%
```

The GST is added to the upfront cost used in the all-in APR calculation.

**Why:** The application models tax on the processing charge as part of the borrower's upfront borrowing cost.

**Source / Judgement:** Application assumption.

---

## 9. All-in APR

Borrower Copilot estimates the effective annualized borrowing cost by accounting for upfront processing charges and GST.

Conceptually:

```text
Net amount received
= Loan Amount - Processing Fee - GST
```

The borrower then receives the loan amount through the EMI stream.

The application calculates the monthly internal rate of return that equates:

```text
Net amount received
```

with

```text
Future monthly EMI payments
```

and annualizes that monthly rate.

```text
APR ≈ Monthly IRR × 12 × 100
```

The result is shown as:

```text
All-in APR (Including Fees)
```

**Why:** A borrower can pay more than the stated interest rate because upfront charges reduce the amount actually received.

**Source / Judgement:** Planning methodology inspired by all-in cost / APR disclosure principles.

> This is an application estimate and should not be represented as an official regulator-generated APR.

---

## 10. Loan Amount / Capacity

Borrower Copilot calculates two different capacity numbers.

### Lender Likely Amount

First calculate the maximum EMI allowed by the lender-oriented FOIR limit:

```text
Lender EMI Capacity
= Income × Lender FOIR - Existing EMI
```

Then convert that EMI capacity into principal using the EMI formula.

---

### Borrower Safe Amount

The safer EMI capacity is:

```text
Safe EMI Capacity
= Income × Safe FOIR - Existing EMI
```

That EMI capacity is then converted into principal.

---

### Capacity Principle

| What | Value | Why |
|---|---|---|
| Lender Likely Amount | Higher lender-oriented capacity | Shows what a generic lender-style affordability calculation might permit. |
| Borrower Safe Amount | Conservative safe capacity | Shows what the borrower should prefer to carry. |

The application should explicitly recommend:

> **Use the Borrower Safe Amount, not the maximum lender sanction.**

---

## 11. EMI Calculation

Borrower Copilot uses the standard reducing-balance EMI formula.

```text
EMI =
P × r × (1 + r)^n
------------------
     (1 + r)^n - 1
```

Where:

- `P` = principal
- `r` = monthly interest rate
- `n` = number of months

Monthly rate:

```text
r = Annual Rate / 12 / 100
```

If the rate is zero:

```text
EMI = Principal / Tenure
```

---

## 12. Planning Rate

For conservative affordability calculations, the application uses the **upper end of the applicable rate band**.

```text
Planning Rate = Rate Band High
```

**Why:** Using the higher planning rate avoids making affordability look better than it may be if the borrower receives pricing toward the expensive end of the estimated range.

**Source / Judgement:** Product safety rule.

---

## 13. Verdict Rules

The application can return:

- **Borrow**
- **Borrow less**
- **Don't borrow**

Rules are evaluated using the requested loan's proposed EMI and FOIR.

### Rule 1 — Excessive Debt Burden

```text
Requested FOIR > 60%
→ Don't borrow
```

**Why:** Debt obligations above this level leave limited income for household needs and financial shocks.

**Source / Judgement:** Product safety threshold.

---

### Rule 2 — Recent EMI Bounce + High Leverage

```text
Recent EMI bounce = true
AND
Requested FOIR > Safe FOIR
→ Don't borrow
```

**Why:** A recent missed/bounced EMI combined with above-safe leverage is a strong repayment-stress signal.

**Source / Judgement:** Product safety rule.

---

### Rule 3 — Low Emergency Savings + Moderate Leverage

```text
Emergency savings < 1 month
AND
Requested FOIR > 40%
→ Borrow less
```

**Why:** A borrower with little emergency liquidity has less ability to absorb an income or expense shock.

**Source / Judgement:** Product safety rule.

---

### Rule 4 — Above Safe FOIR

```text
Requested FOIR > Safe FOIR
→ Borrow less
```

**Why:** The requested borrowing exceeds the application's conservative repayment capacity.

**Source / Judgement:** Core affordability rule.

---

### Rule 5 — Lower Credit Score but Affordable Debt

```text
Credit score < 650
AND
Requested FOIR <= Safe FOIR
→ Borrow
```

The application does not automatically reject an affordable loan solely because of a lower credit score.

Instead, the borrower receives a pricing warning.

**Why:** Credit score affects expected pricing and lender eligibility, but affordability and credit risk are separate dimensions.

**Source / Judgement:** Product design decision.

---

### Rule 6 — Healthy Profile

```text
Requested FOIR <= Safe FOIR
AND
No major repayment-risk signal
→ Borrow
```

**Why:** The requested obligation remains within the application's conservative affordability threshold.

**Source / Judgement:** Product decision rule.

---

## 14. Emergency Savings

Emergency savings are represented in months of expenses/income buffer.

The application currently uses:

```text
< 1 month
```

as the depleted-savings threshold in the verdict logic.

**Why:** Limited liquidity makes repayment more vulnerable to short-term income or expense shocks.

**Source / Judgement:** Product safety assumption.

---

## 15. Income Stress Test

The application models a:

```text
15% income reduction
```

Stress income:

```text
Stress Income = Normal Income × 0.85
```

Stress FOIR:

```text
Stress FOIR
= (Existing EMI + Proposed EMI) / Stress Income × 100
```

**Why:** The stress scenario tests whether a proposed EMI remains manageable if income temporarily falls.

**Source / Judgement:** Product stress-testing assumption.

---

## 16. Tenure Trade-Off

The application compares:

```text
24 months
36 months
48 months
60 months
```

For each tenure it displays:

- EMI
- Total payment
- Total interest
- Whether EMI is within the safe EMI ceiling

The EMI is recalculated for each tenure using the planning rate.

### Interpretation

Shorter tenure:

- Higher monthly EMI
- Lower total interest

Longer tenure:

- Lower monthly EMI
- Higher total interest

The application should not automatically recommend the longest tenure simply because it produces the lowest EMI.

---

## 17. Suggested Tenure

The Negotiation Card selects the first available tenure that is within the safe EMI ceiling.

If none is within the safe ceiling, the card falls back to the configured default option.

**Why:** The borrower should first look for a tenure that keeps the monthly obligation within the safe repayment ceiling.

**Source / Judgement:** Product design rule.

---

## 18. Explainability

Every major financial output should include a short explanation.

The application explains:

- Why the safe amount is different from lender capacity
- Why the EMI ceiling exists
- Why the rate range changed
- Why credit-score uncertainty affects confidence
- What happens under income stress
- Why a borrower received Borrow / Borrow less / Don't borrow

The purpose is to make the calculation auditable rather than presenting unexplained numbers.

---

## 19. Unknown Values

Unknown values must not silently become favorable assumptions.

Examples:

```text
Unknown credit score
→ wider rate range + lower confidence
```

Unknown information should either:

- reduce confidence,
- widen the estimate,
- trigger an additional question,
- or clearly appear as unknown.

**Why:** Silence should not be interpreted as zero risk.

**Source:** Core Borrower Copilot design principle.

---

## 20. Limitations

These rules are intentionally simplified.

Real lender underwriting can also consider:

- Credit bureau history
- Employer and employment stability
- Banking transactions
- ITR/GST records
- Debt obligations not disclosed by the borrower
- Property valuation
- Loan-to-value limits
- Collateral title quality
- Geography
- Lender-specific policy
- Loan purpose
- Documentation
- Insurance and other charges

Therefore, Borrower Copilot outputs are **planning estimates**, not approval decisions.

---

## 21. Rule Ownership

The application deliberately distinguishes between external concepts and product judgments.

### External / Industry Concepts

Examples:

- FOIR as an affordability concept
- EMI amortization
- Processing fees affecting effective borrowing cost
- GST on applicable service charges
- APR/all-in cost methodology

### Product Judgements

Examples:

- 40% safe FOIR for salaried borrowers
- 35% safe FOIR for self-employed borrowers
- 25% safe FOIR for informal/gig borrowers
- 15% income stress
- 60% hard-stop FOIR
- Credit-score adjustment percentages
- Exact benchmark rate bands
- Suggested-tenure selection

These judgments are explicitly documented so the borrower and evaluator can distinguish application logic from lender policy.

---

## Core Principle

Borrower Copilot is designed around one central distinction:

> **A lender's maximum approval is not necessarily a borrower's safe capacity.**

The application therefore follows:

```text
Understand
    ↓
Calculate
    ↓
Compare
    ↓
Stress-test
    ↓
Negotiate
```

rather than simply answering:

```text
"How much loan can I get?"
```
