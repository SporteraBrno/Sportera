import React from 'react';
import * as markers from '../assets/markers';
import './styles/Filters.css';

interface SportFiltersProps {
  selectedSports: string[];
  onToggleSport: (sport: string) => void;
}

const sportIcons: { [key: string]: string } = {
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
  //gym: markers.gymMarker,
};

const SportFilters: React.FC<SportFiltersProps> = ({ selectedSports, onToggleSport }) => {
  const isSportActive = (sport: string) => {
    if (selectedSports.includes(sport)) {
      if (sport === 'bf' || sport === 'bfv') {
        return selectedSports.includes(sport);
      }
      return true;
    }
    return false;
  };

  return (
    <div className="sport-filters-wrapper">
      <div className="sport-filters">
        {Object.entries(sportIcons).map(([sport, icon]) => (
          <button
            key={sport}
            className={`sport-filter-button ${isSportActive(sport) ? 'active' : 'inactive'}`}
            onClick={() => onToggleSport(sport)}
          >
            <img src={icon} alt={sport} className="sport-icon" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default SportFilters;