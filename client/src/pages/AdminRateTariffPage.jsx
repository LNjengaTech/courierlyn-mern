import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'; //direct axios call for simplicity in admin panel placeholders


const AdminRateTariffPage = () => {
    
    const API_BASE = import.meta.env.VITE_API_BASE_URL;
    const [tariffs, setTariffs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // this data should be managed by Redux but for now...
    //using simple fetch here to demonstrate immediate admin functionality.

    useEffect(() => {
        const fetchTariffs = async () => {
            try {
                //get JWT token from local storage
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if (!userInfo || !userInfo.token) {
                    throw new Error("Admin token not found.");
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                
                const { data } = await axios.get(`${API_BASE}/admin/rates`, config);
                setTariffs(data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        fetchTariffs();
    }, []);

    const navigate = useNavigate();
    
    //placeholder handlers
    const deleteHandler = () => { /*implement logic later*/ };
    const editHandler = (id) => { navigate(`/admin/rates/${id}/edit`); };

    return (
        <>
            <Helmet><title>Manage Rates | Admin</title></Helmet>
            
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl! sm:text-3xl! font-bold text-gray-900 dark:text-gray-100">Rate Tariff Management</h1>
                <button 
                    onClick={() => navigate('/admin/rates/create')}
                    className="flex text-sm! items-center px-4! py-2! bg-blue-600! text-white! rounded-md shadow hover:bg-blue-700! transition"
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" /> Create Tariff
                </button>
            </div>

            {loading ? (
                <p className='text-center py-10 text-lg text-blue-600 dark:text-blue-400'>
                    <FontAwesomeIcon icon={faSpinner} className='animate-spin mr-3' /> Loading Tariffs...
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Service</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Route</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Weight Range (kg)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Base Cost</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cost/Unit</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {tariffs.map((tariff) => (
                                <tr key={tariff._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{tariff.serviceType}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{tariff.originZone} to {tariff.destinationZone}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{tariff.minWeight} - {tariff.maxWeight === 999999 ? 'MAX' : tariff.maxWeight}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600 dark:text-green-400">Ksh. {tariff.baseCost.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600 dark:text-green-400">Ksh. {tariff.costPerUnit.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button 
                                            onClick={() => editHandler(tariff._id)}
                                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 transition"
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button 
                                            onClick={() => deleteHandler(tariff._id)}
                                            className="text-red-600 dark:text-red-400 hover:text-red-900 transition"
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
};

export default AdminRateTariffPage;