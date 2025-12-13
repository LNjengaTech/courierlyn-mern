import axios from 'axios';
import {
    DASHBOARD_STATS_REQUEST,
    DASHBOARD_STATS_SUCCESS,
    DASHBOARD_STATS_FAIL,
} from '../constants/adminConstants';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const getDashboardStats = () => async (dispatch, getState) => {
    try {
        dispatch({ type: DASHBOARD_STATS_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get(`${API_BASE}/admin/stats`, config);

        dispatch({
            type: DASHBOARD_STATS_SUCCESS,
            payload: data,
        });

    } catch (error) {
        dispatch({
            type: DASHBOARD_STATS_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};