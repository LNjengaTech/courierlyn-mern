// client/src/components/ProtectedRoute.jsx
// acts as a wrapper around the routes that require a user to be logged in, and optionally, to have administrative privileges.


import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import UserLayout from '../layouts/UserLayout';

/**
 * A wrapper component that protects routes based on authentication and role.
 * @param {object} children - The component to render if authorized.
 * @param {boolean} isAdmin - If true, requires the user to be an admin.
 */
const ProtectedRoute = ({ children, isAdmin = false }) => {
    // Get user info from Redux store
    const userLogin = useSelector(state => state.userLogin);
    const { userInfo, loading } = userLogin;

    // Wait for the Redux state to initialize or check local storage
    if (loading) {
        // You can return a sophisticated spinner here, but for now:
        return <div className="text-center py-10 text-xl text-blue-600">Loading user session...</div>; 
    }

    // 1. Check Authentication Status
    if (!userInfo) {
        // Not logged in, redirect to login page
        return <Navigate to="/login" replace />;
    }

    // 2. Check Authorization Role (if isAdmin flag is required)
    if (isAdmin && !userInfo.isAdmin) {
        // Logged in, but is not an Admin, redirect to customer dashboard or home
        return <Navigate to="/account/dashboard" replace />; 
    }

    // User is authenticated and authorized, render the requested content wrapped in the UserLayout
    // Note: Admin pages should usually use AdminLayout, but we'll adapt the structure below.
    return children;
};

export default ProtectedRoute;