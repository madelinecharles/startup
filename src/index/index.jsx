import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

function Unauthenticated({ onLogin }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  async function loginOrCreate(endpoint) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({ name, password }),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      });

      if (response.ok) {
        onLogin(name);
        return;
      }

      const body = await response.json().catch(() => ({}));
      setErrorMsg(`Warning: ${body.msg || 'Something went wrong. Please try again.'}`);
    } catch {
      setErrorMsg('Warning: Could not reach the server.');
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1 className="text-center fw-bold mb-2" style={{ color: '#1a237e' }}>
          &#128167; Welcome to Drinkly
        </h1>

        <p className="text-center text-muted mb-4">
          To create an account just type your name and password and click <strong>Create Account</strong>.
        </p>

        <div className="input-group mb-3">
          <span className="input-group-text">&#128100;</span>
          <input
            className="form-control"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
          />
        </div>

        <div className="input-group mb-3">
          <span className="input-group-text">&#128274;</span>
          <input
            className="form-control"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>

        {errorMsg && (
          <div className="alert alert-danger py-2">{errorMsg}</div>
        )}

        <div className="login-buttons">
          <button
            className="btn-primary-custom"
            onClick={() => loginOrCreate('/api/auth/login')}
            disabled={!name || !password}
          >
            Login
          </button>
          <button
            className="btn-outline-custom"
            onClick={() => loginOrCreate('/api/auth/create')}
            disabled={!name || !password}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}

function Authenticated({ userName, onLogout }) {
  const navigate = useNavigate();

  async function logout() {
    await onLogout();
  }

  return (
    <div className="login-wrapper">
      <div className="login-card text-center">
        <h2 className="fw-bold mb-3" style={{ color: '#1a237e' }}>
          Welcome back, {userName}! &#128167;
        </h2>
        <div className="login-buttons">
          <button className="btn-primary-custom" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </button>
          <button className="btn-outline-custom" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Login({ userName, onLogin, onLogout }) {
  return (
    <main className="container-fluid">
      {userName
        ? <Authenticated userName={userName} onLogout={onLogout} />
        : <Unauthenticated onLogin={onLogin} />}
    </main>
  );
}
