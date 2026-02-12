import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import GrimesAiApp from './components/GrimesAiApp';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<GrimesAiApp />} />
      </Routes>
    </BrowserRouter>
  );
}