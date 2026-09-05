import { useState } from 'react'
import './App.css'
import QuestionForm from './components/QuestionForm'
import NegotiationCard from './components/NegotiationCard'
import ResultsPanel from './components/ResultsPanel'

function App() {
  const [result,setResult] = useState(null);

  return (
    <>
      <h1>Borrower Copilot</h1>
      <QuestionForm setResult={setResult}/>
      {result && (
        <>
          <NegotiationCard result={result} />
          <ResultsPanel result={result} />
        </>
      )}
    </>
  )
}

export default App
