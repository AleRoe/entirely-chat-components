// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// According to @react-keycloak/web documentation, disable StrictMode in development
// to prevent "Keycloak instance can only be initialized once" error.
// StrictMode intentionally double-invokes components to detect side effects,
// which causes Keycloak to initialize twice.
const isProduction = import.meta.env.PROD;

ReactDOM.createRoot(document.getElementById('root')!).render(
  isProduction ? (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  ) : (
    <App />
  ),
)
