import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import axios from 'axios';
import SMTPConfigForm from './SMTPConfigForm';
import { useAuth } from '../context/AuthContext';



const SMTPConfigList = () => {
    const [smtpServers, setSmtpServers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { isAuthenticated } = useAuth();

    const { BASE_URL } = useAuth();
    const API_URL = BASE_URL;

    const fetchServers = async () => {
        try {
            if (!isAuthenticated()) return;

            const response = await axios.get(`${API_URL}/smtp`);
            if (response.data.success) {
                setSmtpServers(response.data.smtps);
            }
        } catch (error) {
            console.error('Error fetching SMTP servers:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchServers();
    }, []);



    const addNewForm = () => {
        setSmtpServers([...smtpServers, { id: `new-${Date.now()}`, isNew: true }]);
    };

    const removeServer = async (id) => {
        if (!id.toString().startsWith('new-')) {
            try {
                await axios.delete(`${API_URL}/smtp/${id}`);
                fetchServers();
            } catch (error) {
                console.error('Error deleting server:', error);
            }
        } else {
            setSmtpServers(smtpServers.filter(server => server._id !== id));
            fetchServers();
        }
    };

    const handleServerSaved = async (savedServer) => {
        await fetchServers();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-tr from-purple-100 via-teal-50 to-blue-100 p-4 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-tr from-purple-100 via-teal-50 to-blue-100 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">SMTP Configurations</h1>
                    <button
                        onClick={addNewForm}
                        className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Add Server
                    </button>
                </div>

                <div className="space-y-8">
                    {smtpServers.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 mb-4">No SMTP servers configured yet</p>
                            <button
                                onClick={addNewForm}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                            >
                                <PlusCircle className="w-5 h-5" />
                                Add Your First Server
                            </button>
                        </div>
                    ) : (
                        smtpServers.map((server, index) => (
                            <div key={index} className="relative">
                                <button
                                    onClick={() => removeServer(server._id || server.id)}
                                    className="absolute -top-3 -right-3 z-10 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 transition-colors"
                                >
                                    ×
                                </button>
                                <SMTPConfigForm
                                    formId={server._id}
                                    serverData={server.isNew ? null : server}
                                    onServerSaved={handleServerSaved}
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>
            <div className="mt-4 text-center text-xs text-gray-600">
                <div className="flex justify-center space-x-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-400"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                </div>
            </div>
        </div>
    );
};

export default SMTPConfigList;
