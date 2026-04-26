import api from '../config/axios';

const authService = {
  loginUser: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  registerUser: async (email, password) => {
    const response = await api.post('/auth/signup', { email, password });
    return response.data;
  },
  
  googleLogin: async (email, uid, name, avatar) => {
    const response = await api.post('/auth/google', { email, uid, name, avatar });
    return response.data;
  }
};

export default authService;
