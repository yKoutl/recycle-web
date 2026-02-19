import React, { useState, useEffect } from 'react';
import { BarChart3, Bell, User, FileText, TrendingUp, Calendar, Zap, Target } from 'lucide-react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import UsersTable from '../UsersTable';
import RequestsList from '../RequestsList';
import RewardsList from '../rewards/reward-actions';
import RewardFormModal from '../rewards/reward-modal';
import ProgramsList from '../programs/program-actions';
import PartnersList from '../partners/partners-actions';
import PartnerRequestsTable from '../partners/requests-list';
import EcoHistoriesTable from '../EcoHistoriesTable';
import AdminSettings from './AdminSettings';
import { MOCK_REQUESTS, MOCK_STATS } from '../../../data/mockData';
import { useDispatch, useSelector } from 'react-redux';
import { onLogout } from '../../../store/auth/authSlice';

import StatusModal from '../../../components/shared/StatusModal';

const AdminView = ({ t, darkMode, setDarkMode, lang, setLang, showBot, setShowBot }) => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const [requests, setRequests] = useState([]);
    const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = () => {
        setShowLogoutModal(true);
        setTimeout(() => {
            dispatch(onLogout());
        }, 2000);
    };

    useEffect(() => {
        setRequests(MOCK_REQUESTS(t));
        // Desactivar Bot por defecto en Admin
        if (setShowBot) setShowBot(false);
    }, [t, setShowBot]);

    const handleStatusChange = (id, newStatusKey) => {
        setRequests(requests.map(req =>
            req.id === id ? {
                ...req,
                status: t.admin.status[newStatusKey],
                statusKey: newStatusKey
            } : req
        ));
    };

    // Componente para el Dashboard Principal
    const DashboardHome = () => (
        <div className="space-y-12 animate-fade-in relative z-10">
            {/* Header with Welcome */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="space-y-1">
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight uppercase italic leading-none">
                        {(user?.role?.toUpperCase() === 'ADMIN') ? 'Bienvenido, Administrador' : 'Bienvenido, Funcionario'} <span className="text-[#018F64]">{user?.fullName || user?.name || 'Usuario'}</span>
                    </h2>
                    <p className="text-gray-400 dark:text-gray-500 font-medium text-sm">
                        {(user?.role?.toUpperCase() === 'ADMIN') ? 'Panel de Control Total' : 'Panel de Gestión Municipal'} • <span className="text-[#018F64] font-bold">{new Date().toLocaleDateString()}</span>
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-all shadow-sm flex items-center gap-2">
                        <Calendar size={14} /> {t.admin.exportBtn}
                    </button>
                    <button className="px-5 py-2.5 bg-[#018F64] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#05835D] transition-all shadow-lg shadow-[#018F64]/20 active:scale-95 flex items-center gap-2">
                        <Target size={14} /> {t.admin.reportBtn}
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {MOCK_STATS(t).map((stat, idx) => (
                    <div key={idx} className="bg-white/80 dark:bg-gray-900/40 backdrop-blur-xl p-6 rounded-3xl border border-gray-100 dark:border-white/5 flex flex-col justify-between h-40 transition-all hover:shadow-lg hover:shadow-gray-200/20 dark:hover:shadow-none">
                        <div className="flex justify-between items-start">
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} shadow-sm`}>
                                <stat.icon size={20} />
                            </div>
                            <div className="text-[10px] font-black text-[#018F64] bg-green-500/10 px-2 py-1 rounded-lg">
                                +12.5%
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">{stat.label}</p>
                            <p className="text-3xl font-black text-gray-900 dark:text-white tabular-nums">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 bg-white/80 dark:bg-gray-900/40 p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-none backdrop-blur-xl">
                    <div className="flex justify-between items-center mb-10">
                        <div className="space-y-1">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic flex items-center gap-3">
                                <div className="p-2 bg-[#018F64]/10 rounded-xl text-[#018F64]">
                                    <BarChart3 size={20} strokeWidth={3} />
                                </div>
                                {t.admin.weeklySummary}
                            </h3>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] ml-11">Kg de material recolectado</p>
                        </div>
                    </div>
                    <div className="h-64 flex items-end justify-between gap-6 px-4">
                        {[40, 60, 45, 70, 85, 55, 65].map((h, i) => (
                            <div key={i} className="flex-1 bg-gray-100/50 dark:bg-white/5 rounded-3xl relative group h-full transition-all">
                                <div className="absolute bottom-0 w-full bg-gradient-to-t from-[#018F64] to-emerald-400 rounded-3xl" style={{ height: `${h}%` }} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white/80 dark:bg-gray-900/40 p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-none backdrop-blur-xl">
                    <div className="flex justify-between items-center mb-10">
                        <div className="space-y-1">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic flex items-center gap-3">
                                <div className="p-2 bg-orange-500/10 rounded-xl text-orange-500">
                                    <Bell size={20} strokeWidth={3} />
                                </div>
                                {t.admin.recentActivity}
                            </h3>
                        </div>
                    </div>
                    <div className="space-y-6">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex gap-6 items-center p-4 rounded-3xl bg-gray-50/50 dark:bg-white/5 border border-transparent">
                                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center text-[#018F64] shadow-sm shrink-0">
                                    <User size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-800 dark:text-gray-200 text-sm font-bold">Actividad Reciente</p>
                                    <span className="text-gray-400 text-[10px] uppercase font-black">Hace 2 horas</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FAFCF9] dark:bg-gray-950 flex font-sans transition-all duration-500 relative">
            <AdminSidebar
                t={t}
                requestsCount={requests.filter(r => r.statusKey === 'pending').length}
                onLogout={handleLogout}
                user={user}
            />

            <main className="flex-1 md:ml-72 min-h-screen transition-all duration-500 relative z-10">
                <AdminHeader
                    t={t}
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                />
                <div className="p-6 md:p-12 max-w-[1400px] mx-auto transition-all duration-500">
                    <Routes>
                        <Route path="/" element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<DashboardHome />} />

                        {/* Rutas Protegidas por Rol en el Frontend */}
                        {user?.role?.toUpperCase() === 'ADMIN' && (
                            <>
                                <Route path="users" element={<div className="animate-fade-in"><UsersTable t={t} /></div>} />
                                <Route path="requests" element={<div className="animate-fade-in"><RequestsList requests={requests} t={t} onStatusChange={handleStatusChange} /></div>} />
                                <Route path="rewards" element={<div className="animate-fade-in"><RewardsList onOpenModal={() => setIsRewardModalOpen(true)} /></div>} />

                                {/* Gestión de Socios */}
                                <Route path="partners/list" element={<div className="animate-fade-in"><PartnersList /></div>} />
                                <Route path="partners/requests" element={<div className="animate-fade-in"><PartnerRequestsTable /></div>} />

                                <Route path="histories" element={<div className="animate-fade-in"><EcoHistoriesTable t={t} /></div>} />
                                <Route path="settings" element={
                                    <AdminSettings
                                        t={t}
                                        darkMode={darkMode}
                                        setDarkMode={setDarkMode}
                                        lang={lang}
                                        setLang={setLang}
                                        user={user}
                                        showBot={showBot}
                                        setShowBot={setShowBot}
                                    />
                                } />
                            </>
                        )}

                        <Route path="programs" element={<div className="animate-fade-in"><ProgramsList /></div>} />

                        {/* Redirección si la ruta no existe */}
                        <Route path="*" element={<Navigate to="dashboard" replace />} />
                    </Routes>
                </div>

                <RewardFormModal
                    isOpen={isRewardModalOpen}
                    onClose={() => setIsRewardModalOpen(false)}
                />
            </main>

            <StatusModal
                status={showLogoutModal ? "loading" : null}
                message="Cerrando sesión de forma segura..."
            />
        </div>
    );
};

export default AdminView;
