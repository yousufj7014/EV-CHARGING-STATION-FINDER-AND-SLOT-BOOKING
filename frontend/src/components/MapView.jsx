import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fixes missing leaflet marker icons in build setups
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: markerIcon, shadowUrl: markerShadow, iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

export default function MapView({ stations, onSelectStation }) {
  const centerPosition = [12.9716, 77.5946]; // Default to Bangalore Center

  return (
    <MapContainer center={centerPosition} zoom={13} style={{ height: '400px', width: '100%', borderRadius: '8px' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {stations.map((station) => (
        <Marker key={station._id} position={[station.location.coordinates[1], station.location.coordinates[0]]}>
          <Popup>
            <div>
              <h3>{station.name}</h3>
              <p>Type: <strong>{station.chargerType}</strong></p>
              <button 
                onClick={() => onSelectStation(station)}
                style={{ background: '#007bff', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}
              >
                Book a Slot
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
