// src/authService.js
const mockUser = {
    username: 'admin',
    password: 'password',
  };
  
  export const login = ({ username, password }) => {
    if (username === mockUser.username && password === mockUser.password) {
      const token = 'fake-jwt-token';
      localStorage.setItem('token', token);
      return token;
    } else {
      throw new Error('Invalid username or password');
    }
  };
  
  export const logout = () => {
    localStorage.removeItem('token');
  };
  
  export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };
  