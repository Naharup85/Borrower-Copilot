export default function NegotiationCard({ result }) {
  if (!result) return null;

  const {
    loan,
    borrower,
    affordability,
    rate,
    apr,
    tenureOptions,
  } = result;

  const recommendedTenure =
    tenureOptions?.find((option) => option.withinSafeEMI) ||
    tenureOptions?.[1];

  return (
    <section className="negotiation-card">
      <div className="negotiation-card-header">
        <div>
          <p className="eyebrow">BORROWER COPILOT</p>
          <h2>My Borrowing Card</h2>
          <p>
            {loan?.type} · {loan?.purpose}
          </p>
        </div>

        <div className="card-verdict">
          {result.verdict?.verdict}
        </div>
      </div>

      <div className="card-grid">

        {/* Amount */}
        <div className="card-metric">
          <span>Requested</span>
          <strong>
            ₹{loan.requestedAmount.toLocaleString("en-IN")}
          </strong>
        </div>

        <div className="card-metric">
          <span>Safe amount</span>
          <strong>
            ₹{affordability.borrowerSafeAmount.toLocaleString("en-IN")}
          </strong>
        </div>

        {/* Rate */}
        <div className="card-metric">
          <span>Fair rate</span>
          <strong>
            {rate.low}% – {rate.high}%
          </strong>
        </div>

        <div className="card-metric">
          <span>All-in APR</span>
          <strong>
            {apr.low}% – {apr.high}%
          </strong>
        </div>

        {/* EMI */}
        <div className="card-metric">
          <span>EMI ceiling</span>
          <strong>
            ₹{affordability.safeEMICap.toLocaleString("en-IN")}
          </strong>
        </div>

        <div className="card-metric">
          <span>Suggested tenure</span>
          <strong>
            {recommendedTenure?.months || 36} months
          </strong>
        </div>

      </div>

      {/* Why */}
      <div className="card-section">
        <h3>Why this range?</h3>

        <ul>
          <li>
            Income: ₹
            {borrower.income.toLocaleString("en-IN")}/month
          </li>

          <li>
            Existing EMI: ₹
            {borrower.existingEMI.toLocaleString("en-IN")}/month
          </li>

          <li>
            Safe FOIR: {affordability.safeFOIRCap}%
          </li>

          <li>
            Credit score:{" "}
            {borrower.creditScore ?? "Unknown"}
          </li>
        </ul>
      </div>

      {/* Negotiation */}
      <div className="negotiation-request">
        <h3>What to ask the lender</h3>

        <p>
          “Can you offer a rate within my fair range and
          keep the processing fee and all-in cost transparent?”
        </p>
      </div>

      <p className="card-disclaimer">
        This is a planning estimate, not a lender sanction.
        Actual pricing and approval depend on lender
        underwriting and documentation.
      </p>
    </section>
  );
}