import { useState } from 'react';

function Login({ onLoginSuccess, onShowRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
     const response = await fetch('http://localhost:9999/api/auth/login', {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ email, password })
});

      const data = await response.text();

      if (response.ok) {
        setMessage('Login successful!');

        if (onLoginSuccess) {
          onLoginSuccess(email);
        }
      } else {
        setMessage(data || 'Invalid email or password!');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('Unable to connect to the server.');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h2>Welcome Back!</h2>
        <p>Login to manage your job applications.</p>

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>

        {message && <p role="status">{message}</p>}

        <p>
          Don't have an account?{' '}
          <button type="button" onClick={onShowRegister}>
            Register
          </button>
        </p>
      </form>
    </div>
  );
}

export default Login;