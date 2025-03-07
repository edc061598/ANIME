import React, { useState } from 'react';
import './AuthPage.css';
import { useUser } from './useUser';

export default function AuthPage() {
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [userName, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { handleSignIn} = useUser();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const endpoint = mode === 'signup' ? '/api/auth/sign-up' : '/api/auth/sign-in';
      const body = {
        userName,
        password,
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(`Failed to load endpoint`);
      }
      const data = await response.json();
      console.log('Registered ', data);
      handleSignIn(data.payload, data.signedToken);
      alert(`${mode === 'signup' ? 'Signed up' : 'Logged in'} successfully!`);
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="auth-text">
          <h2>BE ABLE TO RATE YOUR FAVORITE SHOWS!!!</h2>
          <p>
            Sign Up Now To Rate Your Favorite Shows And Provide Your Honest Reviews.
            This Platform Allows You To Speak Your Mind And Create Your Own Customizable Favorites List
          </p>
        </div>
        <div className="auth-form-container">
          <div className="auth-toggle">
            <button
              className={mode === 'signup' ? 'active' : ''}
              onClick={() => setMode('signup')}
            >
              Sign Up
            </button>
            <button
              className={mode === 'login' ? 'active' : ''}
              onClick={() => setMode('login')}
            >
              Login
            </button>
          </div>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={userName}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="auth-submit-btn">
              {mode === 'signup' ? 'Sign Up' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
