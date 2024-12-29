import React, { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { mapKitConfig } from '@config/mapConfig';
import places from '../data/places.json';
import decathlons from '../data/decathlons.json';
import * as markers from '../assets/markers';
import SportFilters from './SportFilters';
import Lightbox from './LightBox';
import OpenMeteoWeatherOverlay from './WeatherOverlay';
import SignUpPopup from './SignUpPopup';
import { storage } from '../firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import './styles/Map.css';
import './styles/Filters.css';
import './styles/SocialLinks.css';
import './styles/Callouts.css';
import './styles/Lightbox.css';
import './styles/WeatherOverlay.css';

// Global type declarations
declare global {
  interface Window {
    mapkit: any;
  }
}

// Sport type definitions
type BaseSport = 'bas' | 'foo' | 'wor' | 'ska' | 'pin' | 'par' | 'vol' | 'bou' | 'ten';
type MultiSport = 'bf' | 'bfv';
type SportType = BaseSport | MultiSport;

// Constants
const BASE_SPORTS = [
  'bas', 'foo', 'wor', 'ska', 'pin', 'par', 'vol', 'bou', 'ten'
] as const;

// Interface definitions
interface Place {
  Name: string;
  Latitude: number;
  Longitude: number;
  Sport: SportType;
  Description: string;
  Opening: string;
  Folder: string;
  Rating?: number;
  Reel?: string;
}

interface Decathlon {
  Name: string;
  Latitude: number;
  Longitude: number;
  Description: string;
  reel?: string;
}

interface MapProps {
  onFilterToggle: () => void;
}

interface RatingPopupPosition {
  x: number;
  y: number;
}

// Map component
const Map: React.FC<MapProps> = React.memo(({ onFilterToggle }) => {
  // Constants
  const BRNO_COORDINATES = { latitude: 49.1951, longitude: 16.6068 };
  const INITIAL_SPORTS = BASE_SPORTS.filter(
    sport => !['bf', 'bfv'].includes(sport)
  ) as BaseSport[];

  // Refs
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const annotationsRef = useRef<ReturnType<typeof window.mapkit.ImageAnnotation>[]>([]);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // State
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [selectedSports, setSelectedSports] = useState<BaseSport[]>(INITIAL_SPORTS);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [ratingPopupVisible, setRatingPopupVisible] = useState(false);
  const [ratingPopupPosition, setRatingPopupPosition] = useState<RatingPopupPosition>({ x: 0, y: 0 });

  const navigate = useNavigate();

  // Callbacks
  const hideFilters = useCallback(() => {
    setIsFiltersVisible(false);
  }, []);

  const getMarkerIcon = useCallback((sport: SportType): string => {
    const markerMap: Record<SportType, string> = {
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
    return markerMap[sport];
  }, []);

  const updateMarkerVisibility = useCallback((activeSports: BaseSport[]) => {
    if (!mapInstanceRef.current || !annotationsRef.current) return;
  
    annotationsRef.current.forEach(annotation => {
      if (!annotation || !annotation.data) return;
  
      if (annotation.data.isDecathlon) {
        annotation.visible = true;
        return;
      }
  
      const sport = annotation.data.sport as SportType;
      if (!sport) return;
  
      // For single sport locations, simple check
      if (BASE_SPORTS.includes(sport as BaseSport)) {
        annotation.visible = activeSports.includes(sport as BaseSport);
        return;
      }
  
      // For bf locations (basketball + football)
      if (sport === 'bf') {
        annotation.visible = activeSports.some(s => ['bas', 'foo'].includes(s));
        return;
      }
  
      // For bfv locations (basketball + football + volleyball)
      if (sport === 'bfv') {
        annotation.visible = activeSports.some(s => ['bas', 'foo', 'vol'].includes(s));
      }
    });
  }, []);

  const loadImagesForLightbox = useCallback((folder: string) => {
    const MAX_IMAGES = 10;
    const imagePaths: string[] = [];
    
    const checkImage = async (index: number) => {
      if (index > MAX_IMAGES) {
        if (imagePaths.length > 0) {
          setLightboxImages(imagePaths);
          setLightboxIndex(0);
        }
        return;
      }

      try {
        const path = `places/brno/${folder}/${folder}${index}.jpg`;
        const imageRef = ref(storage, path);
        await getDownloadURL(imageRef);
        imagePaths.push(path);
        await checkImage(index + 1);
      } catch (error) {
        if (imagePaths.length > 0) {
          setLightboxImages(imagePaths);
          setLightboxIndex(0);
        }
      }
    };

    checkImage(1).catch(console.error);
  }, []);

  const createCustomCallout = useCallback((annotation: any) => {
    const div = document.createElement("div");
    div.className = "custom-callout";
    div.setAttribute('role', 'dialog');
    div.setAttribute('aria-label', `Information about ${annotation.title}`);

    if (annotation.data.folder) {
      const image = document.createElement("img");
      image.className = "callout-image";
      image.alt = `Fotka hřiště se načítá`;
      image.classList.add('loading');
      
      const imageRef = ref(storage, `places/brno/${annotation.data.folder}/${annotation.data.folder}1.jpg`);
      getDownloadURL(imageRef)
        .then(url => {
          image.src = url;
          image.onload = () => image.classList.remove('loading');
        })
        .catch(() => image.remove());

      image.addEventListener('click', () => {
        loadImagesForLightbox(annotation.data.folder);
      });
      div.appendChild(image);
    }

    const contentDiv = document.createElement("div");
    contentDiv.className = "callout-content";
    
    // Title
    const title = document.createElement("h2");
    title.className = "callout-title selectable";
    title.textContent = annotation.title;
    contentDiv.appendChild(title);

    // Description with links
    const description = document.createElement("p");
    description.className = "callout-description selectable";
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+\.[^\s]+)/g;
    const descriptionWithLinks = annotation.subtitle.replace(urlRegex, (url: string) => {
      const href = url.startsWith('www.') ? 'http://' + url : url;
      return `<a href="${href}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });
    description.innerHTML = descriptionWithLinks;
    contentDiv.appendChild(description);

    // Opening hours
    const openingHours = document.createElement("p");
    openingHours.className = "callout-opening-hours";
    openingHours.textContent = annotation.data.opening;
    contentDiv.appendChild(openingHours);

    // Footer with buttons
    const footer = document.createElement("div");
    footer.className = "callout-footer";

    // Navigation button
    const button = document.createElement("button");
    button.className = "callout-nav-button";
    button.innerHTML = '<img src="/images/navigate-icon.svg" alt="Navigate" />';
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const url = `https://www.google.com/maps/search/?api=1&query=${annotation.coordinate.latitude},${annotation.coordinate.longitude}`;
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        window.location.href = url;
      } else {
        window.open(url, '_blank');
      }
    });
    footer.appendChild(button);

    // Instagram reel button
    if (annotation.data.reel) {
      const reelButton = document.createElement("button");
      reelButton.className = "callout-reel-button";
      reelButton.innerHTML = '<img src="/images/instagram_logo.svg" alt="Watch Instagram Reel" />';
      reelButton.addEventListener('click', () => {
        const reelUrl = annotation.data.reel;
        const cleanReelUrl = reelUrl.split('?')[0];
        
        if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
          window.location.href = cleanReelUrl;
        } else if (/Android/i.test(navigator.userAgent)) {
          const reelId = cleanReelUrl.split('/reel/')[1].replace('/', '');
          const instagramAppUrl = `intent://instagram.com/reel/${reelId}#Intent;package=com.instagram.android;scheme=https;end`;
          window.location.href = instagramAppUrl;
          setTimeout(() => {
            window.location.href = cleanReelUrl;
          }, 2000);
        } else {
          window.open(cleanReelUrl, '_blank');
        }
      });
      footer.appendChild(reelButton);
    }

    // Rating indicator
    if (annotation.data.rating) {
      const ratingIndicator = document.createElement("div");
      ratingIndicator.className = `rating-indicator rating-${annotation.data.rating}`;
      
      const infoIcon = document.createElement("span");
      infoIcon.className = "info-icon";
      infoIcon.textContent = "i";
      
      ratingIndicator.appendChild(infoIcon);
      ratingIndicator.addEventListener('click', (e) => {
        e.stopPropagation();
        const rect = ratingIndicator.getBoundingClientRect();
        const mapRect = mapContainerRef.current?.getBoundingClientRect();
        if (mapRect) {
          setRatingPopupPosition({
            x: rect.left - mapRect.left,
            y: rect.bottom - mapRect.top + 5
          });
          setRatingPopupVisible(prev => !prev);
        }
      });
      footer.appendChild(ratingIndicator);
    }

    contentDiv.appendChild(footer);
    div.appendChild(contentDiv);
    return div;
  }, [loadImagesForLightbox]);

  // Initialize map and markers
  const initializeMap = useCallback(() => {
    if (mapInstanceRef.current || !mapRef.current || !window.mapkit) return;

    const { latitude, longitude, latitudeDelta, longitudeDelta } = mapKitConfig.initialRegion;
    const center = new window.mapkit.Coordinate(latitude, longitude);
    const span = new window.mapkit.CoordinateSpan(latitudeDelta, longitudeDelta);

    // Create map instance
    mapInstanceRef.current = new window.mapkit.Map(mapRef.current, {
      center,
      region: new window.mapkit.CoordinateRegion(center, span),
      ...mapKitConfig.mapSettings,
    });

    mapInstanceRef.current._allowWheelToZoom = true;
    mapInstanceRef.current.addEventListener('zoom-start', hideFilters);
    mapInstanceRef.current.addEventListener('pan-start', hideFilters);
    mapInstanceRef.current.addEventListener('single-tap', hideFilters);

    // Clear existing annotations
    annotationsRef.current = [];

    // Create and add all markers
    type MapKitAnnotation = ReturnType<typeof window.mapkit.ImageAnnotation>;
    const allAnnotations: MapKitAnnotation[] = [];

    // Add place markers
    (places as Place[]).forEach((place) => {
      const markerIcon = getMarkerIcon(place.Sport);
      if (markerIcon) {
        const annotation = new window.mapkit.ImageAnnotation(
          new window.mapkit.Coordinate(place.Latitude, place.Longitude),
          {
            title: place.Name,
            subtitle: place.Description,
            url: { 1: markerIcon },
            size: { width: 26, height: 26 },
            anchorOffset: new window.DOMPoint(0, -15),
            callout: {
              calloutElementForAnnotation: createCustomCallout,
            },
            accessibilityLabel: place.Name,
            data: { 
              sport: place.Sport,
              folder: place.Folder,
              opening: place.Opening,
              rating: place.Rating,
              reel: place.Reel
            },
          }
        );
        allAnnotations.push(annotation);
      }
    });

    // Add decathlon markers
    decathlons.forEach((decathlon: Decathlon) => {
      const annotation = new window.mapkit.ImageAnnotation(
        new window.mapkit.Coordinate(decathlon.Latitude, decathlon.Longitude),
        {
          title: decathlon.Name,
          subtitle: decathlon.Description,
          url: { 1: markers.decathlon },
          size: { width: 32, height: 32 },
          anchorOffset: new window.DOMPoint(0, -15),
          callout: {
            calloutElementForAnnotation: (annotation: any) => {
              const div = document.createElement("div");
              div.className = "custom-callout decathlon-callout";
              
              const contentDiv = document.createElement("div");
              contentDiv.className = "callout-content";
              
              const title = document.createElement("h2");
              title.className = "callout-title selectable";
              const titleLink = document.createElement("a");
              titleLink.href = "https://www.decathlon.cz/";
              titleLink.target = "_blank";
              titleLink.rel = "noopener noreferrer";
              titleLink.textContent = annotation.title;
              title.appendChild(titleLink);
              contentDiv.appendChild(title);
              
              const description = document.createElement("p");
              description.className = "callout-description selectable";
              description.textContent = annotation.subtitle;
              contentDiv.appendChild(description);
              
              const footer = document.createElement("div");
              footer.className = "callout-footer";
              
              const button = document.createElement("button");
              button.className = "callout-nav-button";
              button.innerHTML = '<img src="/images/navigate-icon.svg" alt="Navigate" />';
              button.addEventListener('click', (e) => {
                e.preventDefault();
                const url = `https://www.google.com/maps/search/?api=1&query=${annotation.coordinate.latitude},${annotation.coordinate.longitude}`;
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                  window.location.href = url;
                } else {
                  window.open(url, '_blank');
                }
              });
              footer.appendChild(button);
            
              if (annotation.data.reel) {
                const reelButton = document.createElement("button");
                reelButton.className = "callout-reel-button";
                reelButton.innerHTML = '<img src="/images/instagram_logo.svg" alt="Watch Instagram Reel" />';
                reelButton.addEventListener('click', () => {
                  const reelUrl = annotation.data.reel;
                  const cleanReelUrl = reelUrl.split('?')[0];
                  
                  if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                    window.location.href = cleanReelUrl;
                  } else if (/Android/i.test(navigator.userAgent)) {
                    const reelId = cleanReelUrl.split('/reel/')[1].replace('/', '');
                    const instagramAppUrl = `intent://instagram.com/reel/${reelId}#Intent;package=com.instagram.android;scheme=https;end`;
                    window.location.href = instagramAppUrl;
                    setTimeout(() => {
                      window.location.href = cleanReelUrl;
                    }, 2000);
                  } else {
                    window.open(cleanReelUrl, '_blank');
                  }
                });
                footer.appendChild(reelButton);
              }
              
              contentDiv.appendChild(footer);
              div.appendChild(contentDiv);
              
              return div;
            }
          },
          accessibilityLabel: decathlon.Name,
          data: { isDecathlon: true, reel: decathlon.reel }
        }
      );
      allAnnotations.push(annotation);
    });

    // Add all annotations at once and store them
    mapInstanceRef.current.addAnnotations(allAnnotations);
    annotationsRef.current = allAnnotations;

    // Set initial visibility
    updateMarkerVisibility(selectedSports);
  }, [createCustomCallout, getMarkerIcon, hideFilters]);

  // Memoized sport manipulation functions
  const handleSportAddition = useCallback((sport: BaseSport, currentSports: BaseSport[]) => {
    return [...currentSports, sport];
  }, []);
  
  // Replace the handleSportRemoval function:
  const handleSportRemoval = useCallback((sport: BaseSport, currentSports: BaseSport[]) => {
    return currentSports.filter(s => s !== sport);
  }, []);
  
  // Replace the toggleSport function:
  const toggleSport = useCallback((sport: BaseSport) => {
    setSelectedSports(prev => {
      const newSelectedSports = prev.includes(sport) 
        ? handleSportRemoval(sport, prev)
        : handleSportAddition(sport, prev);
      
      queueMicrotask(() => {
        updateMarkerVisibility(newSelectedSports);
      });
      
      return newSelectedSports;
    });
  }, [handleSportRemoval, handleSportAddition, updateMarkerVisibility]);

  const toggleFilters = useCallback(() => {
    setIsFiltersVisible(prev => !prev);
    onFilterToggle();
  }, [onFilterToggle]);

  const toggleSignUp = useCallback(() => {
    setIsSignUpOpen(prev => !prev);
  }, []);

  // Initialize map and markers effect
  useEffect(() => {
    if (!window.mapkit) {
      const script = document.createElement('script');
      script.src = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js';
      script.async = true;
      
      const handleLoad = () => {
        script.removeEventListener('load', handleLoad);
        window.mapkit.init({
          authorizationCallback: (done: (token: string) => void) => {
            done(import.meta.env.VITE_MAPKIT_TOKEN);
          },
          language: mapKitConfig.language,
          libraries: ["services"]
        });
        initializeMap();
      };
      
      script.addEventListener('load', handleLoad);
      document.head.appendChild(script);
      
      return () => {
        script.removeEventListener('load', handleLoad);
      };
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
    updateMarkerVisibility(selectedSports);
  }, [selectedSports, updateMarkerVisibility]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ratingPopupVisible) {
        const target = event.target as Node;
        if (target instanceof Element && !target.closest('.rating-indicator')) {
          setRatingPopupVisible(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [ratingPopupVisible]);

  // Memoize weather coordinates
  const weatherCoordinates = useMemo(() => BRNO_COORDINATES, []);

  // Render
  return (
    <div ref={mapContainerRef} className="map-container">
      <div ref={mapRef} className="map" aria-label="Map of sport locations" />
      
      <div className="navigation-group">
        <button 
          className="sign-up-button" 
          onClick={toggleSignUp} 
          aria-label="Open sign up dialog"
        >
          Přihlásit se
        </button>

        <div className="social-links">

          <button 
            onClick={() => navigate('/info')}
            className="social-link about-link"
            aria-label="Go to About page"
          >
            <img src="/images/logo.png" alt="O nás" className="social-logo" />
          </button>
        </div>
      </div>

      <SignUpPopup isOpen={isSignUpOpen} onClose={toggleSignUp} />

      <button 
        className={`filter-toggle-button ${isFiltersVisible ? 'hidden' : ''}`}
        onClick={toggleFilters}
        aria-label="Toggle sport filters"
      >
        <img src="/images/filter-button.png" alt="Filter toggle" className="filter-button-icon" />
      </button>

      <div className={`filters-container ${isFiltersVisible ? 'visible' : ''}`}>
        <SportFilters 
          selectedSports={selectedSports} 
          onToggleSport={toggleSport}
        />
      </div>

      {lightboxImages.length > 0 && (
        <Lightbox 
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxImages([])}
          onNavigate={(newIndex) => setLightboxIndex(newIndex)}
        />
      )}

      {ratingPopupVisible && (
        <div 
          className="rating-popup"
          style={{
            position: 'absolute',
            left: `${ratingPopupPosition.x - 150}px`,
            top: `${ratingPopupPosition.y}px`,
            zIndex: 9999,
          }}
        >
          <img src="/images/rating.png" alt="Rating explanation" className="rating-popup-image" />
        </div>
      )}

      <OpenMeteoWeatherOverlay coordinate={weatherCoordinates} />
    </div>
  );
});

export default Map;