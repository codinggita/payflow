import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { auth, provider as googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import api from '../config/axios';

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.loginUser(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
      return data;
    } catch (err) {
      const message = err.response?.data?.msg || err.message || 'Login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.registerUser(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
      return data;
    } catch (err) {
      const message = err.response?.data?.msg || err.message || 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const googleAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      
      // POST /api/auth/google -> { idToken }
      // Included extra fields to ensure compatibility with backend
      const response = await api.post('/auth/google', { 
        idToken,
        email: result.user.email,
        uid: result.user.uid,
        name: result.user.displayName,
        avatar: result.user.photoURL
      });
      const data = response.data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({
        name: result.user.displayName,
        email: result.user.email,
        avatar: result.user.photoURL,
        id: data.user?.id || result.user.uid
      }));
      navigate('/dashboard');
      return { data, googleUser: result.user };
    } catch (err) {
      const message = err.response?.data?.msg || err.message || 'Google sign-in failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, register, googleAuth, loading, error, setError };
};

export default useAuth;
