import React from 'react';
import { LayoutDashboard, Users, FileText, LogOut } from 'lucide-react';
import logoNosPlanet from '../../assets/Logo Nos Planet.png';

const AdminSidebar = ({ activeTab, setActiveTab, t, requestsCount, onLogout }) => {
    return (
        <aside className="w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 hidden md:flex flex-col fixed h-full z-20 transition-colors duration-500">
            <div className="p-8 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2.5 text-gray-900 dark:text-white text-2xl">
                    <div className="p-1.5 rounded-lg shadow-md bg-white">
                        <img src={logoNosPlanet} alt="Logo" className="w-6 h-6 object-contain" />
                    </div>
                    <span className="text-green-600 dark:text-green-400">Recycle</span>
                </div>
            </div>

            <div className="flex-1 py-8 px-5 space-y-2 overflow-y-auto">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-4 mb-2">{t.admin.menu.main}</div>
                <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'}`}
                >
                    <LayoutDashboard size={20} /> {t.admin.menu.dashboard}
                </button>

                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-4 mb-2 mt-6">{t.admin.menu.management}</div>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'}`}
                >
                    <Users size={20} /> {t.admin.menu.users}
                </button>
                <button
                    onClick={() => setActiveTab('requests')}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'requests' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'}`}
                >
                    <FileText size={20} /> {t.admin.menu.requests}
                    {requestsCount > 0 && (
                        <span className="ml-auto bg-orange-500 text-white text-[10px] py-0.5 px-2 rounded-full font-extrabold shadow-sm">
                            {requestsCount}
                        </span>
                    )}
                </button>
            </div>

            <div className="p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-sm font-bold transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900"
                >
                    <LogOut size={20} /> {t.nav.logout}
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
