// In SportFilters.tsx

import React, { useEffect, useState } from 'react';
import * as markers from '../assets/markers';
import './styles/Filters.css';

type BaseSport = 'bas' | 'foo' | 'wor' | 'ska' | 'pin' | 'par' | 'vol' | 'bou' | 'ten';
type MultiSport = 'bf' | 'bfv';
type SportType = BaseSport | MultiSport;

interface SportFiltersProps {
  selectedSports: BaseSport[];
  onToggleSport: (sport: BaseSport) => void;
}

const SPORT_NAMES: Record<SportType, string> = {
  bas: 'Basketball',
  foo: 'Football',
  wor: 'Workout',
  ska: 'Skatepark',
  pin: 'Ping Pong',
  par: 'Parkour',
  vol: 'Volleyball',
  bou: 'Boulder',
  ten: 'Tennis',
  bf: 'Basketball/Football',
  bfv: 'Basketball/Football/Volleyball'
};

const sportIcons: Record<SportType, string> = {
  bas: markers.basketballMarker,
  foo: markers.footballMarker,
  wor: markers.workoutMarker,
  ska: markers.skateparkMarker,
  pin: markers.pingpongMarker,
  par: markers.parkourMarker,
  vol: markers.volleyballMarker,
  bou: markers.boulderMarker,
  ten: markers.tennisMarker,
  bf: markers.bfMarker,
  bfv: markers.bfvMarker,
};

const BASE_SPORTS = [
  'bas', 'foo', 'wor', 'ska', 'pin', 'par', 'vol', 'bou', 'ten'
] as const;

const SportFilters: React.FC<SportFiltersProps> = React.memo(({ selectedSports, onToggleSport }) => {
  const [allSelected, setAllSelected] = useState(true);

  useEffect(() => {
    // Update "all" checkbox state based on selected sports
    setAllSelected(selectedSports.length === BASE_SPORTS.length);
  }, [selectedSports]);

  const handleAllToggle = () => {
    if (allSelected) {
      // Deselect all sports
      BASE_SPORTS.forEach(sport => {
        if (selectedSports.includes(sport)) {
          onToggleSport(sport);
        }
      });
    } else {
      // Select all sports
      BASE_SPORTS.forEach(sport => {
        if (!selectedSports.includes(sport)) {
          onToggleSport(sport);
        }
      });
    }
  };

  const isSportActive = (sport: SportType): boolean => {
    if (sport === 'bf') {
      return selectedSports.includes('bas') || selectedSports.includes('foo');
    }
    if (sport === 'bfv') {
      return (selectedSports.includes('bas') || selectedSports.includes('foo')) 
             && selectedSports.includes('vol');
    }
    return selectedSports.includes(sport as BaseSport);
  };

  const handleSportToggle = (sport: SportType) => {
    if (sport !== 'bf' && sport !== 'bfv') {
      onToggleSport(sport);
    }
  };

  const renderSportButton = (sport: SportType) => {
    const isMultiSport = sport === 'bf' || sport === 'bfv';
    
    return (
      <button
        key={sport}
        className={`sport-filter-button ${isSportActive(sport) ? 'active' : 'inactive'}`}
        onClick={() => handleSportToggle(sport)}
        aria-label={`Toggle ${SPORT_NAMES[sport]}`}
        aria-pressed={isSportActive(sport)}
        title={SPORT_NAMES[sport]}
        disabled={isMultiSport}
      >
        <img 
          src={sportIcons[sport]} 
          alt={SPORT_NAMES[sport]} 
          className="sport-icon"
          loading="eager" 
        />
      </button>
    );
  };

  const displayableSports = (Object.keys(sportIcons) as SportType[]).filter(
    sport => sport !== 'bf' && sport !== 'bfv'
  );

  return (
    <div className="sport-filters-wrapper">
 <label className="select-all-checkbox">
  <input
    type="checkbox"
    checked={allSelected}
    onChange={handleAllToggle}
    aria-label="Select all sports"
  />
  <span>Vše</span>
</label>
      <div className="sport-filters">
        {displayableSports.map(sport => renderSportButton(sport))}
      </div>
    </div>
  );
});

export default SportFilters;