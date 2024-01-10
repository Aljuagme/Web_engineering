// frontend/src/components/EventLocationInput.js
import React, { useEffect, useState, useRef, useCallback } from 'react';
// import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { useMap } from 'react-leaflet/hooks'
import { MapContainer } from 'react-leaflet/MapContainer';
import { Marker } from 'react-leaflet/Marker';
import { TileLayer } from 'react-leaflet/TileLayer';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/assets/css/leaflet.css'; // Import CSS for geosearch

const EventLocationInput = ({ onLocationSelect }) => {
    const [position, setPosition] = useState(null);
    const [map, setMap] = useState(null); // State to store the map instance
  
    // Define an icon for the marker to ensure it renders correctly
    const defaultIcon = new L.Icon({
      iconUrl: require('leaflet/dist/images/marker-icon.png'),
      iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
      shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      shadowSize: [41, 41]
    });
  
    useEffect(() => {
      // Attempt to get the user's current location
      navigator.geolocation.getCurrentPosition(
        (geoPosition) => {
          const coords = [geoPosition.coords.latitude, geoPosition.coords.longitude];
          
          setPosition(coords);
          onLocationSelect(coords);
  
          // If map instance is available, fly to the user's position
          if (map) {
            map.flyTo(coords, 13); // Zoom level of 13
          }
        },
        () => {
          console.error('Geolocation is not enabled on this device or permission was denied.');
          const defaultCoords = [51.505, -0.09]; // Coordinates of London
          setPosition(defaultCoords); // Default location if geoPosition fails
          onLocationSelect(defaultCoords);
        }
      );
    }, [map, onLocationSelect]);

    // Component to handle map events and return a draggable marker
    const LocationMarker = () => {
        const map = useMap();
      
        useEffect(() => {
          // If position is already set (e.g., through dragging), do not auto-locate.
          if (position) return;
      
          // This will only re-center the map on the current location when position state is null.
          map.locate().on('locationfound', function (e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
            onLocationSelect(e.latlng);
          });
        }, [map, position, setPosition, onLocationSelect]);
      
        return position === null ? null : (
          <Marker
            position={position}
            icon={defaultIcon}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const newPosition = marker.getLatLng();
                setPosition(newPosition);
                onLocationSelect(newPosition);
              },
            }}
          />
        );
    };
  
    return (
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        whenCreated={setMap}
        style={{ height: '250px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <LocationMarker />
      </MapContainer>
    );
};

export default EventLocationInput;