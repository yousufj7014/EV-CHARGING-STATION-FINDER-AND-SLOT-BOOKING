import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MapView from './components/MapView';
import BookingModal from './components/BookingModal';
import Login from './components/Login';
import Register from './components/Register';

export default function App() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [isLoginView, setIsLoginView] = useState(true);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        // Defaults coordinates to Central Bengaluru area [lng, lat]
        const res = await axios.get(
  ${API_URL}/api/stations/nearby?lng=77.5946&lat=12.9716&maxDistance=10000
);
      } catch (err) {
        console.error("Error pulling stations", err);
      }
    };
    fetchStations();
  }, []);

  const handleAuthSuccess = (receivedToken, receivedUser) => {
    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem('token', receivedToken);
    localStorage.setItem('user', JSON.stringify(receivedUser));
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
        <h1 style={{ color: '#333', margin: 0 }}>⚡ EV Station Hub</h1>
        {token && (
          <div>
            <span style={{ marginRight: '15px' }}>Welcome, <strong>{user?.name}</strong></span>
            <button onClick={handleLogout} style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
          </div>
        )}
      </header>

      {!token ? (
        <div>
          <p style={{ textAlign: 'center', color: '#555' }}>You must be authenticated to check real slot availability or make bookings.</p>
          {isLoginView ? (
            <Login onAuthSuccess={handleAuthSuccess} toggleAuth={() => setIsLoginView(false)} />
          ) : (
            <Register onAuthSuccess={handleAuthSuccess} toggleAuth={() => setIsLoginView(true)} />
          )}
        </div>
      ) : (
        <div>
          <MapView stations={stations} onSelectStation={setSelectedStation} />
          {selectedStation && (
            <BookingModal 
              station={selectedStation} 
              token={token} 
              onClose={() => setSelectedStation(null)} 
            />
          )}
        </div>
      )}
    </div>
  );
}
