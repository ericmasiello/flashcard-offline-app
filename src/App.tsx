import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FlashCardPage } from './pages/FlashCardPage';
import { AdminPage } from './pages/AdminPage';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { NetworkStatus } from './components/NetworkStatus';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import { Suspense } from 'react';
import { Loading } from './components/Loading';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<Loading />}>
        <Router>
          <Routes>
            <Route path="/" element={<FlashCardPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
          <PWAInstallPrompt />
          <NetworkStatus />
        </Router>
      </Suspense>
    </QueryClientProvider>
  );
}

export default App;
