// client/src/components/RateCalculator.jsx - Tailwind Styled

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { calculateRate, resetRateCalculation } from '../redux/actions/rateActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { listServices } from '../redux/actions/serviceActions'; // To populate service dropdown

const RateCalculator = () => {
    const dispatch = useDispatch();
    
    // Redux states
    const { loading: rateLoading, error: rateError, rate } = useSelector(state => state.rateCalculate);
    const { services: availableServices = [] } = useSelector(state => state.serviceList || {});

    // Form state
    const [origin, setOrigin] = useState('USA');
    const [destination, setDestination] = useState('Europe');
    const [service, setService] = useState('');
    const [weight, setWeight] = useState('');
    
    // Fetch services on component mount to populate the dropdown
    useEffect(() => {
        if (availableServices.length === 0) {
            dispatch(listServices());
        }
        // Reset calculation state when component mounts or unmounts
        return () => {
            dispatch(resetRateCalculation());
        };
    }, [dispatch, availableServices.length]);

    useEffect(() => {
        if (availableServices.length > 0 && !service) {
            setService(availableServices[0].title);
        }
    }, [availableServices, service]);

    const submitHandler = (e) => {
        e.preventDefault();
        if (origin && destination && service && weight > 0) {
            dispatch(calculateRate({ origin, destination, service, weight: Number(weight) }));
        }
    };
    
    // Placeholder options (should be dynamically fetched zones in a real app)
    const zones = ['USA', 'Europe', 'Asia', 'Africa', 'Oceania'];

    return (
        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-2xl transition duration-300">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                <FontAwesomeIcon icon={faCalculator} className="mr-3 text-blue-600 dark:text-blue-400" /> 
                Instant Rate Calculator (international shipments)
            </h2>
            
            <form onSubmit={submitHandler} className="space-y-4">
                
                {/* 1. Origin and Destination (Zones) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Origin Zone */}
                    <div>
                        <label htmlFor="origin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Origin Zone
                        </label>
                        <select 
                            id="origin" 
                            value={origin} 
                            onChange={(e) => setOrigin(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            {zones.map(zone => <option key={zone} value={zone}>{zone}</option>)}
                        </select>
                    </div>

                    {/* Destination Zone */}
                    <div>
                        <label htmlFor="destination" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Destination Zone
                        </label>
                        <select 
                            id="destination" 
                            value={destination} 
                            onChange={(e) => setDestination(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            {zones.map(zone => <option key={zone} value={zone}>{zone}</option>)}
                        </select>
                    </div>
                </div>

                {/* 2. Service and Weight */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Service Type */}
                    <div>
                        <label htmlFor="service" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Service Type
                        </label>
                        <select 
                            id="service" 
                            value={service} 
                            onChange={(e) => setService(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            {/* Fetch options from serviceList Redux state */}
                            {availableServices.map(svc => <option key={svc._id} value={svc.title}>{svc.title}</option>)}
                        </select>
                    </div>

                    {/* Weight Input */}
                    <div>
                        <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Weight (in kg)
                        </label>
                        <input
                            id="weight"
                            type="number"
                            placeholder="e.g., 5.5"
                            step="0.1"
                            min="0.1"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                </div>
                
                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={rateLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600! hover:bg-green-700! focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition duration-150 mt-6"
                >
                    {rateLoading ? <FontAwesomeIcon icon={faSpinner} className='animate-spin mr-3' /> : 'Calculate Rate'}
                </button>
            </form>

            {/* Calculation Results Display */}
            <div className='mt-8 pt-4 border-t border-gray-200 dark:border-gray-700'>
                {rateError ? (
                    <div className='bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded text-sm' role='alert'>
                        {rateError}
                    </div>
                ) : rate ? (
                    <div className="text-center bg-blue-50 dark:bg-gray-700 p-4 rounded-md">
                        <p className="text-gray-700 dark:text-gray-300 text-lg mb-2">
                            Estimated Rate for <span className='font-bold text-xl text-blue-600'>{rate.serviceType}</span> 
                        </p>
                        <h3 className="text-4xl font-extrabold text-green-700 dark:text-green-400">
                            {rate.currency} {rate.calculatedRate}
                        </h3>
                        <p className="text-xs mt-2 text-gray-500 dark:text-gray-400">
                            {rate.details}
                        </p>
                        <button className="mt-4 px-4 py-2 text-sm bg-blue-600! text-white! rounded hover:bg-blue-700!">
                            Book Now
                        </button>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400">
                        Enter shipment details above to get an instant quote.
                    </p>
                )}
            </div>
        </div>
    );
};

export default RateCalculator;