import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import './index.css';

function Unauthenticated({ onLogin }) {
  const [name, setName] = useState('');

  function handleLogin(e) {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim());
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <div className='input-group mb-3'>
        <span className='input-group-text'>Name</span>
        <input
          className='form-control'
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Your name'
        />
      </div>
      <Button variant='primary' type='submit' disabled={!name.trim()}>
        Login
      </Button>
    </form>
  );
}

function Authenticated({ userName, onLogout }) {
  const navigate = useNavigate();

  return (
    <div>
      <div className='playerName'>{userName}</div>
      <Button variant='primary' onClick={() => navigate('/dashboard')}>
        Play
      </Button>
      <Button variant='secondary' onClick={onLogout}>
        Logout
      </Button>
    </div>
  );
}

export default function Login({ userName, onLogin, onLogout }) {
  return (
    <main className='container-fluid bg-primary text-center'>
      <div>
        <h1 className='text-white fw-bold'>Welcome to Drinkly</h1>
        {userName
          ? <Authenticated userName={userName} onLogout={onLogout} />
          : <Unauthenticated onLogin={onLogin} />
        }
      </div>
    </main>
  );
}
