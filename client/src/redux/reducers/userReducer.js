import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  token: localStorage.getItem('authToken') || null,  // קריאת הטוקן מ-localStorage אם יש
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // פעולה לשמירת מידע על המשתמש, כולל טוקן
    setUser: (state, action) => {
        debugger
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      
      // שמירה של הטוקן ב-localStorage
      localStorage.setItem('authToken', action.payload.token);
    },

    // פעולה ל-logout
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;

      // מחיקת הטוקן מ-localStorage
      localStorage.removeItem('authToken');
    }
  }
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
