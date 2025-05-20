import React, { useState, useEffect } from 'react';
import { MailCheck, AlertCircle, CheckCircle2, Mail, FileText, Users, Tag } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';



const CampaignManager = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [smtpServers, setSmtpServers] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [subscriberLists, setSubscriberLists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const { isAuthenticated } = useAuth();
const {BASE_URL}=useAuth()
const API_URL = BASE_URL;
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        smtp: [],
        template: '',
        subject: '',
        subscriberList: []
    });// Fetch all required data
    const fetchData = async () => {
        try {
            if (!isAuthenticated()) return;

            const [smtpRes, templatesRes, subscribersRes] = await Promise.all([
                axios.get(`${API_URL}/smtp`),
                axios.get(`${API_URL}/template`),
                axios.get(`${API_URL}/subscriberList`)
            ]);

            setSmtpServers(smtpRes.data.smtps || []);
            setTemplates(templatesRes.data.templates || []);
            setSubscriberLists(subscribersRes.data.lists || []);
        } catch (error) {
            setError('Failed to fetch data');
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        if (id) {
            // Fetch campaign data if in edit mode
            const fetchCampaign = async () => {
                try {
                    const response = await axios.get(`${API_URL}/campaign/${id}`);
                    if (response.data.success) {
                        const campaign = response.data.campaign;
                        console.log('Fetched campaign:', campaign);
                        setFormData({
                            name: campaign.name,
                            smtp: campaign.smtp.map(s => s),
                            template: campaign.template,
                            subject: campaign.subject,
                            subscriberList: campaign.subscriberList.map(s => s)
                        });
                    }
                } catch (error) {
                    setError('Failed to fetch campaign');
                    console.error('Error fetching campaign:', error);
                }
            };
            fetchCampaign();
        }
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            const field = name.split('-')[0]; // Get the base field name (smtp or subscriberList)
            const itemId = name.split('-')[1]; // Get the item id

            setFormData(prev => ({
                ...prev,
                [field]: checked
                    ? [...prev[field], itemId]
                    : prev[field].filter(id => id !== itemId)
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            smtp: [],
            template: '',
            subject: '',
            subscriberList: []
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!formData.name || !formData.subject || !formData.template ||
                formData.smtp.length === 0 || formData.subscriberList.length === 0) {
                setError('Please fill in all fields');
                return;
            }

            const method = id ? 'put' : 'post';
            const url = id ? `${API_URL}/campaign/${id}` : `${API_URL}/campaign`;
            const response = await axios[method](url, formData);

            if (response.data.success) {
                setSuccess(id ? 'Campaign updated successfully!' : 'Campaign created successfully!');
                setTimeout(() => navigate('/campaigns'), 1500);
            }
        } catch (error) {
            setError(error.response?.data?.message || `Failed to ${id ? 'update' : 'create'} campaign`);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
            </div>
        );
    } return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-4xl mx-auto bg-white rounded-xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {id ? 'Edit Campaign' : 'Create New Campaign'}
                    </h2>
                    <button
                        onClick={() => navigate('/campaigns')}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2"
                    >
                        Back to Campaigns
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

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name and Subject */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Campaign Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                    <Tag className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter campaign name"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Subject
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                    <MailCheck className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    placeholder="Enter email subject"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Template Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Template
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                <FileText className="w-5 h-5" />
                            </div>
                            <select
                                name="template"
                                value={formData.template}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                            >
                                <option value="">Select a template</option>
                                {templates.map(template => (
                                    <option key={template._id} value={template._id}>
                                        {template.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>                    {/* SMTP Servers Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            SMTP Servers (Select multiple)
                        </label>
                        <div className="space-y-2 pl-2">
                            {smtpServers.map(server => (
                                <label key={server._id} className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        name={`smtp-${server._id}`}
                                        checked={formData.smtp.includes(server._id)}
                                        onChange={handleInputChange}
                                        className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                    />
                                    <div className="flex items-center space-x-2">
                                        <Mail className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-700">{server.servername}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Subscriber Lists Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Subscriber Lists (Select multiple)
                        </label>
                        <div className="space-y-2 pl-2">
                            {subscriberLists.map(list => (
                                <label key={list._id} className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        name={`subscriberList-${list._id}`}
                                        checked={formData.subscriberList.includes(list._id)}
                                        onChange={handleInputChange}
                                        className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                    />
                                    <div className="flex items-center space-x-2">
                                        <Users className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-700">{list.name} ({list.tag})</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>{/* Form Actions */}
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={() => navigate('/campaigns')}
                            type="button"
                            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                        >
                            {id ? 'Update Campaign' : 'Create Campaign'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CampaignManager;
