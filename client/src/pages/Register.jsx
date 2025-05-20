import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';


const schema = yup.object().shape({
    username: yup
        .string()
        .min(3, 'Username must be at least 3 characters')
        .required('Username is required'),
    email: yup
        .string()
        .email('Please enter a valid email')
        .required('Email is required'),
    password: yup
        .string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Please confirm your password'),
});

const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    
const {BASE_URL}=useAuth()
const API_URL = `${BASE_URL}/auth/register`

    const { isAuthenticated } = useAuth();
    if (isAuthenticated()) {
        navigate('/dashboard');
    }
    
    const { 
        register, 
        handleSubmit, 
        formState: { errors, isSubmitting },
        setError 
    } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = async (data) => {
        try {
            // Register the user
            const response = await axios.post(API_URL, {
                username: data.username,
                email: data.email,
                password: data.password
            });

            // If registration is successful, login automatically
            await login({
                email: data.email,
                password: data.password
            });
            navigate('/dashboard');
        } catch (error) {
            if (error.response) {
                // Backend validation errors
                if (error.response.data.errors) {
                    Object.keys(error.response.data.errors).forEach(key => {
                        setError(key, {
                            type: 'manual',
                            message: error.response.data.errors[key]
                        });
                    });
                } else {
                    // General error message
                    setError('root', {
                        type: 'manual',
                        message: error.response.data.message || 'Registration failed'
                    });
                }
            } else {
                setError('root', {
                    type: 'manual',
                    message: 'Unable to connect to server'
                });
            }
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="w-full max-w-md overflow-hidden rounded-2xl shadow-xl">
                <div className="bg-white px-8 pt-8 pb-10">
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white">
                            <User size={24} />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
                        <p className="mt-2 text-gray-600">Join us today</p>
                    </div>

                    {errors.root && (
                        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
                            {errors.root.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <div className="relative mt-1">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <User size={18} className="text-gray-400" />
                                </div>
                                <input
                                    id="username"
                                    type="text"
                                    autoComplete="username"
                                    className={`block w-full rounded-lg border ${
                                        errors.username ? 'border-red-500' : 'border-gray-300'
                                    } py-3 pl-10 pr-3 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50`}
                                    placeholder="johndoe"
                                    {...register('username')}
                                />
                            </div>
                            {errors.username && (
                                <p className="mt-1 text-xs text-red-600">{errors.username.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <div className="relative mt-1">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Mail size={18} className="text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    className={`block w-full rounded-lg border ${
                                        errors.email ? 'border-red-500' : 'border-gray-300'
                                    } py-3 pl-10 pr-3 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50`}
                                    placeholder="johndoe@example.com"
                                    {...register('email')}
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="relative mt-1">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Lock size={18} className="text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    className={`block w-full rounded-lg border ${
                                        errors.password ? 'border-red-500' : 'border-gray-300'
                                    } py-3 pl-10 pr-10 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50`}
                                    placeholder="••••••••"
                                    {...register('password')}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} className="text-gray-400 hover:text-gray-500" />
                                    ) : (
                                        <Eye size={18} className="text-gray-400 hover:text-gray-500" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <div className="relative mt-1">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Lock size={18} className="text-gray-400" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    className={`block w-full rounded-lg border ${
                                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                    } py-3 pl-10 pr-10 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50`}
                                    placeholder="••••••••"
                                    {...register('confirmPassword')}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={18} className="text-gray-400 hover:text-gray-500" />
                                    ) : (
                                        <Eye size={18} className="text-gray-400 hover:text-gray-500" />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="group relative flex w-full justify-center rounded-lg bg-indigo-600 py-3 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-300 disabled:opacity-70"
                            >
                                {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="bg-gray-50 px-8 pb-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?
                        <Link 
                            to="/login" 
                            className="ml-1 font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;