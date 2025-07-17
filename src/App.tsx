import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FlashCardPage } from './pages/FlashCardPage';
import { AdminPage } from './pages/AdminPage';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { NetworkStatus } from './components/NetworkStatus';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FlashCardPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      <PWAInstallPrompt />
      <NetworkStatus />
    </Router>
  );
}

export default App;
