import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listServices } from '../redux/actions/serviceActions';
import { Helmet } from 'react-helmet';
import ServiceCard from '../components/ServiceCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruckFast, faSpinner } from '@fortawesome/free-solid-svg-icons';

const ServicesPage = () => {
    const dispatch = useDispatch();

    //select the service list state
    const serviceList = useSelector(state => state.serviceList);
    const { loading, error, services } = serviceList;

    useEffect(() => {
        //dispatching action to fetch services when the component loads
        dispatch(listServices());
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition duration-300 overflow-x-hidden">
            {/* UNIQUE SEO FOR SERVICES PAGE */}
            <Helmet>
                <title>Global & Local Shipping Services | Courierlyn</title>
                <meta name="description" content="Explore Courierlyn's comprehensive logistics solutions: air freight, ocean cargo, road transport, and specialized warehousing services. Get the best rate for your global supply chain needs." />
                <meta name="keywords" content="logistics services, air freight, ocean shipping, road transport, warehousing, cargo, supply chain management, FCL, LCL" />
            </Helmet>
            
            <div className="max-w-7xl mx-auto">
                {/* Header section */}
                <div className="text-center mb-12">
                    <FontAwesomeIcon icon={faTruckFast} className="text-5xl text-blue-600 dark:text-blue-400 mb-4" />
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-3">
                        Our Logistics Solutions
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        Explore our comprehensive range of services designed for speed, security, and reliability across the globe.
                    </p>
                </div>

                {/*Content area */}
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
                    //display services in a grid
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