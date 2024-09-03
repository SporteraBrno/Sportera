import React, { useEffect, useState } from 'react';
import './styles/WeatherOverlay.css';

interface OpenMeteoWeatherOverlayProps {
  coordinate: { latitude: number; longitude: number };
}

const OpenMeteoWeatherOverlay: React.FC<OpenMeteoWeatherOverlayProps> = ({ coordinate }) => {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coordinate.latitude}&longitude=${coordinate.longitude}&current_weather=true`);
        const data = await response.json();

        if (data.current_weather && typeof data.current_weather.temperature === 'number') {
          setTemperature(Math.round(data.current_weather.temperature));
        } else {
          throw new Error("Unexpected weather data format");
        }
      } catch (err) {
        console.error('Error fetching weather:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();

    const intervalId = setInterval(fetchWeather, 15 * 60 * 1000); // Update every 15 minutes
    return () => clearInterval(intervalId);
  }, [coordinate]);

  if (loading) return <div className="weather-overlay">Loading...</div>;
  if (error) return null; // Hide the overlay if there's an error
  if (temperature === null) return null;

  return (
    <div className="weather-overlay">
      <span className="temperature">{temperature}°</span>
    </div>
  );
};

export default OpenMeteoWeatherOverlay;