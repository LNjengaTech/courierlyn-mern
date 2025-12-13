import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { updateQuoteStatus, resetUpdateQuoteStatus, getQuoteDetails } from '../redux/actions/quoteActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faArrowLeft, faUser, faEnvelope, faPhone, faIndustry, faTruckMoving, faQuoteLeft } from '@fortawesome/free-solid-svg-icons';

const DetailItem = ({ icon, label, value }) => (
    <div className="flex items-start space-x-3 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <FontAwesomeIcon icon={icon} className="mt-1 text-blue-600 dark:text-blue-400 shrink-0" />
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 wrap-break-words">{value}</p>
        </div>
    </div>
);

const AdminQuoteDetailsPage = () => {
    const dispatch = useDispatch();
    const { id } = useParams(); //Get the ID from url

    const quoteDetails = useSelector((state) => state.quoteDetails);
    const { loading, error, quote } = quoteDetails;

    const quoteUpdateStatus = useSelector((state) => state.quoteStatusUpdate);
    const { loading: loadingUpdate, success: successUpdate, error: errorUpdate } = quoteUpdateStatus;

    useEffect(() => {
        // if the update was successful, refresh the details and reset the update state
        if (successUpdate) {
            dispatch(resetUpdateQuoteStatus); //clearing the success flag
            dispatch(getQuoteDetails(id)); //re-fetch the updated quote data
        } else {
            //Fetch quote details on mount
            dispatch(getQuoteDetails(id));
        }
    }, [dispatch, id, successUpdate]);

    const handleProcessQuote = () => {
        if (window.confirm('Are you sure you want to mark this quote as PROCESSED?')) {
            dispatch(updateQuoteStatus(id));
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <Helmet><title>Quote Details | {quote._id ? quote._id.substring(0, 8) : 'Loading'}</title></Helmet>

            <Link to="/admin/quotes" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 mb-6 transition">
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Back to Quote List
            </Link>

            {loading ? (
                <div className="text-center py-20">
                    <FontAwesomeIcon icon={faSpinner} className='animate-spin text-4xl text-blue-600' />
                </div>
            ) : error ? (
                <div className="bg-red-100 dark:bg-red-900 p-4 rounded text-red-700 dark:text-red-300">Error: {error}</div>
            ) : quote._id ? (
                <>
                    <header className="flex justify-between items-center pb-4 mb-6">
                        <h1 className="text-xl! sm:text-3xl! font-bold text-gray-900! dark:text-gray-100!">
                            Quote Request from {quote.name}
                        </h1>
                        <span className={`px-2 py-1 text-sm! font-bold rounded-full ${quote.isProcessed 
                            ? 'bg-green-600 text-white' 
                            : 'bg-yellow-400 text-gray-900'}`}
                        >
                            {quote.isProcessed ? 'PROCESSED' : 'PENDING'}
                        </span>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/*customer info*/}
                        <div className="lg:col-span-1 space-y-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg h-full">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Customer Details</h2>
                            <DetailItem icon={faUser} label="Name" value={quote.name} />
                            <DetailItem icon={faEnvelope} label="Email" value={quote.email} />
                            <DetailItem icon={faPhone} label="Phone" value={quote.phone || 'N/A'} />
                            <DetailItem icon={faIndustry} label="Industry" value={quote.industry || 'N/A'} />
                            <p className="text-xs text-gray-500 dark:text-gray-400 pt-2">Submitted: {new Date(quote.createdAt).toLocaleString()}</p>
                        </div>

                        {/* shipment details & action*/}
                        <div className="lg:col-span-2 space-y-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Shipment Details</h2>
                            
                            {/* route & category */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <DetailItem icon={faTruckMoving} label="Ship From" value={quote.shipFrom} />
                                <DetailItem icon={faTruckMoving} label="Ship To" value={quote.shipTo} />
                                <DetailItem icon={faQuoteLeft} label="Category" value={quote.category} />
                            </div>

                            {/*description*/}
                            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Description of Items</p>
                                <p className="text-base text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{quote.description}</p>
                            </div>

                            {/*Action buttons*/}
                            <div className="pt-4 border-t dark:border-gray-700">
                                <button
                                    onClick={handleProcessQuote}
                                    disabled={quote.isProcessed}
                                    className={`px-6 py-3 font-semibold rounded-md transition ${quote.isProcessed
                                        ? 'bg-gray-400! text-gray-700! dark:bg-gray-600! dark:text-gray-300! cursor-not-allowed'
                                        : 'bg-indigo-600! text-white! hover:bg-indigo-700!'
                                    }`}
                                >
                                    {quote.isProcessed ? 'Quote Already Processed' : 'Mark as Processed'}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-center py-20 text-gray-600 dark:text-gray-400">
                    Quote data is not available. Check the ID.
                </div>
            )}
        </div>
    );
};

export default AdminQuoteDetailsPage;