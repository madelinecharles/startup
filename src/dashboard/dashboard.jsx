import { useState, useEffect } from 'react';
import './dashboard.css';

export default function Dashboard({ userName }) {
  const [streak, setStreak] = useState(0);
  const [intake, setIntake] = useState(0);
  const [weeklyTotal, setWeeklyTotal] = useState(0);
  const goal = 100;

  useEffect(() => {
    const today = new Date().toLocaleDateString();

    // Streak logic
    const savedStreak = JSON.parse(localStorage.getItem('streak') || '{"days":0,"lastDate":""}');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString();

    let newStreak;
    if (savedStreak.lastDate === today) {
      newStreak = savedStreak.days;
    } else if (savedStreak.lastDate === yesterdayStr) {
      newStreak = savedStreak.days + 1;
    } else {
      newStreak = 0;
    }
    localStorage.setItem('streak', JSON.stringify({ days: newStreak, lastDate: today }));
    setStreak(newStreak);

    // Intake resets every 24 hours
    const savedIntake = JSON.parse(localStorage.getItem('intake') || '{"oz":0,"date":""}');
    if (savedIntake.date === today) {
      setIntake(savedIntake.oz);
    } else {
      localStorage.setItem('intake', JSON.stringify({ oz: 0, date: today }));
      setIntake(0);
    }

    // Weekly total: accumulate oz, reset if week has changed
    const getWeekStart = () => {
      const d = new Date();
      d.setDate(d.getDate() - d.getDay());
      return d.toLocaleDateString();
    };
    const weekStart = getWeekStart();
    const savedWeekly = JSON.parse(localStorage.getItem('weekly') || '{"oz":0,"weekStart":""}');
    if (savedWeekly.weekStart === weekStart) {
      setWeeklyTotal(savedWeekly.oz);
    } else {
      localStorage.setItem('weekly', JSON.stringify({ oz: 0, weekStart }));
      setWeeklyTotal(0);
    }
  }, []);

  function updatePlayerBoard(name, newStreak, newWeekly, newPct) {
    const today = new Date().toLocaleDateString();
    const tree = getTreeImage(newPct, newStreak);
    const treeLabel = tree ? tree.label : 'No tree yet';
    const treeSrc = tree ? tree.src : null;

    const players = JSON.parse(localStorage.getItem('players') || '[]');
    const idx = players.findIndex(p => p.name === name);
    const entry = { name, weeklyTotal: newWeekly, streak: newStreak, treeLabel, treeSrc, lastDate: today };
    if (idx >= 0) {
      players[idx] = entry;
    } else {
      players.push(entry);
    }
    localStorage.setItem('players', JSON.stringify(players));
  }

  function logWater() {
    const today = new Date().toLocaleDateString();
    const newIntake = intake + 8;
    localStorage.setItem('intake', JSON.stringify({ oz: newIntake, date: today }));
    setIntake(newIntake);

    const getWeekStart = () => {
      const d = new Date();
      d.setDate(d.getDate() - d.getDay());
      return d.toLocaleDateString();
    };
    const newWeekly = weeklyTotal + 8;
    localStorage.setItem('weekly', JSON.stringify({ oz: newWeekly, weekStart: getWeekStart() }));
    setWeeklyTotal(newWeekly);

    const newPct = Math.min(Math.round((newIntake / goal) * 100), 100);
    updatePlayerBoard(userName, streak, newWeekly, newPct);
  }

  function newDay() {
    localStorage.removeItem('intake');
    setIntake(0);

    const newStreak = streak + 1;
    const today = new Date().toLocaleDateString();
    localStorage.setItem('streak', JSON.stringify({ days: newStreak, lastDate: today }));
    setStreak(newStreak);

    updatePlayerBoard(userName, newStreak, weeklyTotal, 0);
  }

  function getTreeImage(pct, currentStreak) {
    if (pct >= 100) {
      const fullyGrown = [
        { src: '/tree with leaves.png', label: 'Tree with Leaves' },
        { src: '/apple tree.png',       label: 'Apple Tree' },
        { src: '/orange tree.png',      label: 'Orange Tree' },
        { src: '/watermelon tree.png',  label: 'Watermelon Tree' },
        { src: '/Peach tree.png',       label: 'Peach Tree' },
        { src: '/pineapple tree.png',   label: 'Pineapple Tree' },
        { src: '/grapes tree.png',      label: 'Grapes Tree' },
        { src: '/tree of life.png',     label: 'Tree of Life', weekComplete: true },
      ];
      const idx = Math.min(currentStreak, fullyGrown.length - 1);
      return fullyGrown[idx];
    }
    if (pct >= 75) return { src: '/tree.png',         label: 'Tree' };
    if (pct >= 50) return { src: '/more sapling.png', label: 'Growing Sapling' };
    if (pct >= 25) return { src: '/sapling.png',      label: 'Sapling' };
    return null;
  }

  const pct = Math.min(Math.round((intake / goal) * 100), 100);
  const treeImage = getTreeImage(pct, streak);

  return (
    <main className="container-fluid">
      <div className="text-center my-3">
        <h2 className="fw-bold">{userName ? `${userName}'s ${streak} consecutive day${streak !== 1 ? 's' : ''}` : `${streak} consecutive day${streak !== 1 ? 's' : ''}`}</h2>
      </div>
      <div className="dashboard-grid">

        {/* Left: Progress + Tree */}
        <div>
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Today's Progress</h5>
              <label className="form-label">Hydration Goal ({intake} / {goal} oz)</label>
              <div className="progress mb-3" style={{ height: '22px' }}>
                <div
                  className="progress-bar bg-primary"
                  role="progressbar"
                  style={{ width: `${Math.min((intake / goal) * 100, 100)}%` }}
                  aria-valuenow={intake}
                  aria-valuemin="0"
                  aria-valuemax={goal}
                >
                  {Math.min(Math.round((intake / goal) * 100), 100)}%
                </div>
              </div>
              <span className="badge bg-success mb-2">🔥 {streak}-Day Streak</span>
              <button className="btn btn-primary ms-2" onClick={logWater}>+ Log Water Intake</button>
              <button className="btn btn-secondary ms-2" onClick={newDay}>New Day</button>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Your Virtual Tree</h5>
              {treeImage
                ? <>
                    <img src={treeImage.src} alt={treeImage.label} style={{ maxHeight: '180px' }} />
                    {treeImage.weekComplete && (
                      <p className="fw-bold mt-2" style={{ color: '#1a237e' }}>
                        You have accomplished a whole week. You have reached the Tree of Life!
                      </p>
                    )}
                  </>
                : <p className="text-muted">Keep drinking! Your tree will appear at 25%.</p>
              }
            </div>
          </div>
        </div>

        {/* Right: Notifications + Stats */}
        <div>
<div className="card">
            <div className="card-body">
              <h5 className="card-title">Your Stats</h5>
              <ul className="list-unstyled">
                <li>📅 Current streak: <strong>{streak} day{streak !== 1 ? 's' : ''}</strong></li>
                <li>💧 Total this week: <strong>{weeklyTotal} oz</strong></li>
                <li>🌳 Tree level: <strong>{treeImage ? treeImage.label : 'No tree yet'}</strong></li>
                <li>🏅 Rank: <strong>{pct >= 100 ? 'Hydration Master' : pct >= 75 ? 'Almost There' : pct >= 50 ? 'Halfway Hero' : pct >= 25 ? 'Getting Started' : 'Just Beginning'}</strong></li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
