import { useEffect, useState } from 'react';
import { DrinkEvent, DrinkNotifier } from './drinkNotifier';
import './leaderboard.css';

export default function Leaderboard({ onLogout }) {
  const [players, setPlayers] = useState([]);
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    // Fetch leaderboard from backend instead of localStorage
    fetch('/api/leaderboard')
      .then(async res => {
        if (res.status === 401) {
          onLogout?.();
          throw new Error('Unauthorized');
        }
        return await res.json();
      })
      .then(data => setPlayers(data))
      .catch(() => setPlayers([]));

    // Live activity feed (simulated — will be WebSocket later)
    function handleEvent(event) {
      if (event.type === DrinkEvent.Log) {
        setFeed((prev) => {
          const msg = `${event.from} just logged ${event.value.oz} oz`;
          const next = [msg, ...prev];
          return next.length > 5 ? next.slice(0, 5) : next;
        });
      }
    }

    DrinkNotifier.addHandler(handleEvent);
    return () => DrinkNotifier.removeHandler(handleEvent);
  }, []);

  const rows = players.length
    ? players.map((p, i) => (
        <tr key={p.name}>
          <td>{i + 1}</td>
          <td>{p.name}</td>
          <td>{p.weeklyTotal} oz</td>
          <td>{p.streak}</td>
          <td>
            {p.treeSrc
              ? <img src={p.treeSrc} alt={p.treeLabel} style={{ height: '40px' }} />
              : p.treeLabel}
          </td>
        </tr>
      ))
    : (
        <tr>
          <td colSpan="5">No active players yet. Start logging water!</td>
        </tr>
      );

  return (
    <main className="container-fluid text-center">
      <h2 className="pt-3" style={{ color: '#1a237e' }}>
        &#127942; Weekly Hydration Leaderboard
      </h2>
      <p style={{ color: '#1565c0' }}>Compete with friends and see who stays the most hydrated!</p>

      <table className="table table-hover table-striped-columns">
        <thead className="table-dark">
          <tr>
            <th>Rank</th>
            <th>User</th>
            <th>Total Intake (oz)</th>
            <th>Streak (days)</th>
            <th>Tree</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>

      <div className="mt-3">
        <h5 style={{ color: '#1a237e' }}>&#9889; Live Activity</h5>
        {feed.length === 0
          ? <p className="text-muted">Waiting for activity...</p>
          : feed.map((msg, i) => (
              <div key={i} className="text-muted" style={{ fontSize: '0.9rem' }}>
                {msg}
              </div>
            ))
        }
      </div>
    </main>
  );
}
