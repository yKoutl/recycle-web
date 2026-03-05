import React, { useState, useEffect } from 'react';
import { BarChart3, Bell, User, FileText, TrendingUp, Calendar, Zap, Target, Leaf as LeafIcon, Mail, CheckCircle, MessageSquare } from 'lucide-react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import GestoresManagementView from '../GestoresManagementView';
import ProgramManagementView from '../programs/ProgramManagementView';
import DonationsTable from '../DonationsTable';
import ContactRequests from '../ContactRequests';
import { MOCK_REQUESTS, MOCK_STATS } from '../../../data/mockData';

import { useDispatch, useSelector } from 'react-redux';
import { onLogout } from '../../../store/auth/authSlice';

import StatusModal from '../../../components/shared/StatusModal';

const AdminView = ({ t, darkMode, setDarkMode, lang, setLang, showBot, setShowBot, themeColor, setThemeColor }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { user } = useSelector(state => state.auth);
    const [requests, setRequests] = useState([]);
    const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        setShowLogoutModal(true);
        setTimeout(() => {
            dispatch(onLogout());
        }, 2000);
    };

    // Cerrar sidebar al cambiar de ruta en móvil
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

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
    const DashboardHome = () => {
        const roleColor = themeColor;

        return (
            <div className="space-y-6 animate-fade-in pb-20">
                {/* ── Header ── */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${themeColor}, ${themeColor}dd)`, boxShadow: `0 8px 20px ${themeColor}30` }}>
                            <LeafIcon size={22} strokeWidth={1.75} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest mb-0.5" style={{ color: roleColor }}>
                                {new Date().toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                            </p>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                                {(user?.role?.toUpperCase() === 'ADMIN') ? 'Panel de Administración' : 'Panel de Gestión'}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                Bienvenido, <span className="font-semibold" style={{ color: roleColor }}>{user?.fullName || 'Usuario'}</span> · {(user?.role?.toUpperCase() === 'ADMIN') ? 'Control total' : 'Gestión institucional'}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button className="flex-1 sm:flex-none px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95">
                            <Calendar size={14} /> EXPORTAR
                        </button>
                        <button
                            style={{ background: `linear-gradient(135deg, ${themeColor}, ${themeColor}dd)`, boxShadow: `0 4px 14px ${themeColor}40` }}
                            className="flex-1 sm:flex-none px-4 py-2.5 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-1.5"
                        >
                            <Target size={14} /> REPORTES
                        </button>
                    </div>
                </div>

                {/* ── Stats Grid ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {MOCK_STATS(t).map((stat, idx) => {
                        const colors = [
                            { bg: 'bg-emerald-50 dark:bg-emerald-500/10', color: 'text-emerald-600', dynamicColor: themeColor },
                            { bg: 'bg-blue-50 dark:bg-blue-500/10', color: 'text-blue-600' },
                            { bg: 'bg-orange-50 dark:bg-orange-500/10', color: 'text-orange-600' },
                            { bg: 'bg-purple-50 dark:bg-purple-500/10', color: 'text-purple-600' },
                        ];
                        const c = colors[idx % colors.length];
                        return (
                            <div key={idx} className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-100 dark:border-white/5 hover:shadow-xl transition-all group overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-150 transition-transform duration-700">
                                    <stat.icon size={60} />
                                </div>
                                <div className="flex items-center justify-between mb-4 relative z-10">
                                    <div
                                        className={`p-2.5 rounded-2xl ${c.bg} ${c.color}`}
                                        style={c.dynamicColor ? { backgroundColor: `${c.dynamicColor}15`, color: c.dynamicColor } : {}}
                                    >
                                        <stat.icon size={18} strokeWidth={1.75} />
                                    </div>
                                    <TrendingUp size={13} strokeWidth={1.75} className="text-emerald-400" style={c.dynamicColor ? { color: c.dynamicColor } : {}} />
                                </div>
                                <div className="relative z-10">
                                    <p className="text-2xl font-black text-gray-900 dark:text-white tabular-nums tracking-tight">{stat.value}</p>
                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest mt-0.5">{stat.label}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ── Charts Section ── */}
                <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
                    <div className="xl:col-span-3 bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <BarChart3 size={18} strokeWidth={2.5} style={{ color: roleColor }} />
                                    Resumen Semanal de Recolección
                                </h3>
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest mt-1 ml-7">Kilogramos de material por día</p>
                            </div>
                        </div>
                        <div className="h-44 flex items-end justify-between gap-3 px-2">
                            {[40, 60, 45, 70, 85, 55, 65].map((h, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-3 group/bar">
                                    <div className="w-full relative rounded-2xl overflow-hidden cursor-pointer" style={{ height: '160px', background: 'rgba(0,0,0,0.02)' }}>
                                        <div
                                            className="absolute bottom-0 w-full rounded-2xl transition-all duration-700 ease-out group-hover/bar:brightness-110"
                                            style={{ height: `${h}%`, background: `linear-gradient(to top, ${themeColor}, ${themeColor}dd)` }}
                                        />
                                        <div className="absolute inset-x-0 bottom-0 top-0 bg-white/20 opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none" />
                                    </div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{['L', 'M', 'X', 'J', 'V', 'S', 'D'][i]}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="xl:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden flex flex-col">
                        <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                            <Bell size={18} strokeWidth={2.5} style={{ color: roleColor }} />
                            Actividad Reciente
                        </h3>
                        <div className="space-y-4 flex-1">
                            {[
                                { title: 'Nueva solicitud', desc: 'Socio "EcoModa" envió propuesta', time: 'hace 5 min', icon: Mail, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
                                { title: 'Retiro completado', desc: 'Canje de puntos "Bolsa Reutilizable"', time: 'hace 12 min', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', dynamicColor: themeColor },
                                { title: 'Nueva EcoHistoria', desc: 'Usuario "JPerez" publicó testimonio', time: 'hace 1 hora', icon: MessageSquare, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' },
                            ].map((act, i) => (
                                <div key={i} className="flex gap-4 group cursor-default">
                                    <div
                                        className={`w-10 h-10 rounded-2xl ${act.bg} ${act.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
                                        style={act.dynamicColor ? { backgroundColor: `${act.dynamicColor}15`, color: act.dynamicColor } : {}}
                                    >
                                        <act.icon size={18} strokeWidth={2.5} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{act.title}</p>
                                        <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate mt-0.5">{act.desc}</p>
                                        <p className="text-[9px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest mt-1">{act.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen flex font-sans transition-all duration-500 relative bg-slate-50 dark:bg-slate-950">
            {/* Overlay para móvil */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden animate-fade-in"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <AdminSidebar
                t={t}
                requestsCount={requests.filter(r => r.statusKey === 'pending').length}
                onLogout={handleLogout}
                user={user}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                themeColor={themeColor}
            />

            <main className={`flex-1 md:ml-64 min-h-screen transition-all duration-300 relative z-10`}>
                <AdminHeader
                    t={t}
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                    setIsSidebarOpen={setIsSidebarOpen}
                    isSidebarOpen={isSidebarOpen}
                    themeColor={themeColor}
                />
                <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto">
                    <Routes>
                        <Route path="/" element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<DashboardHome />} />

                        {user?.role?.toUpperCase() === 'ADMIN' && (
                            <>
                                <Route path="users" element={<div className="animate-fade-in"><UsersTable t={t} themeColor={themeColor} /></div>} />
                                <Route path="gestores" element={<div className="animate-fade-in"><GestoresManagementView t={t} themeColor={themeColor} /></div>} />
                                <Route path="requests" element={<div className="animate-fade-in"><RequestsList requests={requests} t={t} onStatusChange={handleStatusChange} themeColor={themeColor} /></div>} />
                                <Route path="contact-requests" element={<div className="animate-fade-in"><ContactRequests themeColor={themeColor} /></div>} />
                                <Route path="donations" element={<div className="animate-fade-in"><DonationsTable t={t} themeColor={themeColor} /></div>} />
                                <Route path="rewards" element={
                                    <div className="animate-fade-in">
                                        <RewardsList t={t} onAdd={() => setIsRewardModalOpen(true)} themeColor={themeColor} />
                                        <RewardFormModal
                                            isOpen={isRewardModalOpen}
                                            onClose={() => setIsRewardModalOpen(false)}
                                            t={t}
                                            themeColor={themeColor}
                                        />
                                    </div>
                                } />
                                <Route path="partners/list" element={<div className="animate-fade-in"><PartnersList t={t} themeColor={themeColor} /></div>} />
                                <Route path="partners/requests" element={<div className="animate-fade-in"><PartnerRequestsTable t={t} themeColor={themeColor} /></div>} />
                                <Route path="histories" element={<div className="animate-fade-in"><EcoHistoriesTable t={t} themeColor={themeColor} /></div>} />
                            </>
                        )}
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
                                themeColor={themeColor}
                                setThemeColor={setThemeColor}
                            />
                        } />

                        <Route path="programs/:id" element={<div className="animate-fade-in"><ProgramManagementView t={t} themeColor={themeColor} /></div>} />
                        <Route path="programs" element={<div className="animate-fade-in"><ProgramsList t={t} themeColor={themeColor} /></div>} />
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
