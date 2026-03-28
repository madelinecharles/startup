import './dashboard.css';

export default function Dashboard() {
  return (
    <main className="container-fluid">
      <div className="dashboard-grid">

        {/* Left: Progress + Tree */}
        <div>
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Today's Progress</h5>
              <label className="form-label">Hydration Goal (50 / 100 oz)</label>
              <div className="progress mb-3" style={{ height: '22px' }}>
                <div
                  className="progress-bar bg-primary"
                  role="progressbar"
                  style={{ width: '50%' }}
                  aria-valuenow="50"
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  50%
                </div>
              </div>
              <span className="badge bg-success mb-2">🔥 5-Day Streak</span>
              <button className="btn btn-primary">+ Log Water Intake</button>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Your Virtual Tree</h5>
              <div>
                <p>Your tree grows as you stay hydrated!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Notifications + Stats */}
        <div>
<div className="card">
            <div className="card-body">
              <h5 className="card-title">Your Stats</h5>
              <ul className="list-unstyled">
                <li>📅 Current streak: <strong></strong></li>
                <li>💧 Total this week: <strong></strong></li>
                <li>🌳 Tree level: <strong></strong></li>
                <li>🏅 Rank: <strong></strong></li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
