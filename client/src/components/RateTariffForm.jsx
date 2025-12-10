// client/src/components/RateTariffForm.jsx - Tailwind Styled

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { listServices } from '../redux/actions/serviceActions';
import { Helmet } from 'react-helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const RateTariffForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Form Fields State
    const [serviceType, setServiceType] = useState('');
    const [originZone, setOriginZone] = useState('USA');
    const [destinationZone, setDestinationZone] = useState('Europe');
    const [minWeight, setMinWeight] = useState(0);
    const [maxWeight, setMaxWeight] = useState(10);
    const [baseCost, setBaseCost] = useState(5.00);
    const [costPerUnit, setCostPerUnit] = useState(2.00);
    const [isActive, setIsActive] = useState(true);

    // API States
    const [loadingSave, setLoadingSave] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    
    // Services list for dropdown options
    const { services: availableServices } = useSelector(state => state.serviceList);

    // Placeholder zones (Must match zones defined in backend logic)
    const zones = ['USA', 'Europe', 'Asia', 'Africa', 'Oceania'];

    // 1. Fetch available services and existing tariff data if editing
    useEffect(() => {
        // Fetch public services to populate the service dropdown
        if (availableServices.length === 0) {
            dispatch(listServices());
        }
        
        // Set default service type
        if (availableServices.length > 0 && !serviceType) {
            setServiceType(availableServices[0].title);
        }

        // Fetch existing tariff for edit mode
        if (id) {
            const fetchTariffDetails = async () => {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                try {
                    const { data } = await axios.get(`http://localhost:5000/api/admin/rates/${id}`, config);
                    setServiceType(data.serviceType);
                    setOriginZone(data.originZone);
                    setDestinationZone(data.destinationZone);
                    setMinWeight(data.minWeight);
                    setMaxWeight(data.maxWeight === 999999 ? '' : data.maxWeight); // Convert MAX back to empty string
                    setBaseCost(data.baseCost);
                    setCostPerUnit(data.costPerUnit);
                    setIsActive(data.isActive);
                } catch (err) {
                    setError(err.response?.data?.message || err.message);
                }
            };
            fetchTariffDetails();
        }
    }, [id, dispatch, availableServices.length, serviceType, availableServices]);

    // 2. Submit Handler (Create or Update)
    const submitHandler = async (e) => {
        e.preventDefault();
        setLoadingSave(true);
        setError(null);
        setSuccessMessage(null);

        const tariffData = {
            serviceType,
            originZone,
            destinationZone,
            minWeight: Number(minWeight),
            // Set maxWeight to a large number if input is empty (representing 'MAX')
            maxWeight: maxWeight === '' ? 999999 : Number(maxWeight), 
            baseCost: Number(baseCost),
            costPerUnit: Number(costPerUnit),
            isActive
        };
        
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        try {
            if (id) {
                // Update (PUT)
                await axios.put(`http://localhost:5000/api/admin/rates/${id}`, tariffData, config);
                setSuccessMessage('Rate Tariff successfully updated!');
            } else {
                // Create (POST)
                await axios.post('http://localhost:5000/api/admin/rates', tariffData, config);
                setSuccessMessage('Rate Tariff successfully created!');
            }
            
            setTimeout(() => {
                navigate('/admin/rates'); // Redirect back to list
            }, 1000);
            
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoadingSave(false);
        }
    };


    return (
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl text-gray-900 dark:text-gray-100">
            <Helmet><title>{id ? 'Edit Tariff' : 'Create Tariff'} | Admin</title></Helmet>
            
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                <h1 className="text-xl! sm:text-3xl! font-bold">
                    {id ? `Edit Rate Tariff: ${serviceType}` : 'Create New Rate Tariff'}
                </h1>
                <button 
                    onClick={() => navigate('/admin/rates')}
                    className="flex items-center px-4 py-2 text-sm! bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                    <FontAwesomeIcon icon={faChevronLeft} className="mr-2" /> Back to List
                </button>
            </div>

            {error && <div className='bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 p-3 rounded mb-4'>{error}</div>}
            {successMessage && <div className='bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 p-3 rounded mb-4'>{successMessage}</div>}

            <form onSubmit={submitHandler} className="space-y-6">
                
                {/* Service Type */}
                <div>
                    <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Associated Service</label>
                    <select id="serviceType" required value={serviceType} onChange={(e) => setServiceType(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm p-2.5 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                    >
                        {availableServices.map(svc => <option key={svc._id} value={svc.title}>{svc.title}</option>)}
                    </select>
                </div>

                {/* Route (Zones) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="originZone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Origin Zone</label>
                        <select id="originZone" required value={originZone} onChange={(e) => setOriginZone(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm p-2.5 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {zones.map(zone => <option key={zone} value={zone}>{zone}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="destinationZone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Destination Zone</label>
                        <select id="destinationZone" required value={destinationZone} onChange={(e) => setDestinationZone(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm p-2.5 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {zones.map(zone => <option key={zone} value={zone}>{zone}</option>)}
                        </select>
                    </div>
                </div>

                {/* Weight Range (kg) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="minWeight" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Min Weight (kg)</label>
                        <input type="number" id="minWeight" required step="0.01" min="0" value={minWeight} onChange={(e) => setMinWeight(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm p-2.5 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="maxWeight" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Max Weight (kg) - Leave empty for MAX</label>
                        <input type="number" id="maxWeight" step="0.01" min={minWeight} value={maxWeight} onChange={(e) => setMaxWeight(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm p-2.5 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="baseCost" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Base Cost ($)</label>
                        <input type="number" id="baseCost" required step="0.01" min="0" value={baseCost} onChange={(e) => setBaseCost(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm p-2.5 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="costPerUnit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cost Per Kg/Unit ($)</label>
                        <input type="number" id="costPerUnit" required step="0.01" min="0" value={costPerUnit} onChange={(e) => setCostPerUnit(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm p-2.5 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Status */}
                <div className="flex items-center">
                    <input id="isActive" name="isActive" type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
                        Is Active
                    </label>
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        disabled={loadingSave}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition"
                    >
                        <FontAwesomeIcon icon={faSave} className="mr-2" /> 
                        {loadingSave ? 'Saving...' : id ? 'Update Tariff' : 'Create Tariff'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RateTariffForm;