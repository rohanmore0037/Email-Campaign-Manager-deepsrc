import React, { useState, useEffect } from 'react';
import { FileText, Code, Type, AlertCircle, CheckCircle2, Trash2, Eye, Edit } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';



const TemplateUpload = () => {
    const navigate = useNavigate();
    const [templates, setTemplates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [name, setName] = useState('');
    const [type, setType] = useState('html');
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const { isAuthenticated } = useAuth();
const {BASE_URL}=useAuth()
const API_URL = BASE_URL;
    // Fetch existing templates
    const fetchTemplates = async () => {
        try {
            if (!isAuthenticated()) return;

            const response = await axios.get(`${API_URL}/template/`);
            if (response.data.success) {
                setTemplates(response.data.templates);
            }
        } catch (error) {
            setError('Failed to fetch templates');
            console.error('Error fetching templates:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Please enter a template name');
            return;
        }
        if (!content.trim()) {
            setError('Please enter template content');
            return;
        }

        try {
            const templateData = {
                name,
                type,
                content
            };

            const method = editMode ? 'put' : 'post';
            const url = editMode
                ? `${API_URL}/template/${editId}`
                : `${API_URL}/template/`;

            const response = await axios[method](url, templateData);

            if (response.data.success) {
                setSuccess(editMode ? 'Template updated successfully!' : 'Template created successfully!');
                resetForm();
                fetchTemplates();
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to create template');
        }

        setTimeout(() => {
            setSuccess(null);
            setError(null);
        }, 3000);
    };

    const handleDelete = async (templateId) => {
        try {
            await axios.delete(`${API_URL}/template/${templateId}`);
            await fetchTemplates();
            setSuccess('Template deleted successfully!');
        } catch (error) {
            setError('Failed to delete template');
        }

        setTimeout(() => {
            setSuccess(null);
            setError(null);
        }, 3000);
    };

    const handleEdit = (template) => {
        setName(template.name);
        setType(template.type);
        setContent(template.content);
        setEditMode(true);
        setEditId(template._id);
    };

    const resetForm = () => {
        setName('');
        setType('html');
        setContent('');
        setEditMode(false);
        setEditId(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-tr from-emerald-100 via-teal-50 to-cyan-100 p-4">
            <div className="max-w-4xl mx-auto">
                {/* Template List Section */}
                <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Saved Templates</h2>
                    {isLoading ? (
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500" />
                        </div>
                    ) : templates.length > 0 ? (
                        <div className="space-y-4">
                            {templates.map((template) => (
                                <div key={template._id} className="bg-white p-4 rounded-lg shadow-md">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-3">
                                            <FileText className="text-teal-500 w-5 h-5" />
                                            <div>
                                                <p className="font-medium text-gray-800">{template.name}</p>
                                                <p className="text-sm text-gray-500">Type: {template.type}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => navigate(`/templates/${template._id}`)}
                                                className="px-3 py-1 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors flex items-center gap-1 text-sm"
                                                title="Preview template"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Preview
                                            </button>
                                            <button
                                                onClick={() => handleEdit(template)}
                                                className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 text-sm"
                                                title="Edit template"
                                            >
                                                <Edit className="w-4 h-4" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(template._id)}
                                                className="p-1 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                                                title="Delete template"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <div className="text-sm text-gray-600 bg-gray-50 rounded p-2 max-h-24 overflow-y-auto font-mono">
                                            <pre className="whitespace-pre-wrap">{template.content.slice(0, 200)}{template.content.length > 200 ? '...' : ''}</pre>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center">No templates created yet</p>
                    )}
                </div>

                {/* Upload Form Section */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">                    <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {editMode ? 'Edit Template' : 'Create New Template'}
                    </h2>
                    {editMode && (
                        <button
                            onClick={resetForm}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Cancel Edit
                        </button>
                    )}
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

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name and Type Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Template Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                        <Type className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter template name"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Template Type
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                        <Code className="w-5 h-5" />
                                    </div>
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none bg-white"
                                    >
                                        <option value="html">HTML</option>
                                        <option value="text">Text</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Content Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Template Content
                            </label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Enter your template content here..."
                                rows="8"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono text-sm"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                            >                                {editMode ? 'Update Template' : 'Create Template'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TemplateUpload;
