// client/src/pages/AdminShipmentListPage.jsx - Tailwind Styled

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { listShipments } from '../redux/actions/shipmentActions'; // Assume this action exists
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEye, faSpinner, faTruckMoving } from '@fortawesome/free-solid-svg-icons';


const AdminShipmentListPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const shipmentList = useSelector(state => state.shipmentList);
    const { loading, error, shipments } = shipmentList;

    useEffect(() => {
        dispatch(listShipments());
    }, [dispatch]);
    
    const viewTrackingHandler = (id) => {
        navigate(`/admin/shipments/${id}/track`);
    };
    
    const getStatusStyle = (status) => {
        if (status === 'DELIVERED') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        if (status === 'OUT_FOR_DELIVERY') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        if (status === 'IN_TRANSIT') return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    };

    return (
        <>
            <Helmet><title>Manage Shipments | Admin</title></Helmet>
            
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl! sm:text-3xl! font-bold text-gray-900! dark:text-gray-100! flex items-center">
                    <FontAwesomeIcon icon={faTruckMoving} className="mr-3 text-blue-600 dark:text-blue-400" /> Shipment Management
                </h1>
                <button 
                    onClick={() => navigate('/admin/shipments/create')}
                    className="flex text-sm! items-center px-2! py-2! bg-blue-600! text-white! rounded-md shadow hover:bg-blue-700! transition"
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" /> Create Shipment
                </button>
            </div>

            {loading ? (
                <p className='text-center py-10 text-lg text-blue-600 dark:text-blue-400'>
                    <FontAwesomeIcon icon={faSpinner} className='animate-spin mr-3' /> Loading Shipments...
                </p>
            ) : error ? (
                <div className='bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 p-4 rounded'>
                    Error: {error}
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tracking No.</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Route</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {/* Check if shipments array is not empty before mapping */}
                            {shipments && shipments.length > 0 ? (  
                                shipments.map((shipment) => (
                                <tr key={shipment._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600 dark:text-blue-400">{shipment.trackingNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{shipment.customer ? shipment.customer.name : shipment.customer || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{shipment.originCountry} &rarr; {shipment.destinationCountry}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(shipment.currentStatus)}`}>
                                            {shipment.currentStatus.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button 
                                            onClick={() => viewTrackingHandler(shipment._id)}
                                            className="text-indigo-600! dark:text-indigo-400! hover:text-indigo-900! transition"
                                        >
                                            <FontAwesomeIcon icon={faEye} className="mr-1" /> Update Tracking
                                        </button>
                                    </td>
                                </tr>
                            ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                        No shipments found. Start by creating a new shipment record!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
};

export default AdminShipmentListPage;