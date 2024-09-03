import React, { useEffect, useRef, useCallback, useState } from 'react';
import { mapKitConfig } from '@config/mapConfig';
import places from '../data/places.json';
import * as markers from '../assets/markers';
import SportFilters from './SportFilters';
import Lightbox from './LightBox';
import OpenMeteoWeatherOverlay from './WeatherOverlay';
import './styles/Map.css';
import './styles/Filters.css';
import './styles/SocialLinks.css';
import './styles/Callouts.css';
import './styles/Lightbox.css';
import './styles/WeatherOverlay.css';

declare global {
  interface Window {
    mapkit: any;
  }
}

interface Place {
  Name: string;
  Latitude: number;
  Longitude: number;
  Sport: string;
  Description: string;
  Image1: string;
  Image2: string;
}

const brnoCoordinates = { latitude: 49.1951, longitude: 16.6068 };

const Map: React.FC = React.memo(() => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const annotationsRef = useRef<any[]>([]);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [selectedSports, setSelectedSports] = useState<string[]>(
    Object.keys(markers)
  );

  const hideFilters = useCallback(() => {
    setIsFiltersVisible(false);
  }, []);

  const getMarkerIcon = useCallback((sport: string): string | null => {
    let icon: string | null;
    
    switch(sport) {
      case 'gym': icon = markers.gymMarker; break;
      case 'bas': icon = markers.basketballMarker; break;
      case 'vol': icon = markers.volleyballMarker; break;
      case 'bou': icon = markers.boulderMarker; break;
      case 'foo': icon = markers.footballMarker; break;
      case 'pin': icon = markers.pingpongMarker; break;
      case 'ska': icon = markers.skateparkMarker; break;
      case 'ten': icon = markers.tennisMarker; break;
      case 'par': icon = markers.parkourMarker; break;
      case 'wor': icon = markers.workoutMarker; break;
      case 'bf': icon = markers.bfMarker; break;
      case 'bfv': icon = markers.bfvMarker; break;
      default: icon = null;
    }
    
    return icon;
  }, []);
  
  const createCustomCallout = useCallback((annotation: any) => {
    const div = document.createElement("div");
    div.className = "custom-callout";
    div.setAttribute('role', 'dialog');
    div.setAttribute('aria-label', `Information about ${annotation.title}`);
    
    const contentDiv = document.createElement("div");
    contentDiv.className = "callout-content";
    
    const title = document.createElement("h2");
    title.className = "callout-title selectable";
    title.textContent = annotation.title;
    contentDiv.appendChild(title);

    const description = document.createElement("p");
    description.className = "callout-description selectable";
    description.textContent = annotation.subtitle;
    contentDiv.appendChild(description);

    const openingHours = document.createElement("p");
    openingHours.className = "callout-opening-hours";
    openingHours.textContent = "Otevřeno: Coming soon";
    contentDiv.appendChild(openingHours);

    div.appendChild(contentDiv);

    if (annotation.data.image1) {
      const image = document.createElement("img");
      image.src = annotation.data.image1;
      image.className = "callout-image";
      image.alt = `Image of ${annotation.title}`;
      image.addEventListener('click', () => {
        const images = [annotation.data.image1, annotation.data.image2].filter(Boolean);
        setLightboxImages(images);
        setLightboxIndex(0);
      });
      div.appendChild(image);
    }
  
    return div;
  }, []);

  const toggleSport = useCallback((sport: string) => {
    setSelectedSports(prev => {
      let newSelectedSports;
      if (prev.includes(sport)) {
        newSelectedSports = prev.filter(s => s !== sport);
        if (sport === 'bf' || sport === 'bfv') {
          // Do nothing else, just remove the sport
        } else {
          if (!newSelectedSports.includes('bas') && !newSelectedSports.includes('foo')) {
            newSelectedSports = newSelectedSports.filter(s => s !== 'bf' && s !== 'bfv');
          } else if (!newSelectedSports.includes('vol')) {
            newSelectedSports = newSelectedSports.filter(s => s !== 'bfv');
          }
        }
      } else {
        newSelectedSports = [...prev, sport];
        if (['bas', 'foo'].includes(sport) && !newSelectedSports.includes('bf')) {
          newSelectedSports.push('bf');
        }
        if (['bas', 'foo', 'vol'].includes(sport) && !newSelectedSports.includes('bfv')) {
          newSelectedSports.push('bfv');
        }
      }
  
      annotationsRef.current.forEach(annotation => {
        const annotationSport = annotation.data.sport;
        annotation.visible = newSelectedSports.includes(annotationSport) ||
          (annotationSport === 'bf' && (newSelectedSports.includes('bas') || newSelectedSports.includes('foo'))) ||
          (annotationSport === 'bfv' && (newSelectedSports.includes('bas') || newSelectedSports.includes('foo') || newSelectedSports.includes('vol')));
      });
  
      return newSelectedSports;
    });
  }, []);

  const initializeMap = useCallback(() => {
    if (mapInstanceRef.current || !mapRef.current || !window.mapkit) return;
  
    const { latitude, longitude, latitudeDelta, longitudeDelta } = mapKitConfig.initialRegion;
    const center = new window.mapkit.Coordinate(latitude, longitude);
    const span = new window.mapkit.CoordinateSpan(latitudeDelta, longitudeDelta);
  
    mapInstanceRef.current = new window.mapkit.Map(mapRef.current, {
      center: center,
      region: new window.mapkit.CoordinateRegion(center, span),
      ...mapKitConfig.mapSettings,
    });

    (mapInstanceRef.current as any)._allowWheelToZoom = true;

    mapInstanceRef.current.addEventListener('zoom-start', hideFilters);
    mapInstanceRef.current.addEventListener('pan-start', hideFilters);
    mapInstanceRef.current.addEventListener('single-tap', hideFilters);
  
    places.forEach((place: Place) => {
      const markerIcon = getMarkerIcon(place.Sport);
      if (markerIcon) {
        const annotation = new window.mapkit.ImageAnnotation(
          new window.mapkit.Coordinate(place.Latitude, place.Longitude),
          {
            title: place.Name,
            subtitle: place.Description,
            url: { 1: markerIcon },
            size: { width: 30, height: 30 },
            anchorOffset: new window.DOMPoint(0, -15),
            callout: {
              calloutElementForAnnotation: createCustomCallout,
            },
            accessibilityLabel: `${place.Sport} location: ${place.Name}`,
            data: { 
              sport: place.Sport,
              image1: place.Image1,
              image2: place.Image2
            },
          }
        );
        mapInstanceRef.current.addAnnotation(annotation);
        annotationsRef.current.push(annotation);
      }
    });
  }, [createCustomCallout, getMarkerIcon, hideFilters]);
  
  useEffect(() => {
    if (!window.mapkit) {
      const script = document.createElement('script');
      script.src = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js';
      script.async = true;
      script.onload = () => {
        window.mapkit.init({
          authorizationCallback: (done: (token: string) => void) => {
            done(import.meta.env.VITE_MAPKIT_TOKEN);
          },
          language: mapKitConfig.language,
          libraries: ["services"]
        });
        initializeMap();
      };
      document.head.appendChild(script);
    } else if (!mapInstanceRef.current) {
      initializeMap();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.removeEventListener('zoom-start', hideFilters);
        mapInstanceRef.current.removeEventListener('pan-start', hideFilters);
        mapInstanceRef.current.removeEventListener('single-tap', hideFilters);
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
        annotationsRef.current = [];
      }
    };
  }, [initializeMap, hideFilters]);

  useEffect(() => {
    if (mapInstanceRef.current) {
      annotationsRef.current.forEach(annotation => {
        annotation.visible = selectedSports.includes(annotation.data.sport);
      });
    }
  }, [selectedSports]);

  const toggleFilters = useCallback(() => {
    setIsFiltersVisible(prev => !prev);
  }, []);

  return (
    <div className="map-container">
      <div ref={mapRef} className="map" aria-label="Map of sport locations" />
      <div className="social-links">
        <a 
          href="https://www.instagram.com/sporterabrno" 
          target="_blank" 
          rel="noopener noreferrer"
          className="social-link instagram-link"
        >
          <img src="/images/instagram_logo.svg" alt="Follow us on Instagram" className="social-logo" />
        </a>
        <a 
          href="https://www.tiktok.com/@sporterabrno" 
          target="_blank" 
          rel="noopener noreferrer"
          className="social-link tiktok-link"
        >
          <img src="/images/tiktok_logo.svg" alt="Follow us on TikTok" className="social-logo" />
        </a>
      </div>
      <button 
        className={`filter-toggle-button ${isFiltersVisible ? 'hidden' : ''}`}
        onClick={toggleFilters}
        aria-label="Toggle sport filters"
      >
        <img src="/images/logo.png" alt="Sportera logo" />
      </button>
      <div className={`filters-container ${isFiltersVisible ? 'visible' : ''}`}>
        <SportFilters selectedSports={selectedSports} onToggleSport={toggleSport} />
      </div>
      {lightboxImages.length > 0 && (
        <Lightbox 
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxImages([])}
          onNavigate={(newIndex) => setLightboxIndex(newIndex)}
        />
      )}
      <OpenMeteoWeatherOverlay coordinate={brnoCoordinates} />
    </div>
  );
});

export default Map;