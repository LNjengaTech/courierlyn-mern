// client/src/pages/ContactPage.jsx - FINAL DESIGN

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux'; // New Imports
import { submitContactEmail, submitQuoteRequest, resetContactSubmission } from '../redux/actions/contactActions'; // New Imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle, faEnvelope, faPhone, faQuoteLeft, faPaperPlane, faTruckLoading } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { toast } from 'react-toastify'; 
// --- Helper Components (Defined below for simplicity) ---

const ContactPage = () => {
    const dispatch = useDispatch();
    
    // Select the submission state
    const contactSubmission = useSelector(state => state.contactSubmission);
    const { loading, success, error } = contactSubmission;

    // State for General Email Form (Keep this)
    const [emailFormData, setEmailFormData] = useState({ name: '', email: '', subject: '', message: '' });
    // State for Quote Request Form (Keep this)
    const [quoteFormData, setQuoteFormData] = useState({ name: '', email: '', phone: '', industry: '', shipFrom: '', shipTo: '', category: '', description: '' });


    // --- EFFECT HOOK FOR TOAST NOTIFICATIONS ---
    useEffect(() => {
        if (success) {
            // Success Toast
            toast.success(success);
            // Reset forms after successful submission
            setEmailFormData({ name: '', email: '', subject: '', message: '' });
            setQuoteFormData({ name: '', email: '', phone: '', industry: '', shipFrom: '', shipTo: '', category: '', description: '' });
            dispatch(resetContactSubmission()); // Clear Redux state
            
        } else if (error) {
            // Error Toast
            toast.error(error);
            dispatch(resetContactSubmission()); // Clear Redux state
        }
    }, [dispatch, success, error]);

    // Reset status when component mounts/unmounts
    useEffect(() => {
        return () => {
            dispatch(resetContactSubmission());
        };
    }, [dispatch]);


    const handleEmailSubmit = (e) => {
        e.preventDefault();
        
        dispatch(submitContactEmail(emailFormData));
    };

    const handleQuoteSubmit = (e) => {
        e.preventDefault();
        
        dispatch(submitQuoteRequest(quoteFormData));
    };


    const inputClasses = "mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500";
    const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition duration-300">
            <Helmet><title>Contact & Get Quote | Courierlyn</title></Helmet>

            {/* Header */}
            <header className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 sm:text-5xl mb-3">
                    Let's Start Your Shipment
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                    Get an instant quote or connect with our support team.
                </p>
            </header>


            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* Left Column: General Contact & Phone/WhatsApp (1/3 width) */}
                <div className="lg:col-span-1 space-y-8">
                    
                    {/* Contact Form (General Email) */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                            <FontAwesomeIcon icon={faEnvelope} className="mr-3 text-blue-500" /> Send Us an Email
                        </h2>
                        <form onSubmit={handleEmailSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className={labelClasses}>Name</label>
                                <input type="text" id="name" required className={inputClasses}
                                    onChange={(e) => setEmailFormData({...emailFormData, name: e.target.value})} />
                            </div>
                            <div>
                                <label htmlFor="email" className={labelClasses}>Email</label>
                                <input type="email" id="email" required className={inputClasses}
                                    onChange={(e) => setEmailFormData({...emailFormData, email: e.target.value})} />
                            </div>
                            <div>
                                <label htmlFor="subject" className={labelClasses}>Subject</label>
                                <input type="text" id="subject" className={inputClasses}
                                    onChange={(e) => setEmailFormData({...emailFormData, subject: e.target.value})} />
                            </div>
                            <div>
                                <label htmlFor="message" className={labelClasses}>Message</label>
                                <textarea id="message" rows="4" required className={inputClasses}
                                    onChange={(e) => setEmailFormData({...emailFormData, message: e.target.value})}></textarea>
                            </div>
                            <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600! text-white! font-medium rounded-md hover:bg-blue-700! transition disabled:opacity-50 flex items-center justify-center">
                              {loading ? 'Sending...' : <><FontAwesomeIcon icon={faPaperPlane} className="mr-2" /> Send Message</>}
                            </button>
                        </form>
                    </div>

                    {/* Phone & WhatsApp Buttons */}
                    <div className="space-y-4">
                        <ContactButton icon={faPhone} text="Call Us: +1 (555) 123-4567" color="green" href="tel:+15551234567"/>
                        <ContactButton icon={faWhatsapp} text="WhatsApp: +1 (555) 123-4567" color="green" href="https://wa.me/15551234567" />
                    </div>
                </div>

                {/* Right Column: Shipping Quote Form (2/3 width) */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                        <FontAwesomeIcon icon={faQuoteLeft} className="mr-3 text-orange-500" /> Get a Detailed Shipping Quote
                    </h2>
                    <form onSubmit={handleQuoteSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="qName" className={labelClasses}>Name *</label>
                                <input type="text" id="qName" required className={inputClasses}
                                    onChange={(e) => setQuoteFormData({...quoteFormData, name: e.target.value})} />
                            </div>
                            <div>
                                <label htmlFor="qEmail" className={labelClasses}>Email *</label>
                                <input type="email" id="qEmail" required className={inputClasses}
                                    onChange={(e) => setQuoteFormData({...quoteFormData, email: e.target.value})} />
                            </div>
                            <div>
                                <label htmlFor="qPhone" className={labelClasses}>Phone</label>
                                <input type="text" id="qPhone" className={inputClasses}
                                    onChange={(e) => setQuoteFormData({...quoteFormData, phone: e.target.value})} />
                            </div>
                            <div>
                                <label htmlFor="qIndustry" className={labelClasses}>Industry</label>
                                <input type="text" id="qIndustry" className={inputClasses}
                                    onChange={(e) => setQuoteFormData({...quoteFormData, industry: e.target.value})} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="shipFrom" className={labelClasses}>Ship From (City, State/ZIP) *</label>
                                <input type="text" id="shipFrom" required className={inputClasses}
                                    onChange={(e) => setQuoteFormData({...quoteFormData, shipFrom: e.target.value})} />
                            </div>
                            <div>
                                <label htmlFor="shipTo" className={labelClasses}>Ship To (City, State/ZIP) *</label>
                                <input type="text" id="shipTo" required className={inputClasses}
                                    onChange={(e) => setQuoteFormData({...quoteFormData, shipTo: e.target.value})} />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="category" className={labelClasses}>Category of Items *</label>
                            <select id="category" required className={inputClasses}
                                onChange={(e) => setQuoteFormData({...quoteFormData, category: e.target.value})}>
                                <option value="">-- Select Category --</option>
                                <option value="General Cargo">General Cargo</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Perishables">Perishables</option>
                                <option value="Heavy Equipment">Heavy Equipment</option>
                                <option value="Other">Other...</option>
                            </select>
                        </div>
                        
                        <div>
                            <label htmlFor="description" className={labelClasses}>Description of Items (Include approximate weight/dimensions) *</label>
                            <textarea id="description" rows="3" placeholder='Include approximate weight/dimensions' required className={inputClasses}
                                onChange={(e) => setQuoteFormData({...quoteFormData, description: e.target.value})}></textarea>
                        </div>

                        <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600! text-white! font-medium rounded-md hover:bg-blue-700! transition disabled:opacity-50 flex items-center justify-center">
                            {loading ? 'Submitting...' : <><FontAwesomeIcon icon={faTruckLoading} className="mr-2" /> Get Quote</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Reusable component for WhatsApp/Phone buttons
const ContactButton = ({ icon, text, color, href }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`w-full flex items-center justify-center p-4 rounded-lg text-white! font-semibold transition duration-300 shadow-lg 
        ${color === 'green' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
        <FontAwesomeIcon icon={icon} className="mr-3 text-xl" />
        {text}
    </a>
);

export default ContactPage;