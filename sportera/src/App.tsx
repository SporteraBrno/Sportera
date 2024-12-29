// src/App.tsx
import { useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Map from './components/Map';
import AboutPage from './components/AboutPage';
import './components/styles/global.css';
import './components/styles/Map.css';
import { analytics } from './firebase';
import { logEvent } from "firebase/analytics";

function App() {
  useEffect(() => {
    logEvent(analytics, 'page_view');
    logEvent(analytics, 'app_open');
  }, []);

  const handleFilterToggle = useCallback(() => {
    logEvent(analytics, 'toggle_filters');
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              <div className="map-container">
                <Map onFilterToggle={handleFilterToggle} />
              </div>
            } 
          />
          <Route path="/info" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;