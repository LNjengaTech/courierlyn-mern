//ROOT REDUCER:  combines all reducers (user, shipment, service, etc.).
// uses Redux's combineReducers utility to merge all individual reducers (like userLoginReducer and userRegisterReducer) into a single, comprehensive function.

import { combineReducers } from 'redux';
import { userLoginReducer, userRegisterReducer, userListReducer } from './userReducers';
import { serviceListReducer, serviceDetailsReducer, serviceDeleteReducer, serviceSaveReducer, } from './serviceReducers';
import { rateCalculateReducer } from './rateReducers';
import { shipmentListReducer, shipmentCreateReducer, shipmentDetailsAdminReducer, trackingAddReducer, trackingDetailsReducer, userShipmentListReducer } from './shipmentReducers';
import { contactSubmissionReducer } from './contactReducers';
import { quoteListReducer, quoteDetailsReducer, quoteStatusUpdateReducer } from './quoteReducers';
import { dashboardStatsReducer } from './adminReducers';


const rootReducer = combineReducers({
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userList: userListReducer,

    serviceList: serviceListReducer, 
    serviceDetails:serviceDetailsReducer,
    serviceDelete:serviceDeleteReducer,
    serviceSave:serviceSaveReducer,

    rateCalculate: rateCalculateReducer,

    shipmentList: shipmentListReducer,
    shipmentCreate: shipmentCreateReducer,
    shipmentDetailsAdmin: shipmentDetailsAdminReducer,
    trackingAdd: trackingAddReducer,
    trackingDetails: trackingDetailsReducer,
    userShipmentList: userShipmentListReducer,

    contactSubmission: contactSubmissionReducer,
    quoteList: quoteListReducer,
    quoteDetails: quoteDetailsReducer,
    quoteStatusUpdate: quoteStatusUpdateReducer,

    dashboardStats: dashboardStatsReducer,

});

export default rootReducer;