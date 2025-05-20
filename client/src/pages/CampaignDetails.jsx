import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, MailCheck, Clock, Calendar, Users } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';



const CampaignDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [campaign, setCampaign] = useState(null);
    const [subscribers, setSubscribers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const subscribersPerPage = 10;

    const {BASE_URL}=useAuth()
const API_URL = BASE_URL;

    const statusMap = {
        0: { label: 'Not Sent', class: 'bg-gray-100 text-gray-800' },
        1: { label: 'Sent', class: 'bg-green-100 text-green-800' }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!isAuthenticated()) return;

                const [campaignRes, subscribersRes] = await Promise.all([
                    axios.get(`${API_URL}/campaign/details/${id}`),
                    axios.get(`${API_URL}/aftercampaign/${id}`)
                ]);

                if (campaignRes.data.success) {
                    setCampaign(campaignRes.data.campaign);
                }
                if (subscribersRes.data.success) {
                    setSubscribers(subscribersRes.data.mailLogs);
                }
            } catch (error) {
                setError('Failed to fetch campaign details');
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id, isAuthenticated]);

    // Reset page when search term changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const filteredSubscribers = subscribers.filter(subscriber => {
        if (!searchTerm.trim()) return true;

        const searchLower = searchTerm.toLowerCase();
        const searchTerms = searchLower.split(' ').filter(term => term.length > 0);

        return searchTerms.every(term => (
            subscriber.reciever?.toLowerCase().includes(term) ||
            subscriber.smtpserver?.toLowerCase().includes(term)
        ));
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-tr from-purple-100 via-indigo-50 to-blue-100 p-4 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-tr from-purple-100 via-indigo-50 to-blue-100 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Campaign Details Card - Styled Section */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg mb-6">
                    {/* Header with back button */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/campaigns')}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                                aria-label="Go back to campaigns"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    {campaign?.name || 'Campaign Details'}
                                </h1>
                                <p className="text-sm text-gray-500">Campaign Overview</p>
                            </div>
                        </div>
                    </div>

                    {/* Campaign details grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Basic Campaign Details */}
                        <div className="bg-gray-50 rounded-xl p-5 shadow-sm border border-gray-100">
                            <h2 className="font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-purple-500" />
                                Campaign Details
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Campaign Name</p>
                                    <p className="text-gray-800 font-medium">{campaign?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Subject Line</p>
                                    <p className="text-gray-800 font-medium">{campaign?.subject || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Template Details */}
                        <div className="bg-gray-50 rounded-xl p-5 shadow-sm border border-gray-100">
                            <h2 className="font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                                <Search className="w-4 h-4 text-purple-500" />
                                Template Details
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Template Name</p>
                                    <p className="text-gray-800 font-medium">{campaign?.template.name || 'Custom Template'}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Content Preview</p>
                                    <p className="text-gray-700 text-sm italic">
                                        {campaign?.template.content?.substring(0, 50)}...
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* SMTP Servers */}
                        <div className="bg-gray-50 rounded-xl p-5 shadow-sm border border-gray-100">
                            <h2 className="font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                                <MailCheck className="w-4 h-4 text-purple-500" />
                                SMTP Servers
                            </h2>
                            <p className="text-sm text-gray-600 mb-3">
                                <span className="font-medium text-purple-600">{campaign?.smtp?.length || 0}</span> Server(s) configured
                            </p>
                            <div className="space-y-2">
                                {campaign?.smtp?.map((server, index) => (
                                    <div key={index} className="bg-white p-2 rounded-md border border-gray-100 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        <span className="text-sm font-medium">{server.servername}</span>
                                    </div>
                                ))}
                                {(!campaign?.smtp || campaign.smtp.length === 0) && (
                                    <p className="text-gray-500 text-sm italic">No SMTP servers configured</p>
                                )}
                            </div>
                        </div>

                        {/* Status & Timing */}
                        <div className="bg-gray-50 rounded-xl p-5 shadow-sm border border-gray-100">
                            <h2 className="font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-purple-500" />
                                Status & Timing
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Created On</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-800 font-medium">
                                            {campaign?.createdAt ? new Date(campaign.createdAt).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Scheduled For</p>
                                    {campaign?.scheduledFor ? (
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-md text-sm">
                                                {new Date(campaign.scheduledFor).toLocaleString()}
                                            </span>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-sm italic">Not scheduled</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subscribers Table Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-purple-500" />
                            <h2 className="text-xl font-semibold text-gray-800">Subscriber Status</h2>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by email or SMTP server..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700">
                            {error}
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        #
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        SMTP Server
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Time
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredSubscribers
                                    .slice((currentPage - 1) * subscribersPerPage, currentPage * subscribersPerPage)
                                    .map((subscriber, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">
                                                    {(currentPage - 1) * subscribersPerPage + index + 1}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{subscriber.reciever}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{subscriber.smtpserver}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusMap[subscriber.status].class}`}>
                                                    {statusMap[subscriber.status].label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">
                                                    {new Date(subscriber.timing).toLocaleString()}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredSubscribers.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No subscribers found
                        </div>
                    )}

                    {filteredSubscribers.length > 0 && (
                        <div className="flex items-center justify-between px-4 py-3 sm:px-6 mt-4">
                            <div className="flex items-center">
                                <p className="text-sm text-gray-700">
                                    Showing{' '}
                                    <span className="font-medium">
                                        {Math.min((currentPage - 1) * subscribersPerPage + 1, filteredSubscribers.length)}
                                    </span>
                                    {' '}-{' '}
                                    <span className="font-medium">
                                        {Math.min(currentPage * subscribersPerPage, filteredSubscribers.length)}
                                    </span>
                                    {' '}of{' '}
                                    <span className="font-medium">{filteredSubscribers.length}</span>
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                {Array.from({ length: Math.ceil(filteredSubscribers.length / subscribersPerPage) }).map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentPage(index + 1)}
                                        className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === index + 1
                                            ? 'bg-purple-600 text-white'
                                            : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CampaignDetails;