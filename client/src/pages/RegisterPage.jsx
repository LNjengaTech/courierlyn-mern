import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../redux/actions/userActions';
import { Helmet } from 'react-helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faSpinner } from '@fortawesome/free-solid-svg-icons';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null); //For the custom messages like password mismatch

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userRegister = useSelector(state => state.userRegister);
    const { loading, error, userInfo } = userRegister;

    useEffect(() => {
        if (userInfo) {
            navigate('/account/dashboard'); 
        }
    }, [navigate, userInfo]);

    const submitHandler = (e) => {
        e.preventDefault();
        setMessage(null);

        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
        } else {
            //dispatch the register action
            dispatch(register(name, email, password));
        }
    };

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-x-hidden'>
            <Helmet><title>Courierlyn | Register</title></Helmet>
            
            <div className='sm:mx-auto sm:w-full sm:max-w-md'>
                <FontAwesomeIcon icon={faUserPlus} className='mx-auto h-12! w-auto! text-blue-600! dark:text-blue-400!' />
                <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100'>
                    Create a Courierlyn Account
                </h2>
            </div>

            <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
                <div className='bg-white dark:bg-gray-800 py-8 px-4 shadow-xl rounded-lg sm:px-10'>
                    
                    {/*feedback messages */}
                    {message && (
                        <div className='bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4 text-sm' role='alert'>
                            <span className='block sm:inline'>{message}</span>
                        </div>
                    )}
                    {error && (
                        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm' role='alert'>
                            <span className='block sm:inline'>{error}</span>
                        </div>
                    )}

                    <form className='space-y-6' onSubmit={submitHandler}>
                        {/*name*/}
                        <div>
                            <label htmlFor='name' className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Full Name</label>
                            <div className='mt-1'>
                                <input id='name' name='name' type='text' required value={name} onChange={(e) => setName(e.target.value)}
                                    className='appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                                />
                            </div>
                        </div>

                        {/*email*/}
                        <div>
                            <label htmlFor='email' className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Email Address</label>
                            <div className='mt-1'>
                                <input id='email' name='email' type='email' autoComplete='email' required value={email} onChange={(e) => setEmail(e.target.value)}
                                    className='appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                                />
                            </div>
                        </div>

                        {/*password*/}
                        <div>
                            <label htmlFor='password' className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Password</label>
                            <div className='mt-1'>
                                <input id='password' name='password' type='password' required value={password} onChange={(e) => setPassword(e.target.value)}
                                    className='appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                                />
                            </div>
                        </div>
                        
                        {/*password confirmation*/}
                        <div>
                            <label htmlFor='confirm-password' className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Confirm Password</label>
                            <div className='mt-1'>
                                <input id='confirm-password' name='confirm-password' type='password' required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                    className='appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                                />
                            </div>
                        </div>


                        <div>
                            <button
                                type='submit'
                                disabled={loading}
                                className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600! hover:bg-blue-700!  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500! disabled:opacity-50 transition duration-150'
                            >
                                {loading ? <FontAwesomeIcon icon={faSpinner} className='animate-spin mr-2' /> : 'Register'}
                            </button>
                        </div>
                    </form>
                    
                    <div className='mt-6 text-center'>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>
                            Already have an account? {' '}
                            <Link to='/login' className='font-medium text-blue-600! hover:text-blue-500!'>
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;