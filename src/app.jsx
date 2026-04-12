import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { useEffect, useState } from 'react';
import { BrowserRouter, NavLink, Navigate, Route, Routes } from 'react-router-dom';
import Login from './index/index';
import Dashboard from './dashboard/dashboard';
import Leaderboard from './leaderboard/leaderboard';
import About from './about/about';

function Header({ userName, onLogout }) {
  return (
    <header>
      <nav className="navbar fixed-top navbar-dark bg-primary">
        <a className="navbar-brand" href="#">&#128167; Drinkly</a>
        <menu className="navbar-nav">
          <li className="nav-item"><NavLink className="nav-link" to="/">Home</NavLink></li>
          {userName && (
            <li className="nav-item"><NavLink className="nav-link" to="/dashboard">Dashboard</NavLink></li>
          )}
          {userName && (
            <li className="nav-item"><NavLink className="nav-link" to="/leaderboard">Leaderboard</NavLink></li>
          )}
          <li className="nav-item"><NavLink className="nav-link" to="/about">About</NavLink></li>
          {userName && (
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={onLogout}>Logout ({userName})</button>
            </li>
          )}
        </menu>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="container-fluid d-flex justify-content-between">
        <span className="text-reset">Madeline Xu</span>
        <a className="text-reset" href="https://github.com/xumadeline/startup" target="_blank">GitHub</a>
      </div>
    </footer>
  );
}

function ProtectedRoute({ userName, children }) {
  return userName ? children : <Navigate to="/" replace />;
}

export default function App() {
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');

  useEffect(() => {
    async function hydrateSession() {
      try {
        const response = await fetch('/api/auth/me');
        if (!response.ok) {
          localStorage.removeItem('userName');
          setUserName('');
          return;
        }

        const body = await response.json();
        localStorage.setItem('userName', body.name);
        setUserName(body.name);
      } catch {
        // Leave the app usable even when the backend is offline.
      }
    }

    hydrateSession();
  }, []);

  function onLogin(name) {
    const currentUser = localStorage.getItem('userName');
    if (currentUser !== name) {
      localStorage.removeItem('intake');
      localStorage.removeItem('streak');
    }
    localStorage.setItem('userName', name);
    setUserName(name);
  }

  function onLogout() {
    localStorage.removeItem('userName');
    setUserName('');
  }

  return (
    <BrowserRouter>
      <div className='body' style={{ backgroundColor: '#e3f2fd', color: '#1a237e', minHeight: '100vh' }}>
        <Header userName={userName} onLogout={onLogout} />
        <main className="container-fluid">
          <Routes>
            <Route path="/" element={<Login userName={userName} onLogin={onLogin} onLogout={onLogout} />} />
            <Route
              path="/dashboard"
              element={(
                <ProtectedRoute userName={userName}>
                  <Dashboard userName={userName} onLogout={onLogout} />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/leaderboard"
              element={(
                <ProtectedRoute userName={userName}>
                  <Leaderboard onLogout={onLogout} />
                </ProtectedRoute>
              )}
            />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

