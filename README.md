# Borrower Copilot

Borrower Copilot is a client-side financial planning tool that helps an Indian borrower answer four questions before approaching a lender:

1. **Should I borrow at all?**
2. **How much can I safely borrow?**
3. **What is a fair interest rate?**
4. **What EMI and tenure should I agree to?**

It also generates a **One-Page Negotiation Card** that summarizes the borrower's safe range, expected rate, EMI ceiling, and key negotiation points.

> **Important:** Borrower Copilot provides planning estimates, not lender approval or financial advice. Actual eligibility, pricing, fees, and approval depend on the lender's underwriting and documentation.

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

### 3. Open the application

```text
http://localhost:5173
```

---

## What Borrower Copilot Does

The application is designed around four borrower-facing outputs.

### Output 01 — Decision Verdict

The borrower receives one of three outcomes:

- **Borrow**
- **Borrow less**
- **Don't borrow**

The decision considers factors such as:

- Existing EMI obligations
- Proposed EMI
- Safe FOIR threshold
- Overall debt burden
- Recent EMI bounce
- Emergency savings
- Credit score

The goal is not to maximize the amount a lender might approve. The goal is to identify what the borrower can reasonably carry.

---

### Output 02 — Maximum Borrowing Capacity

Borrower Copilot deliberately separates two numbers.

#### Lender Likely Sanction

An estimate based on the lender-oriented FOIR ceiling.

#### Borrower Safe Capacity

A more conservative estimate based on the borrower's safe FOIR ceiling.

The application recommends using the **Borrower Safe Capacity**, rather than treating the lender's likely sanction as the amount the borrower should take.

---

### Output 03 — Fair Rate & All-in APR

The application provides:

- Fair interest-rate band
- Rate confidence
- Processing fee
- GST on processing fee
- All-in APR estimate

The APR calculation considers the reduction in the amount received because of upfront processing charges and annualizes the resulting borrowing cost.

The application distinguishes between:

**Interest rate**

The stated borrowing rate.

**All-in APR**

The estimated annualized borrowing cost after considering upfront fees.

> The displayed APR is a planning estimate and is not presented as an official regulator-generated figure.

---

### Output 04 — EMI Ceiling & Stress Test

Borrower Copilot calculates:

- Safe monthly EMI ceiling
- Current requested EMI
- Requested FOIR
- Lender EMI capacity
- Safe EMI capacity
- 24/36/48/60-month tenure comparison
- Total interest across tenures
- Income stress scenario

The stress test models a **15% reduction in monthly income** and shows how the proposed EMI affects FOIR after the income shock.

---

## Negotiation Card

After the four outputs, the application generates a compact **Negotiation Card**.

The card summarizes:

- Requested loan amount
- Borrower-safe amount
- Fair interest-rate range
- All-in APR
- Safe EMI ceiling
- Suggested tenure
- Income
- Existing EMI
- Safe FOIR
- Credit-score status
- A lender negotiation statement

For a borrower receiving a **Don't borrow** result, the card changes the guidance from negotiating a new loan to discussing ways to reduce or restructure existing debt before taking additional borrowing.

---

## Question Design

The application asks for information that can materially affect the borrowing assessment.

Core information includes:

- Loan purpose
- Loan amount
- Loan type
- Net monthly income
- Income type
- Existing EMI
- Household expenses
- Age
- Credit score, if known

Additional information can affect the assessment, including:

- Collateral availability
- Recent EMI bounce
- Emergency savings

Unknown information is not automatically treated as zero.

For example, an unknown credit score results in a wider rate range and lower confidence instead of assuming a good score.

---

## Affordability Model

Borrower Copilot uses FOIR-style affordability calculations.

| Borrower Type | Lender FOIR | Safe FOIR |
|---|---:|---:|
| Salaried | 55% | 40% |
| Self-employed | 45% | 35% |
| Informal / Gig | 35% | 25% |

The proposed EMI is evaluated together with existing EMI obligations.

Household expenses are considered separately as a cash-flow measure rather than being silently subtracted from the FOIR calculation.

This keeps two concepts separate:

**FOIR**

Debt obligations relative to monthly income.

**Cash-flow surplus**

Income remaining after household expenses and existing EMI.

---

## Rate Model

The application starts with product-level benchmark rate bands and adjusts them based on available borrower information.

Credit-score handling:

