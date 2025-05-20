import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    BarChart3, Users, Mail, Send, 
    ArrowUpRight, ArrowDownRight, 
    PlusCircle, FileSpreadsheet, 
    FileText, MailCheck 
} from 'lucide-react';
import axios from 'axios';
import {useAuth} from '../context/AuthContext'


const Dashboard = () => {
    const [stats, setStats] = useState({
        totalSubscribers: 0,
        totalCampaigns: 0,
        totalTemplates: 0,
        emailsSent: 0,
        recentCampaigns: []
    });
    const [loading, setLoading] = useState(true);
const {BASE_URL}=useAuth()
const API_URL = BASE_URL;
    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                const response = await axios.get(`${API_URL}/dashboard/stats`);
                if (response.data.success) {
                    setStats(response.data.stats);
                }
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardStats();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
            </div>
        );
    }

    return (
        // <div className="p-6">
        //     <div className="mb-8">
        //         <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        //         <p className="text-gray-600">Overview of your email marketing performance</p>
        //     </div>

        //     {/* Quick Stats */}
        //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        //         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        //             <div className="flex justify-between items-start mb-4">
        //                 <div>
        //                     <p className="text-sm font-medium text-gray-500">Total Subscribers</p>
        //                     <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.totalSubscribers}</h3>
        //                 </div>
        //                 <div className="bg-emerald-100 p-3 rounded-lg">
        //                     <Users className="w-6 h-6 text-emerald-600" />
        //                 </div>
        //             </div>
        //             <div className="flex items-center text-sm">
        //                 <ArrowUpRight className="w-4 h-4 text-emerald-500 mr-1" />
        //                 <span className="text-emerald-500 font-medium">12%</span>
        //                 <span className="text-gray-500 ml-2">vs last month</span>
        //             </div>
        //         </div>

        //         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        //             <div className="flex justify-between items-start mb-4">
        //                 <div>
        //                     <p className="text-sm font-medium text-gray-500">Campaigns Sent</p>
        //                     <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.totalCampaigns}</h3>
        //                 </div>
        //                 <div className="bg-blue-100 p-3 rounded-lg">
        //                     <Send className="w-6 h-6 text-blue-600" />
        //                 </div>
        //             </div>
        //             <div className="flex items-center text-sm">
        //                 <ArrowUpRight className="w-4 h-4 text-emerald-500 mr-1" />
        //                 <span className="text-emerald-500 font-medium">8%</span>
        //                 <span className="text-gray-500 ml-2">vs last month</span>
        //             </div>
        //         </div>

        //         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        //             <div className="flex justify-between items-start mb-4">
        //                 <div>
        //                     <p className="text-sm font-medium text-gray-500">Emails Sent</p>
        //                     <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.emailsSent}</h3>
        //                 </div>
        //                 <div className="bg-purple-100 p-3 rounded-lg">
        //                     <Mail className="w-6 h-6 text-purple-600" />
        //                 </div>
        //             </div>
        //             <div className="flex items-center text-sm">
        //                 <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
        //                 <span className="text-red-500 font-medium">3%</span>
        //                 <span className="text-gray-500 ml-2">vs last month</span>
        //             </div>
        //         </div>

        //         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        //             <div className="flex justify-between items-start mb-4">
        //                 <div>
        //                     <p className="text-sm font-medium text-gray-500">Templates</p>
        //                     <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.totalTemplates}</h3>
        //                 </div>
        //                 <div className="bg-orange-100 p-3 rounded-lg">
        //                     <FileText className="w-6 h-6 text-orange-600" />
        //                 </div>
        //             </div>
        //             <div className="flex items-center text-sm">
        //                 <ArrowUpRight className="w-4 h-4 text-emerald-500 mr-1" />
        //                 <span className="text-emerald-500 font-medium">5%</span>
        //                 <span className="text-gray-500 ml-2">vs last month</span>
        //             </div>
        //         </div>
        //     </div>

        //     {/* Quick Actions */}
        //     <div className="mb-8">
        //         <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        //             <Link to="/campaigns/create" 
        //                 className="flex items-center gap-3 p-4 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-colors">
        //                 <PlusCircle className="w-5 h-5" />
        //                 <span className="font-medium">New Campaign</span>
        //             </Link>
        //             <Link to="/csv-upload" 
        //                 className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
        //                 <FileSpreadsheet className="w-5 h-5 text-gray-600" />
        //                 <span className="font-medium text-gray-700">Import List</span>
        //             </Link>
        //             <Link to="/templates" 
        //                 className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
        //                 <FileText className="w-5 h-5 text-gray-600" />
        //                 <span className="font-medium text-gray-700">Create Template</span>
        //             </Link>
        //             <Link to="/campaigns" 
        //                 className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
        //                 <BarChart3 className="w-5 h-5 text-gray-600" />
        //                 <span className="font-medium text-gray-700">View Reports</span>
        //             </Link>
        //         </div>
        //     </div>

        //     {/* Recent Campaigns */}
        //     <div>
        //         <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Campaigns</h2>
        //         <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        //             <div className="overflow-x-auto">
        //                 <table className="w-full">
        //                     <thead className="bg-gray-50">
        //                         <tr>
        //                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
        //                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
        //                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opens</th>
        //                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
        //                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
        //                         </tr>
        //                     </thead>
        //                     <tbody className="divide-y divide-gray-200">
        //                         {stats.recentCampaigns.map((campaign, index) => (
        //                             <tr key={index} className="hover:bg-gray-50">
        //                                 <td className="px-6 py-4 whitespace-nowrap">
        //                                     <Link to={`/campaigns/details/${campaign._id}`} className="text-blue-600 hover:text-blue-800">
        //                                         {campaign.name}
        //                                     </Link>
        //                                 </td>
        //                                 <td className="px-6 py-4 whitespace-nowrap">
        //                                     <span className={`px-2 py-1 text-xs font-medium rounded-full ${
        //                                         campaign.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
        //                                         campaign.status === 'running' ? 'bg-blue-100 text-blue-800' :
        //                                         'bg-gray-100 text-gray-800'
        //                                     }`}>
        //                                         {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
        //                                     </span>
        //                                 </td>
        //                                 <td className="px-6 py-4 whitespace-nowrap text-gray-600">
        //                                     {campaign.opens}%
        //                                 </td>
        //                                 <td className="px-6 py-4 whitespace-nowrap text-gray-600">
        //                                     {campaign.clicks}%
        //                                 </td>
        //                                 <td className="px-6 py-4 whitespace-nowrap text-gray-600">
        //                                     {new Date(campaign.sendDate).toLocaleDateString()}
        //                                 </td>
        //                             </tr>
        //                         ))}
        //                     </tbody>
        //                 </table>
        //             </div>
        //         </div>
        //     </div>
        // </div>
        <></>
    );
};

export default Dashboard;
