import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MailCheck, AlertCircle, CheckCircle2, Trash2, Play, Pause,
    Calendar, StopCircle, Edit, Clock, Eye
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';



const CampaignsList = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

const {BASE_URL}=useAuth()
const API_URL = BASE_URL;

    const arr = {
        0: 'Created',
        1: 'Running',
        2: 'Completed',
        3: 'Paused',
        4: 'Terminated',
        5: 'Scheduled',
    }

    const fetchCampaigns = async () => {
        try {
            if (!isAuthenticated()) return;
            const response = await axios.get(`${API_URL}/campaign/`);
            setCampaigns(response.data.campaigns || []);
        } catch (error) {
            setError('Failed to fetch campaigns');
            console.error('Error fetching campaigns:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);
// run pause 
    const handleAction = async (campaignId, action) => {
        try {
            const response = await axios.get(`${API_URL}/campaign/${action}/${campaignId}`);

            if (response.data.success) {
                setSuccess(`Campaign ${action}ed successfully!`);
                fetchCampaigns(); // Refresh the list
            }
        } catch (error) {
            setError(`Failed to ${action}ed campaign`);
        }

        setTimeout(() => {
            setSuccess(null);
            setError(null);
        }, 3000);
    };

    const handleDelete = async (campaignId) => {
        if (!window.confirm('Are you sure you want to delete this campaign?')) return;

        try {
            await axios.delete(`${API_URL}/campaign/${campaignId}`);
            setSuccess('Campaign deleted successfully!');
            fetchCampaigns();
        } catch (error) {
            setError('Failed to delete campaign');
        }

        setTimeout(() => {
            setSuccess(null);
            setError(null);
        }, 3000);
    };

    const handleSchedule = async (campaignId) => {
        // This would open a modal or navigate to scheduling page
        // For now, we'll just use a basic prompt
        const scheduleTime = window.prompt('Enter schedule time (YYYY-MM-DD HH:mm)');
        if (!scheduleTime) return;

        try {
            const response = await axios.post(`${API_URL}/campaign/schedule/${campaignId}`, {
                scheduleTime: new Date(scheduleTime).toISOString()
            });

            if (response.data.success) {
                setSuccess('Campaign scheduled successfully!');
                fetchCampaigns();
            }
        } catch (error) {
            setError('Failed to schedule campaign');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Campaigns</h1>
                    <button
                        onClick={() => navigate('/campaigns/create')}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                        Create New Campaign
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-100 border-l-4 border-red-500 text-red-700">
                        <div className="flex items-center">
                            <AlertCircle className="w-5 h-5 mr-2" />
                            <p>{error}</p>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 rounded-lg bg-green-100 border-l-4 border-green-500 text-green-700">
                        <div className="flex items-center">
                            <CheckCircle2 className="w-5 h-5 mr-2" />
                            <p>{success}</p>
                        </div>
                    </div>
                )}

                <div className="grid gap-4">
                    {campaigns.length > 0 ? (
                        campaigns.map((campaign) => (
                            <div
                                key={campaign._id}
                                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {campaign.name} name
                                        </h3>
                                        <p className="text-gray-600 mt-1">
                                            {campaign.subject} subject
                                        </p>
                                        <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <MailCheck className="w-4 h-4" />
                                                {campaign.smtp.length} SMTP Server(s)
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                Status: {arr[campaign.status]}
                                            </span>

                                            {/* {campaign.scheduledFor && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    Scheduled: {new Date(campaign.scheduledFor).toLocaleString()}
                                                </span>
                                            )}  */}
                                        </div>
                                    </div>                                    <div className="flex gap-2">
                                        {/* Action Buttons with Enhanced Tooltips */}                                        <div className="group relative">
                                            <button
                                                onClick={() => navigate(`/campaigns/edit/${campaign._id}`)}
                                                className="p-2 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-all duration-200 hover:shadow-md"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                                Edit Campaign
                                            </div>
                                        </div>

                                        <div className="group relative">
                                            <button
                                                onClick={() => navigate(`/campaigns/details/${campaign._id}`)}
                                                className="p-2 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 rounded-lg transition-all duration-200 hover:shadow-md"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                                View Details
                                            </div>
                                        </div>

                                        <div className="group relative">
                                            <button
                                                onClick={() => handleAction(campaign._id, 'start')}
                                                className="p-2 text-green-600 hover:bg-green-100 hover:text-green-700 rounded-lg transition-all duration-200 hover:shadow-md"
                                            >
                                                <Play className="w-5 h-5" />
                                            </button>
                                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                                Start Campaign
                                            </div>
                                        </div>

                                        <div className="group relative">
                                            <button
                                                onClick={() => handleAction(campaign._id, 'pause')}
                                                className="p-2 text-yellow-600 hover:bg-yellow-100 hover:text-yellow-700 rounded-lg transition-all duration-200 hover:shadow-md"
                                            >
                                                <Pause className="w-5 h-5" />
                                            </button>
                                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                                Pause Campaign
                                            </div>
                                        </div>

                                        <div className="group relative">
                                            <button
                                                onClick={() => handleAction(campaign._id, 'terminate')}
                                                className="p-2 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-lg transition-all duration-200 hover:shadow-md"
                                            >
                                                <StopCircle className="w-5 h-5" />
                                            </button>
                                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                                Stop Campaign
                                            </div>
                                        </div>

                                        <div className="group relative">
                                            <button
                                                onClick={() => handleSchedule(campaign._id)}
                                                className="p-2 text-purple-600 hover:bg-purple-100 hover:text-purple-700 rounded-lg transition-all duration-200 hover:shadow-md"
                                            >
                                                <Calendar className="w-5 h-5" />
                                            </button>
                                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                                Schedule Campaign
                                            </div>
                                        </div>

                                        <div className="group relative">
                                            <button
                                                onClick={() => handleDelete(campaign._id)}
                                                className="p-2 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-lg transition-all duration-200 hover:shadow-md"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                                Delete Campaign
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 bg-white rounded-lg">
                            <p className="text-gray-500">No campaigns found</p>
                            <button
                                onClick={() => navigate('/campaigns/create')}
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Create Your First Campaign
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CampaignsList;
