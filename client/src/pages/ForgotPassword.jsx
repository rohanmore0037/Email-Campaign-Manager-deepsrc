import React from 'react';
import { Mail, Lock } from 'lucide-react';
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
});

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
 const {BASE_URL}=useAuth()
const API_URL = `${BASE_URL}/auth`   
    const { 
        register, 
        handleSubmit, 
        formState: { errors, isSubmitting },
        setError,
        reset 
    } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = async (data) => {
        try {
            const response = await axios.post(`${API_URL}/forgot-password`, {
                email: data.email
            });

            // Reset form
            reset();
            
            // Show success message
            setError('success', {
                type: 'manual',
                message: 'Password reset instructions have been sent to your email.'
            });

            // Optionally redirect after a delay
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to process request. Please try again.';
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
                        <h2 className="text-3xl font-bold text-gray-800">Forgot Password</h2>
                        <p className="mt-2 text-gray-600">Enter your email to reset password</p>
                    </div>

                    {errors.root && (
                        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
                            {errors.root.message}
                        </div>
                    )}

                    {errors.success && (
                        <div className="mb-4 rounded-lg bg-green-50 p-4 text-sm text-green-600">
                            {errors.success.message}
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
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="group relative flex w-full justify-center rounded-lg bg-indigo-600 py-3 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-300 disabled:opacity-70"
                            >
                                {isSubmitting ? 'Sending...' : 'Reset Password'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="bg-gray-50 px-8 pb-6 text-center">
                    <p className="text-sm text-gray-600">
                        Remember your password?
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

export default ForgotPasswordPage;
