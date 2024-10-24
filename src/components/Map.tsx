import React from 'react';
import { MapContainer as LeafletMapContainer, TileLayer, Circle, Marker, useMap } from 'react-leaflet';
import { useTransactionStore } from '../store/useTransactionStore';
import { useLocationTracking } from '../hooks/useLocationTracking';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

// Fix for default marker icons in React-Leaflet
const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationUpdater() {
  const map = useMap();
  const { location } = useLocationTracking();

  React.useEffect(() => {
    if (location) {
      map.setView([location.lat, location.lng], map.getZoom());
    }
  }, [location, map]);

  return null;
}

export function Map() {
  const { location } = useLocationTracking();
  const activeTransaction = useTransactionStore((state) => state.activeTransaction);

  if (!location) {
    return (
      <div className="h-full bg-gray-800 rounded-xl flex items-center justify-center">
        <p className="text-gray-400">Acquiring location...</p>
      </div>
    );
  }

  return (
    <LeafletMapContainer
      center={[location.lat, location.lng]}
      zoom={15}
      className="h-full rounded-xl overflow-hidden"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <Marker position={[location.lat, location.lng]} icon={defaultIcon} />
      
      {activeTransaction && (
        <>
          <Circle
            center={[
              activeTransaction.location!.lat,
              activeTransaction.location!.lng
            ]}
            radius={activeTransaction.proximityRadius}
            pathOptions={{ color: 'emerald', fillColor: 'emerald' }}
          />
          <Marker
            position={[
              activeTransaction.location!.lat,
              activeTransaction.location!.lng
            ]}
            icon={defaultIcon}
          />
        </>
      )}
      
      <LocationUpdater />
    </LeafletMapContainer>
  );
}