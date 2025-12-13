import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../redux/actions/userActions';
import { Helmet } from 'react-helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faSignInAlt } from '@fortawesome/free-solid-svg-icons';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userLogin = useSelector(state => state.userLogin);
    const { loading, error, userInfo } = userLogin;

    useEffect(() => {
        if (userInfo) {
            if (userInfo.isAdmin) {
                navigate('/admin/dashboard'); 
            } else {
                navigate('/account/dashboard'); 
            }
        }
    }, [navigate, userInfo]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login(email, password));
    };

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-x-hidden transition duration-300'>
            <Helmet><title>Courierlyn | Login</title></Helmet>
            
            <div className='sm:mx-auto sm:w-full sm:max-w-md'>
                <FontAwesomeIcon icon={faSignInAlt} className='mx-auto h-12! w-auto! text-blue-600! dark:text-blue-400!' />
                <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100'>
                    Sign in to your Courierlyn Account
                </h2>
                <p className='mt-2 text-center text-sm text-gray-600 dark:text-gray-400'>
                    Access your shipments, invoices, and custom rates.
                </p>
            </div>

            <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
                <div className='bg-white dark:bg-gray-800 py-8 px-4 shadow-xl rounded-lg sm:px-10 transition duration-300'>
                    
                    {/*error and loading Feedback */}
                    {error && (
                        <div className='bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded relative mb-4 text-sm' role='alert'>
                            <span className='block sm:inline'>{error}</span>
                        </div>
                    )}
                    {loading && (
                        <div className='flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4'>
                             <FontAwesomeIcon icon={faSpinner} className='animate-spin mr-3' /> Processing...
                        </div>
                    )}

                    <form className='space-y-6' onSubmit={submitHandler}>
                        <div>
                            <label htmlFor='email' className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                                Email Address
                            </label>
                            <div className='mt-1'>
                                <input
                                    id='email'
                                    name='email'
                                    type='email'
                                    autoComplete='email'
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className='appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor='password' className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                                Password
                            </label>
                            <div className='mt-1'>
                                <input
                                    id='password'
                                    name='password'
                                    type='password'
                                    autoComplete='current-password'
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className='appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type='submit'
                                disabled={loading}
                                className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600! hover:bg-blue-700! focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition duration-150'
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                            </button>
                        </div>
                    </form>
                    
                    <div className='mt-6 text-center'>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>
                            New Customer? {' '}
                            <Link to='/register' className='font-medium text-blue-600 dark:text-blue-400! hover:text-blue-500 dark:hover:text-blue-300!'>
                                Register Now
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;