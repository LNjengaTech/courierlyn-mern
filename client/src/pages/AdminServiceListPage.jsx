import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { listServices } from '../redux/actions/serviceActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSpinner, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const AdminServiceListPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const serviceList = useSelector(state => state.serviceList);
    const { loading, error, services } = serviceList;
    
    //I need separate actions for AdminServiceList and Delete/Create success. for now, i reuse listServices (which fetches ALL services)

    useEffect(() => {
        dispatch(listServices());
    }, [dispatch]);

    // Placeholder for delete handler (will require a new Redux action)
    const deleteHandler = (id) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            console.log(`Deleting service with ID: ${id}`);
            // dispatch(deleteService(id)); //this action should to be implemented laterr
        }
    };
    
    //placeholder for edit navigation
    const editHandler = (id) => {
        navigate(`/admin/services/${id}/edit`);
    };

    return (
        <>
            <Helmet><title>Manage Services | Admin</title></Helmet>
            
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl! sm:text-3xl! font-bold text-gray-900 dark:text-gray-100">Service Management</h1>
                <button 
                    onClick={() => navigate('/admin/services/create')}
                    className="flex items-center text-xs! px-4! py-2! bg-blue-600! text-white! rounded-md shadow hover:bg-blue-700! transition"
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" /> Create Service
                </button>
            </div>

            {loading ? (
                <p className='text-center py-10 text-lg text-blue-600 dark:text-blue-400'>
                    <FontAwesomeIcon icon={faSpinner} className='animate-spin mr-3' /> Loading Services...
                </p>
            ) : error ? (
                <div className='bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 p-4 rounded'>
                    Error: {error}
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Published</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {services.map((service) => (
                                <tr key={service._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{service._id.substring(0, 8)}...</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{service.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {service.isPublished ? (
                                            <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                                        ) : (
                                            <FontAwesomeIcon icon={faTimesCircle} className="text-red-500" />
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button 
                                            onClick={() => editHandler(service._id)}
                                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 transition"
                                        >
                                            <FontAwesomeIcon icon={faEdit} /> Edit
                                        </button>
                                        <button 
                                            onClick={() => deleteHandler(service._id)}
                                            className="text-red-600 dark:text-red-400 hover:text-red-900 transition"
                                        >
                                            <FontAwesomeIcon icon={faTrash} /> Delete
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

export default AdminServiceListPage;