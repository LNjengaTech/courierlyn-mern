import { 
    RATE_CALCULATE_REQUEST, RATE_CALCULATE_SUCCESS, RATE_CALCULATE_FAIL, RATE_CALCULATE_RESET 
} from '../constants/rateConstants';

export const rateCalculateReducer = (state = {}, action) => {
    switch (action.type) {
        case RATE_CALCULATE_REQUEST:
            return { loading: true };
        case RATE_CALCULATE_SUCCESS:
            // Store the calculated rate object
            return { loading: false, rate: action.payload };
        case RATE_CALCULATE_FAIL:
            // Store the error message
            return { loading: false, error: action.payload };
        case RATE_CALCULATE_RESET:
            // Clear the state
            return {};
        default:
            return state;
    }
};