export const mapKitConfig = {
  language: "cs",
  initialRegion: {
    latitude: 49.2051,
    longitude: 16.6068,
    latitudeDelta: 0.06,
    longitudeDelta: 0.06
  },
  mapSettings: {
    showsZoomControl: false,
    showsMapTypeControl: true,
    showsPointsOfInterest: false,
    showsUserLocation: true,
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