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
    <div className='body bg-dark text-light'>
      <Header />
      <main>App will display here</main>
      <Footer />
    </div>
  );
}
