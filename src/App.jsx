import { useState } from 'react'
import './App.css'
import QuestionForm from './components/QuestionForm '
import NegotiationCard from './components/NegotiationCard'
import ResultsPanel from './components/ResultsPanel'

function App() {
  const [result, setResult] = useState(null);
  const [tab, setTab] = useState('ResultsPanel');

  return (
    <div className="wrap">
      <header className="app-header">
        <p className="eyebrow">Lokta · Build Challenge · Borrower Copilot</p>
        <h1>Borrower <em>Copilot</em></h1>
        <p className="thesis">
          A personal assistant that helps an Indian borrower answer four questions before they walk into a lender: <strong>Should I borrow at all? How much am I really eligible for? What is a fair rate for me? What EMI should I agree to?</strong> Then hand them a one-page card they can negotiate with.
        </p>
        <div className="meta">
          <span>Borrower Profile: <b>Self-Assessment</b></span>
          <span>Regulatory Standard: <b>RBI All-in APR & FOIR</b></span>
          <span>Privacy: <b>Zero Bureau Pull / No Data Stored</b></span>
        </div>
      </header>

      <main>
        <QuestionForm setResult={setResult} />

        {result && (
          <section className="results-view" id="results-view">
            <div className="tab-switcher">
              <button
                type="button"
                className={`tab-btn ${tab === 'ResultsPanel' ? 'active' : ''}`}
                onClick={() => setTab('ResultsPanel')}
              >
                Affordability Evaluation (4 Outputs)
              </button>
              <button
                type="button"
                className={`tab-btn ${tab === 'NegotiationCard' ? 'active' : ''}`}
                onClick={() => setTab('NegotiationCard')}
              >
                Negotiation Card
              </button>
            </div>

            {tab === 'ResultsPanel' ? (
              <ResultsPanel result={result} />
            ) : (
              <NegotiationCard result={result} />
            )}
          </section>
        )}
      </main>

      <footer className="app-footer">
        Turn lending judgement into rules a borrower can see and a machine can run.
      </footer>
    </div>
  )
}

export default App
