import React, { useEffect, useRef, useState } from 'react';
import { hereApi } from '../services/hereApi';
import { decode } from '@mapbox/polyline';

interface MapProps {
  userLocation: { lat: number; lng: number };
  hospitalLocation: { lat: number; lng: number };
  onRouteLoaded?: (route: any) => void;
}

declare global {
  interface Window {
    H: any;
    initHereMaps?: () => void;
  }
}

const Map: React.FC<MapProps> = ({ userLocation, hospitalLocation, onRouteLoaded }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const routeLineRef = useRef<any>(null);
  const [mapError, setMapError] = useState<string>('');
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const initializationPromise = useRef<Promise<void> | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadMapModules = async () => {
      try {
        console.log('Starting HERE Maps module loading...');
        
        // Wait for the container to be properly sized
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Create initialization promise
        initializationPromise.current = new Promise<void>((resolve, reject) => {
          window.initHereMaps = () => {
            console.log('HERE Maps initialization callback triggered');
            if (isMounted) {
              setIsMapLoaded(true);
              initializeMap();
              resolve();
            }
          };

          // Load core module first with callback
          const coreScript = document.createElement('script');
          coreScript.src = 'https://js.api.here.com/v3/3.1/mapsjs-core.js';
          coreScript.async = true;
          coreScript.onload = () => {
            console.log('Core module loaded');
            // Load additional modules
            const modules = ['service', 'ui', 'mapevents', 'clustering'];
            let loadedModules = 0;

            modules.forEach(module => {
              const script = document.createElement('script');
              script.src = `https://js.api.here.com/v3/3.1/mapsjs-${module}.js`;
              script.async = true;
              script.onload = () => {
                loadedModules++;
                console.log(`Module ${module} loaded (${loadedModules}/${modules.length})`);
                if (loadedModules === modules.length) {
                  console.log('All modules loaded, triggering initialization');
                  window.initHereMaps?.();
                }
              };
              script.onerror = (error) => {
                console.error(`Failed to load module ${module}:`, error);
                reject(new Error(`Failed to load module ${module}`));
              };
              document.head.appendChild(script);
            });
          };
          coreScript.onerror = (error) => {
            console.error('Failed to load core module:', error);
            reject(new Error('Failed to load core module'));
          };
          document.head.appendChild(coreScript);
        });

        // Wait for initialization
        await initializationPromise.current;
      } catch (error) {
        console.error('Error loading map modules:', error);
        if (isMounted) {
          setMapError('Failed to load map modules. Please refresh the page.');
        }
      }
    };

    loadMapModules();

    return () => {
      isMounted = false;
      // Cleanup
      if (mapInstance.current) {
        mapInstance.current.dispose();
      }
      markersRef.current.forEach(marker => marker.dispose());
      if (routeLineRef.current) {
        routeLineRef.current.dispose();
      }
      // Clean up global callback
      window.initHereMaps = undefined;
    };
  }, []);

  useEffect(() => {
    if (isMapLoaded && mapInstance.current && userLocation && hospitalLocation) {
      updateMap();
    }
  }, [isMapLoaded, userLocation, hospitalLocation]);

  const initializeMap = () => {
    if (!mapRef.current) {
      console.error('Map container not available');
      return;
    }

    if (!window.H || !window.H.service || !window.H.ui) {
      console.error('HERE Maps not fully loaded');
      setMapError('HERE Maps not fully loaded. Please refresh the page.');
      return;
    }

    try {
      console.log('Initializing map...');
      
      // Initialize the platform
      const platform = new window.H.service.Platform({
        apikey: '4EDNLlWOUfLaUaxZlQ41R4p7BRIhBB0TS_kL_LwHCKA'
      });

      // Get the default map types from the platform object
      const defaultLayers = platform.createDefaultLayers();

      // Validate coordinates
      if (!userLocation || !hospitalLocation) {
        throw new Error('Invalid coordinates provided');
      }

      console.log('Creating map instance...');
      // Initialize the map with user's location as center
      mapInstance.current = new window.H.Map(
        mapRef.current,
        defaultLayers.vector.normal.map,
        {
          zoom: 12,
          center: { lat: userLocation.lat, lng: userLocation.lng },
          pixelRatio: window.devicePixelRatio || 1,
          padding: { top: 50, right: 50, bottom: 50, left: 50 }
        }
      );

      // Force a resize event to ensure proper rendering
      setTimeout(() => {
        if (mapInstance.current) {
          mapInstance.current.getViewPort().resize();
        }
      }, 100);

      console.log('Setting up map behavior...');
      // Enable the event system
      const behavior = new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(mapInstance.current));

      console.log('Creating UI...');
      // Create the default UI with specific options
      const ui = window.H.ui.UI.createDefault(mapInstance.current, defaultLayers, 'en-US');

      // Configure map settings
      const mapSettings = ui.getControl('mapsettings');
      if (mapSettings) {
        mapSettings.setAlignment('top-right');
      }

      // Configure zoom control
      const zoomControl = ui.getControl('zoom');
      if (zoomControl) {
        zoomControl.setAlignment('top-right');
      }

      // Enable traffic layer
      mapInstance.current.addLayer(defaultLayers.vector.traffic.map);

      // Set default map type to normal
      mapInstance.current.setBaseLayer(defaultLayers.vector.normal.map);

      console.log('Map initialized successfully');
      // Add markers and route
      updateMap();
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Failed to initialize map. Please check your location settings and try again.');
    }
  };

  // Fix TypeScript errors for polyline decoding
  const decodePolyline = (encoded: string): Array<[number, number]> => {
    return decode(encoded) as Array<[number, number]>;
  };

  const updateMap = async () => {
    if (!mapInstance.current || !userLocation || !hospitalLocation) {
      setMapError('Invalid map state or coordinates');
      return;
    }

    try {
      // Clear existing markers and route
      markersRef.current.forEach(marker => marker.dispose());
      markersRef.current = [];
      if (routeLineRef.current) {
        routeLineRef.current.dispose();
      }

      // Add user location marker with custom icon
      const userMarker = new window.H.map.Marker(
        { lat: userLocation.lat, lng: userLocation.lng },
        { 
          icon: new window.H.map.Icon('/user-marker.svg', { 
            size: { w: 32, h: 32 },
            anchor: { x: 16, y: 16 }
          }) 
        }
      );
      mapInstance.current.addObject(userMarker);
      markersRef.current.push(userMarker);

      // Add hospital marker with custom icon
      const hospitalMarker = new window.H.map.Marker(
        { lat: hospitalLocation.lat, lng: hospitalLocation.lng },
        { 
          icon: new window.H.map.Icon('/hospital-marker.svg', { 
            size: { w: 32, h: 32 },
            anchor: { x: 16, y: 16 }
          }) 
        }
      );
      mapInstance.current.addObject(hospitalMarker);
      markersRef.current.push(hospitalMarker);

      // Get route information
      const route = await hereApi.getRoute(userLocation, hospitalLocation);
      
      if (!route || !route.polyline) {
        throw new Error('Invalid route data received');
      }

      // Decode polyline with proper typing
      const decodedPolyline = decodePolyline(route.polyline);
      
      // Create a LineString for the polyline
      const lineString = new window.H.geo.LineString();
      decodedPolyline.forEach(([lat, lng]) => {
        lineString.pushPoint(new window.H.geo.Point(lat, lng));
      });

      // Create route line with traffic color
      const routeLine = new window.H.map.Polyline(
        lineString,
        {
          style: {
            lineWidth: 4,
            strokeColor: getTrafficColor(route.traffic?.status || 'free')
          }
        }
      );
      mapInstance.current.addObject(routeLine);
      routeLineRef.current = routeLine;

      // Fit map to show all markers and route with padding
      const bounds = new window.H.geo.Rect(
        Math.min(userLocation.lat, hospitalLocation.lat),
        Math.min(userLocation.lng, hospitalLocation.lng),
        Math.max(userLocation.lat, hospitalLocation.lat),
        Math.max(userLocation.lng, hospitalLocation.lng)
      );
      mapInstance.current.getViewModel().setLookAtData({
        bounds: bounds,
        padding: { top: 50, right: 50, bottom: 50, left: 50 }
      });

      // Force a resize event to ensure proper rendering
      setTimeout(() => {
        if (mapInstance.current) {
          mapInstance.current.getViewPort().resize();
        }
      }, 100);

      // Notify parent component about route
      if (onRouteLoaded) {
        onRouteLoaded(route);
      }
    } catch (error) {
      console.error('Error updating map:', error);
      setMapError('Failed to update map. Please try again.');
    }
  };

  const getTrafficColor = (status: 'free' | 'moderate' | 'heavy'): string => {
    switch (status) {
      case 'free':
        return '#4CAF50'; // Green
      case 'moderate':
        return '#FFC107'; // Yellow
      case 'heavy':
        return '#F44336'; // Red
      default:
        return '#2196F3'; // Blue
    }
  };

  return (
    <div className="relative w-full h-full">
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 bg-opacity-75 z-10">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p className="text-red-600">{mapError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      )}
      <div
        ref={mapRef}
        className="w-full h-full min-h-[400px]"
        style={{
          position: 'relative',
          backgroundColor: '#f0f0f0',
          overflow: 'hidden',
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  );
};

export default Map; 