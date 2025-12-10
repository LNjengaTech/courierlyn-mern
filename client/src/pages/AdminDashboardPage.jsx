// client/src/pages/AdminDashboardPage.jsx - Tailwind Styled

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { getDashboardStats } from '../redux/actions/adminActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const AdminDashboardPage = () => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.userLogin);

    // Fetch the new stats state
    const dashboardStats = useSelector(state => state.dashboardStats);
    const { loading, stats, error } = dashboardStats;

    useEffect(() => {
        dispatch(getDashboardStats());
    }, [dispatch]);

    // Helper function to format numbers (optional)
    const formatCount = (count) => count ? count.toLocaleString() : '0';

    if (loading) {
        return (
            <div className="text-center py-20">
                <FontAwesomeIcon icon={faSpinner} className='animate-spin text-4xl text-blue-600' />
                <p className='mt-3 text-gray-700 dark:text-gray-300'>Loading dashboard data...</p>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="bg-red-100 dark:bg-red-900 p-4 rounded text-red-700 dark:text-red-300">
                Error loading stats: {error}
            </div>
        );
    }

    // Deconstruct the actual counts
    const totalShipments = stats?.shipmentStats?.total || 0;
    const pendingQuotes = stats?.quoteStats?.pending || 0;
    const totalUsers = stats?.userStats?.total || 0;
    const servicesAvailable = stats?.servicesAvailable || 0;
    const shipmentsAwaitingPickup = stats?.shipmentStats?.awaitingPickup || 0;
    const newUsersThisWeek = stats?.userStats?.newThisWeek || 0;

    return (
        <>
            <Helmet><title>Admin Dashboard | Courierlyn</title></Helmet>
            <h1 className="text-xl! sm:text-3xl! font-bold mb-6 text-gray-900! dark:text-gray-100!">
                Admin Overview
            </h1>
            <p className="mb-8 text-sm sm:text-lg text-gray-700 dark:text-gray-300">
                Welcome back, <span className='font-bold text-xl text-blue-500'>{userInfo?.name}!</span>  Use the sidebar to manage content, users, and shipments.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Shipments" count={formatCount(totalShipments)} icon="📦" color="green" />
                <StatCard title="New Quote Requests" count={formatCount(pendingQuotes)} icon="✍️" color="yellow" />
                <StatCard title="Total Users" count={formatCount(totalUsers)} icon="🧑‍💻" color="blue" />
                <StatCard title="Services Available" count={formatCount(servicesAvailable)} icon="⚙️" color="indigo" />
            </div>

            <div className="mt-12 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Pending Actions</h2>
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    <li className="py-3 flex justify-between items-center text-gray-700 dark:text-gray-300">
                        <span>Review <span className='text-blue-500 font-extrabold'>{pendingQuotes}</span> Pending Quotes</span>
                        <button onClick={() => window.location.href = '/admin/quotes'} className="text-sm! px-3! py-1! bg-yellow-500! text-white! rounded hover:bg-yellow-600! transition">Review</button>
                    </li>
                    <li className="py-3 flex justify-between items-center text-gray-700 dark:text-gray-300">
                        <span>New User Registration: <span className='text-blue-500 font-extrabold'>{newUsersThisWeek}</span></span>
                        <button onClick={() => window.location.href = '/admin/users'} className="text-sm! px-3! py-1! bg-blue-500! text-white! rounded hover:bg-blue-600! transition">View Users</button>
                    </li>
                    <li className="py-3 flex justify-between items-center text-gray-700 dark:text-gray-300">
                        <span>Shipments awaiting pickup: <span className='text-blue-500 font-extrabold'>{shipmentsAwaitingPickup}</span></span>
                        <button onClick={() => window.location.href = '/admin/shipments'} className="text-sm! px-3! py-1! bg-green-500! text-white! rounded hover:bg-green-600! transition">Update Status</button>
                    </li>
                </ul>
            </div>
        </>
    );
};

// Simple Stat Card
const StatCard = ({ title, count, icon, color }) => (
    <div className={`bg-white! dark:bg-gray-700! p-6 rounded-lg shadow-md border-l-4 border-${color}-500`}>
        <div className="flex items-center justify-between">
            <span className="text-2xl">{icon}</span>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        </div>
        <p className="text-4xl font-extrabold mt-2 text-gray-900 dark:text-gray-100">{count}</p>
    </div>
);

export default AdminDashboardPage;