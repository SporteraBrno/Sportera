export const mapKitConfig = {
  language: "cs",
  initialRegion: {
    latitude: 49.2051,
    longitude: 16.6068,
    latitudeDelta: 0.14,
    longitudeDelta: 0.14
  },
  mapSettings: {
    showsUserLocation: true,
    showsZoomControl: false,
    showsMapTypeControl: true,
    showsPointsOfInterest: false,
    isRotationEnabled: true,
    showsCompass: "hidden",
    showsScale: "hidden"
  },
  poiFilter: [
    "Airport",
    "BusStation",
    "SubwayStation",
    "TrainStation",
    "TramStation"
  ],
  libraries: ['services']  // Add this line to include WeatherKit
};