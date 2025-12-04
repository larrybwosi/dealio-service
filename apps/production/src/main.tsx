import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Bakery from './pages'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Bakery />
  </StrictMode>,
)
