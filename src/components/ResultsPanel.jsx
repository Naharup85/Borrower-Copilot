

export default function ResultsPanel({ result }) {
    const { rate, apr, amount, foir, eligibility, foirCapSafe, requestedEMI, loanAmount, tenureMonths,safeEMI } = result    
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
                            <span>{amount.lenderLikelyAmount}</span>
                        </div>
                        <div className="result-row">
                            <span>Safer amount </span>
                            <span>{amount.borrowerSafeAmount}</span>
                        </div>
                        <div className="result-row">
                            <span>We recommend </span>
                            <span>{amount.borrowerSafeAmount}</span>
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
                            <span>{loanAmount}</span>
                        </div>
                        <div className="result-row">
                            <span>If you borrow {loanAmount}, your EMI will be </span>
                            <span>{requestedEMI}</span>
                        </div>
                        <div className="result-row">
                            <span>This means your FOIR will be {foir}%, which is above the safe limit of {foirCapSafe}%.</span>
                            <span>{apr.apr}</span>
                        </div>
                        <div className="result-row">
                            <span>To keep your FOIR at the safe limit of {foirCapSafe}%, you should borrow </span>
                            <span>{amount.borrowerSafeAmount}</span>
                        </div>
                        <div className="result-row">
                            <span>Your EMI for this safe  amount will be </span>
                            <span>{safeEMI}</span>
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