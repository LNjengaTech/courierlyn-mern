// client/src/components/ServiceForm.jsx - Tailwind Styled

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { resetServiceSave } from '../redux/actions/serviceActions'; // Using SERVICE_SAVE_RESET
import { Helmet } from 'react-helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faChevronLeft, faSpinner } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'; // Used for FormData/file upload

const ServiceForm = () => {
    const { id } = useParams(); // Get service ID for editing
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Form Fields State
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [details, setDetails] = useState('');
    const [image, setImage] = useState('');
    const [isPublished, setIsPublished] = useState(true);
    const [uploading, setUploading] = useState(false);
    
    // API States (Using local state for save/upload feedback for simplicity with FormData)
    const [loadingSave, setLoadingSave] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Fetch existing service details for editing
    useEffect(() => {
        if (id) {
            // Fetch service details from the backend
            // NOTE: In a complete Redux pattern, we'd use the Redux action here.
            // For simplicity and immediate functionality, we'll implement this form logic locally.
            const fetchDetails = async () => {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                };
                try {
                    const { data } = await axios.get(`http://localhost:5000/api/admin/services/${id}`, config);
                    setTitle(data.title);
                    setSubtitle(data.subtitle);
                    setDetails(data.details);
                    setImage(data.image); // This is the image URL/path
                    setIsPublished(data.isPublished);
                } catch (err) {
                    setError(err.response?.data?.message || err.message);
                }
            };
            fetchDetails();
        }
        // Cleanup on unmount
        return () => {
        dispatch(resetServiceSave()); // <-- Dispatch the action creator function
    };
    }, [id, dispatch]);

    // Handles file selection and uploads to the server
    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file); // 'image' must match Multer field name
        setUploading(true);
        setError(null);
        
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            
            // POST to a dedicated image upload endpoint (or reuse the service endpoint for update)
            // For now, we will submit the form data directly to the service SAVE action below.
            // We just store the file object for the main submit handler.
            
            // NOTE: For a clean flow, the service create/update endpoint already handles the image upload via multer.
            // We just need to pass the file object within the main form submission.
            setImage(file);
            setUploading(false);
            setSuccessMessage(`File ready: ${file.name}`);
            
        } catch (err) {
            console.error(err);
            setError('Error uploading image file.');
            setUploading(false);
        }
    };
    
    // Handles the main form submission (Create or Update)
    const submitHandler = async (e) => {
        e.preventDefault();
        setLoadingSave(true);
        setError(null);
        setSuccessMessage(null);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('subtitle', subtitle);
        formData.append('details', details);
        formData.append('isPublished', isPublished);

        // Append image only if a new File object was selected
        if (image && image instanceof File) {
            formData.append('image', image);
        }

        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = {
            headers: {
                // IMPORTANT: Do NOT set Content-Type for FormData, browser does it automatically
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        try {
            if (id) {
                // Update (PUT)
                await axios.put(`http://localhost:5000/api/admin/services/${id}`, formData, config);
                setSuccessMessage('Service successfully updated!');
            } else {
                // Create (POST)
                await axios.post('http://localhost:5000/api/admin/services', formData, config);
                setSuccessMessage('Service successfully created!');
                
                // Clear form after creation
                setTitle('');
                setSubtitle('');
                setDetails('');
                setImage('');
                setIsPublished(true);
            }
            
            setTimeout(() => {
                navigate('/admin/services'); // Redirect back to list
            }, 1000);
            
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoadingSave(false);
        }
    };


    return (
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl text-gray-900 dark:text-gray-100">
            <Helmet><title>{id ? 'Edit Service' : 'Create Service'} | Admin</title></Helmet>
            
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                <h1 className="text-2xl! font-bold">
                    {id ? `Edit Service: ${title}` : 'Create New Service'}
                </h1>
                <button 
                    onClick={() => navigate('/admin/services')}
                    className="flex items-center px-2! py-2! text-sm! bg-gray-200! dark:bg-gray-700! text-gray-700! dark:text-gray-300! rounded-md hover:bg-gray-300! dark:hover:bg-gray-600! transition"
                >
                    <FontAwesomeIcon icon={faChevronLeft} className="mr-2" /> Back to List
                </button>
            </div>

            {error && <div className='bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 p-3 rounded mb-4'>{error}</div>}
            {successMessage && <div className='bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 p-3 rounded mb-4'>{successMessage}</div>}

            <form onSubmit={submitHandler} className="space-y-6">
                
                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title (e.g., Express Air Freight)</label>
                    <input type="text" id="title" required value={title} onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm p-2.5 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Subtitle */}
                <div>
                    <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subtitle (Short tagline)</label>
                    <input type="text" id="subtitle" required value={subtitle} onChange={(e) => setSubtitle(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm p-2.5 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Details */}
                <div>
                    <label htmlFor="details" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Detailed Description</label>
                    <textarea id="details" rows="4" required value={details} onChange={(e) => setDetails(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm p-2.5 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                </div>

                {/* Image Upload */}
                <div>
                    <label htmlFor="image-file" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Service Image</label>
                    <input type="file" id="image-file" onChange={uploadFileHandler}
                        className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {uploading && <p className="mt-2 text-sm text-blue-500 dark:text-blue-400">Uploading {<FontAwesomeIcon icon={faSpinner} className='animate-spin' />}...</p>}
                    {/* Display current image if editing */}
                    {id && image && typeof image === 'string' && (
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Current Image: <span className="font-mono">{image}</span></p>
                    )}
                </div>

                {/* Publication Status */}
                <div className="flex items-center">
                    <input id="isPublished" name="isPublished" type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="isPublished" className="ml-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
                        Publish to Public Website
                    </label>
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        disabled={loadingSave || uploading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition"
                    >
                        <FontAwesomeIcon icon={faSave} className="mr-2" /> 
                        {loadingSave ? 'Saving...' : id ? 'Update Service' : 'Create Service'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ServiceForm;