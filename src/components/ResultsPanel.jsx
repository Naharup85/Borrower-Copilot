import React from "react";
import "./ResultsPanel.css";

const formatINR = (val) => {
  if (val === undefined || val === null || isNaN(val)) return "₹0";
  return "₹" + Math.round(val).toLocaleString("en-IN");
};

export default function ResultsPanel({ result }) {
  if (!result) return null;

  const {
    borrower = {},
    loan = {},
    affordability = {},
    rate = {},
    apr = {},
    verdict = {},
    tenureOptions = [],
    stress = {},
    explanation = {},
  } = result;



  const verdictType = verdict?.verdict?.toLowerCase().replace(/\s+/g, "-") || "borrow";

  return (
    <div className="results-container">
      {/* Header / Profile Summary */}
      <header className="results-header">
        <p className="results-eyebrow">Borrower Assessment · 4 Core Outputs</p>
        <h2 className="results-title">Affordability & Sanction Evaluation</h2>
        <div className="results-meta-bar">
          <span>Profile: <strong>{borrower.borrowerType || "Applicant"} ({borrower.age ? `${borrower.age}y` : "Age N/A"})</strong></span>
          <span>Net Income: <strong>{formatINR(borrower.income)}/mo</strong></span>
          <span>Existing EMI: <strong>{formatINR(borrower.existingEMI)}/mo</strong></span>
          <span>Credit Score: <strong>{borrower.creditScore ? borrower.creditScore : "Unknown / Unscored"}</strong></span>
          <span>Requested: <strong>{formatINR(loan.requestedAmount)} ({loan.purpose || loan.type || "Loan"})</strong></span>
        </div>
      </header>

      <div className="outputs-grid">
        {/* =================================================================
            O1: Verdict (Borrow / Don't borrow / Borrow less)
           ================================================================= */}
        <section className="output-card">
          <div className="card-header">
            <div>
              <span className="output-tag">Output 01 · Decision</span>
              <h3 className="card-title">Borrower Verdict</h3>
            </div>
            <div className={`verdict-badge ${verdictType}`}>
              {verdict.verdict || "Assessment Complete"}
            </div>
          </div>

          <p className="verdict-reason">{verdict.reason}</p>

          <div className="metrics-row">
            <div className="metric-box">
              <div className="metric-box-label">Requested FOIR</div>
              <div className="metric-box-val">{affordability.requestedFOIR ?? 0}%</div>
              <div className="metric-box-sub">Total EMI / Monthly Income</div>
            </div>
            <div className="metric-box">
              <div className="metric-box-label">Safe FOIR Cap</div>
              <div className="metric-box-val">{affordability.safeFOIRCap ?? 0}%</div>
              <div className="metric-box-sub">Recommended safety ceiling</div>
            </div>
            <div className="metric-box">
              <div className="metric-box-label">Lender Max FOIR</div>
              <div className="metric-box-val">{affordability.lenderFOIRCap ?? 0}%</div>
              <div className="metric-box-sub">Institutional limit</div>
            </div>
            <div className="metric-box">
              <div className="metric-box-label">Cash Before Proposed EMI</div>
              <div className="metric-box-val">
                {formatINR(affordability.remainingAfterExpenses)}
              </div>
              <div className="metric-box-sub">
                After household expenses + existing EMI
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            O2: Maximum Amount (Sanction vs Safe Carry)
           ================================================================= */}
        <section className="output-card">
          <div className="card-header">
            <div>
              <span className="output-tag">Output 02 · Borrowing Capacity</span>
              <h3 className="card-title">Maximum Loan Amount</h3>
            </div>
          </div>

          <div className="amount-comparison">
            <div className="amount-box safe-focus">
              <span className="amount-box-badge recommended">Use This (Safe)</span>
              <div className="metric-box-label">Borrower Safe Capacity</div>
              <div className="amount-val">{formatINR(affordability.borrowerSafeAmount)}</div>
              <p className="amount-desc">
                The prudent amount you can comfortably repay without risking essential household needs or default.
              </p>
            </div>

            <div className="amount-box">
              <span className="amount-box-badge">Lender Cap</span>
              <div className="metric-box-label">Lender Likely Sanction</div>
              <div className="amount-val">{formatINR(affordability.lenderLikelyAmount)}</div>
              <p className="amount-desc">
                The ceiling a lender may approve under generic underwriting criteria. Often higher than what is safe.
              </p>
            </div>
          </div>

          <div className="callout-box">
            {explanation.amount || (
              <>
                A lender may approve up to {formatINR(affordability.lenderLikelyAmount)}, but your safe limit is {formatINR(affordability.borrowerSafeAmount)}. Do not borrow to the lender's limit if it stretches your household buffer.
              </>
            )}
          </div>
        </section>

        {/* =================================================================
            O3: Fair Interest Rate & All-in APR Cost
           ================================================================= */}
        <section className="output-card">
          <div className="card-header">
            <div>
              <span className="output-tag">Output 03 · Cost of Borrowing</span>
              <h3 className="card-title">Fair Interest Rate & All-in APR</h3>
            </div>
            <span className="confidence-pill">
              Confidence: {rate.confidence ? rate.confidence.toUpperCase() : "STANDARD"}
            </span>
          </div>

          <div className="rate-apr-grid">
            <div className="amount-box">
              <div className="metric-box-label">Fair Rate Band</div>
              <div className="rate-figure">
                {rate.low ?? 0}% – {rate.high ?? 0}%
              </div>
              <p className="amount-desc">
                Planning baseline: <strong>{rate.planningRate ?? 0}% p.a.</strong>
              </p>
              <div className="callout-box" style={{ marginTop: "12px" }}>
                {rate.reason || "Benchmark band calibrated to profile risk and product collateral."}
              </div>
            </div>

            <div className="amount-box">
              <div className="metric-box-label">All-in APR (Including Fees)</div>
              <div className="rate-figure">{apr.low ?? 0}% – {apr.high ?? 0}%</div>
              <p className="amount-desc">
                Actual annualized cost including processing fees & statutory taxes.
              </p>
              <div className="apr-breakdown">
                <div className="apr-row">
                  <span>Processing Fee:</span>
                  <strong>{formatINR(apr.processingFee)}</strong>
                </div>
                <div className="apr-row">
                  <span>GST on Fee (18%):</span>
                  <strong>{formatINR(apr.gst)}</strong>
                </div>
                <div className="apr-row">
                  <span>Fee impact:</span>
                  <strong>
                    +{((apr.low || 0) - (rate.low || 0)).toFixed(2)}
                    {" – "}
                    +{((apr.high || 0) - (rate.high || 0)).toFixed(2)} pp
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            O4: Monthly EMI Outflow & Tenure Trade-off & Stress Test
           ================================================================= */}
        <section className="output-card">
          <div className="card-header">
            <div>
              <span className="output-tag">Output 04 · Monthly Commitment</span>
              <h3 className="card-title">EMI Ceiling & Tenure Trade-Off</h3>
            </div>
          </div>

          <div className="ceiling-summary">
            <div className="ceiling-stat">
              <span className="ceiling-stat-label">Safe Monthly EMI Ceiling</span>
              <span className="ceiling-stat-val">{formatINR(affordability.safeEMICap)}</span>
            </div>
            <div className="ceiling-stat">
              <span className="ceiling-stat-label">Requested Loan EMI</span>
              <span className="ceiling-stat-val">{formatINR(affordability.requestedEMI)}</span>
            </div>
            <div className="ceiling-stat">
              <span className="ceiling-stat-label">Max Lender EMI Cap</span>
              <span className="ceiling-stat-val">{formatINR(affordability.lenderEMICap)}</span>
            </div>
          </div>

          <div className="callout-box" style={{ margin: "0 0 16px" }}>
            {explanation.emi || (
              <>
                Your monthly safe repayment ceiling is {formatINR(affordability.safeEMICap)} based on a {affordability.safeFOIRCap}% safe FOIR limit after factoring existing obligations.
              </>
            )}
          </div>

          <div className="metric-box-label" style={{ marginBottom: "8px" }}>
            Tenure Trade-Off Matrix ({formatINR(loan.requestedAmount)} at {rate.planningRate}%)
          </div>

          <div className="table-wrapper">
            <table className="tenure-table">
              <thead>
                <tr>
                  <th>Tenure</th>
                  <th>Monthly EMI</th>
                  <th>Total Interest</th>
                  <th>Total Outflow</th>
                  <th>Safety Status</th>
                </tr>
              </thead>
              <tbody>
                {tenureOptions.map((opt) => (
                  <tr key={opt.months}>
                    <td className="num-cell">
                      {opt.months} mos ({opt.months / 12}y)
                    </td>
                    <td className="num-cell">
                      <strong>{formatINR(opt.emi)}</strong>
                    </td>
                    <td className="num-cell">{formatINR(opt.totalInterest)}</td>
                    <td className="num-cell">{formatINR(opt.totalPayment)}</td>
                    <td>
                      <span className={`status-tag ${opt.withinSafeEMI ? "safe" : "stretch"}`}>
                        {opt.withinSafeEMI ? "Within Safe Cap" : "Stretches Budget"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Stress Scenario */}
          <div className="stress-box">
            <div className="stress-header">
              <span className="stress-tag">Stress Scenario</span>
              <h4 className="stress-title">What if monthly income drops by {stress.incomeDropPercent || 15}%?</h4>
            </div>
            <p className="stress-text">
              Stressed Income: <strong>{formatINR(stress.stressIncome)}/mo</strong> ·
              Stressed FOIR: <strong>{stress.stressFOIR ?? 0}%</strong> (Safe Cap: {stress.safeFOIRCap ?? affordability.safeFOIRCap}%)
            </p>
            <p className="stress-text" style={{ marginTop: "6px" }}>
              {explanation.stress || (
                `If income drops by ${stress.incomeDropPercent || 15}%, total debt service consumes ${stress.stressFOIR}% of earnings.`
              )}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}