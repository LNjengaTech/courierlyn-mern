import axios from 'axios';
import { 
    SERVICE_LIST_REQUEST,
    SERVICE_LIST_SUCCESS,
    SERVICE_LIST_FAIL,

    //for editing
    SERVICE_DETAILS_REQUEST,
    SERVICE_DETAILS_SUCCESS,
    SERVICE_DETAILS_FAIL,

    SERVICE_DELETE_REQUEST,
    SERVICE_DELETE_SUCCESS,
    SERVICE_DELETE_FAIL,

    //combined the constants for simplicity
    SERVICE_SAVE_REQUEST,
    SERVICE_SAVE_SUCCESS,
    SERVICE_SAVE_FAIL,
    SERVICE_SAVE_RESET,

 } from '../constants/serviceConstants';

const API_BASE = import.meta.env.VITE_API_BASE_URL;


// ----------------------------------
// GET ALL PUBLIC SERVICES
// ----------------------
export const listServices = () => async (dispatch) => {
    try {
        dispatch({ type: SERVICE_LIST_REQUEST });

        //public route, no token required
        const { data } = await axios.get(`${API_BASE}/services`);

        dispatch({
            type: SERVICE_LIST_SUCCESS,
            payload: data,
        });
        
    } catch (error) {
        dispatch({
            type: SERVICE_LIST_FAIL,
            payload: 
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};



// Utility function to get auth config
const getConfig = (getState) => {
    const { userLogin: { userInfo } } = getState();
    return {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
};

// -------------------------------------
// get single detail for Edit Form population
// ----------------------
export const getServiceDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: SERVICE_DETAILS_REQUEST });

        // Public route for now, but we'll use the Admin route for admin panel detail fetching
        const { data } = await axios.get(`${API_BASE}/admin/services/${id}`, getConfig(id));

        dispatch({
            type: SERVICE_DETAILS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: SERVICE_DETAILS_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};

// ----------------------
// CREATE or UPDATE service(save)
// ----------------------
export const saveService = (service) => async (dispatch, getState) => {
    try {
        dispatch({ type: SERVICE_SAVE_REQUEST });
        
        const { userLogin: { userInfo } } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        let data;
        
        // Check if service._id exists (Edit/Update) or is new (Create)
        if (service._id) {
            // PUT req to update
            const response = await axios.put(`${API_BASE}/admin/services/${service._id}`, service, config);
            data = response.data;
        } else {
            // POST request to create
            const response = await axios.post(`${API_BASE}/admin/services`, service, config);
            data = response.data;
        }

        dispatch({
            type: SERVICE_SAVE_SUCCESS,
            payload: data,
        });
        
    } catch (error) {
        dispatch({
            type: SERVICE_SAVE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};

// ----------------------
// DELETE service
// ----------------------
export const deleteService = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: SERVICE_DELETE_REQUEST });
        
        const { userLogin: { userInfo } } = getState();
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        await axios.delete(`${API_BASE}/admin/services/${id}`, config);

        dispatch({ type: SERVICE_DELETE_SUCCESS });
        
    } catch (error) {
        dispatch({
            type: SERVICE_DELETE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};

// ----------------------
// RESET service state save
// ----------------------
export const resetServiceSave = () => (dispatch) => {
    dispatch({ type: SERVICE_SAVE_RESET });
};