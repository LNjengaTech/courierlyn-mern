// client/src/components/AdminShipmentForm.jsx - Tailwind Styled

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faChevronLeft, } from '@fortawesome/free-solid-svg-icons';
import { listServices } from '../redux/actions/serviceActions'; // To get service options
import { createShipment, resetShipmentCreate } from '../redux/actions/shipmentActions';
// Make sure a listUsers action exists for getting customer IDs/Names
import { listUsers } from '../redux/actions/userActions'; 


// --- MOCK DATA for Dropdowns (Replace with Redux state) ---
const zones = ['USA', 'Europe', 'Asia', 'Africa', 'Oceania'];
// ---------------------------------------------------------


const AdminShipmentForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux State Selectors
    const { services } = useSelector(state => state.serviceList);
    const { users } = useSelector(state => state.userList);
    const { loading, success, error } = useSelector(state => state.shipmentCreate);

    // Form Fields State
    const [userId, setUserId] = useState('');
    const [serviceType, setServiceType] = useState('');
    const [calculatedRate, setCalculatedRate] = useState(100.00);
    const [weight, setWeight] = useState(1);
    const [length, setLength] = useState(10);
    const [width, setWidth] = useState(10);
    const [height, setHeight] = useState(10);
    const [originName, setOriginName] = useState('');
    const [originAddress, setOriginAddress] = useState('');
    const [originCity, setOriginCity] = useState('');
    const [originCountry, setOriginCountry] = useState(zones[0]);
    const [destinationName, setDestinationName] = useState('');
    const [destinationAddress, setDestinationAddress] = useState('');
    const [destinationCity, setDestinationCity] = useState('');
    const [destinationCountry, setDestinationCountry] = useState(zones[1]);


    // Fetch necessary data on load
    useEffect(() => {
        // Fetch Services (if not already loaded)
        if (services.length === 0) {
            dispatch(listServices());
        }
        if (users.length === 0) {
            dispatch(listUsers());
        }

        if (success) {
            // Success: Redirect and cleanup
            alert('Shipment Created Successfully!');
            dispatch(resetShipmentCreate());
            navigate('/admin/shipments');
        }
    }, [dispatch, navigate, success, services.length, users.length]);


    const submitHandler = (e) => {
        e.preventDefault();

        // 1. Build the shipment object according to the backend model
        const shipmentData = {
            userId,
            calculatedRate: Number(calculatedRate),
            currentStatus: 'PENDING', // Initial status set by form
            
            shipmentDetails: {
                weight: Number(weight),
                dimensions: {
                    length: Number(length),
                    width: Number(width),
                    height: Number(height),
                },
                serviceType,
                quotedPrice: Number(calculatedRate),
            },
            
            origin: {
                name: originName,
                address: originAddress,
                city: originCity,
                country: originCountry,
            },
            
            destination: {
                name: destinationName,
                address: destinationAddress,
                city: destinationCity,
                country: destinationCountry,
            }
        };

        // 2. Dispatch the creation action
        dispatch(createShipment(shipmentData));
    };

    return (
        <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl text-gray-900 dark:text-gray-100">
            <Helmet><title>Create Shipment | Admin</title></Helmet>
            
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                <h1 className="text-xl! sm:text-3xl! font-bold">Create New Shipment Record</h1>
                <button 
                    onClick={() => navigate('/admin/shipments')}
                    className="flex text-sm! items-center px-2! py-2! bg-gray-200! dark:bg-gray-700! text-gray-700! dark:text-gray-300! rounded-md hover:bg-gray-300! dark:hover:bg-gray-600! transition"
                >
                    <FontAwesomeIcon icon={faChevronLeft} className="mr-2" /> Back to Shipments
                </button>
            </div>

            {error && <div className='bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 p-3 rounded mb-4'>{error}</div>}
            
            <form onSubmit={submitHandler} className="space-y-8">
                
                {/* -------------------- SHIPMENT CORE -------------------- */}
                <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400">Core Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* User Link */}
                    <div className="md:col-span-1">
                        <label htmlFor="userId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer (User ID)</label>
                        <select id="userId" required value={userId} onChange={(e) => setUserId(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm p-2.5 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">-- Select Customer --</option>
                            {users.map(user => <option key={user._id} value={user._id}>{user.name} ({user.email})</option>)}
                        </select>
                    </div>

                    {/* Service Type */}
                    <div className="md:col-span-1">
                        <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Service Type</label>
                        <select id="serviceType" required value={serviceType} onChange={(e) => setServiceType(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm p-2.5 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">-- Select Service --</option>
                            {services.map(svc => <option key={svc._id} value={svc.title}>{svc.title}</option>)}
                        </select>
                    </div>

                    {/* Calculated Rate */}
                    <div className="md:col-span-1">
                        <label htmlFor="rate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Final Rate ($)</label>
                        <input type="number" id="rate" required step="0.01" min="0" value={calculatedRate} onChange={(e) => setCalculatedRate(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm p-2.5 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* -------------------- SHIPMENT DETAILS -------------------- */}
                <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 pt-4 border-t dark:border-gray-700">Package Details</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Weight */}
                    <div>
                        <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Weight (kg)</label>
                        <input type="number" id="weight" required step="0.1" min="0.1" value={weight} onChange={(e) => setWeight(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm p-2.5 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    {/* Dimensions */}
                    <div>
                        <label htmlFor="length" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Length (cm)</label>
                        <input type="number" id="length" required step="1" min="1" value={length} onChange={(e) => setLength(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm p-2.5 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="width" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Width (cm)</label>
                        <input type="number" id="width" required step="1" min="1" value={width} onChange={(e) => setWidth(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm p-2.5 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Height (cm)</label>
                        <input type="number" id="height" required step="1" min="1" value={height} onChange={(e) => setHeight(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm p-2.5 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* -------------------- ORIGIN & DESTINATION -------------------- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t dark:border-gray-700">
                    
                    {/* Origin */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Origin (Sender)</h3>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="originName" className="block text-sm font-medium">Name</label>
                                <input type="text" id="originName" required value={originName} onChange={(e) => setOriginName(e.target.value)}
                                    className="mt-1 block w-full border dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm p-2.5 dark:text-gray-100" />
                            </div>
                            <div>
                                <label htmlFor="originAddress" className="block text-sm font-medium">Address Line 1</label>
                                <input type="text" id="originAddress" required value={originAddress} onChange={(e) => setOriginAddress(e.target.value)}
                                    className="mt-1 block w-full border dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm p-2.5 dark:text-gray-100" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="originCity" className="block text-sm font-medium">City</label>
                                    <input type="text" id="originCity" required value={originCity} onChange={(e) => setOriginCity(e.target.value)}
                                        className="mt-1 block w-full border dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm p-2.5 dark:text-gray-100" />
                                </div>
                                <div>
                                    <label htmlFor="originCountry" className="block text-sm font-medium">Country (Zone)</label>
                                    <select id="originCountry" required value={originCountry} onChange={(e) => setOriginCountry(e.target.value)}
                                        className="mt-1 block w-full border dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm p-2.5 dark:text-gray-100"
                                    >
                                        {zones.map(zone => <option key={zone} value={zone}>{zone}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Destination */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Destination (Recipient)</h3>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="destinationName" className="block text-sm font-medium">Name</label>
                                <input type="text" id="destinationName" required value={destinationName} onChange={(e) => setDestinationName(e.target.value)}
                                    className="mt-1 block w-full border dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm p-2.5 dark:text-gray-100" />
                            </div>
                            <div>
                                <label htmlFor="destinationAddress" className="block text-sm font-medium">Address Line 1</label>
                                <input type="text" id="destinationAddress" required value={destinationAddress} onChange={(e) => setDestinationAddress(e.target.value)}
                                    className="mt-1 block w-full border dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm p-2.5 dark:text-gray-100" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="destinationCity" className="block text-sm font-medium">City</label>
                                    <input type="text" id="destinationCity" required value={destinationCity} onChange={(e) => setDestinationCity(e.target.value)}
                                        className="mt-1 block w-full border dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm p-2.5 dark:text-gray-100" />
                                </div>
                                <div>
                                    <label htmlFor="destinationCountry" className="block text-sm font-medium">Country (Zone)</label>
                                    <select id="destinationCountry" required value={destinationCountry} onChange={(e) => setDestinationCountry(e.target.value)}
                                        className="mt-1 block w-full border dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm p-2.5 dark:text-gray-100"
                                    >
                                        {zones.map(zone => <option key={zone} value={zone}>{zone}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Submit Button */}
                <div className="pt-6 border-t dark:border-gray-700">
                    <button
                        type="submit"
                        disabled={loading || !userId || !serviceType}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition"
                    >
                        <FontAwesomeIcon icon={faSave} className="mr-2" /> 
                        {loading ? 'Creating...' : 'Create Shipment & Start Tracking'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminShipmentForm;