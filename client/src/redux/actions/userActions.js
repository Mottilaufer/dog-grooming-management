import axios from '../../services/axios';
import { setUser } from '../reducers/userReducer';  
import { jwtDecode } from "jwt-decode";



export const loginUser = (credentials) => async (dispatch) => {
  try {
    const response = await axios.post('/auth/login', credentials);

    if (response?.data?.successResponse?.success) {
      
      const token = response?.data?.token;
      const decodedToken = jwtDecode(token);
      const user = decodedToken?.user;
      const id = decodedToken?.id;


      dispatch(setUser({ token, user , id}));

      return {
        success: true,
        message: 'Login succeeded'
      };
    } else {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: 'Login failed'
      });
      return {
        success: false,
        message: 'Login failed'
      };
    }
  } catch (error) {
    dispatch({
      type: 'LOGIN_FAILURE',
      payload: error.message
    });
    return {
      success: false,
      message: 'Error during login'
    };
  }
};

export const registerUser = (userData) => async (dispatch) => {
  try {
    const response = await axios.post('/auth/register', userData);

    if (response?.data?.successResponse?.success) {
      return { success: true };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
};
