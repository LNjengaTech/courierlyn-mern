// client/src/pages/AdminQuoteListPage.jsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { listQuoteRequests } from '../redux/actions/quoteActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCheckCircle, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const AdminQuoteListPage = ({ history }) => {
    const dispatch = useDispatch();

    const quoteList = useSelector((state) => state.quoteList);
    const { loading, error, quotes } = quoteList;

    const { userInfo } = useSelector((state) => state.userLogin);

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            dispatch(listQuoteRequests());
        } else {
            // Redirect if not admin
            history.push('/login'); // If using older router, otherwise use useNavigate hook
        }
    }, [dispatch, userInfo, history]);
    
    // Helper function for status chip
    const getStatusChip = (isProcessed) => {
        const base = "px-3 py-1 text-xs font-semibold rounded-full";
        if (isProcessed) {
            return <span className={`${base} bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100`}>
                <FontAwesomeIcon icon={faCheckCircle} className="mr-1" /> PROCESSED
            </span>;
        } else {
            return <span className={`${base} bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100`}>
                PENDING
            </span>;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <Helmet><title>Admin | Quote Requests</title></Helmet>
            <h1 className="text-xl! sm:text-3xl! font-bold! text-gray-900! dark:text-gray-100! mb-6 pb-2">
                <FontAwesomeIcon icon={faEnvelope} className="mr-3 text-blue-600" /> Quote Requests
            </h1>

            {loading ? (
                <div className="text-center py-10">
                    <FontAwesomeIcon icon={faSpinner} className='animate-spin text-3xl text-blue-600' />
                </div>
            ) : error ? (
                <div className="bg-red-100 dark:bg-red-900 p-4 rounded text-red-700 dark:text-red-300">Error: {error}</div>
            ) : (
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Route</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {quotes.map((quote) => (
                                <tr key={quote._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{quote._id.substring(0, 8)}...</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{quote.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{quote.shipFrom} &rarr; {quote.shipTo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{quote.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{getStatusChip(quote.isProcessed)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(quote.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link 
                                            to={`/admin/quotes/${quote._id}`} 
                                            className="text-indigo-600! hover:text-indigo-900! dark:text-indigo-400! dark:hover:text-indigo-300!"
                                        >
                                            Details
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

export default AdminQuoteListPage;