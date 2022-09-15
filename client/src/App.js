import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import TestPage from './views/TestPage';

function App() {
  return (
    <Router>
      <div>
        <CssBaseline />
        <Routes>
          <Route path="/" element={< TestPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
