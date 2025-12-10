// client/src/redux/store.js
// central piece that initializes and ties together all parts of Redux structure: the reducers, middleware, and initial state.
// thunk from redux-thunk: A middleware that allows Redux actions to handle asynchronous logic (like making API calls using Axios in src/api/ and waiting for a response) rather than just immediately returning a plain action object. It makes the asynchronous flow (Request -> Success/Fail) possible.
// composeWithDevTools: An optional but widely used utility for connecting store to the browser's Redux DevTools extension, making it much easier to track state changes and debug your application.


import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk'; // Use named import for Redux Thunk
//import { composeWithDevTools } from 'redux-devtools-extension'; // Optional but helpful





import rootReducer from './reducers';

const userInfoFromStorage = localStorage.getItem('userInfo') 
    ? JSON.parse(localStorage.getItem('userInfo')) 
    : null;

const initialState = {
    userLogin: { userInfo: userInfoFromStorage },
};

const middleware = [thunk];

const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(...middleware)
);

export default store;