

export default function ResultsPanel({ result }) {
    
    const {
      loanRequestAmount,
      loanRequestEMI,
      loanRequestAnnualRate,
      lenderGivenAmount,
      lenderGivenAmountEMI,
      borrowerSafeAmount,
      borrowerSafeAmountEMI,
      lenderAmountReason,
      apr,      
      FOIR,
      eligibility,
      foirCapSafe,
    } = result    
    return (
        <>
            <div className="results-container">
                <h1>Result</h1>
                <div className="result-row">
                    <div className="result-label">
                        <span className="result-label-text">
                        {eligibility.verdict}
                        </span>
                    </div>
                    <div className="result-value">
                        <span className="result-value-text">{eligibility.reason}</span>
                    </div>
                </div>
                <div className="amount">

                </div>
                <div className="result-row">
                    <div className="result-label">
                        <p>How Much You Can Borrow</p>
                    </div>
                    <div className="result-value">
                        <div className="result-row">
                            <span>Lender likely approved</span>
                            <span>{lenderGivenAmount}</span>
                        </div>
                        <div className="result-row">
                            <span>Safer amount </span>
                            <span>{borrowerSafeAmount}</span>
                        </div>
                        <div className="result-row">
                            <span>We recommend </span>
                            <span>{lenderGivenAmount>borrowerSafeAmount?borrowerSafeAmount:lenderGivenAmount}</span>
                        </div>
                    </div>
                </div>
                <div className="result-row">
                    <div className="result-label">
                        <p>Your EMI</p>
                    </div>
                    <div className="result-value">
                        <div className="result-row">
                            <span>Requested loan amount </span>
                            <span>{loanRequestAmount}</span>
                        </div>
                        <div className="result-row">
                            <span>If you borrow {}, your EMI will be </span>
                            <span>{loanRequestEMI}</span>
                        </div>
                        <div className="result-row">
                            <span>This means your FOIR will be {FOIR}%, which is above the safe limit of {foirCapSafe}%.</span>
                        </div>
                        <div className="result-row">
                            <span>To keep your FOIR at the safe limit of {foirCapSafe}%, you should borrow </span>
                            <span>{borrowerSafeAmount}</span>
                        </div>
                        <div className="result-row">
                            <span>Your EMI for this safe  amount will be </span>
                            <span>{borrowerSafeAmountEMI}</span>
                        </div>
                    </div>
                </div>
                <div className="result-row">
                    <div className="result-label">
                        <p>All-in Cost</p>
                    </div>
                    <div className="result-value">
                        <span>Processing fess</span>
                        <span>{apr.processingFee}</span>
                    </div>
                    <div className="result-value">
                        <span>GST on Processing fess</span>
                        <span>{apr.gst}</span>
                    </div>
                    <div className="result-value">
                        <span>APR</span>
                        <span>{apr.apr} %</span>
                    </div>
                </div>
                <div className="result-row">
                    <div className="result-label">
                        <p>STRESS TEST CASES</p>
                    </div>
                    <div className="result-value">
                        <p>If your income drops by 30%, you could still afford your EMI.</p>
                        <p>If rates go up by 3%, you could still afford your EMI.</p>
                        <p>If rates go up by 3% AND your income drops by 30%, you could still afford your EMI.</p>
                    </div>
                </div>
            </div>
        </>
    )

}