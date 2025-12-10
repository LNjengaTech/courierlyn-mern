// client/src/pages/ServicesPage.jsx - Tailwind Styled

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listServices } from '../redux/actions/serviceActions';
import { Helmet } from 'react-helmet';
import ServiceCard from '../components/ServiceCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruckFast, faSpinner } from '@fortawesome/free-solid-svg-icons';

const ServicesPage = () => {
    const dispatch = useDispatch();

    // Select the service list state
    const serviceList = useSelector(state => state.serviceList);
    const { loading, error, services } = serviceList;

    useEffect(() => {
        // Dispatch action to fetch services when the component loads
        dispatch(listServices());
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition duration-300 overflow-x-hidden">
            <Helmet><title>Our Services | Courierlyn</title></Helmet>
            
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <FontAwesomeIcon icon={faTruckFast} className="text-5xl text-blue-600 dark:text-blue-400 mb-4" />
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-3">
                        Our Logistics Solutions
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        Explore our comprehensive range of services designed for speed, security, and reliability across the globe.
                    </p>
                </div>

                {/* Content Area */}
                {loading ? (
                    <div className="text-center py-20 text-blue-600 dark:text-blue-400 text-lg">
                        <FontAwesomeIcon icon={faSpinner} className='animate-spin mr-3' /> Loading available services...
                    </div>
                ) : error ? (
                    <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded relative mx-auto max-w-lg" role="alert">
                        Error fetching services: {error}
                    </div>
                ) : services.length === 0 ? (
                    <div className="text-center py-20 text-gray-600 dark:text-gray-400">No published services found at this time.</div>
                ) : (
                    // Display Services in a Responsive Grid
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map(service => (
                            <ServiceCard key={service._id} service={service} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServicesPage;