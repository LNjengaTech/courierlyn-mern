// client/src/redux/actions/contactActions.js (New File)

import axios from 'axios';
import {
    CONTACT_SUBMISSION_REQUEST,
    CONTACT_SUBMISSION_SUCCESS,
    CONTACT_SUBMISSION_FAIL,
    CONTACT_SUBMISSION_RESET,
} from '../constants/contactConstants';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

// @desc    Submit general email form
export const submitContactEmail = (formData) => async (dispatch) => {
    try {
        dispatch({ type: CONTACT_SUBMISSION_REQUEST });

        const { data } = await axios.post(`${API_BASE}/contact/email`, formData);

        dispatch({
            type: CONTACT_SUBMISSION_SUCCESS,
            payload: data.message, // Success message from server
        });
    } catch (error) {
        dispatch({
            type: CONTACT_SUBMISSION_FAIL,
            payload: error.response && error.response.data.message 
                ? error.response.data.message 
                : error.message,
        });
    }
};

// @desc    Submit detailed shipping quote request
export const submitQuoteRequest = (formData) => async (dispatch) => {
    try {
        dispatch({ type: CONTACT_SUBMISSION_REQUEST });

        const { data } = await axios.post(`${API_BASE}/contact/quote`, formData);

        dispatch({
            type: CONTACT_SUBMISSION_SUCCESS,
            payload: data.message, // Success message from server
        });
    } catch (error) {
        dispatch({
            type: CONTACT_SUBMISSION_FAIL,
            payload: error.response && error.response.data.message 
                ? error.response.data.message 
                : error.message,
        });
    }
};

export const resetContactSubmission = () => ({ type: CONTACT_SUBMISSION_RESET });