import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { getTrackingDetails, resetTrackingDetails } from '../redux/actions/shipmentActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTruckMoving,faCheckCircle, faSpinner, faMapMarkerAlt, faClock, faPlaneDeparture, faBox } from '@fortawesome/free-solid-svg-icons';


//=============Finally able to implement the tracking page with url parameter support

const TrackingPage = () => {
    const dispatch = useDispatch();
    const { trackingNumber: urlTrackingNumber } = useParams(); //Get parameter from URL
    const { loading, error, tracking } = useSelector(state => state.trackingDetails);

    //initializing state with the URL parameter(if it exists)
    const [trackingNumber, setTrackingNumber] = useState(urlTrackingNumber || '');

    useEffect(() => {
        //if a tracking number came from the URL, automatically dispatch the search action
        if (urlTrackingNumber) {
            dispatch(resetTrackingDetails()); 
            dispatch(getTrackingDetails(urlTrackingNumber));
            // setting input field value to the URL parameter for display
            setTrackingNumber(urlTrackingNumber); 
        }
    }, [dispatch, urlTrackingNumber]); // Re-run only if dispatch or the URL parameter changes

    const searchHandler = (e) => {
        e.preventDefault();
        // Only run search if it wasn't already triggered by the useEffect
        if (trackingNumber) {
            dispatch(resetTrackingDetails()); 
            dispatch(getTrackingDetails(trackingNumber)); 
        }
    };

    const getStatusColor = (status) => {
        if (status.includes('DELIVERED')) return 'text-green-600 dark:text-green-400';
        if (status.includes('EXCEPTION')) return 'text-red-600 dark:text-red-400';
        if (status.includes('TRANSIT')) return 'text-blue-600 dark:text-blue-400';
        return 'text-gray-500 dark:text-gray-400';
    };

    //==> DYNAMIC SEO LOGIC
    let pageTitle = 'Shipment Tracking | Courierlyn';
    let pageDescription = 'Track your parcel or freight in real-time. Enter your Courierlyn tracking number to get the latest status, location, and estimated delivery date.';
    
    if (tracking && tracking.shipment) {
        const shipment = tracking.shipment;
        const currentStatus = shipment.currentStatus.replace('_', ' ');
        const origin = shipment.originCountry;
        const destination = shipment.destinationCountry;

        pageTitle = `Tracking ${shipment.trackingNumber} | Status: ${currentStatus}`;
        pageDescription = `Shipment ${shipment.trackingNumber} is currently ${currentStatus} en route from ${origin} to ${destination}. View the full tracking history and estimated delivery date.`;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition duration-300 overflow-x-hidden">
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <meta name="keywords" content="shipment tracking, track parcel, freight tracking, check status, Courierlyn tracking number" />
            </Helmet>
            
            <div className="max-w-4xl mx-auto">
                {/*search-bar Section */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl mb-10">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                        <FontAwesomeIcon icon={faTruckMoving} className="mr-3 text-blue-600 dark:text-blue-400" /> Track Your Shipment
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Enter your tracking number below to view the latest status and history of your package.
                    </p>
                    <form onSubmit={searchHandler} className="flex space-x-3">
                        <input
                            type="text"
                            placeholder="Enter Tracking Number (e.g., CLYX123456789)"
                            value={trackingNumber} //<--solved: now controlled by state
                            onChange={(e) => setTrackingNumber(e.target.value)}
                            required
                            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {loading ? <FontAwesomeIcon icon={faSpinner} className='animate-spin' /> : <FontAwesomeIcon icon={faSearch} />}
                        </button>
                    </form>
                </div>

                {/*results display area*/}
                {loading && (
                    <div className="text-center py-20 text-blue-600 dark:text-blue-400 text-lg">
                        <FontAwesomeIcon icon={faSpinner} className='animate-spin mr-3' /> Searching for shipment...
                    </div>
                )}
                
                {error && (
                    <div className='bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 p-4 rounded text-center'>
                        Error: {error}
                    </div>
                )}

                {/*display results when `tracking` is present*/}
                {tracking && ( // Condition simplifies to checking if Redux state has tracking data
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
                        
                        {/*summary header - Accessing tracking.shipment and tracking.trackingHistory */}
                        <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                Tracking No: <span className="text-blue-600 dark:text-blue-400">{tracking.shipment.trackingNumber}</span>
                            </h2>
                            <p className={`text-xl font-semibold ${getStatusColor(tracking.shipment.currentStatus)}`}>
                                Status: {tracking.shipment.currentStatus.replace('_', ' ')}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center">
                                <FontAwesomeIcon icon={faPlaneDeparture} className="mr-2" /> Service: {tracking.shipment.serviceType}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center">
                                <FontAwesomeIcon icon={faBox} className="mr-2" /> Estimated Delivery: {new Date(tracking.shipment.deliveryDate).toLocaleDateString()}
                            </p>
                        </div>
                        
                        {/*tracking history timeline */}
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Shipment History</h3>
                        <div className="relative border-l border-gray-200 dark:border-gray-700 ml-3">
                            {tracking.trackingHistory.map((event, index) => (
                                <div key={index} className="mb-8 ml-6">
                                    {/* timeline dot and event card logic*/}
                                    <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-8 ring-white dark:ring-gray-800 
                                        ${event.isCurrent ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                                        <FontAwesomeIcon icon={event.isCurrent ? faCheckCircle : faMapMarkerAlt} className="text-white text-xs" />
                                    </span>
                                    
                                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md transition duration-200 hover:shadow-lg">
                                        <time className="mb-1 text-xs font-normal leading-none text-gray-400 dark:text-gray-500 flex items-center">
                                            <FontAwesomeIcon icon={faClock} className="mr-1" /> {new Date(event.timestamp).toLocaleString()}
                                        </time>
                                        <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-1">{event.location}</h4>
                                        <p className={`text-sm ${event.isCurrent ? 'font-bold' : 'font-medium'} ${getStatusColor(event.status)}`}>
                                            {event.status}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {!loading && error && (
                    <div className='bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 p-4 rounded text-center'>
                        Error: {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackingPage;