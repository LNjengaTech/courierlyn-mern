import axios from 'axios';
import { 
    RATE_CALCULATE_REQUEST, RATE_CALCULATE_SUCCESS, RATE_CALCULATE_FAIL, RATE_CALCULATE_RESET
} from '../constants/rateConstants';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

// -----------------------------------
// CALCULATE INSTANT RATE
// -----------------------------
export const calculateRate = ({ origin, destination, service, weight }) => async (dispatch) => {
    try {
        dispatch({ type: RATE_CALCULATE_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const { data } = await axios.post(
            `${API_BASE}/rates/calculate`,
            { origin, destination, service, weight }, // Send parameters to the server
            config
        );

        dispatch({
            type: RATE_CALCULATE_SUCCESS,
            payload: data,
        });
        
    } catch (error) {
        dispatch({
            type: RATE_CALCULATE_FAIL,
            payload: 
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

//reset
export const resetRateCalculation = () => (dispatch) => {
    dispatch({ type: RATE_CALCULATE_RESET });
};