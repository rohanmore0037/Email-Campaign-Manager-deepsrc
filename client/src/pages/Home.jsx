import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Users, LineChart, Zap, Send, Layout, Shield, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated()) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleGetStarted = () => {
        if (isAuthenticated()) {
            navigate('/dashboard');
        } else {
            navigate('/register');
        }
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                <div className="container mx-auto px-4 py-20">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Powerful Email Marketing Made Simple
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-emerald-50">
                            Create, send, and track email campaigns that engage your audience and drive results.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link
                                to="/register"
                                className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
                            >
                                Get Started Free
                            </Link>
                            <Link
                                to="/login"
                                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                        Everything You Need for Successful Email Campaigns
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                                <Layout className="w-6 h-6 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Beautiful Templates</h3>
                            <p className="text-gray-600">
                                Create stunning email templates with our easy-to-use editor. No coding required.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                                <Users className="w-6 h-6 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">List Management</h3>
                            <p className="text-gray-600">
                                Easily manage your subscriber lists with CSV imports and automatic updates.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                                <LineChart className="w-6 h-6 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Analytics</h3>
                            <p className="text-gray-600">
                                Track opens, clicks, and engagement with detailed campaign analytics.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                                <Zap className="w-6 h-6 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Automation</h3>
                            <p className="text-gray-600">
                                Set up automated campaigns and drip sequences with ease.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                        How It Works
                    </h2>
                    <div className="max-w-4xl mx-auto">
                        <div className="space-y-12">
                            <div className="flex items-center gap-8">
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-8 h-8 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">1. Create Your Template</h3>
                                    <p className="text-gray-600">
                                        Design your email template using our intuitive editor or import your own HTML. 
                                        Add images, buttons, and customize to match your brand.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Database className="w-8 h-8 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">2. Import Subscribers</h3>
                                    <p className="text-gray-600">
                                        Upload your subscriber list via CSV or connect your existing database. 
                                        Manage lists and segments with ease.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Send className="w-8 h-8 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">3. Launch Campaign</h3>
                                    <p className="text-gray-600">
                                        Schedule your campaign, select your audience, and hit send. 
                                        Monitor results in real-time through our dashboard.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Security Section */}
            <div className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Shield className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                            Enterprise-Grade Security
                        </h2>
                        <p className="text-gray-600 text-lg mb-8">
                            Your data is protected with industry-leading security measures. 
                            We ensure compliance with email regulations and protect your subscribers' information.
                        </p>
                        <Link
                            to="/register"
                            className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                        >
                            Start Sending Today
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer CTA */}
            <div className="bg-gradient-to-br from-teal-600 to-emerald-600 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                    <p className="text-lg text-emerald-50 mb-8">
                        Join thousands of businesses using our platform to grow their email marketing.
                    </p>
                    <Link
                        to="/register"
                        className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors inline-block"
                    >
                        Create Free Account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
