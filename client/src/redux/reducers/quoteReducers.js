// client/src/redux/reducers/quoteReducers.js

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


const initialState = { quotes: [], loading: false, error: null };

export const quoteListReducer = (state = initialState, action) => {
    switch (action.type) {
        case QUOTE_LIST_REQUEST:
            return { loading: true, quotes: [] };
        case QUOTE_LIST_SUCCESS:
            return { loading: false, quotes: action.payload };
        case QUOTE_LIST_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};



const detailsInitialState = { quote: {}, loading: false, error: null };

export const quoteDetailsReducer = (state = detailsInitialState, action) => {
    switch (action.type) {
        case QUOTE_DETAILS_REQUEST:
            return { loading: true, ...state };
        case QUOTE_DETAILS_SUCCESS:
            return { loading: false, quote: action.payload, error: null };
        case QUOTE_DETAILS_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};


export const quoteStatusUpdateReducer = (state = {}, action) => {
    switch (action.type) {
        case QUOTE_UPDATE_STATUS_REQUEST:
            return { loading: true };
        case QUOTE_UPDATE_STATUS_SUCCESS:
            return { loading: false, success: true };
        case QUOTE_UPDATE_STATUS_FAIL:
            return { loading: false, error: action.payload };
        case QUOTE_UPDATE_STATUS_RESET:
            return {};
        default:
            return state;
    }
};
