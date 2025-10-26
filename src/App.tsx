import { BrowserRouter } from 'react-router-dom';

import './libs/i18n';
import { SuspenseFallbackProvider } from './providers/SuspenseFallbackProvider';
import { Router } from './routes/Router';

function App() {
  return (
    <BrowserRouter>
      <SuspenseFallbackProvider>
        <Router />
      </SuspenseFallbackProvider>
    </BrowserRouter>
  );
}

export { App };
