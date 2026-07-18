import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function BookingModal({ station, token, onClose }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchBookedSlots = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/bookings/booked-slots?stationId=${station._id}&date=${date}`);
        setBookedSlots(res.data);
      } catch (err) {
        console.error("Error fetching slots", err);
      }
    };
    fetchBookedSlots();
  }, [date, station]);

  const handleBooking = async () => {
    if (!selectedSlot) return alert('Please choose a slot first.');
    try {
      const res = await axios.post(
        'http://localhost:5000/api/bookings',
        { stationId: station._id, slot: selectedSlot, date },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.msg);
      setBookedSlots([...bookedSlots, selectedSlot]);
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Booking failed');
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', marginTop: '20px', background: '#f9f9f9' }}>
      <h2>Book Slot at {station.name}</h2>
      <label>Choose Date: </label>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ marginBottom: '10px', padding: '5px' }} />
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', margin: '15px 0' }}>
        {station.slots.map((slot) => {
          const isBooked = bookedSlots.includes(slot);
          return (
            <button
              key={slot}
              disabled={isBooked}
              onClick={() => setSelectedSlot(slot)}
              style={{
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                background: isBooked ? '#ffcccc' : selectedSlot === slot ? '#cce5ff' : '#fff',
                cursor: isBooked ? 'not-allowed' : 'pointer'
              }}
            >
              {slot} {isBooked ? '(Booked)' : ''}
            </button>
          );
        })}
      </div>
      {message && <p style={{ fontWeight: 'bold', color: 'green' }}>{message}</p>}
      <button onClick={handleBooking} style={{ background: '#28a745', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>Confirm Booking</button>
      <button onClick={onClose} style={{ background: '#6c757d', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
    </div>
  );
}
