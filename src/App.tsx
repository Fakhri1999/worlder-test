import { BrowserRouter } from 'react-router-dom';

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
