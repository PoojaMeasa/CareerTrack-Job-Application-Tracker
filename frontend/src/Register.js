import { useState } from 'react';

function Register({ onRegisterSuccess, onShowLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch(
        'http://localhost:9999/api/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name,
            email,
            password
          })
        }
      );

      const data = await response.text();

      if (response.ok) {
        setMessage('Registration successful! Please login.');
        setName('');
        setEmail('');
        setPassword('');

        if (onRegisterSuccess) {
          onRegisterSuccess();
        }
      } else {
        setMessage(data || 'Registration failed.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('Unable to connect to the server.');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleRegister}>
        <h2>Create Account</h2>
        <p>Start tracking your job applications with CareerTrack.</p>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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
          minLength={8}
          required
        />

        <button type="submit">Register</button>

        {message && <p role="status">{message}</p>}

        <p>
          Already have an account?{' '}
          <button type="button" onClick={onShowLogin}>
            Login
          </button>
        </p>
      </form>
    </div>
  );
}

export default Register;        