// client/src/layouts/UserLayout.jsx
// main site wrapper for customers.

import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet'; // For SEO

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// The children prop will render the specific page content (HomePage, ServicesPage, etc.)
const UserLayout = ({ children, title = 'Courierlyn - Your Global Logistics Partner' }) => {
  return (
    <>
        <Helmet>
            <title>{title}</title>
            {/* Add common meta tags here for better SEO */}
        </Helmet>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition duration-300 overflow-x-hidden">
            <Header />
            
            <main style={{ minHeight: '88vh' }}> 
                {/* The main content area where pages are rendered */}
                {children}
            </main>
            
            <Footer />
            <ToastContainer 
            position="top-right" 
            autoClose={10000} // autoClose duration in ms
            hideProgressBar={false} // Show the progress bar
            theme="colored" // Adds built-in colors (green for success, red for error, etc.)
        />
        </div>
    </>
  );
};

export default UserLayout;