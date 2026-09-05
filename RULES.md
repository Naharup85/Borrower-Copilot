# Borrower Copilot — Underwriting Rules & Assumptions

This document outlines every financial threshold, interest rate band, fee calculation, affordability limit, and decision heuristic implemented in **Borrower Copilot**, formatted as required by the Lokta Build Challenge:
`what · value · why · source or "my judgement"`

---

## 1. Affordability & FOIR (Fixed Obligation to Income Ratio)

| What | Value | Why | Source / Judgement |
| :--- | :--- | :--- | :--- |
| **Salaried — Lender FOIR Cap** | 55% of net monthly income | Standard tier-1 bank/NBFC underwriting ceiling for salaried employees with steady payroll credits. | Industry standard (HDFC / Bajaj Finserv / SBI norms) |
| **Salaried — Borrower Safe FOIR Cap** | 40% of net monthly income | Leaves at least 60% for non-discretionary rent, food, medical care, and savings. Prevents living paycheck-to-paycheck. | Financial planning best practice / My judgement |
| **Self-Employed — Lender FOIR Cap** | 45% of net monthly income | Business cash flows fluctuate; institutional lenders haircut maximum leverage to cushion working capital troughs. | NBFC MSME lending guidelines |
| **Self-Employed — Borrower Safe FOIR Cap** | 35% of net monthly income | Buffer against seasonal dips, delayed debtor receivables, and inventory cycles. | My judgement based on MSME risk profiles |
| **Informal / Gig Worker — Lender FOIR Cap** | 35% of net monthly income | Unstructured earnings, lack of formal ITR/GST trails, and higher earnings volatility. | Microfinance & digital lender standard |
| **Informal / Gig Worker — Borrower Safe FOIR Cap** | 25% of net monthly income | Essential buffer to ensure day-to-day household stability without falling into predatory micro-debt traps. | My judgement |

---

## 2. Base Interest Rate Bands (by Loan Product)

| What | Value | Why | Source / Judgement |
| :--- | :--- | :--- | :--- |
| **Home Loan** | 8.50% – 9.50% p.a. | High-quality immovable collateral, long tenure, lowest historical default rate. | Current RBI Repo-linked retail benchmark (2025–2026) |
| **Loan Against Property (LAP)** | 9.50% – 11.00% p.a. | Secured by real estate, but general-purpose usage carries slightly higher risk than residential purchase. | Market prevailing rates (Bajaj / Tata Capital) |
| **Personal Loan** | 10.50% – 16.00% p.a. | Completely unsecured; pricing reflects credit score and employer category. | Prime bank rates to NBFC market rates |
| **Gold Loan** | 9.00% – 12.00% p.a. | Highly liquid collateral with standardized LTV ratios regulated by RBI. | Muthoot / Manappuram / PSU Bank benchmark |
| **Business Loan (Unsecured)** | 12.00% – 18.00% p.a. | Higher default risk on cash-flow-based commercial lending without registered mortgage. | Fintech & NBFC MSME pricing |
| **Two-Wheeler Loan** | 12.00% – 16.00% p.a. | Rapid asset depreciation and higher default frequencies on small vehicle loans. | Hero FinCorp / TVS Credit norms |

---

## 3. Rate Adjustments & Credit Score Mechanics

| What | Value | Why | Source / Judgement |
| :--- | :--- | :--- | :--- |
| **Credit Score: Unknown / Unscored** | High end +3.00% p.a., confidence = `LOW` | Lack of bureau record requires conservative pricing until KYC and banking trails are assessed. | Lokta Rule: "Unknown is never zero; widen confidence with silence." |
| **Credit Score: 750+ (Prime)** | Upper band tightened to lower 40% of base spread, confidence = `HIGH` | Strong credit history warrants best-in-class risk tier with strong negotiating leverage. | CIBIL/Experian prime underwriting tier |
| **Credit Score: 700–749 (Good)** | Upper band tightened to lower 60% of base spread, confidence = `MEDIUM` | Acceptable bureau history qualifies for competitive institutional offers. | Standard retail risk cut-off |
| **Credit Score: 650–699 (Fair)** | Base range preserved unchanged, confidence = `MEDIUM` | Average risk tier; standard published card rates apply. | General retail credit guidelines |
| **Credit Score: < 650 (Sub-prime)** | Base band shifted +2.00% (low) to +4.00% (high), confidence = `MEDIUM` | Elevated risk of delinquency; NBFCs load risk premium. | Subprime lending risk premium |
| **Collateral on Business Loan** | Re-routes pricing to LAP rates (9.50% – 11.00%) | Pledging unencumbered immovable property converts unsecured business risk into secured lending. | Asset-backed lending switch / My judgement |

---

## 4. Loan Fees & All-in APR (Annual Percentage Rate)

