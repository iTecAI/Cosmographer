import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.scss';
import React, { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    //dialog.showOpenDialog({ title: 'Test' });
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<></>} />
      </Routes>
    </Router>
  );
}
