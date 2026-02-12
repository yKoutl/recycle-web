import React, { useState, useEffect } from 'react';
import { BarChart3, Bell, User, FileText, TrendingUp, Calendar, Zap, Target } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import UsersTable from '../UsersTable';
import RequestsList from '../RequestsList';
import RewardsList from '../rewards/reward-actions';
import RewardFormModal from '../rewards/reward-modal';
import ProgramsList from '../programs/program-actions';
import PartnersList from '../partners/partners-actions';
import { MOCK_REQUESTS, MOCK_STATS } from '../../../data/mockData';
import { useDispatch, useSelector } from 'react-redux';
import { onLogout } from '../../../store/auth/authSlice';


import StatusModal from '../../../components/shared/StatusModal';


const AdminView = ({ t, darkMode, setDarkMode }) => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [requests, setRequests] = useState([]);
    const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);


    const handleLogout = () => {
        setShowLogoutModal(true);
        // Pequeño delay para mostrar el logo de cargando como pidió el usuario
        setTimeout(() => {
            dispatch(onLogout());
        }, 2000);
    };

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
                return (
                    <div className="animate-fade-in">
                        <UsersTable t={t} />
                    </div>
                );
            case 'requests':
                return (
                    <div className="animate-fade-in">
                        <RequestsList requests={requests} t={t} onStatusChange={handleStatusChange} />
                    </div>
                );
            case 'rewards':
                return (
                    <div className="animate-fade-in">
                        <RewardsList onOpenModal={() => setIsRewardModalOpen(true)} />
                    </div>
                );
            case 'programs':
                return (
                    <div className="animate-fade-in">
                        <ProgramsList />
                    </div>
                );
            case 'partners':
                return (
                    <div className="animate-fade-in">
                        <PartnersList />
                    </div>
                );
            case 'settings':
                return (
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm animate-fade-in">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-tight italic">Configuración del Sistema</h2>
                        <div className="space-y-6 max-w-2xl">
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-white uppercase text-xs tracking-widest">Tema del Sistema</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Alternar entre modo claro y oscuro para el panel administrativo.</p>
                                </div>
                                <button
                                    onClick={() => setDarkMode(!darkMode)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${darkMode ? 'bg-green-600' : 'bg-gray-300'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>

                            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 opacity-50 cursor-not-allowed">
                                <p className="font-bold text-gray-800 dark:text-white uppercase text-xs tracking-widest">Notificaciones</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configurar alertas para nuevas solicitudes de reciclaje.</p>
                            </div>
                        </div>
                    </div>
                );

            default: // Dashboard
                return (
                    <div className="space-y-12 animate-fade-in relative z-10">
                        {/* Header with Welcome */}
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="space-y-1">
                                <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight uppercase italic leading-none">
                                    {t.admin.welcome} <span className="text-[#018F64]">{user?.fullName || user?.name || user?.username || 'Administrador'}</span>
                                </h2>
                                <p className="text-gray-400 dark:text-gray-500 font-medium text-sm">
                                    {t.admin.welcomeSub} • <span className="text-[#018F64] font-bold">{new Date().toLocaleDateString()}</span>
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

                        {/* Bottom Charts/Activity */}
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
                                    <select className="text-[10px] font-black uppercase tracking-widest border border-gray-100 dark:border-white/5 rounded-2xl text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/5 px-6 py-3 outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors shadow-sm">
                                        <option>Últimos 7 días</option>
                                        <option>Último mes</option>
                                    </select>
                                </div>

                                <div className="h-64 flex items-end justify-between gap-6 px-4">
                                    {[40, 60, 45, 70, 85, 55, 65].map((h, i) => (
                                        <div key={i} className="flex-1 bg-gray-100/50 dark:bg-white/5 rounded-3xl relative group h-full transition-all hover:bg-gray-100 dark:hover:bg-white/10">
                                            <div
                                                className="absolute bottom-0 w-full bg-gradient-to-t from-[#018F64] to-emerald-400 rounded-3xl transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1) shadow-xl shadow-[#018F64]/20 group-hover:brightness-110"
                                                style={{ height: `${h}%` }}
                                            >
                                                <div className="absolute inset-x-0 top-0 h-1/4 bg-white/20 rounded-t-3xl blur-[1px] opacity-40 mx-2 mt-2" />
                                            </div>

                                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-2xl shadow-2xl scale-90 group-hover:scale-100 z-20 whitespace-nowrap border-4 border-white dark:border-gray-900">
                                                {h * 10} KG
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between text-[10px] text-gray-400 font-black uppercase tracking-[0.25em] mt-10 px-4 opacity-70 italic font-medium">
                                    <span>LUN</span><span>MAR</span><span>MIÉ</span><span>JUE</span><span>VIE</span><span>SÁB</span><span>DOM</span>
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
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] ml-11">Últimos movimientos</p>
                                    </div>
                                    <button className="text-[#018F64] text-[10px] font-black uppercase tracking-widest hover:underline decoration-4 underline-offset-8 transition-all">{t.admin.seeAll}</button>
                                </div>

                                <div className="space-y-6">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="flex gap-6 items-center p-4 rounded-3xl hover:bg-white dark:hover:bg-white/5 transition-all duration-300 group cursor-pointer border border-transparent hover:border-gray-100 dark:hover:border-white/10">
                                            <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-[#018F64] border border-gray-100 dark:border-white/10 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shrink-0">
                                                <User size={24} strokeWidth={2.5} />
                                            </div>
                                            <div className="flex-1 space-y-1.5">
                                                <p className="text-gray-800 dark:text-gray-200 text-sm font-black leading-tight tracking-tight">
                                                    Nuevo socio registrado: <span className="text-[#018F64] italic uppercase">Solar S.A.</span>
                                                </p>
                                                <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 opacity-60">
                                                    Hace 2 horas <span className="w-1.5 h-1.5 bg-[#018F64] rounded-full"></span> Gestión Humana
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="flex gap-6 items-center p-4 rounded-3xl hover:bg-white dark:hover:bg-white/5 transition-all duration-300 group cursor-pointer border border-transparent hover:border-gray-100 dark:hover:border-white/10">
                                        <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-orange-500 border border-gray-100 dark:border-white/10 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shrink-0">
                                            <FileText size={24} strokeWidth={2.5} />
                                        </div>
                                        <div className="flex-1 space-y-1.5">
                                            <p className="text-gray-800 dark:text-gray-200 text-sm font-black leading-tight tracking-tight">
                                                Reporte mensual <span className="text-orange-500 italic uppercase">Optimizado</span>
                                            </p>
                                            <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 opacity-60">
                                                Hace 5 horas <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span> Sistema Core
                                            </span>
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
        <div className="min-h-screen bg-[#FAFCF9] dark:bg-gray-950 flex font-sans transition-all duration-500 relative">
            {/* Background elements removed for clean look */}

            <AdminSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                t={t}
                requestsCount={requests.filter(r => r.statusKey === 'pending').length}
                onLogout={handleLogout}
            />

            <main className="flex-1 md:ml-72 min-h-screen transition-all duration-500 relative z-10">
                <AdminHeader
                    t={t}
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                />
                <div className="p-6 md:p-12 max-w-[1400px] mx-auto transition-all duration-500">
                    {renderContent()}
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
