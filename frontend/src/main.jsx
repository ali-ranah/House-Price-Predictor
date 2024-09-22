import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux';
import { ThemeProvider } from "@material-tailwind/react";
import Store from './Components/State/Store'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
        <Provider store={Store}>
        <ThemeProvider>
    <App />
    </ThemeProvider>
    </Provider>
  </React.StrictMode>,
)