| Credit Information | Treatment |
|---|---|
| Unknown | Wider range and LOW confidence |
| 750+ | Lower portion of base range |
| 700–749 | Competitive middle portion |
| 650–699 | Base range |
| Below 650 | Higher pricing range |

The detailed values and assumptions are documented in [`RULES.md`](./RULES.md).

The displayed rate is a **planning benchmark**, not a guaranteed lender offer.

---

## APR Calculation

The application estimates the all-in borrowing cost using:

1. Loan amount
2. Interest rate
3. Processing fee
4. GST on processing fee
5. Monthly EMI cash flows
6. Effective annualization of the resulting monthly rate

The application displays this as:

```text
All-in APR (Including Fees)
```

rather than presenting it as an official lender or regulator-generated APR.

---

## Three Run-Through Profiles

### 1. Priya — Salaried Borrower

**Profile**

- Age: 29
- Income: ₹1,10,000/month
- Existing EMI: ₹14,000/month
- Credit score: 780
- Borrower type: Salaried

**Request**

- Personal loan
- ₹8,00,000
- Wedding purpose

**Expected behavior**

Priya has a relatively strong credit profile and moderate existing obligations.

The application should show:

- Competitive rate range
- High rate confidence
- Safe EMI capacity
- Borrower-safe amount separately from lender capacity
- Negotiation guidance based on her credit profile

---

### 2. Ravi — Self-Employed Borrower

**Profile**

- Age: 42
- Income: approximately ₹60,000/month
- Borrower type: Self-employed
- Credit score: Unknown
- Collateral: Available

**Request**

- Business-related borrowing
- ₹15,00,000

**Expected behavior**

The application should recognize that:

- Self-employed borrowers use a more conservative FOIR threshold.
- Unknown credit information reduces rate confidence.
- Collateral can materially affect the appropriate secured-lending route and pricing assumptions.

Collateral does not guarantee approval.

---

### 3. Anita — High-Risk Borrower

**Profile**

- Age: 35
- Income: ₹28,000/month
- Borrower type: Informal
- Existing EMI: ₹35,000/month
- Recent EMI bounce: Yes

**Request**

- Two-wheeler loan
- ₹1,50,000

**Expected behavior**

This scenario demonstrates that:

> **"Don't borrow" is a real outcome.**

Anita already has debt obligations that are extremely high relative to income.

The application should prioritize repayment stability rather than encouraging additional borrowing.

The Negotiation Card should provide alternative guidance instead of simply encouraging her to negotiate another loan.

---

## Privacy

Borrower Copilot is designed as a client-side application.

There is:

- No login
- No backend requirement
- No lender account connection
- No bureau pull
- No requirement to store personal financial information

The calculations are performed locally in the browser.

---

## Documentation

Detailed financial rules and assumptions are documented separately:

**[`RULES.md`](./RULES.md)**

This includes:

- FOIR thresholds
- Rate bands
- Credit-score adjustments
- Processing fees
- GST assumption
- APR methodology
- Borrowing-capacity calculations
- Verdict rules
- Stress-test assumptions
- Tenure assumptions

Each rule identifies whether it is based on an external reference or is explicitly a product/design judgment.

---

## Limitations

Borrower Copilot is a planning tool and does not replace lender underwriting.

The results do not account for every factor a lender may consider, including:

- Employer-specific underwriting
- Detailed bank-statement analysis
- Income verification
- Existing undisclosed liabilities
- Property valuation
- Collateral legal checks
- Lender-specific credit policies
- Exact lender fees
- Insurance or other loan-specific charges
- Final KYC/documentation requirements

Rate bands and affordability thresholds are therefore **indicative assumptions**, not guaranteed market offers.

---

## Tech Stack

- React
- JavaScript
- Vite
- Client-side calculations
- CSS

The application is intentionally lightweight and does not require a backend.

---

## Project Structure

```text
src/
├── components/
│   ├── QuestionForm.jsx
│   ├── ResultPanel.jsx
│   └── NegotiationCard.jsx
│
├── data/
│   ├── rateBand.js
│   └── loanFees.js
│
└── rules/
    ├── amount.js
    ├── apr.js
    ├── eligibility.js
    ├── emi.js
    ├── foir.js
    └── rate.js

RULES.md
README.md
```

---

## Design Principle

Borrower Copilot is intentionally designed around one principle:

> **A lender's maximum approval is not the same thing as a borrower's safe capacity.**

The product therefore prioritizes:

**Understand → Calculate → Stress-test → Negotiate**

rather than simply answering:

**"How much loan can I get?"**
