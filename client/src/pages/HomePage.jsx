// client/src/pages/HomePage.jsx - Tailwind Styled

import React from 'react';
import { Helmet } from 'react-helmet';
import RateCalculator from '../components/RateCalculator'; // Import the calculator
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faLock, faGlobe } from '@fortawesome/free-solid-svg-icons';

import { ReactTyped } from 'react-typed';

const HomePage = () => {

    const typingPhrases = [
        "Fast, Secure, Local and Global Shipments.",
        "Real-Time Tracking For Your Goods.",
        "Seamless Logistics For Your Business."
    ];


    return (
        <div className="bg-gray-50 dark:bg-gray-900 transition duration-300 overflow-x-hidden">
            <Helmet><title>Courierlyn - Global Logistics Partner</title></Helmet>

            {/* 1. Hero Section: Calculator and Headline */}
            <div className="relative pt-10 pb-20 sm:pt-16 lg:pt-24 lg:pb-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                        {/* Hero Text - Left Side */}
                        <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                            <h1 className="mt-4 h-20! md:h-28! text-4xl! md:text-5xl! tracking-tight font-extrabold text-gray-900 dark:text-gray-100 sm:mt-5 sm:text-6xl lg:mt-6 xl:text-7xl">
                                
                                {/* 2. Implement the Typing Effect */}
                                <ReactTyped
                                    strings={typingPhrases} // The array of strings to type
                                    typeSpeed={40}       // Speed of typing (ms per character)
                                    backSpeed={50}       // Speed of deleting (ms per character)
                                    loop={true}          // Loop indefinitely
                                    backDelay={2000}     // Pause before deleting (2 seconds)
                                    className="block text-blue-600 dark:text-blue-400" // Apply color class
                                />
                                
                            </h1>
                            <p className="mt-3 text-base text-gray-600 dark:text-gray-400 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                                Get instant quotes, track your parcels in real-time, and manage your logistics with our platform.
                            </p>
                            <div className="mt-10 sm:mt-12 flex gap-6 ">

                                <Link to="/tracking" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white! bg-blue-600 hover:bg-blue-700">
                                    Start Tracking Now
                                </Link>
                                 <Link to="/contact" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white! bg-blue-600 hover:bg-blue-700">
                                    Get a Quote
                                </Link>
                            </div>
                        </div>

                        {/* Rate Calculator - Right Side */}
                        <div className="mt-12 lg:mt-0 lg:col-span-6">
                            <RateCalculator />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Feature Icons Section */}
            <div className="py-16 bg-white dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        <FeatureCard icon={faMapMarkerAlt} title="Real-Time Tracking" description="Monitor your shipment location 24/7 with our advanced global tracking system." />
                        <FeatureCard icon={faLock} title="Secure Payments" description="All transactions are secured with industry-leading encryption and payment gateways." />
                        <FeatureCard icon={faGlobe} title="Worldwide Coverage" description="From local deliveries to global freight, we cover every major port and route." />
                    </div>
                </div>
            </div>

            {/* 3. CTA for Services Page */}
            <div className="py-20 text-center bg-gray-50 dark:bg-gray-900">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 sm:text-4xl">
                    Need a Custom Logistics Plan?
                </h2>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                    Explore our specialized services tailored for businesses of all sizes.
                </p>
                <Link to="/services" className="mt-8 inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-600! bg-blue-100! dark:bg-blue-900! dark:text-white! hover:bg-blue-200! dark:hover:bg-blue-800! transition">
                    View All Services &rarr;
                </Link>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="text-center p-6 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <FontAwesomeIcon icon={icon} className="text-4xl text-blue-600 dark:text-blue-400 mb-4" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
    </div>
);

export default HomePage;