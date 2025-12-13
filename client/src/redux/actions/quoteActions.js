import axios from 'axios';
import {
    QUOTE_LIST_REQUEST,
    QUOTE_LIST_SUCCESS,
    QUOTE_LIST_FAIL,

    QUOTE_DETAILS_REQUEST,
    QUOTE_DETAILS_SUCCESS,
    QUOTE_DETAILS_FAIL,

    QUOTE_UPDATE_STATUS_REQUEST,
    QUOTE_UPDATE_STATUS_SUCCESS,
    QUOTE_UPDATE_STATUS_FAIL,
    QUOTE_UPDATE_STATUS_RESET,
   
} from '../constants/quoteConstants';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const listQuoteRequests = () => async (dispatch, getState) => {
    try {
        dispatch({ type: QUOTE_LIST_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get(`${API_BASE}/admin/quotes`, config);

        dispatch({
            type: QUOTE_LIST_SUCCESS,
            payload: data,
        });

    } catch (error) {
            dispatch({
                type: QUOTE_LIST_FAIL,
                payload: 
                    error.response && error.response.data.message
                        ? error.response.data.message
                        : error.message,
            });
        }
};

//Getting single quote request details
export const getQuoteDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: QUOTE_DETAILS_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get(`${API_BASE}/admin/quotes/${id}`, config);

        dispatch({
            type: QUOTE_DETAILS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: QUOTE_DETAILS_FAIL,
            payload: error.response && error.response.data.message 
                ? error.response.data.message 
                : error.message,
        });
    }
};


//mark a quote request as processed
export const updateQuoteStatus = (quoteId) => async (dispatch, getState) => {
    try {
        dispatch({ type: QUOTE_UPDATE_STATUS_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        // PUT request to the new endpoint
        const { data } = await axios.put(`${API_BASE}/admin/quotes/${quoteId}/process`, {}, config);

        dispatch({
            type: QUOTE_UPDATE_STATUS_SUCCESS,
            payload: data,
        });

        //Dispatch success to the details reducer to instantly update the page state - optional though
        dispatch({ type: QUOTE_DETAILS_SUCCESS, payload: data.quote }); 

    } catch (error) {
        dispatch({
            type: QUOTE_UPDATE_STATUS_FAIL,
            payload: error.response && error.response.data.message 
                ? error.response.data.message 
                : error.message,
        });
    }
};

export const resetUpdateQuoteStatus = () => (dispatch) => {
    dispatch({ type: QUOTE_UPDATE_STATUS_RESET, });
};