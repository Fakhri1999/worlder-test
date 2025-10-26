import { BrowserRouter } from 'react-router-dom';

import { SuspenseFallbackProvider } from './providers/SuspenseFallbackProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { Router } from './routes/Router';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <SuspenseFallbackProvider>
          <Router />
        </SuspenseFallbackProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export { App };
