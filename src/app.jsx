import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import Login from './index/index';
import Dashboard from './dashboard/dashboard';
import Leaderboard from './leaderboard/leaderboard';
import About from './about/about';

function Header() {
  return (
    <header>
      <nav className="navbar fixed-top navbar-dark bg-primary">
        <a className="navbar-brand" href="#">💧 Drinkly</a>
        <menu className="navbar-nav">
          <li className="nav-item"><NavLink className="nav-link" to="/">Home</NavLink></li>
          <li className="nav-item"><NavLink className="nav-link" to="/dashboard">Dashboard</NavLink></li>
          <li className="nav-item"><NavLink className="nav-link" to="/leaderboard">Leaderboard</NavLink></li>
          <li className="nav-item"><NavLink className="nav-link" to="/about">About</NavLink></li>
        </menu>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-dark text-white-50">
      <div className="container-fluid d-flex justify-content-between">
        <span className="text-reset">Madeline Xu</span>
        <a className="text-reset" href="https://github.com/madelinecharles/startup" target="_blank">GitHub</a>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className='body bg-dark text-light'>
        <Header />
        <main className="container-fluid">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
