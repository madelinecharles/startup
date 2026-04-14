import { useEffect, useState } from 'react';
import { DrinkEvent, DrinkNotifier } from '../leaderboard/drinkNotifier';
import './dashboard.css';

const GOAL_OZ = 100;

function getWeekStart() {
  const date = new Date();
  date.setDate(date.getDate() - date.getDay());
  return date.toLocaleDateString();
}

function getRankLabel(pct) {
  if (pct >= 100) return 'Hydration Master';
  if (pct >= 75) return 'Almost There';
  if (pct >= 50) return 'Halfway Hero';
  if (pct >= 25) return 'Getting Started';
  return 'Just Beginning';
}

function getTreeImage(pct, currentStreak) {
  if (pct >= 100) {
    const fullyGrown = [
      { src: '/tree with leaves.png', label: 'Tree with Leaves' },
      { src: '/apple tree.png', label: 'Apple Tree' },
      { src: '/orange tree.png', label: 'Orange Tree' },
      { src: '/watermelon tree.png', label: 'Watermelon Tree' },
      { src: '/Peach tree.png', label: 'Peach Tree' },
      { src: '/pineapple tree.png', label: 'Pineapple Tree' },
      { src: '/grapes tree.png', label: 'Grapes Tree' },
      { src: '/tree of life.png', label: 'Tree of Life', weekComplete: true },
    ];
    const index = Math.min(currentStreak, fullyGrown.length - 1);
    return fullyGrown[index];
  }

  if (pct >= 75) return { src: '/tree.png', label: 'Tree' };
  if (pct >= 50) return { src: '/more sapling.png', label: 'Growing Sapling' };
  if (pct >= 25) return { src: '/sapling.png', label: 'Sapling' };
  return null;
}

export default function Dashboard({ userName, onLogout }) {
  const [streak, setStreak] = useState(0);
  const [intake, setIntake] = useState(0);
  const [weeklyTotal, setWeeklyTotal] = useState(0);
  const [temperature, setTemperature] = useState(null);

  useEffect(() => {
    fetch('/api/user/data')
      .then(async res => {
        if (res.status === 401) {
          onLogout?.();
          throw new Error('Unauthorized');
        }
        return await res.json();
      })
      .then(data => {
        const today = new Date().toLocaleDateString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toLocaleDateString();

        const currentIntake = data.lastDate === today ? data.intake : 0;
        const currentWeekly = data.weekStart === getWeekStart() ? data.weeklyTotal : 0;

        let currentStreak = data.streak || 0;
        if (data.lastDate === yesterdayStr) {
          currentStreak += 1;
        } else if (data.lastDate !== today) {
          currentStreak = 0;
        }

        setIntake(currentIntake);
        setWeeklyTotal(currentWeekly);
        setStreak(currentStreak);
      })
      .catch(() => {});

    fetch('https://api.open-meteo.com/v1/forecast?latitude=40.25&longitude=111.625&current=temperature_2m&temperature_unit=fahrenheit')
      .then(res => res.json())
      .then(data => setTemperature(data.current.temperature_2m));
  }, [onLogout]);

  function saveToBackend(newIntake, newWeekly, newStreak) {
    const tree = getTreeImage(Math.min(Math.round((newIntake / GOAL_OZ) * 100), 100), newStreak);
    fetch('/api/user/data', {
      method: 'POST',
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
      body: JSON.stringify({
        streak: newStreak,
        intake: newIntake,
        weeklyTotal: newWeekly,
        lastDate: new Date().toLocaleDateString(),
        weekStart: getWeekStart(),
        treeLabel: tree ? tree.label : 'No tree yet',
        treeSrc: tree ? tree.src : null,
      }),
    }).then(res => {
      if (res.status === 401) {
        onLogout?.();
      }
    });
  }

  function logWater() {
    const newIntake = intake + 8;
    const newWeekly = weeklyTotal + 8;
    setIntake(newIntake);
    setWeeklyTotal(newWeekly);
    saveToBackend(newIntake, newWeekly, streak);
    DrinkNotifier.sendEvent(userName, DrinkEvent.Log, { oz: 8 });
  }

  function newDay() {
    const newStreak = streak + 1;
    setIntake(0);
    setStreak(newStreak);
    saveToBackend(0, weeklyTotal, newStreak);
  }

  const pct = Math.min(Math.round((intake / GOAL_OZ) * 100), 100);
  const treeImage = getTreeImage(pct, streak);
  const dayLabel = streak === 1 ? 'day' : 'days';
  const title = userName
    ? `${userName.split('@')[0]}'s ${streak} consecutive ${dayLabel}`
    : `${streak} consecutive ${dayLabel}`;
  const rankLabel = getRankLabel(pct);

  return (
    <main className="container-fluid">
      <div className="text-center my-3">
        <h2 className="fw-bold">{title}</h2>
        {temperature !== null && (
          <div className="alert alert-info">
            {temperature >= 80 ? (
              <span>&#127777; It's {temperature}F today, so drink extra water!</span>
            ) : (
              <span>&#127780; It's {temperature}F today, so stay hydrated!</span>
            )}
          </div>
        )}
      </div>

      <div className="dashboard-grid">
        <div>
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Today's Progress</h5>
              <label className="form-label">
                Hydration Goal ({intake} / {GOAL_OZ} oz)
              </label>
              <div className="progress mb-3" style={{ height: '22px' }}>
                <div
                  className="progress-bar bg-primary"
                  role="progressbar"
                  style={{ width: `${Math.min((intake / GOAL_OZ) * 100, 100)}%` }}
                  aria-valuenow={intake}
                  aria-valuemin="0"
                  aria-valuemax={GOAL_OZ}
                >
                  {pct}%
                </div>
              </div>
              <span className="badge bg-success mb-2">&#128293; {streak}-Day Streak</span>
              <button className="btn btn-primary ms-2" onClick={logWater}>
                + Log Water Intake
              </button>
              <button className="btn btn-secondary ms-2" onClick={newDay}>
                New Day
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Your Virtual Tree</h5>
              {treeImage ? (
                <>
                  <img src={treeImage.src} alt={treeImage.label} style={{ maxHeight: '180px' }} />
                  {treeImage.weekComplete && (
                    <p className="fw-bold mt-2" style={{ color: '#1a237e' }}>
                      You have accomplished a whole week. You have reached the Tree of Life!
                    </p>
                  )}
                </>
              ) : (
                <p className="text-muted">Keep drinking! Your tree will appear at 25%.</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Your Stats</h5>
              <ul className="list-unstyled">
                <li>&#128221; Current streak: <strong>{streak} {dayLabel}</strong></li>
                <li>&#128167; Total this week: <strong>{weeklyTotal} oz</strong></li>
                <li>&#127795; Tree level: <strong>{treeImage ? treeImage.label : 'No tree yet'}</strong></li>
                <li>&#127941; Rank: <strong>{rankLabel}</strong></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
