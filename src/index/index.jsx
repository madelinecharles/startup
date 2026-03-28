import './index.css';

export default function Login({ userName, onLogin }) {
  return (
    <main>
      <div className="login-wrapper">
        <div className="login-card">
          <h2>Welcome Back</h2>
          <form>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              required
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              required
            />

            <div className="login-buttons">
              <button type="submit" className="btn-primary-custom">Login</button>
              <button type="button" className="btn-outline-custom">Create Account</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
