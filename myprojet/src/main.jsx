import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Launch from './Projet/Launch.jsx'




createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/*<App />*/}
      <Launch />
  </StrictMode>,
)
