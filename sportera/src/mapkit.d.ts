declare namespace mapkit {
  class Map {
    constructor(container: HTMLElement, options?: MapConstructorOptions);
    addAnnotation(annotation: Annotation): void;
    addEventListener(type: string, listener: Function): void;
    destroy(): void;
  }

  class Coordinate {
    constructor(latitude: number, longitude: number);
  }

  class CoordinateSpan {
    constructor(latitudeDelta: number, longitudeDelta: number);
  }

  class CoordinateRegion {
    constructor(center: Coordinate, span: CoordinateSpan);
  }

  class Annotation {
    constructor(coordinate: Coordinate, factory: (coordinate: Coordinate) => Element);
  }

  class MarkerAnnotation extends Annotation {
    constructor(coordinate: Coordinate, options?: MarkerAnnotationConstructorOptions);
  }

  interface CalloutConstructorOptions {
    title?: string;
    subtitle?: string;
  }

  interface MarkerAnnotationConstructorOptions {
    callout?: CalloutConstructorOptions;
    displayPriority?: number;
    data?: {
      imageUrl?: string;
      glyphText?: string;
      glyphColor?: string;
      glyphBackgroundColor?: string;
    };
  }

  namespace services {
    class Weather {
      temperature(coordinate: Coordinate): Promise<WeatherData>;
      // Add other WeatherKit methods as needed
    }
  }

  interface WeatherData {
    temperature: {
      value: number;
      unit: string;
    };
    // Add other weather data properties as needed
  }

  interface MapConstructorOptions {
    center?: Coordinate;
    region?: CoordinateRegion;
    rotation?: number;
    showsZoomControl?: boolean;
    showsMapTypeControl?: boolean;
    showsCompass?: string;
    showsScale?: string;
    showsPointsOfInterest?: boolean;
    showsUserLocation?: boolean;
    isRotationEnabled?: boolean;
    libraries?: string[]; // Add this line
  }

  interface MapKitInitOptions {
    authorizationCallback: (done: (token: string) => void) => void;
    language?: string;
    libraries?: string[]; // Add this line
  }

  function init(options: MapKitInitOptions): void;

  interface MapKitEvent {
    type: string;
    target: any;
    annotation?: Annotation;
  }

  class ImageAnnotation extends Annotation {
    constructor(coordinate: Coordinate, options?: ImageAnnotationConstructorOptions);
  }

  interface ImageAnnotationConstructorOptions {
    title?: string;
    subtitle?: string;
    url: { 1: string; 2?: string; 3?: string; };
    size?: { width: number; height: number };
    anchorOffset?: DOMPoint;
    callout?: {
      calloutElementForAnnotation: (annotation: Annotation) => HTMLElement;
    };
  }

  class DOMPoint {
    constructor(x: number, y: number, z?: number, w?: number);
  }
}