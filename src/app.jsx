import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

function Header() {
  return (
    <header>
      <nav className="navbar fixed-top navbar-dark bg-primary">
        <a className="navbar-brand" href="#">💧 Drinkly</a>
        <menu className="navbar-nav">
          <li className="nav-item"><a className="nav-link" href="/">Home</a></li>
          <li className="nav-item"><a className="nav-link" href="/dashboard">Dashboard</a></li>
          <li className="nav-item"><a className="nav-link" href="/leaderboard">Leaderboard</a></li>
          <li className="nav-item"><a className="nav-link" href="/about">About</a></li>
        </menu>
      </nav>
    </header>
  );
}

export default function App() {
  return (
    <div className='body bg-dark text-light'>
      <Header />
    </div>
  );
}
