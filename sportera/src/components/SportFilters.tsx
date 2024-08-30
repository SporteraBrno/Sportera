import React from 'react';
import * as markers from '../assets/markers';

interface SportFiltersProps {
  selectedSports: string[];
  onToggleSport: (sport: string) => void;
}

const sportIcons: { [key: string]: string } = {
  gym: markers.gymMarker,
  bas: markers.basketballMarker,
  vol: markers.volleyballMarker,
  bou: markers.boulderMarker,
  foo: markers.footballMarker,
  pin: markers.pingpongMarker,
  ska: markers.skateparkMarker,
  ten: markers.tennisMarker,
  par: markers.parkourMarker,
  wor: markers.workoutMarker,
  bf: markers.bfMarker,
  bfv: markers.bfvMarker,
};

const SportFilters: React.FC<SportFiltersProps> = ({ selectedSports, onToggleSport }) => {
  const isSportActive = (sport: string) => {
    if (selectedSports.includes(sport)) {
      // For BF and BFV, check if they are explicitly selected
      if (sport === 'bf' || sport === 'bfv') {
        return selectedSports.includes(sport);
      }
      return true;
    }
    return false;
  };

  return (
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
  );
};

export default SportFilters;