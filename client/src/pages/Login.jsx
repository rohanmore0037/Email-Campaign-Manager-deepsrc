import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';



const schema = yup.object().shape({
    email: yup
        .string()
        .email('Please enter a valid email')
        .required('Email is required'),
    password: yup
        .string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
});

const LoginPage = () => {
const {BASE_URL}=useAuth()
const API_URL = `${BASE_URL}/auth`;
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    
    const {isAuthenticated} = useAuth();
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
            await login(data);
            navigate('/dashboard');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to sign in. Please try again.';
            setError('root', {
                type: 'manual',
                message: errorMessage
            });
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="w-full max-w-md overflow-hidden rounded-2xl shadow-xl">
                <div className="bg-white px-8 pt-8 pb-10">
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white">
                            <Lock size={24} />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
                        <p className="mt-2 text-gray-600">Please sign in to your account</p>
                    </div>

                    {errors.root && (
                        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
                            {errors.root.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                                    placeholder="yourname@example.com"
                                    {...register('email')}
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <Link 
                                    to="/forgot-password" 
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative mt-1">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Lock size={18} className="text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
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
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="group relative flex w-full justify-center rounded-lg bg-indigo-600 py-3 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-300 disabled:opacity-70"
                            >
                                {isSubmitting ? 'Signing in...' : 'Sign In'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="bg-gray-50 px-8 pb-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?
                        <Link 
                            to="/register" 
                            className="ml-1 font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;