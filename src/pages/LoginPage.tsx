import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isLogin) {
        // Handle Login
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setMessage('Logged in successfully! Redirecting...');
        setTimeout(() => navigate('/'), 2000);
      } else {
        // Handle Sign Up
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
        setMessage('Account created! Please check your email for a verification link.');
      }
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="toggle-buttons">
          <button onClick={() => setIsLogin(true)} className={isLogin ? 'active' : ''}>Login</button>
          <button onClick={() => setIsLogin(false)} className={!isLogin ? 'active' : ''}>Sign Up</button>
        </div>
        <form onSubmit={handleAuthAction} className="login-form">
          {isLogin ? (
            <>
              <h2>Login to Your Account</h2>
              <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Processing...' : 'Login'}
              </button>
            </>
          ) : (
            <>
              <h2>Create a New Account</h2>
              <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Processing...' : 'Sign Up'}
              </button>
            </>
          )}
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
