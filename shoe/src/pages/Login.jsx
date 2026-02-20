import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-logo">
          <div className="logo-icon">👟</div>
          <span className="logo-text">SHOE<sup></sup></span>
        </div>
        <h1 className="login-heading">Log In to Your Account</h1>
        {error && <div className="login-error">{error}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
          />
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'LOG IN'}
          </button>
        </form>
      </div>
      <div className="login-right">
        <div className="login-shoe-graphic">
          <div className="shoe-circles">
            <div className="circle c1"></div>
            <div className="circle c2"></div>
          </div>
          <img
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80"
            alt="Shoe"
            className="shoe-img"
          />
        </div>
      </div>
    </div>
  );
}