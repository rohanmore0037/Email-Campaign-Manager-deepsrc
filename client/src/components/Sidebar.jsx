import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Mail,
    FileSpreadsheet,
    FileText,
    Home,
    LayoutDashboard,
    Menu,
    X,
    MailCheck
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated } = useAuth();

    const menuItems = [
        {
            name: 'Home',
            path: '/',
            icon: <Home className="w-5 h-5" />,
            requiresAuth: false
        },
        {
            name: 'Dashboard',
            path: '/dashboard',
            icon: <LayoutDashboard className="w-5 h-5" />,
            requiresAuth: true
        },
        {
            name: 'SMTP Settings',
            path: '/smtp-config',
            icon: <Mail className="w-5 h-5" />,
            requiresAuth: true
        },
        {
            name: 'CSV Management',
            path: '/csv-upload',
            icon: <FileSpreadsheet className="w-5 h-5" />,
            requiresAuth: true
        },        {
            name: 'Templates',
            path: '/templates',
            icon: <FileText className="w-5 h-5" />,
            requiresAuth: true
        },
        {
            name: 'Campaign Manager',
            path: '/campaigns',
            icon: <MailCheck className="w-5 h-5" />,
            requiresAuth: true
        }
    ];

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                className="fixed top-4 left-4 z-50 lg:hidden bg-white p-2 rounded-lg shadow-lg"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed top-0 left-0 bg-white shadow-xl z-40
                transition-transform duration-300 ease-in-out
                lg:relative lg:translate-x-0 lg:w-64
                ${isOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Logo Area */}
                    <div className="p-4 border-b">
                        <h1 className="text-xl font-bold text-gray-800">Email Manager</h1>
                    </div>

                    {/* Menu Items */}
                    <nav className="flex-1 overflow-y-auto py-4">
                        <ul className="space-y-1">
                            {menuItems.map((item) => {
                        // Hide home when authenticated and hide auth-required items when not authenticated
                                if ((item.requiresAuth && !isAuthenticated()) || 
                                    (item.path === '/' && isAuthenticated())) return null;
                                return (
                                    <li key={item.path}>
                                        <NavLink
                                            to={item.path}
                                            className={({ isActive }) => `
                                                flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100
                                                ${isActive ? 'bg-gray-100 text-purple-600 border-r-4 border-purple-600' : ''}
                                            `}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {item.icon}
                                            <span>{item.name}</span>
                                        </NavLink>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Footer Area */}
                    <div className="p-4 border-t">
                        <p className="text-sm text-gray-600">© 2025 Email Manager</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
