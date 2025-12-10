// client/src/components/AdminSidebar.jsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTachometerAlt, faTruck, faUserCog, faCog, faDollarSign, 
    faEnvelopeCircleCheck, faTimes // Added faTimes for the close button
} from '@fortawesome/free-solid-svg-icons'; 

// Component now accepts isOpen and onClose props from the parent layout
const AdminSidebar = ({ isOpen, onClose }) => { 
    const location = useLocation();

    // Define main navigation items (unchanged)
    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: faTachometerAlt },
        { name: 'Shipments', path: '/admin/shipments', icon: faTruck },
        { name: 'Quote Requests', path: '/admin/quotes', icon: faEnvelopeCircleCheck },
        { name: 'Services', path: '/admin/services', icon: faCog },
        { name: 'Rates & Tariffs', path: '/admin/rates', icon: faDollarSign },
        { name: 'User Management', path: '/admin/users', icon: faUserCog },
    ];

    return (
        <>
            {/* 1. Sidebar Container: Fixed positioning and mobile toggle logic */}
            <div 
                className={`
                    fixed top-0 left-0 h-full w-64 bg-gray-100! dark:bg-gray-900! text-white! p-4 shadow-2xl z-50 
                    transform transition-transform duration-300 ease-in-out
                    md:translate-x-0 md:block 
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {/* Close Button */}
                <div className="md:hidden flex justify-end mb-4">
                    <button 
                        onClick={onClose} 
                        className="text-gray-100! bg-blue-600! hover:text-white! transition"
                        aria-label="Close sidebar"
                    >
                        <FontAwesomeIcon icon={faTimes} size="lg" />
                    </button>
                </div>
                
                <h3 className="text-2xl font-extrabold mb-8 border-b border-gray-700! dark:border-gray-800! pb-7 text-blue-600 dark:text-blue-400!">
                    Courierlyn Admin
                </h3>
                
                <nav className="space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            onClick={onClose} // Close sidebar on mobile after clicking a link
                            className={`
                                flex items-center px-4 py-3 rounded-lg text-sm font-medium transition duration-200
                                ${location.pathname === item.path 
                                    ? 'bg-blue-600! dark:bg-blue-400! text-white! shadow-lg' 
                                    : 'text-blue-600! dark:text-gray-400! hover:bg-gray-700! dark:hover:bg-gray-800! hover:text-white!'
                                }
                            `}
                        >
                            <FontAwesomeIcon icon={item.icon} className="mr-3 w-5" />
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* 2. Overlay visible when sidebar is open */}
            {isOpen && (
                <div 
                    onClick={onClose} 
                    className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
                    aria-hidden="true"
                ></div>
            )}
        </>
    );
};

export default AdminSidebar;