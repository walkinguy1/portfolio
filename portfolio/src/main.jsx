import React from 'react'
import ReactDOM from 'react-dom/client'

// Bootstrap must load before anything else, including App.jsx's own CSS —
// our theme layer overrides it, not the other way around. Moving this below
// the App import silently loses the cascade fight.
import 'bootstrap/dist/css/bootstrap.min.css'

import App from './App.jsx'
import './index.css'
import './styles/global.css'
import './styles/shared.css'
import './styles/animations.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)