import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
//import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faClock, faMapMarkerAlt, faSpinner, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { getShipmentDetailsAdmin, resetShipmentDetailsAdmin, addTrackingEvent, resetTrackingAdd } from '../redux/actions/shipmentActions';

const AdminTrackingUpdatePage = () => {
    const { id } = useParams(); //the MongoDB Shipment ID //
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //---UPDATED REDUX SELECTORS/ ---
    const { loading: loadingDetails, error: errorDetails, shipment, trackingHistory } = useSelector(state => state.shipmentDetailsAdmin);
    const { loading: loadingAdd, error: errorAdd, success: successAdd } = useSelector(state => state.trackingAdd);
    //-------------------------------------------
    
    //states for Form
    const [status, setStatus] = useState('');
    const [location, setLocation] = useState('');
    const [details, setDetails] = useState('');
    //const [date, setDate] = useState('');
    //const [time, setTime] = useState('');
    
    
    //status options for easy selection
    const commonStatuses = [
        'Picked Up', 'Arrived at Hub', 'Processed for Transit', 
        'Departed Hub', 'Customs Cleared', 'Out For Delivery', 
        'Delivered', 'Held at Customs', 'Exception'
    ];

    useEffect(() => {
    // 1. Logic for Re-fetching after a new tracking event is added
    if (successAdd) {
        alert('Tracking event added successfully!');
        dispatch(resetTrackingAdd());
        // Always re-fetch the data after a successful event addition!
        dispatch(getShipmentDetailsAdmin(id));
        
        return;         //return here to prevent the second 'if' block from running immediately with the old state, which would cause an extra redundant fetch.
    }

    //Logic for initial data fetch (Run only when component mounts or ID changes)
    // We check if the shipment data is missing OR if the ID in the URL changed.
    // NOTE: This intentionally omits `shipment` from the dependency array to break the loop.
    if (!shipment || shipment._id !== id) {
        // Only dispatch if the ID is present and we don't have the data for it.
        if (id) {
             dispatch(getShipmentDetailsAdmin(id));
        }
    }
    
    // Cleanup on unmount
    return () => {
        dispatch(resetShipmentDetailsAdmin());
    };
    
    // important: removed 'shipment' from dependencies to break the infinite reference loop.
    //the fetch is now managed by checking the current state inside the effect.
}, [dispatch, id, successAdd,]);

    //Ssubmit New Tracking Event (using redux)
    const submitHandler = (e) => {
        e.preventDefault();

        //if shipment details are loaded and we have the ID
        if (!shipment || !shipment._id) {
            alert("Error: Shipment details not loaded.");
            return;
        }

        const eventData = { 
            status, 
            location, 
            details,
            // timestamp: date && time ? new Date(`${date} ${time}`).toISOString() : undefined,
        };

        //dispatch the redux action to add the event
        dispatch(addTrackingEvent(shipment._id, eventData));
    };



    //use the Redux loading and error states for rendering
    if (loadingDetails) { //use the loading state from Redux
        return <p className='text-center py-20 text-lg text-blue-600 dark:text-blue-400'>
            <FontAwesomeIcon icon={faSpinner} className='animate-spin mr-3' /> Loading Shipment Data...
        </p>;
    }
    
    if (errorDetails && !shipment) { //Use the error state from Redux
        return <div className='bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 p-4 rounded'>Error: {errorDetails}</div>;
    }

    return (
        <div className="max-w-6xl mx-auto text-gray-900 dark:text-gray-100">
            <Helmet><title>Update Tracking | Admin</title></Helmet>
            
            {/*Header and back Button */}
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                <h1 className="text-xl! sm:text-3xl! font-bold">
                    Update Tracking: <span className="text-blue-600! dark:text-blue-400!">{shipment?.trackingNumber}</span>
                </h1>
                <button 
                    onClick={() => navigate('/admin/shipments')}
                    className="flex items-center px-2! py-2! text-sm! bg-gray-200! dark:bg-gray-700! text-gray-700! dark:text-gray-300! rounded-md hover:bg-gray-300! dark:hover:bg-gray-600! transition"
                >
                    <FontAwesomeIcon icon={faChevronLeft} className="mr-1" /> Back To Shipments
                </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/*New Event Form (2/3 width) */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl h-fit">
                    <h2 className="text-xl font-bold mb-4 border-b pb-3 dark:border-gray-700">Add New Tracking Event</h2>

                    {errorAdd && <div className='bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 p-3 rounded mb-4'>{errorAdd}</div>}

                    <form onSubmit={submitHandler} className="space-y-4">
                        {/*Status Select */}
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status Description</label>
                            <select id="status" required value={status} onChange={(e) => setStatus(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm p-2.5 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">-- Select Status --</option>
                                {commonStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                                <option value="Other">Other...</option>
                            </select>
                        </div>
                        
                        {/*Location */}
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location (City, Country)</label>
                            <input type="text" id="location" required value={location} onChange={(e) => setLocation(e.target.value)}
                                placeholder="e.g., Frankfurt, Germany"
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm p-2.5 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/*Details/Notes */}
                        <div>
                            <label htmlFor="details" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Details/Notes (Optional)</label>
                            <textarea id="details" rows="2" value={details} onChange={(e) => setDetails(e.target.value)}
                                placeholder="E.g., Loaded onto Flight LH451"
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm p-2.5 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                            ></textarea>
                        </div>

                        {/*submit */}
                        <button
                            type="submit"
                            disabled={loadingAdd || !status || !location} // Using Redux loadingAdd
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition"
                        >
                            <FontAwesomeIcon icon={faPlus} className="mr-2" /> 
                            {loadingAdd ? 'Adding Event...' : 'Add Tracking Update'} 
                        </button>
                    </form>
                </div>
                
                {/*tracking timeline (1/3 width) */}
                <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
                    <h2 className="text-xl font-bold mb-4 border-b pb-3 dark:border-gray-700">Tracking Timeline</h2>
                    
                    <div className="relative border-l border-gray-300 dark:border-gray-600 ml-3">
                        {trackingHistory.map((event, index) => (
                            <div key={index} className="mb-6 ml-6">
                                <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-4 ring-white dark:ring-gray-800 
                                    ${index === 0 ? 'bg-blue-500' : 'bg-gray-400 dark:bg-gray-500'}`}>
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-white text-xs" />
                                </span>
                                
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{event.status}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">{event.location}</p>
                                <time className="block text-xs font-normal text-gray-500 dark:text-gray-500 flex items-center mt-1">
                                    <FontAwesomeIcon icon={faClock} className="mr-1" /> {new Date(event.timestamp).toLocaleString()}
                                </time>
                                {event.details && <p className="text-xs italic text-gray-700 dark:text-gray-300 mt-1">{event.details}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminTrackingUpdatePage;