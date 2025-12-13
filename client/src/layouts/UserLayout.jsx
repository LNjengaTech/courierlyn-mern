// my main site wrapper for customers.

import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet'; // For SEO

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//children prop to render the specific page content like HomePage, ServicesPage...)
const UserLayout = ({ children,
  title = 'Courierlyn - Your Global Logistics Partner', 
  description = 'Courierlyn provides fast, reliable, and secure global logistics, freight forwarding, and domestic parcel delivery services. Get an instant quote today!',
  keywords = 'logistics, freight, shipping, courier, parcel delivery, global forwarding, supply chain'
}) => {
    // defining a canonical URL default if your site runs on a single domain:
    const canonicalUrl = window.location.href;
  return (
    <>

        <Helmet>
            <title>{title}</title>
            {/*Core SEO Tags */}
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <link rel="canonical" href={canonicalUrl} />
            
            {/*Open Graph tags (social media sharing) */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={canonicalUrl} />
            {/*I "SHOULD" remember to change this with a real image URL when ready */}
            <meta property="og:image" content="/images/courierlyn_social_share.jpg" /> 

            {/*Twitter Card Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            {/*I "SHOULD" remember to change this with a real company X handle */}
            <meta name="twitter:site" content="@CourierlynGlobal" />
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
            autoClose={5000}
            hideProgressBar={false}
            theme="colored" //built-in colors
        />
        </div>
    </>
  );
};

export default UserLayout;