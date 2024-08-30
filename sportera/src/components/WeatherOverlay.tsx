import React, { useEffect, useState } from 'react';

interface WeatherOverlayProps {
  mapkit: any;
  coordinate: { latitude: number; longitude: number };
}

const WeatherOverlay: React.FC<WeatherOverlayProps> = ({ mapkit, coordinate }) => {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      console.log("Attempting to fetch weather...");
      console.log("MapKit object:", mapkit);
      console.log("MapKit services:", mapkit.services);
      setLoading(true);
      setError(null);
      try {
        if (!mapkit.services || !mapkit.services.Weather) {
          throw new Error("WeatherKit service is not available");
        }
        const weatherService = new mapkit.services.Weather();
        console.log("Weather service created");
        const result = await weatherService.temperature(new mapkit.Coordinate(coordinate.latitude, coordinate.longitude));
        console.log("Weather data received:", result);
        if (result && result.temperature && typeof result.temperature.value === 'number') {
          setTemperature(Math.round(result.temperature.value));
        } else {
          throw new Error("Unexpected weather data format");
        }
      } catch (err: unknown) {
        console.error('Error fetching weather:', err);
        if (err instanceof Error) {
          setError(`Failed to fetch weather data: ${err.message}`);
        } else {
          setError('Failed to fetch weather data: Unknown error');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [mapkit, coordinate]);

  console.log("Weather Overlay State:", { loading, error, temperature });

  if (loading) return <div className="weather-overlay">Loading weather...</div>;
  if (error) return <div className="weather-overlay">Error: {error}</div>;
  if (temperature === null) return <div className="weather-overlay">No weather data available</div>;

  return (
    <div className="weather-overlay">
      <span>{temperature}°C</span>
    </div>
  );
};

export default WeatherOverlay;