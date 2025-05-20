import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, FileText, Clock, Tag } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';



const TemplatePreview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [template, setTemplate] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [iframeHeight, setIframeHeight] = useState('500px');
const {BASE_URL}=useAuth()
const API_URL = BASE_URL;
    useEffect(() => {
        const fetchTemplate = async () => {
            try {
                if (!isAuthenticated()) return;

                const response = await axios.get(`${API_URL}/template/${id}`);
                if (response.data.success) {
                    setTemplate(response.data.template);
                }
            } catch (error) {
                setError('Failed to fetch template details');
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTemplate();
    }, [id, isAuthenticated]);

    // Function to create a preview iframe with the template content
    const renderPreview = () => {
        if (!template?.content) return null;

        const iframeContent = `${template.content}`;

        return (
            <iframe
                srcDoc={iframeContent}
                title="Email Template Preview"
                className="w-full border-0 bg-white rounded"
                style={{ height: iframeHeight }}
                onLoad={(e) => {
                    const height = e.target.contentWindow.document.body.scrollHeight;
                    setIframeHeight(`${height + 32}px`);
                }}
            />
        );
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-4">
            {/* Navigation Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/templates')}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Back to templates"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">Template Preview</h1>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Template Details */}
                <div className="border-b border-gray-200">
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="flex items-start gap-3">
                                <FileText className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-gray-500">Name</p>
                                    <p className="mt-1 font-medium text-gray-900">{template?.name}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Tag className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-gray-500">Type</p>
                                    <p className="mt-1 font-medium text-gray-900 capitalize">{template?.type}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-gray-500">Created</p>
                                    <p className="mt-1 font-medium text-gray-900">
                                        {new Date(template?.createdAt).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Mail className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-gray-500">Preview Mode</p>
                                    <p className="mt-1 font-medium text-emerald-600">Live Preview</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Template Preview */}
                <div className="bg-gray-50 p-6">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        {renderPreview()}
                    </div>
                </div>
            </div>

            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                    {error}
                </div>
            )}
        </div>
    );
};

export default TemplatePreview;
