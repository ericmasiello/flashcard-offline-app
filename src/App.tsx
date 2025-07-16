import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FlashCardPage } from './pages/FlashCardPage';
import { AdminPage } from './pages/AdminPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FlashCardPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
