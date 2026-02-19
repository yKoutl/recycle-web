import React from 'react';
import logoNosPlanet from '../../../assets/Logo Nos Planet.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { LayoutDashboard, Users, FileText, LogOut, Gift, MapPin, Users2, ChevronDown, Bell } from 'lucide-react';

const AdminSidebar = ({ t, requestsCount, onLogout, user }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [openMenu, setOpenMenu] = useState('partners'); // Default open or closed

    // Determinar la pestaña activa basada en la URL (soporta subrutas)
    const activeTab = location.pathname.split('/')[2] || 'dashboard';
    const activeSubTab = location.pathname.split('/')[3];

    const navItemClasses = (id, isSubItem = false) => `
        w-full flex items-center gap-3 px-4 py-3.5 
        rounded-2xl text-[11px] font-black uppercase tracking-widest 
        transition-all duration-300 transform active:scale-95
        ${(activeTab === id && !isSubItem) || (isSubItem && activeSubTab === id)
            ? 'bg-[#018F64] text-white shadow-lg shadow-[#018F64]/30'
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
        }
    `;

    const handleNavigate = (path) => {
        navigate(`/admin/${path}`);
    };

    const toggleMenu = (menu) => {
        setOpenMenu(openMenu === menu ? null : menu);
    };

    // ... (rest of render)


    return (
        <aside className="w-72 bg-white/90 dark:bg-gray-950/90 backdrop-blur-2xl border-r border-gray-100 dark:border-white/5 hidden md:flex flex-col fixed h-full z-20 transition-all duration-500">
            <div className="p-8 border-b border-gray-50 dark:border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: `linear-gradient(#018F64 1px, transparent 1px), linear-gradient(90deg, #018F64 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />

                <div className="flex items-center gap-3 relative z-10 transition-transform hover:scale-105 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="p-2 rounded-xl shadow-xl bg-white dark:bg-white/10 border border-gray-100 dark:border-white/10">
                        <img src={logoNosPlanet} alt="Logo" className="w-6 h-6 object-contain" />
                    </div>
                    <span className="text-xl font-black uppercase tracking-tighter italic text-gray-900 dark:text-white leading-none">
                        Nos<span className="text-[#018F64]">Planet</span>
                    </span>
                </div>
            </div>

            <div className="flex-1 py-10 px-6 space-y-6 overflow-y-auto">
                <div className="space-y-2">
                    <div className="text-[10px] font-black text-[#018F64] uppercase tracking-[0.2em] px-4 mb-4 opacity-70 italic">{t.admin.menu.main}</div>
                    <button onClick={() => handleNavigate('dashboard')} className={navItemClasses('dashboard')}>
                        <LayoutDashboard size={18} className={activeTab === 'dashboard' ? 'animate-pulse' : ''} /> {t.admin.menu.dashboard}
                    </button>
                </div>

                <div className="space-y-2">
                    <div className="text-[10px] font-black text-[#018F64] uppercase tracking-[0.2em] px-4 mb-4 opacity-70 italic">{t.admin.menu.management}</div>

                    {(user?.role?.toUpperCase() === 'ADMIN') && (
                        <button onClick={() => handleNavigate('users')} className={navItemClasses('users')}>
                            <Users size={18} /> {t.admin.menu.users}
                        </button>
                    )}

                    {(user?.role?.toUpperCase() === 'ADMIN') && (
                        <>
                            <button onClick={() => handleNavigate('requests')} className={navItemClasses('requests')}>
                                <FileText size={18} />
                                {t.admin.menu.requests}
                                {requestsCount > 0 && (
                                    <span className={`ml-auto text-[10px] py-0.5 px-2 rounded-lg font-black ${activeTab === 'requests' ? 'bg-white/20 text-white' : 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'}`}>
                                        {requestsCount}
                                    </span>
                                )}
                            </button>
                            <button onClick={() => handleNavigate('rewards')} className={navItemClasses('rewards')}>
                                <Gift size={18} /> Premios
                            </button>
                            <button onClick={() => handleNavigate('histories')} className={navItemClasses('histories')}>
                                <FileText size={18} /> Eco Historias
                            </button>
                        </>
                    )}

                    <button onClick={() => handleNavigate('programs')} className={navItemClasses('programs')}>
                        <MapPin size={18} /> Programas
                    </button>

                    {(user?.role?.toUpperCase() === 'ADMIN') && (
                        <div className="space-y-1">
                            <button
                                onClick={() => toggleMenu('partners')}
                                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 hover:bg-gray-50 dark:hover:bg-white/5 ${activeTab === 'partners' ? 'text-[#018F64]' : 'text-gray-500'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <Users2 size={18} />
                                    Gestión de Socios
                                </div>
                                <ChevronDown size={14} className={`transition-transform duration-300 ${openMenu === 'partners' ? 'rotate-180' : ''}`} />
                            </button>

                            <div className={`space-y-1 pkg-2 overflow-hidden transition-all duration-300 ${openMenu === 'partners' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <button onClick={() => handleNavigate('partners/requests')} className={navItemClasses('requests', true) + " pl-11"}>
                                    <Bell size={14} /> Solicitudes
                                </button>
                                <button onClick={() => handleNavigate('partners/list')} className={navItemClasses('list', true) + " pl-11"}>
                                    <Users2 size={14} /> Lista de Socios
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {(user?.role?.toUpperCase() === 'ADMIN') && (
                    <div className="space-y-2">
                        <div className="text-[10px] font-black text-[#018F64] uppercase tracking-[0.2em] px-4 mb-4 opacity-70 italic">Ajustes</div>
                        <button onClick={() => handleNavigate('settings')} className={navItemClasses('settings')}>
                            <LayoutDashboard size={18} className="rotate-90" /> Configuración
                        </button>
                    </div>
                )}
            </div>

            <div className="p-6 mt-auto">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center justify-center gap-3 px-4 py-4 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 border border-transparent hover:border-red-100 dark:hover:border-red-500/20 shadow-sm hover:shadow-red-500/10"
                >
                    <LogOut size={18} /> {t.nav.logout}
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
