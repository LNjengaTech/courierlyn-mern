//  serve as unique, descriptive string identifiers for the different actions related to user authentication login, logout, and registration) that can occur in your application.

//USER_LOGIN_REQUEST	(Start)	    An action is dispatched right before the API call to log the user in is made. The reducer uses this to set a loading: true state.
//USER_LOGIN_SUCCESS	(Success)	An action is dispatched when the API call returns successfully. The reducer uses this to set loading: false, store the user info (e.g., token, name), and clear any errors.
//USER_LOGIN_FAIL	    (Failure)	An action is dispatched if the API call fails (e.g., wrong password, network error). The reducer sets loading: false and saves the error message in the state.
//USER_LOGOUT	        (N/A)	    An action dispatched when a user explicitly logs out. The reducer uses this to clear all user data from the Redux store.


export const USER_LOGIN_REQUEST = 'USER_LOGIN_REQUEST';
export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
export const USER_LOGIN_FAIL = 'USER_LOGIN_FAIL';
export const USER_LOGOUT = 'USER_LOGOUT';

export const USER_REGISTER_REQUEST = 'USER_REGISTER_REQUEST';
export const USER_REGISTER_SUCCESS = 'USER_REGISTER_SUCCESS';
export const USER_REGISTER_FAIL = 'USER_REGISTER_FAIL';

// User List (Admin)
export const USER_LIST_REQUEST = 'USER_LIST_REQUEST';
export const USER_LIST_SUCCESS = 'USER_LIST_SUCCESS';
export const USER_LIST_FAIL = 'USER_LIST_FAIL';
export const USER_LIST_RESET = 'USER_LIST_RESET';