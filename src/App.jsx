import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AACProvider, useAAC } from './context/AACContext';
import AACMode from './components/AACMode';
import ParentMode from './components/ParentMode';

function AppContent() {
  const { loading } = useAAC();

  if (loading) {
    return <div className="h-screen flex items-center justify-center bg-[#FFF9EA] text-amber-600 font-bold text-xl animate-pulse">Memuat Data AAC...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AACMode />} />
        <Route path="/settings" element={<ParentMode />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AACProvider>
      <AppContent />
    </AACProvider>
  );
}
