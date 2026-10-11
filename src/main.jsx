import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SesionProvider } from './context/SesionContext';
import { AvisoProvider } from './context/AvisoContext';
import App from './App';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SesionProvider>
        <AvisoProvider>
          <App />
        </AvisoProvider>
      </SesionProvider>
    </BrowserRouter>
  </StrictMode>
);
