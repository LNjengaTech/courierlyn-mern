// client/src/redux/actions/shipmentActions.js

import axios from 'axios';
import { 
    SHIPMENT_LIST_REQUEST, SHIPMENT_LIST_SUCCESS, SHIPMENT_LIST_FAIL,
    SHIPMENT_CREATE_REQUEST, SHIPMENT_CREATE_SUCCESS, SHIPMENT_CREATE_FAIL, SHIPMENT_CREATE_RESET,
    SHIPMENT_DETAILS_ADMIN_REQUEST, SHIPMENT_DETAILS_ADMIN_SUCCESS, SHIPMENT_DETAILS_ADMIN_FAIL, SHIPMENT_DETAILS_ADMIN_RESET,
    TRACKING_ADD_REQUEST, TRACKING_ADD_SUCCESS, TRACKING_ADD_FAIL, TRACKING_ADD_RESET,
    TRACKING_DETAILS_REQUEST, TRACKING_DETAILS_SUCCESS, TRACKING_DETAILS_FAIL, TRACKING_DETAILS_RESET, 
    USER_SHIPMENT_LIST_REQUEST, USER_SHIPMENT_LIST_SUCCESS, USER_SHIPMENT_LIST_FAIL,
} from '../constants/shipmentConstants';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

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

// --- ADMIN ACTIONS ---

// @desc    List all shipments (Admin)
export const listShipments = () => async (dispatch, getState) => {
    try {
        dispatch({ type: SHIPMENT_LIST_REQUEST });

        const { data } = await axios.get(`${API_BASE}/admin/shipments`, getConfig(getState));

        dispatch({
            type: SHIPMENT_LIST_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: SHIPMENT_LIST_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};

// @desc    Get shipment details by MongoDB ID (Admin)
export const getShipmentDetailsAdmin = (shipmentId) => async (dispatch, getState) => {
    try {
        dispatch({ type: SHIPMENT_DETAILS_ADMIN_REQUEST });

        // Get the configuration with JWT token
        const config = getConfig(getState);

        // Calls the new admin route /api/admin/shipments/:id
        const { data } = await axios.get(
            `${API_BASE}/admin/shipments/${shipmentId}`,
            {
                ...config,
                // Tells Axios to treat 200 and 304 as successful status codes
                validateStatus: (status) => {
                    return status >= 200 && status < 300 || status === 304; 
                },
            }
        );
        dispatch({
            type: SHIPMENT_DETAILS_ADMIN_SUCCESS,
            // If 304, 'data' might be empty. The reducer handles this.
            payload: data, 
        });
        
    } catch (error) {
        dispatch({
            type: SHIPMENT_DETAILS_ADMIN_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};

// @desc    Create a new Shipment (Admin)
export const createShipment = (shipment) => async (dispatch, getState) => {
    try {
        dispatch({ type: SHIPMENT_CREATE_REQUEST });
        
        const { data } = await axios.post(
            `${API_BASE}/admin/shipments`,
            shipment,
            getConfig(getState)
        );

        dispatch({
            type: SHIPMENT_CREATE_SUCCESS,
            payload: data,
        });
        
    } catch (error) {
        dispatch({
            type: SHIPMENT_CREATE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};

// @desc    Add a tracking event to a shipment (Admin)
export const addTrackingEvent = (shipmentId, eventData) => async (dispatch, getState) => {
    try {
        dispatch({ type: TRACKING_ADD_REQUEST });
        
        const { data } = await axios.post(
            `${API_BASE}/admin/shipments/${shipmentId}/track`,
            eventData,
            getConfig(getState)
        );

        dispatch({
            type: TRACKING_ADD_SUCCESS,
            payload: data,
        });
        
    } catch (error) {
        dispatch({
            type: TRACKING_ADD_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};

// --- PUBLIC ACTIONS ---

// @desc    Get tracking details by tracking number (Public)
export const getTrackingDetails = (trackingNumber) => async (dispatch) => {
    try {
        dispatch({ type: TRACKING_DETAILS_REQUEST });

        // Uses the public tracking route
        const { data } = await axios.get(`${API_BASE}/tracking/${trackingNumber}`);

        dispatch({
            type: TRACKING_DETAILS_SUCCESS,
            payload: data, // Includes shipment and trackingHistory
        });
    } catch (error) {
        dispatch({
            type: TRACKING_DETAILS_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};

// @desc    Get user's shipments list (Customer Dashboard)
// @access  Private (Requires token)
export const listUserShipments = () => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_SHIPMENT_LIST_REQUEST });

        // Get token from userLogin state
        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        // Note the route is /api/shipments/my
        const { data } = await axios.get(`${API_BASE}/shipments/my`, config);

        dispatch({
            type: USER_SHIPMENT_LIST_SUCCESS,
            payload: data,
        });

    } catch (error) {
        dispatch({
            type: USER_SHIPMENT_LIST_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};




// Reset actions
export const resetShipmentCreate = () => ({ type: SHIPMENT_CREATE_RESET });
export const resetShipmentDetailsAdmin = () => ({ type: SHIPMENT_DETAILS_ADMIN_RESET });
export const resetTrackingDetails = () => ({ type: TRACKING_DETAILS_RESET });
export const resetTrackingAdd = () => ({ type: TRACKING_ADD_RESET });