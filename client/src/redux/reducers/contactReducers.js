// client/src/redux/reducers/contactReducers.js (New File)

import {
    CONTACT_SUBMISSION_REQUEST,
    CONTACT_SUBMISSION_SUCCESS,
    CONTACT_SUBMISSION_FAIL,
    CONTACT_SUBMISSION_RESET,
} from '../constants/contactConstants';

const contactInitialState = { 
    loading: false, 
    success: null, // Holds success message
    error: null 
};

export const contactSubmissionReducer = (state = contactInitialState, action) => {
    switch (action.type) {
        case CONTACT_SUBMISSION_REQUEST:
            return { loading: true, success: null, error: null };
        case CONTACT_SUBMISSION_SUCCESS:
            return { loading: false, success: action.payload, error: null };
        case CONTACT_SUBMISSION_FAIL:
            return { loading: false, success: null, error: action.payload };
        case CONTACT_SUBMISSION_RESET:
            return contactInitialState;
        default:
            return state;
    }
};