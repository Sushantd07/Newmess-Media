import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './contexts/AuthContext.jsx'
import App from './App.jsx'
import './index.css'

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <BrowserRouter>
    <HelmetProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HelmetProvider>
  </BrowserRouter>
)
