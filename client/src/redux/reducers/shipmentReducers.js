import { 
    SHIPMENT_LIST_REQUEST, SHIPMENT_LIST_SUCCESS, SHIPMENT_LIST_FAIL,
    SHIPMENT_CREATE_REQUEST, SHIPMENT_CREATE_SUCCESS, SHIPMENT_CREATE_FAIL, SHIPMENT_CREATE_RESET,
    SHIPMENT_DETAILS_ADMIN_REQUEST, SHIPMENT_DETAILS_ADMIN_SUCCESS, SHIPMENT_DETAILS_ADMIN_FAIL, SHIPMENT_DETAILS_ADMIN_RESET,
    TRACKING_ADD_REQUEST, TRACKING_ADD_SUCCESS, TRACKING_ADD_FAIL, TRACKING_ADD_RESET,
    TRACKING_DETAILS_REQUEST, TRACKING_DETAILS_SUCCESS, TRACKING_DETAILS_FAIL, TRACKING_DETAILS_RESET,
    USER_SHIPMENT_LIST_REQUEST, USER_SHIPMENT_LIST_SUCCESS, USER_SHIPMENT_LIST_FAIL,
} from '../constants/shipmentConstants';

// 1. Admin Shipment List
export const shipmentListReducer = (state = { shipments: [] }, action) => {
    switch (action.type) {
        case SHIPMENT_LIST_REQUEST:
            return { loading: true, shipments: [] };
        case SHIPMENT_LIST_SUCCESS:
            return { loading: false, shipments: action.payload };
        case SHIPMENT_LIST_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

// 2. Admin Shipment Create
export const shipmentCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case SHIPMENT_CREATE_REQUEST:
            return { loading: true };
        case SHIPMENT_CREATE_SUCCESS:
            return { loading: false, success: true, shipment: action.payload };
        case SHIPMENT_CREATE_FAIL:
            return { loading: false, error: action.payload };
        case SHIPMENT_CREATE_RESET:
            return {};
        default:
            return state;
    }
};

// 3. Admin Tracking Add Event
export const trackingAddReducer = (state = {}, action) => {
    switch (action.type) {
        case TRACKING_ADD_REQUEST:
            return { loading: true };
        case TRACKING_ADD_SUCCESS:
            return { loading: false, success: true, event: action.payload };
        case TRACKING_ADD_FAIL:
            return { loading: false, error: action.payload };
        case TRACKING_ADD_RESET:
            return {};
        default:
            return state;
    }
};

// 4. Public Tracking Details

const trackingDetailsInitialState = { tracking: null, loading: false, error: null };

export const trackingDetailsReducer = (state = trackingDetailsInitialState, action) => {
    switch (action.type) {
        case TRACKING_DETAILS_REQUEST:
            return { loading: true, tracking: null, error: null };
        case TRACKING_DETAILS_SUCCESS:
            // Payload contains { shipment, trackingHistory }
            return { loading: false, tracking: action.payload, error: null };
        case TRACKING_DETAILS_FAIL:
            return { loading: false, tracking: null, error: action.payload };
        case TRACKING_DETAILS_RESET:
            return trackingDetailsInitialState;
        default:
            return state;
    }
};


// 5. Admin Shipment Details (for update page)
export const shipmentDetailsAdminReducer = (state = { shipment: null, trackingHistory: [] }, action) => {
    switch (action.type) {
        case SHIPMENT_DETAILS_ADMIN_REQUEST:
            return { ...state, loading: true, error: null }; // Ensure error is cleared
            
        case SHIPMENT_DETAILS_ADMIN_SUCCESS:
            // CRITICAL: If payload is null (from 304), preserve the old data while stopping loading.
            // If payload is NOT null (from 200), update the data.
            return { 
                loading: false, 
                error: null,
                shipment: action.payload && action.payload.shipment ? action.payload.shipment : state.shipment, 
                trackingHistory: action.payload && action.payload.trackingHistory ? action.payload.trackingHistory : state.trackingHistory
            };
            
        case SHIPMENT_DETAILS_ADMIN_FAIL:
            return { ...state, loading: false, error: action.payload };

        case SHIPMENT_DETAILS_ADMIN_RESET:
            return { shipment: null, trackingHistory: [], loading: false, error: null };
            
        default:
            return state;
    }
};


const initialState = { shipments: [], loading: false, error: null };

export const userShipmentListReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_SHIPMENT_LIST_REQUEST:
            return { loading: true, shipments: [] };
        case USER_SHIPMENT_LIST_SUCCESS:
            return { loading: false, shipments: action.payload };
        case USER_SHIPMENT_LIST_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};