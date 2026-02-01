import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import { FaRegUser, FaLock, FaEnvelope, FaSignOutAlt } from 'react-icons/fa';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);

  // GİRİŞ VE KAYIT İŞLEMİ
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // --- LOGIN ---
        const response = await axios.post('http://localhost:5000/login', {
          email: email,
          password: password
        });

        // Backend'den gelen veriyi state'e alıyorum
        setUser({
          email: email,
          username: response.data.username
        });

        alert(response.data.message);
      } else {
        // --- REGISTER ---
        const response = await axios.post('http://localhost:5000/register', {
          username: username,
          email: email,
          password: password
        });
        alert(response.data.message);
        setIsLogin(true);
      }
    } catch (error) {
      alert(error.response?.data?.error || "Bir hata oluştu!");
    }
  };

  // ŞİFRE SIFIRLAMA İŞLEMİ
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/reset-password', {
        email: email,
        newPassword: newPassword
      });
      alert(response.data.message);
      setIsForgotPassword(false);
      setNewPassword('');
    } catch (error) {
      alert(error.response?.data?.error || "Sıfırlama başarısız!");
    }
  };

  // ÇIKIŞ YAPMA
  const handleLogout = () => {
    setUser(null);
    setEmail('');
    setPassword('');
    setUsername('');
    setNewPassword('');
  };

  // --- EKRAN YÖNETİMİ ---

  // 1. HOŞ GELDİN EKRANI
  if (user) {
    return (
      <div className="welcome-container">
        <div className="auth-card welcome-card">
          <h1>Welcome, {user.username}! ✨</h1>
          <p className="user-email">{user.email}</p>
          <div className="welcome-content">
            <p>You have successfully logged in. You can now access all features.</p>
          </div>
          <button className="btn logout-btn" onClick={handleLogout}>
            <FaSignOutAlt style={{ marginRight: '10px' }} /> Exit
          </button>
        </div>
      </div>
    );
  }

  // 2. ŞİFREMİ UNUTTUM EKRANI
  if (isForgotPassword) {
    return (
      <div className="auth-card">
        <h2>RESET PASSWORD</h2>
        <form onSubmit={handleResetPassword}>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <FaEnvelope className="input-icon" />
          </div>
          <div className="input-group">
            <label>New Password</label>
            <input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            <FaLock className="input-icon" />
          </div>
          <button type="submit" className="btn">Update Password</button>
        </form>
        <p className="toggle-text" style={{ marginTop: '20px' }}>
          <span onClick={() => setIsForgotPassword(false)}>Back to Login</span>
        </p>
      </div>
    );
  }

  // 3. ANA LOGIN / REGISTER EKRANI
  return (
    <>
      <nav className="navbar">
        <a href="#home">HOME</a>
        <a href="#about">ABOUT</a>
        <a href="#service">SERVICE</a>
        <a href="#contact">CONTACT</a>
      </nav>

      <div className="auth-card">
        <h2>{isLogin ? 'LOGIN' : 'REGISTER'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <label>Username</label>
              <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
              <FaRegUser className="input-icon" />
            </div>
          )}
          <div className="input-group">
            <label>Email</label>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <FaEnvelope className="input-icon" />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <FaLock className="input-icon" />
          </div>

          {isLogin && (
            <div className="forgot-password-link" style={{ textAlign: 'right', marginBottom: '15px' }}>
              <span className="forgot-password" style={{ cursor: 'pointer', fontSize: '0.9rem' }} onClick={() => setIsForgotPassword(true)}>
                Forgot Password?
              </span>
            </div>
          )}

          <button type="submit" className="btn">{isLogin ? 'Login' : 'Register'}</button>
        </form>
        <p className="toggle-text">
          {isLogin ? "Don't have an Account?" : "Already have an Account?"}
          <span onClick={() => setIsLogin(!isLogin)}>{isLogin ? ' Register' : ' Login'}</span>
        </p>
      </div>
    </>
  );
}

export default App;