import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Entry from './Entry.jsx'
import Home from './Home.jsx'
import Examples from './Examples.jsx'

function Root() {
  const [entered, setEntered] = useState(false)
  if (!entered) return <Entry onEnter={() => setEntered(true)} />
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/examples" element={<Examples />} />
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode><Root /></StrictMode>
)