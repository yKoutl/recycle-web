import React, { useState, useEffect } from 'react';
import { BarChart3, Bell, User, FileText } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import UsersTable from './UsersTable';
import RequestsList from './RequestsList';
import { MOCK_REQUESTS, MOCK_STATS } from '../../data/mockData';

const AdminView = ({ onLogout, t }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [requests, setRequests] = useState([]);

    // Load requests with translations
    useEffect(() => {
        setRequests(MOCK_REQUESTS(t));
    }, [t]);

    const handleStatusChange = (id, newStatusKey) => {
        setRequests(requests.map(req =>
            req.id === id ? {
                ...req,
                status: t.admin.status[newStatusKey],
                statusKey: newStatusKey
            } : req
        ));
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'users':
                return <UsersTable t={t} />;
            case 'requests':
                return <RequestsList requests={requests} t={t} onStatusChange={handleStatusChange} />;
            default: // Dashboard
                return (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        {/* Header with Welcome */}
                        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.admin.welcome} 👋</h2>
                                <p className="text-gray-500 dark:text-gray-400">{t.admin.welcomeSub}</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">{t.admin.exportBtn}</button>
                                <button className="px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-700 dark:hover:bg-green-600 shadow-sm">{t.admin.reportBtn}</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {MOCK_STATS(t).map((stat, idx) => (
                                <div key={idx} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-32 relative overflow-hidden">
                                    <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 ${stat.bg.split(' ')[0]}`}></div>
                                    <div className="flex justify-between items-start z-10">
                                        <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                            <stat.icon size={22} />
                                        </div>
                                        <span className="text-green-600 dark:text-green-400 text-xs font-bold bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded">+12%</span>
                                    </div>
                                    <div className="z-10">
                                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mt-1">{stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <BarChart3 size={20} className="text-green-600 dark:text-green-400" /> {t.admin.weeklySummary}
                                    </h3>
                                    <select className="text-sm border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-1 outline-none">
                                        <option>Últimos 7 días</option>
                                    </select>
                                </div>

                                <div className="h-64 flex items-end justify-between gap-4">
                                    {[40, 60, 45, 70, 85, 55, 65].map((h, i) => (
                                        <div key={i} className="w-full bg-gray-100 dark:bg-gray-800 rounded-t-xl relative group overflow-hidden">
                                            <div
                                                className="absolute bottom-0 w-full bg-gradient-to-t from-green-600 to-emerald-400 dark:from-green-500 dark:to-emerald-600 rounded-t-xl transition-all duration-500 group-hover:opacity-90"
                                                style={{ height: `${h}%` }}
                                            />
                                            {/* Tooltip */}
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 dark:bg-white text-white dark:text-gray-900 text-xs px-2 py-1 rounded mb-1 whitespace-nowrap z-20">
                                                {h * 10} kg
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-4 font-medium uppercase">
                                    <span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Bell size={20} className="text-orange-500 dark:text-orange-400" /> {t.admin.recentActivity}
                                    </h3>
                                    <button className="text-green-600 dark:text-green-400 text-sm font-bold hover:underline">{t.admin.seeAll}</button>
                                </div>

                                <div className="space-y-6">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex gap-4 items-start">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 border border-blue-100 dark:border-blue-800">
                                                <User size={18} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-gray-800 dark:text-gray-200 text-sm font-medium">Nuevo socio registrado: <span className="font-bold">Empresa Solar S.A.</span></p>
                                                <span className="text-gray-400 dark:text-gray-500 text-xs mt-1 block">Hace 2 horas • Gestión de Usuarios</span>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="flex gap-4 items-start">
                                        <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0 border border-orange-100 dark:border-orange-800">
                                            <FileText size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-gray-800 dark:text-gray-200 text-sm font-medium">Reporte mensual generado autom&aacute;ticamente</p>
                                            <span className="text-gray-400 dark:text-gray-500 text-xs mt-1 block">Hace 5 horas • Sistema</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex font-sans transition-colors duration-500">
            <AdminSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                t={t}
                requestsCount={requests.filter(r => r.statusKey === 'pending').length}
                onLogout={onLogout}
            />

            <main className="flex-1 md:ml-72 min-h-screen transition-all duration-500">
                <AdminHeader t={t} />
                <div className="p-6 md:p-10 max-w-7xl mx-auto">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default AdminView;
