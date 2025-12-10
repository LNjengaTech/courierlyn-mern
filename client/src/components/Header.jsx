// client/src/components/Header.jsx - Dark Mode Aware

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCaretDown, faSignOutAlt, faTimes, faBars } from '@fortawesome/free-solid-svg-icons';
import { logout } from '../redux/actions/userActions';
import logolyn from '../assets/logolyn-removebg-preview.png'

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;


    const logoutHandler = () => {
        dispatch(logout());
        setDropdownOpen(false);
        navigate('/login');
    };
    
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: 'Contact', path: '/contact' },
        { name: 'Tracking', path: '/tracking' },
    ];

    return (
        <header className='bg-white! dark:bg-gray-900! shadow-md! sticky top-0! z-50 transition duration-300'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between items-center h-16'>
                    {/* Logo - Left Side */}
                    <Link to='/' className='text-2xl font-bold text-blue-700! dark:text-blue-400! tracking-wide'>
                        <img src={logolyn} alt="logo" className='w-auto h-14'/>
                    </Link>

                    {/* Desktop Navigation - Center */}
                    <nav className='hidden md:flex space-x-8'>
                        {navLinks.map(link => (
                            <Link key={link.name} to={link.path} 
                                className='text-gray-600! dark:text-gray-300! hover:text-blue-700! dark:hover:text-blue-400! font-medium transition duration-150'
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* User Icon/Dropdown & Mobile Menu Button - Right Side */}
                    <div className='flex items-center space-x-4'>
                        {/* User Menu */}
                        {userInfo ? (
                            <div className='relative'>
                                <button 
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className='flex items-center bg-white! dark:bg-transparent! text-blue-600! dark:text-blue-400! hover:text-blue-400! dark:hover:text-blue-400! focus:outline-none transition duration-150'
                                >
                                    <FontAwesomeIcon icon={faUser} className='mr-2' /> 
                                    <span className='hidden sm:inline'>{userInfo.name.split(' ')[0]}</span>
                                    <FontAwesomeIcon icon={faCaretDown} className='ml-1 text-sm' />
                                </button>

                                {/* Dropdown Content */}
                                {dropdownOpen && (
                                    <div className='absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 z-50'>
                                        {userInfo.isAdmin ? (
                                            <Link to='/admin/dashboard' onClick={() => setDropdownOpen(false)} 
                                                className='block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            >
                                                Admin Dashboard
                                            </Link>
                                        ) : (
                                            <Link to='/account/dashboard' onClick={() => setDropdownOpen(false)} 
                                                className='block px-4 py-2 text-sm text-gray-00! dark:text-gray-200! hover:bg-gray-100! dark:hover:bg-gray-700!'
                                            >
                                                Account Dashboard
                                            </Link>
                                        )}
                                        <div 
                                            onClick={logoutHandler} 
                                            className='cursor-pointer flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-900 hover:text-red-600 border-t border-gray-100 dark:border-gray-700'
                                        >
                                            <FontAwesomeIcon icon={faSignOutAlt} className='mr-2'/> Logout
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to='/login' className='hidden sm:flex items-center px-4 py-2 text-sm font-medium text-white! bg-blue-600 rounded-md hover:bg-blue-700 transition duration-150'>
                                <FontAwesomeIcon icon={faUser} className='mr-2' /> Login
                            </Link>
                        )}
                        
                        {/* Mobile Menu Button */}
                        <button 
                            className='md:hidden p-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100'
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} className='h-6 w-6' />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className='md:hidden border-t border-gray-100 dark:border-gray-700'>
                    <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
                        {navLinks.map(link => (
                            <Link 
                                key={link.name} 
                                to={link.path} 
                                onClick={() => setMobileMenuOpen(false)}
                                className='block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-700 dark:hover:text-blue-400'
                            >
                                {link.name}
                            </Link>
                        ))}
                        {!userInfo && (
                            <Link 
                                to='/login' 
                                onClick={() => setMobileMenuOpen(false)}
                                className='block px-3 py-2 rounded-md text-base font-medium text-white! bg-blue-600 text-center hover:bg-blue-700 mt-2'
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;