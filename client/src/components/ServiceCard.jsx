// client/src/components/ServiceCard.jsx - Tailwind Styled

import React from 'react';
import { Link } from 'react-router-dom';

const IMAGE_BASE = import.meta.env.VITE_IMAGE_BASE_URL;

const ServiceCard = ({ service }) => {
    // Determine the image source path
    const imagePath = service.image 
        ? `${IMAGE_BASE}${service.image}` // Full URL to fetch from Express server's /uploads
        : '/images/default_service.jpg'; // Placeholder if no image is set

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden transform hover:scale-[1.02] transition duration-300">
            {/* Image Section */}
            <div className="h-72 overflow-hidden">
                <img 
                    src={imagePath} 
                    alt={service.title} 
                    className="w-full h-full object-cover" 
                    onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder.jpg' }} // Fallback error handling
                />
            </div>

            <div className="p-6">
                {/* Title and Subtitle */}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{service.title}</h3>
                <p className="text-blue-600 dark:text-blue-400 font-semibold mb-2">{service.subtitle}</p>

                {/* Details/Description */}
                <p className="text-gray-600 dark:text-gray-400 text-base mb-6 line-clamp-6">
                    {service.details}
                </p>

                {/* CTA Link */}
                <Link 
                    to={`/services/${service._id}`} 
                    className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition"
                >
                    Learn More &rarr;
                </Link>
            </div>
        </div>
    );
};

export default ServiceCard;