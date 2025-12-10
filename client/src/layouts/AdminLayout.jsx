// client/src/layouts/AdminLayout.jsx

import React, { useState } from 'react'; // <-- IMPORT useState
import { Helmet } from 'react-helmet';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/actions/userActions';
import AdminSidebar from '../components/AdminSidebar'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faBars } from '@fortawesome/free-solid-svg-icons'; // <-- IMPORT faBars

const AdminLayout = ({ children, title = 'Admin Dashboard | Courierlyn' }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo } = useSelector(state => state.userLogin);

    // 1. Sidebar State Management
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    const logoutHandler = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            
            <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition duration-300">
                
                {/* 1. Sidebar (Pass state and handlers) */}
                <AdminSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
                
                {/* 2. Main Content Area */}
                {/* 🛑 Add md:ml-64 to offset the main content on desktop 🛑 */}
                <div className="flex-1 flex flex-col overflow-hidden md:ml-64 transition-all duration-300">
                    
                    {/* Admin Header Bar */}
                    <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center text-gray-900 dark:text-gray-100 sticky top-0 z-20 transition duration-300">
                        
                        <div className="flex items-center">
                            {/* 🛑 Mobile Toggle Button (Visible only below md breakpoint) 🛑 */}
                            <button 
                                onClick={toggleSidebar} 
                                className="md:hidden text-gray-100! dark:text-gray-100! bg-blue-600! p-2 mr-3"
                                aria-label="Toggle sidebar"
                            >
                                <FontAwesomeIcon icon={faBars} size="lg" />
                            </button>
                            
                            <h2 className="text-xl font-semibold">
                                {title.split('|')[0].trim()}
                            </h2>
                        </div>

                        <button 
                            onClick={logoutHandler} 
                            className="text-sm! px-2! py-2! text-white bg-red-600! rounded-md hover:bg-red-700! transition"
                        >
                            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2"/> Logout ({userInfo?.name.split(' ')[0]})
                        </button>
                    </header>
                    
                    {/* Main Content Body */}
                    <main className="flex-1 overflow-y-auto p-4 md:p-6">
                        {/* Remove redundant overflow-x-hidden here, the parent handles it */}
                        <div> 
                            {children}
                        </div>
                    </main>
                </div>
            </div>
            
            {/* Optional: Add body class to prevent background scroll when sidebar is open on mobile */}
            {isSidebarOpen && (
                 <style dangerouslySetInnerHTML={{__html: `body { overflow: hidden; }`}} />
            )}
        </>
    );
};

export default AdminLayout;