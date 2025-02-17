import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,  
  isAuthenticated: !!localStorage.getItem('authToken'), 
  id: localStorage.getItem('userId') || null,
  token: localStorage.getItem('authToken') || null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.id = action.payload.id;

      localStorage.setItem('authToken', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user)); 
      localStorage.setItem('userId', action.payload.id); 
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.id = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
    }
  }
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;

