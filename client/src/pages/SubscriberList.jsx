import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Download } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';



const SubscriberList = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [subscribers, setSubscribers] = useState([]);
    const [listInfo, setListInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null); const [currentPage, setCurrentPage] = useState(1);
    const [isExporting, setIsExporting] = useState(false);
    const subscribersPerPage = 10;
const {BASE_URL}=useAuth()
const API_URL = BASE_URL;
    const downloadCSV = async () => {
        try {
            setIsExporting(true);
            const response = await axios.get(`${API_URL}/subscriberList/export-csv/${id}`, {
                responseType: 'blob'
            });
            console.log('CSV response:', response);
            
            const blob = new Blob([response.data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${listInfo?.name || 'subscribers'}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        } catch (error) {
            setError('Error downloading CSV file');
            console.error('Error downloading CSV:', error);
        } finally {
            setIsExporting(false);
        }
    };

    // Reset page when search term changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!isAuthenticated()) return;

                const [subscribersRes, listInfoRes] = await Promise.all([
                    axios.get(`${API_URL}/subscriber/${id}`),
                    axios.get(`${API_URL}/subscriberList/${id}`)
                ]);

                if (subscribersRes.data.success && listInfoRes.data.success) {
                    setSubscribers(subscribersRes.data.subscribers);
                    setListInfo(listInfoRes.data.list);
                }
            } catch (error) {
                setError('Failed to fetch subscriber data');
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id, isAuthenticated]);

    const filteredSubscribers = subscribers.filter(subscriber => {
        if (!searchTerm.trim()) return true;

        const searchLower = searchTerm.toLowerCase();
        const searchTerms = searchLower.split(' ').filter(term => term.length > 0);

        return searchTerms.every(term => {
            const rowNumber = String((subscribers.indexOf(subscriber) + 1));
            return (
                rowNumber.includes(term) ||
                subscriber.name?.toLowerCase().includes(term) ||
                subscriber.email?.toLowerCase().includes(term)
            );
        });
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
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/csv-upload')}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <ArrowLeft className="w-6 h-6 text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    {listInfo?.name || 'Subscriber List'}
                                </h1>
                                <p className="text-sm text-gray-500">
                                    Tag: {listInfo?.tag} • Total Subscribers: {subscribers.length}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text" placeholder="Search by name, email or number..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
                                />
                            </div>
                            <button
                                onClick={downloadCSV}
                                disabled={isExporting}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Download className="w-4 h-4" />
                                {isExporting ? 'Exporting...' : 'Export CSV'}
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700">
                            {error}
                        </div>
                    )}                    {/* Subscribers Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        #
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Subscriber Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
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
                                                <div className="text-sm text-gray-900">{subscriber.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{subscriber.email}</div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>

                    {/* No Results Message */}
                    {filteredSubscribers.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No subscribers found
                        </div>
                    )}

                    {/* Pagination */}
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

export default SubscriberList;