// client/src/pages/CustomerDashboardPage.jsx - DYNAMIC VERSION

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { listUserShipments } from '../redux/actions/shipmentActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruckMoving, faExclamationTriangle, faCheckCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';

const CustomerDashboardPage = () => {
    const dispatch = useDispatch();
    
    // Select user info (to show name)
    const { userInfo } = useSelector(state => state.userLogin);
    
    // Select the new shipment list state
    const userShipmentList = useSelector(state => state.userShipmentList);
    const { loading, error, shipments } = userShipmentList;

    useEffect(() => {
        // Fetch the user's shipments when the component loads
        dispatch(listUserShipments());
    }, [dispatch]);

    // Helper function to render status chips (you can move this outside if preferred)
    const getStatusChip = (status) => {
        const base = "px-3 py-1 text-xs font-semibold rounded-full flex items-center";
        switch (status) {
            case 'DELIVERED':
                return <span className={`${base} bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100`}>
                    <FontAwesomeIcon icon={faCheckCircle} className="mr-1" /> DELIVERED
                </span>;
            case 'IN_TRANSIT':
                return <span className={`${base} bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100`}>
                    <FontAwesomeIcon icon={faTruckMoving} className="mr-1" /> IN TRANSIT
                </span>;
            case 'PENDING':
                return <span className={`${base} bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100`}>
                    PENDING
                </span>;
            case 'EXCEPTION':
                return <span className={`${base} bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100`}>
                    <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1" /> EXCEPTION
                </span>;
            default:
                return <span className={`${base} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`}>
                    {status.replace('_', ' ')}
                </span>;
        }
    };

    // Calculate dynamic counts for the summary cards
    const currentShipmentsCount = shipments.filter(s => s.currentStatus !== 'DELIVERED' && s.currentStatus !== 'CANCELLED').length;
    const deliveredCount = shipments.filter(s => s.currentStatus === 'DELIVERED').length;
    // You'll need to calculate 'Pending Quotes' based on other data, here we use a placeholder
    
    return (
        <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg my-10 text-gray-900 dark:text-gray-100">
            <Helmet><title>Dashboard | Courierlyn</title></Helmet>
            <h1 className="text-3xl font-bold mb-6 border-b pb-2 border-gray-200 dark:border-gray-700">
                Welcome, {userInfo?.name}!
            </h1>
            
            {/* Dynamic Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <DashboardCard title="Active Shipments" count={currentShipmentsCount} color="blue" />
                <DashboardCard title="Total Delivered" count={deliveredCount} color="green" />
                <DashboardCard title="Total Shipments" count={shipments.length} color="indigo" />
            </div>

            <h2 className="text-2xl font-semibold mt-10 mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">Your Recent Shipments</h2>
            
            {/* Conditional Rendering for Shipments List */}
            {loading ? (
                <div className="text-center py-10">
                    <FontAwesomeIcon icon={faSpinner} className='animate-spin text-2xl text-blue-600' />
                    <p className="mt-2 text-gray-500">Loading your shipments...</p>
                </div>
            ) : error ? (
                <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 p-4 rounded text-center">
                    Error loading shipments: {error}
                </div>
            ) : shipments.length === 0 ? (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                    You have no recent shipments.
                    <div className="mt-4">
                        <Link to="/request-shipment" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                            Request New Shipment
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tracking No.</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Route</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {shipments.map((shipment) => (
                                <tr key={shipment._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                                        {shipment.trackingNumber}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusChip(shipment.currentStatus)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                        {shipment.originCountry} &rarr; {shipment.destinationCountry}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(shipment.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link 
                                            to={`/tracking/${shipment.trackingNumber}`} 
                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                        >
                                            Track
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

// Simple reusable card component (Keep this at the bottom)
const DashboardCard = ({ title, count, color }) => (
    <div className={`p-6 rounded-lg shadow-md bg-white dark:bg-gray-700 border-l-4 border-${color}-500`}>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-4xl font-extrabold mt-1 text-gray-900 dark:text-gray-100">{count}</p>
    </div>
);

export default CustomerDashboardPage;