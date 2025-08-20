console.log('Env:', import.meta.env)
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store/index.js' // Import both store and persistor
import { HelmetProvider } from 'react-helmet-async'


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </PersistGate>
    </Provider>
  </BrowserRouter>
)