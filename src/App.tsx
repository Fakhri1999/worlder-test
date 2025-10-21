import { BrowserRouter } from 'react-router-dom';

import { AppProvider } from './providers/AppProvider';
import { SuspenseFallbackProvider } from './providers/SuspenseFallbackProvider';
import { Router } from './routes/Router';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <SuspenseFallbackProvider>
          <Router />
        </SuspenseFallbackProvider>
      </BrowserRouter>
    </AppProvider>
  );
}

export { App };