| What | Value | Why | Source / Judgement |
| :--- | :--- | :--- | :--- |
| **Home Loan Processing Fee** | 0.50% (Min ₹3,000, Max ₹15,000) | Covers legal scrutiny, technical property valuation, and title verification. | RBI Fair Lending Practice disclosures |
| **LAP Processing Fee** | 1.00% (Min ₹5,000, Max ₹25,000) | Comprehensive property search report and physical inspection costs. | Commercial lender tariff sheets |
| **Personal Loan Processing Fee** | 2.00% (Min ₹1,000, Max ₹10,000) | Digital underwriting, e-mandate registration, and credit insurance setup. | Bank/NBFC standard tariff sheets |
| **Business Loan Processing Fee** | 2.00% (Min ₹2,500, Max ₹20,000) | Verification of financial statements, GST returns, and business premises. | MSME lender guidelines |
| **Gold Loan Processing Fee** | 0.50% (Min ₹500, Max ₹3,000) | Appraiser fee, secure vault custody, and purity assaying charges. | Gold NBFC schedule of charges |
| **Two-Wheeler Processing Fee** | 2.50% (Min ₹750, Max ₹5,000) | Hypothecation registration (RTO endorsement) and documentation. | Auto finance charges |
| **GST on Processing Fees** | 18% statutory tax on fees | Standard Indian Goods and Services Tax applied to all financial processing charges. | Government of India statutory GST rate |
| **All-in APR Calculation** | Monthly Internal Rate of Return (IRR) annualized: $APR = r_{monthly} \times 12 \times 100$ | Net disbursed principal equals requested loan minus total upfront fees + GST. Equating this to EMI stream reveals true annualized cost. | RBI Mandate on Key Fact Statements (KFS) & APR disclosure |

---

## 5. Capacity vs. Sanction (Output 02)

| What | Value | Why | Source / Judgement |
| :--- | :--- | :--- | :--- |
| **Lender Likely Sanction** | Principal amortized from $Income \times FOIR_{lender} - ExistingEMI$ | Maximum amount bank underwriting algorithm will sanction under generic criteria. | Lender credit policy |
| **Borrower Safe Capacity** | Principal amortized from $Income \times FOIR_{safe} - ExistingEMI$ | Maximum amount borrower should borrow without risking living standards or default. | Financial prudence / My judgement |
| **Capacity Separation Principle** | Both numbers displayed distinctly; borrower advised to use Safe Capacity | Lenders often approve more than what is safe to carry. The copilot empowers the borrower to decline over-leverage. | Core Lokta Challenge requirement (O2) |

---

## 6. Eligibility & Verdict Decision Matrix (Output 01)

| What | Trigger Condition | Verdict | Rationale |
| :--- | :--- | :--- | :--- |
| **Excessive Debt Burden** | Requested FOIR > 60% | **Don't borrow** | Debt service consumes > 60% of earnings; high probability of default on non-discretionary expenses. |
| **Recent Bounce with High Leverage** | Recent bounce = `true` AND Requested FOIR > Safe FOIR | **Don't borrow** | Active delinquency signal coupled with above-threshold obligations indicates severe liquidity strain. |
| **Depleted Savings with Moderate Leverage** | Emergency savings < 1 month AND Requested FOIR > 40% | **Borrow less** | Without any cash cushion, even a minor income disruption will trigger missed payments. |
| **Above Safe Capacity** | Requested FOIR > Safe FOIR Cap | **Borrow less** | The proposed loan exceeds safe debt capacity. A smaller sanction protects cash buffers. |
| **Sub-prime Credit Profile** | Credit score < 650 AND Requested FOIR $\le$ Safe FOIR | **Borrow** (with pricing advisory) | Debt is mathematically affordable, but borrower must expect high-cost NBFC pricing. |
| **Healthy Profile** | FOIR $\le$ Safe FOIR, no recent bounces | **Borrow** | Debt obligations are comfortably serviceable with positive disposable cash surplus. |

---

## 7. Stress Testing & Tenure Trade-Off (Output 04)

| What | Value | Why | Source / Judgement |
| :--- | :--- | :--- | :--- |
| **Income Stress Shock** | 15% reduction in net monthly earnings | Simulates real-world shocks: salary cuts, lost overtime, business dry spells, or medical emergencies. | Prudential household stress testing / My judgement |
| **Tenure Options** | 24, 36, 48, 60 months matrix | Shows borrower how extending tenure lowers monthly EMI but significantly inflates lifetime interest cost. | Transparency in credit trade-offs |
| **Safe EMI Status per Tenure** | $EMI \le SafeEMICap$ marked as `Within Safe Cap`; otherwise `Stretches Budget` | Clearly flags tenures that breach monthly affordability limits. | My judgement |
