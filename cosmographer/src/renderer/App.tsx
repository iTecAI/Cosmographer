import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.scss';
import React from 'react';

const { readdir } = window.require('fs/promises');

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<></>} />
      </Routes>
    </Router>
  );
}
