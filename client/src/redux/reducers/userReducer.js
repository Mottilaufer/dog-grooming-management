import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  id : '',
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
      state.id = action.payload.id
      localStorage.setItem('authToken', action.payload.token);
    },


    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.id = null
      localStorage.removeItem('authToken');
    }
  }
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
