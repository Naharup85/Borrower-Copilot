# Borrower Copilot

> A personal assistant that helps an Indian borrower answer four core questions before walking into a lender:
> 1. **Should I borrow at all?** (Verdict & reasoning)
> 2. **How much am I really eligible for?** (Lender sanction vs. Borrower safe carry)
> 3. **What is a fair rate for me?** (Fair interest rate band & RBI All-in APR)
> 4. **What EMI should I agree to?** (Repayment ceiling, tenure trade-off matrix & income stress test)
>
> Followed by a **One-Page Negotiation Card** the borrower can carry into a branch.

---

## ⚡ Quick Start (Runs locally in < 2 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser at http://localhost:5173
```

---

## 🎨 Design System: Simple Black / White / Dark

Built following the editorial design aesthetic from the Lokta Build Challenge:
- **Palette**: Sleek, high-contrast monochrome dark theme (`#121216` background, `#191820` elevation cards, `#f0edf0` ink, crisp white accents).
- **Typography Stack**:
  - Display / Headings: `Newsreader` (editorial serif)
  - Body: `Source Sans 3` (clean, readable sans-serif)
  - Monospace / Numbers: `IBM Plex Mono` (tabular numbers with clear alignment)
- **Zero Login / Zero Bureau Pull**: Runs entirely in the client with complete privacy.

---

## 🧭 The Four Core Outputs

| Output | Name | What It Solves |
| :--- | :--- | :--- |
| **O1** | **Decision Verdict** | `Borrow`, `Borrow less`, or `Don't borrow`. "Don't borrow" is a legitimate output reachable under severe leverage or delinquency. |
| **O2** | **Maximum Capacity** | Separates **Lender Likely Sanction** (what a bank algorithm will offer) from **Borrower Safe Capacity** (what the borrower can safely carry). |
| **O3** | **Fair Rate & All-in APR** | Displays fair benchmark rate bands and calculates the true annualized cost (APR) including upfront processing fees and 18% statutory GST via Internal Rate of Return (IRR). |
| **O4** | **EMI Ceiling & Stress Test** | Calculates safe monthly repayment cap, presents a 24/36/48/60-month tenure trade-off matrix, and models an income reduction stress shock (-15%). |

### 📄 The Negotiation Card
A single high-contrast card screen designed for the borrower to show or read to a loan officer in a branch, stating fair expected rates, safe borrowing capacity, and key profile counter-arguments.

---

## 👥 Three Run-Through Profiles (Tested on the App)

### 1. Priya, 29 (Salaried · Bengaluru)
- **Profile**: Software engineer at MNC, Net ₹1,10,000/mo, Car loan EMI ₹14,000, Credit Score 780.
- **Request**: ₹8,00,000 Personal Loan for wedding.
- **App Evaluation**:
  - **Verdict**: `Borrow` (Safe FOIR limit is 40%; proposed EMI of ~₹26,800 + existing ₹14,000 is ~37% FOIR).
  - **Fair Rate**: 10.5% – 12.7% p.a. (Confidence: `HIGH` due to 780 score).
  - **Negotiation Card**: Highlights high credit score (780) and low existing leverage to demand rate near 11%.

### 2. Ravi, 42 (Self-Employed · Mysuru)
- **Profile**: Kirana store for 14 years, Net ~₹60,000/mo cash income, unencumbered shop premises worth ₹45,00,000, no credit score / no formal loans.
- **Request**: ₹15,00,000 Business Loan for stock and vehicle.
- **App Evaluation**:
  - **Adaptive Routing**: Pledging unencumbered shop collateral automatically re-routes pricing from unsecured business loan (12–18%) to Loan Against Property (LAP: 9.5–11.0%).
  - **Verdict & Capacity**: Unsecured ₹15L would stretch FOIR, but with LAP collateral and 5-year tenure, safe carrying capacity is unlocked.
  - **Confidence**: `LOW` due to missing credit bureau score, with explicit consequence shown to borrower.

### 3. Anita, 35 (Informal · Hubballi)
- **Profile**: Delivery rider & tailoring, ₹28,000/mo, husband unemployed, 3 app loans totaling ₹35,000 at 30%+, 1 EMI bounced last month.
- **Request**: ₹1,50,000 for electric scooter.
- **App Evaluation**:
  - **Verdict**: `Don't borrow`.
  - **Reason**: Recent EMI bounce combined with existing debt service exceeding safe 25% informal FOIR threshold.
  - **Prudent Guidance**: Immediate borrowing would push debt obligations past 60% of income; recommends resolving delinquent micro-loans before taking on asset debt.

---

## 📚 Rules & Banking References

- [RULES.md](./RULES.md) — Comprehensive table documenting every threshold, rate band, fee, and assumption.
- [FOIR Affordability Guidelines](https://www.bajajfinserv.in/what-is-foir-how-it-affect-personal-loan-approval)
- [RBI All-in APR Disclosures](https://www.ltfinance.com/blog/personal-loan/what-is-apr-in-loan)
- [Personal Loan Market Benchmark](https://www.livemint.com/money/personal-finance/personal-loan-interest-rates-april-2026-comparison-of-top-banks-fees-and-5-key-things-to-check-before-you-apply-11775708398141.html)
- [Gold Loan Benchmarks](https://www.utkarsh.bank.in/blogs/gold-loan-interest-rate-in-india-2026-what-borrowers-should-know)
- [Loan Against Property (LAP) Norms](https://www.bajajfinserv.in/loan-against-property-fees-and-interest-rates)