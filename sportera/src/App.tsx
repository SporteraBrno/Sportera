import { useEffect, useCallback } from 'react';
import Map from './components/Map';
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
    <div className="App">
      <div className="map-container">
        <Map onFilterToggle={handleFilterToggle} />
      </div>
    </div>
  );
}

export default App;