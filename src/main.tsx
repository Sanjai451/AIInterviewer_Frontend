import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    
     {/* <div className="min-h-screen bg-black text-white text-4xl font-bold flex items-center justify-center">
      Tailwind Working
    </div> */}
  </StrictMode>,
)
