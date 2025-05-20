import React, { useState, useEffect } from 'react';
import { FileText, Tag, Upload, AlertCircle, CheckCircle2, Trash2, ExternalLink } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';



const CSVUpload = () => {
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filename, setFilename] = useState('');
    const [tag, setTag] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const { isAuthenticated } = useAuth();
const {BASE_URL}=useAuth()
const API_URL = BASE_URL;
    // Fetch existing files
    const fetchFiles = async () => {
        try {
            if (!isAuthenticated()) return;

            const response = await axios.get(`${API_URL}/subscriberList/`);
            if (response.data.success) {
                setFiles(response.data.lists);
            }
        } catch (error) {
            setError('Failed to fetch files');
            console.error('Error fetching files:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && !file.name.endsWith('.csv')) {
            setError('Please select a CSV file');
            return;
        }
        setSelectedFile(file);
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            setError('Please select a file');
            return;
        }
        if (!filename.trim()) {
            setError('Please enter a filename');
            return;
        }
        if (!tag.trim()) {
            setError('Please enter a tag');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('name', filename);
            formData.append('tag', tag);

            const response = await axios.post(`${API_URL}/subscriber/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            if (response.data.success) {
                setSuccess('File uploaded successfully!');
                setFilename('');
                setTag('');
                setSelectedFile(null);
                // Reset file input
                e.target.reset();
                // Refresh file list
                fetchFiles();
            }
        } catch (error) {
            console.log('Error uploading file:', error);
            setError(error.response?.data?.message || 'Failed to upload file');
        }

        setTimeout(() => {
            setSuccess(null);
            setError(null);
        }, 3000);
    };

    const handleDelete = async (fileId) => {
        try {
            await axios.delete(`${API_URL}/subscriberList/${fileId}`);
            await fetchFiles();
            setSuccess('File deleted successfully!');
        } catch (error) {
            setError('Failed to delete file');
        }

        setTimeout(() => {
            setSuccess(null);
            setError(null);
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-tr from-purple-100 via-indigo-50 to-blue-100 p-4">
            <div className="max-w-4xl mx-auto">
                {/* File List Section */}
                <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Uploaded Files</h2>
                    {isLoading ? (
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
                        </div>
                    ) : files.length > 0 ? (
                        <div className="space-y-3">
                            {files.map((file) => (
                                <div key={file._id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow group">
                                    <button
                                        onClick={() => navigate(`/subscribers/${file._id}`)}
                                        className="flex items-center gap-3 flex-grow hover:bg-gray-50 p-2 rounded-lg transition-colors"
                                    >
                                        <FileText className="text-purple-500 w-5 h-5" />
                                        <div className="text-left">
                                            <p className="font-medium text-gray-800">{file.filename}</p>
                                            <p className="text-sm text-gray-500">Tag: {file.tag}</p>
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(file._id);
                                        }}
                                        className="p-1 hover:bg-red-50 rounded-full text-red-500 transition-colors ml-2"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center">No files uploaded yet</p>
                    )}
                </div>

                {/* Upload Form Section */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload New CSV</h2>

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
                    )}                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Filename and Tag Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    File Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        value={filename}
                                        onChange={(e) => setFilename(e.target.value)}
                                        placeholder="Enter file name"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tag
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                        <Tag className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        value={tag}
                                        onChange={(e) => setTag(e.target.value)}
                                        placeholder="Enter a tag for your CSV"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* File Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                CSV File
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                                <div className="space-y-1 text-center">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600">
                                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500">
                                            <span>Upload a file</span>
                                            <input
                                                type="file"
                                                accept=".csv"
                                                className="sr-only"
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {selectedFile ? selectedFile.name : 'CSV files only'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                            >
                                Upload File
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CSVUpload;
