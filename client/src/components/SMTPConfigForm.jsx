import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Mail, Lock, Server, Globe, Cpu, AlertCircle, CheckCircle2, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';



const schema = yup.object().shape({
    servername: yup.string().required('Server name is required'),
    host: yup.string().required('Host is required'),
    port: yup.number()
        .typeError('Port must be a number')
        .required('Port is required')
        .min(1, 'Port must be greater than 0')
        .max(65535, 'Port must be less than 65536'),
    username: yup.string()
        .email('Must be a valid email')
        .required('Username is required'),
    password: yup.string().required('Password is required'),
    protocol: yup.string()
        .oneOf(['ssl', 'tls'], 'Protocol must be either SSL or TLS')
        .required('Protocol is required')
});

const SMTPConfigForm = ({ formId, serverData, onServerSaved }) => {
    const { isAuthenticated } = useAuth();
    const [isEditMode, setIsEditMode] = useState(false);

    const { BASE_URL } = useAuth();
    const API_URL = BASE_URL;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
        clearErrors,
        reset
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: serverData || {}
    });

    useEffect(() => {
        if (serverData) {
            reset(serverData);
        }
    }, [serverData, reset]);

    const onSubmit = async (data) => {
        try {
            clearErrors('root');

            if (!isAuthenticated()) {
                setError('root', {
                    type: 'manual',
                    message: 'You must be logged in to save SMTP configuration'
                });
                return;
            }

            const method = serverData ? 'put' : 'post';
            const url = `${API_URL}/smtp${serverData ? `/${formId}` : ''}`;

            const response = await axios[method](url, data);
            if (response.data.success) {
                setIsEditMode(false);
                setError('success', {
                    type: 'success',
                    message: `SMTP server "${data.servername}" ${serverData ? 'updated' : 'configured'} successfully!`
                });

                if (onServerSaved) {
                    onServerSaved(response.data.server);
                }

                setTimeout(() => {
                    clearErrors('success');
                }, 3000);
            }
        } catch (error) {
            console.error('SMTP Config Error:', error);
            setError('root', {
                type: 'manual',
                message: error.response?.data?.message || 'Failed to save SMTP configuration'
            });
        }
    };

    const handleCancel = () => {
        setIsEditMode(false);
        reset(serverData);
    };

    const isFormDisabled = serverData && !isEditMode;

    return (
        <div className="w-full">
            <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">
                            {serverData ? serverData.servername : 'New SMTP Server'}
                        </h2>
                        <div className="bg-white/20 p-1.5 rounded-lg">
                            <Mail className="text-white w-5 h-5" />
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {errors.root && (
                        <div className="mb-4 p-3 rounded-lg bg-red-100 border-l-4 border-red-500 text-red-700 text-sm">
                            <div className="flex">
                                <AlertCircle className="w-4 h-4 mr-2" />
                                <p>{errors.root.message}</p>
                            </div>
                        </div>
                    )}

                    {errors.success && (
                        <div className="mb-4 p-3 rounded-lg bg-green-100 border-l-4 border-green-500 text-green-700 text-sm">
                            <div className="flex">
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                <p>{errors.success.message}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="servername" className="block text-xs font-medium text-gray-600 mb-1">
                                    Server Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                        <Server className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="e.g., Gmail SMTP"
                                        {...register('servername')}
                                        className={`w-full px-3 py-2 pl-9 rounded-lg text-sm bg-gray-50 border ${errors.servername ? 'border-red-400' : 'border-gray-200'
                                            } focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors`}
                                        disabled={isFormDisabled}
                                    />
                                    {errors.servername && (
                                        <p className="mt-1 text-xs text-red-500">{errors.servername.message}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="host" className="block text-xs font-medium text-gray-600 mb-1">
                                    Host
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                        <Globe className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="e.g., smtp.gmail.com"
                                        {...register('host')}
                                        className={`w-full px-3 py-2 pl-9 rounded-lg text-sm bg-gray-50 border ${errors.host ? 'border-red-400' : 'border-gray-200'
                                            } focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors`}
                                        disabled={isFormDisabled}
                                    />
                                    {errors.host && (
                                        <p className="mt-1 text-xs text-red-500">{errors.host.message}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="port" className="block text-xs font-medium text-gray-600 mb-1">
                                    Port
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                        <Cpu className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="number"
                                        placeholder="e.g., 587"
                                        {...register('port')}
                                        className={`w-full px-3 py-2 pl-9 rounded-lg text-sm bg-gray-50 border ${errors.port ? 'border-red-400' : 'border-gray-200'
                                            } focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors`}
                                        disabled={isFormDisabled}
                                    />
                                    {errors.port && (
                                        <p className="mt-1 text-xs text-red-500">{errors.port.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="username" className="block text-xs font-medium text-gray-600 mb-1">
                                    Username (Email)
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        {...register('username')}
                                        className={`w-full px-3 py-2 pl-9 rounded-lg text-sm bg-gray-50 border ${errors.username ? 'border-red-400' : 'border-gray-200'
                                            } focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors`}
                                        disabled={isFormDisabled}
                                    />
                                    {errors.username && (
                                        <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-xs font-medium text-gray-600 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="App Password"
                                        {...register('password')}
                                        className={`w-full px-3 py-2 pl-9 rounded-lg text-sm bg-gray-50 border ${errors.password ? 'border-red-400' : 'border-gray-200'
                                            } focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors`}
                                        disabled={isFormDisabled}
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="protocol" className="block text-xs font-medium text-gray-600 mb-1">
                                    Protocol
                                </label>
                                <div className="relative">
                                    <select
                                        {...register('protocol')}
                                        className={`w-full px-3 py-2 rounded-lg text-sm bg-gray-50 border ${errors.protocol ? 'border-red-400' : 'border-gray-200'
                                            } focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors appearance-none`}
                                        disabled={isFormDisabled}
                                    >
                                        <option value="">Select Protocol</option>
                                        <option value="tls">TLS</option>
                                        <option value="ssl">SSL</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                    {errors.protocol && (
                                        <p className="mt-1 text-xs text-red-500">{errors.protocol.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end space-x-3">
                            {serverData && !isEditMode && (
                                <button
                                    type="button"
                                    onClick={() => setIsEditMode(true)}
                                    className="px-6 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium tracking-wide shadow-lg hover:bg-gray-200 transform hover:-translate-y-0.5 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                >
                                    Edit Server
                                </button>
                            )}
                            {(!serverData || isEditMode) && (
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-2 rounded-lg text-sm font-medium tracking-wide shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-70"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Saving...
                                        </span>
                                    ) : (
                                        serverData ? 'Update Server' : 'Save Server'
                                    )}
                                </button>
                            )}
                            {isEditMode && (
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-6 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium tracking-wide shadow-lg hover:bg-gray-200 transform hover:-translate-y-0.5 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>


        </div>
    );
};

export default SMTPConfigForm;