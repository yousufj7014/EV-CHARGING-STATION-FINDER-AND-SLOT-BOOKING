import React, { useState } from 'react';
import axios from 'axios';

export default function Login({ onAuthSuccess, toggleAuth }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, formData);
      onAuthSuccess(res.data.token, res.data.user);
    } catch (err) {
      setError(err.response?.data?.msg || 'Invalid credentials');
    }
  };

  return (
    <div style={styles.card}>
      <h2>Account Login</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input type="email" placeholder="Email Address" required onChange={e => setFormData({...formData, email: e.target.value})} style={styles.input} />
        <input type="password" placeholder="Password" required onChange={e => setFormData({...formData, password: e.target.value})} style={styles.input} />
        <button type="submit" style={styles.btnPrimary}>Log In</button>
      </form>
      <p style={styles.switchText}>Don't have an account? <span onClick={toggleAuth} style={styles.link}>Register here</span></p>
    </div>
  );
}

const styles = {
  card: { border: '1px solid #ddd', padding: '20px', borderRadius: '8px', background: '#fff', maxWidth: '400px', margin: '20px auto' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  input: { padding: '10px', borderRadius: '4px', border: '1px solid #ccc' },
  btnPrimary: { background: '#007bff', color: '#fff', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  error: { color: 'red', fontWeight: 'bold' },
  switchText: { textAlign: 'center', marginTop: '15px' },
  link: { color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }
};
