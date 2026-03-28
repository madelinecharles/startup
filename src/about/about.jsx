import './about.css';

export default function About() {
  return (
    <main className="container-fluid bg-secondary text-center">
      <div>
        <h2 className="text-white pt-3">What is Drinkly?</h2>
        <p className="text-white-50">
          Drinkly is a gamified water intake tracker that turns hydration into a daily streak game.
          Log water with a single tap and watch your virtual tree grow with animations as you hit
          your personalized goals. Earn fruit rewards, unlock new tree species, and compete with
          friends on a realtime leaderboard.
        </p>

        <h4 className="text-white mt-4">Key Features</h4>
        <div className="features-grid text-start">
          <div className="feature-card">🔐 Secure login &amp; registration</div>
          <div className="feature-card">🎯 Personalized daily goals</div>
          <div className="feature-card">💧 One-tap water logging</div>
          <div className="feature-card">🌳 Animated tree growth</div>
          <div className="feature-card">🔥 Streak tracking</div>
          <div className="feature-card">🍎 Fruit rewards</div>
          <div className="feature-card">🌲 Unlockable tree types</div>
          <div className="feature-card">🏆 Weekly leaderboard</div>
          <div className="feature-card">⚡ Realtime WebSocket updates</div>
        </div>

        <h4 className="text-white mt-4">All Features</h4>
        <div className="text-start mx-auto" style={{ maxWidth: '500px' }}>
          <ul className="feature-list bg-white p-3 rounded">
            <li>Secure user registration, login, and logout</li>
            <li>Personalized daily hydration goals</li>
            <li>One-tap water intake logging</li>
            <li>Animated tree growth and rain effects</li>
            <li>Streak tracking and fruit rewards</li>
            <li>Unlockable tree species based on consistency</li>
            <li>Weekly leaderboard with friend comparisons</li>
            <li>Realtime friend activity via WebSockets</li>
          </ul>
        </div>

        <div className="quote-box text-start mx-auto mt-4 mb-4" style={{ maxWidth: '500px' }}>
          <p className="mb-0">"Water is the driving force of all nature." — Placeholder for ZenQuotes API</p>
        </div>
      </div>
    </main>
  );
}
