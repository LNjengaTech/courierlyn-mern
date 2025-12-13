// client-side functions that communicate with the Express endpoints (/api/users/register & /api/users/login), handle the promise, and dispatch the correct Redux actions.

import axios from 'axios';
import { 
    USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGIN_FAIL, USER_LOGOUT,
    USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_REGISTER_FAIL,
    USER_LIST_REQUEST, USER_LIST_SUCCESS, USER_LIST_FAIL, USER_LIST_RESET,
} from '../constants/userConstants';

//Base URL for the Express API
const API_BASE = import.meta.env.VITE_API_BASE_URL;

//login action
export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({
            type: USER_LOGIN_REQUEST,
        });

        // Configuration for the Axios request headers
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        // Call the Express Login API endpoint
        const { data } = await axios.post(
            `${API_BASE}/users/login`,
            { email, password },
            config
        );

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data, // The response contains user info and the JWT token
        });

        // Persist user info in local storage for session maintenance
        localStorage.setItem('userInfo', JSON.stringify(data));
        
    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: 
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

//logout
export const logout = () => (dispatch) => {
    localStorage.removeItem('userInfo');
    dispatch({ type: USER_LOGOUT });
    // You might want to clear other states here (e.g., shipments, services)
};

//Reg. action
export const register = (name, email, password) => async (dispatch) => {
    try {
        dispatch({
            type: USER_REGISTER_REQUEST,
        });

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        //Call the Express Register API endpoint
        const { data } = await axios.post(
            `${API_BASE}/users/register`,
            { name, email, password },
            config
        );

        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: data,
        });

        //log the user in immediately after successful registeration
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data,
        });
        
        localStorage.setItem('userInfo', JSON.stringify(data));

    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: 
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};


// Utility function to get Admin Auth config
const getConfig = (getState) => {
    const { userLogin: { userInfo } } = getState();
    return {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
};

//Get all users (Admin only)
export const listUsers = () => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_LIST_REQUEST });

        const { data } = await axios.get(`${API_BASE}/admin/users`, getConfig(getState));

        dispatch({
            type: USER_LIST_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: USER_LIST_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};