// redux/actions/userActions.js
import axios from '../../services/axios';
import { setUser } from '../reducers/userReducer';  // מייבא את האקשן setUser

export const loginUser = (credentials) => async (dispatch) => {
  try {
    debugger
    const response = await axios.post('/auth/login', credentials);

    if (response.data.successResponse.success) {
      const token = response.data.token;
      const user = response.data.user;  // אם יש מידע על המשתמש

      // dispatch של setUser עם הטוקן ופרטי המשתמש
      dispatch(setUser({ token, user }));
    } else {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: 'Login failed'
      });
    }
  } catch (error) {
    dispatch({
      type: 'LOGIN_FAILURE',
      payload: error.message
    });
  }
};
