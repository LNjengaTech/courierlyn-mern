import { 
    SERVICE_LIST_REQUEST, SERVICE_LIST_SUCCESS, SERVICE_LIST_FAIL,
    
    SERVICE_DETAILS_REQUEST, SERVICE_DETAILS_SUCCESS, SERVICE_DETAILS_FAIL,
    
    SERVICE_DELETE_REQUEST, SERVICE_DELETE_SUCCESS, SERVICE_DELETE_FAIL,
    
    SERVICE_SAVE_REQUEST, SERVICE_SAVE_SUCCESS, SERVICE_SAVE_FAIL, SERVICE_SAVE_RESET
} from '../constants/serviceConstants';


export const serviceListReducer = (state = { services: [] }, action) => {
    switch (action.type) {
        case SERVICE_LIST_REQUEST:
            // Set loading state
            return { loading: true, services: [] };
        case SERVICE_LIST_SUCCESS:
            // Store fetched data
            return { loading: false, services: action.payload };
        case SERVICE_LIST_FAIL:
            // Store error message
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};


export const serviceDetailsReducer = (state = { service: {} }, action) => {
    switch (action.type) {
        case SERVICE_DETAILS_REQUEST:
            return { loading: true, ...state };
        case SERVICE_DETAILS_SUCCESS:
            return { loading: false, service: action.payload };
        case SERVICE_DETAILS_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const serviceDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case SERVICE_DELETE_REQUEST:
            return { loading: true };
        case SERVICE_DELETE_SUCCESS:
            // Success flag for UI feedback
            return { loading: false, success: true }; 
        case SERVICE_DELETE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const serviceSaveReducer = (state = {}, action) => {
    switch (action.type) {
        case SERVICE_SAVE_REQUEST:
            return { loading: true };
        case SERVICE_SAVE_SUCCESS:
            // Returns the created/updated service object
            return { loading: false, success: true, service: action.payload }; 
        case SERVICE_SAVE_FAIL:
            return { loading: false, error: action.payload };
        case SERVICE_SAVE_RESET:
            // Clear status after successful save/redirect
            return {};
        default:
            return state;
    }
};