import React, { useState } from 'react';

import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutGrid, Leaf, MapPin,
    LogOut, Bell, UserPlus,
    Settings, Gift, FileText, ChevronDown, Users2, Users, Activity, CreditCard
} from 'lucide-react';
import { useGetProgramsQuery } from '../../../store/programs';

const AdminSidebar = ({ t, requestsCount, onLogout, user, isOpen, themeColor }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [partnersOpen, setPartnersOpen] = useState(false);
    const [programsOpen, setProgramsOpen] = useState(false);
    const { data: programs = [], isLoading: programsLoading } = useGetProgramsQuery();

    const activeTab = location.pathname.split('/')[2] || 'dashboard';
    const activeSubTab = location.pathname.split('/')[3];
    const accent = themeColor || '#018F64';
    const isAdmin = user?.role?.toUpperCase() === 'ADMIN';

    const isActive = (id, isSub = false) =>
        (!isSub && activeTab === id) || (isSub && activeSubTab === id);

    const go = (path) => navigate(`/admin/${path}`);

    const NavItem = ({ id, label, icon: Icon, badge, isSub = false, onClick: customOnClick }) => {
        const active = isActive(id, isSub);
        const handler = customOnClick || (() => go(id));

        return (
            <button
                onClick={handler}
                className={`
                    w-full flex items-center gap-3 rounded-xl
                    transition-all duration-150 text-left
                    ${isSub ? 'px-3 py-1.5 text-[13px] ml-2' : 'px-3 py-2.5 text-sm'}
                    ${active
                        ? 'text-white font-semibold'
                        : 'font-medium text-slate-400 hover:text-white hover:bg-white/5'
                    }
                `}
                style={active ? {
                    backgroundColor: `${accent}25`,
                    color: '#fff',
                    boxShadow: `inset 3px 0 0 ${accent}`,
                } : {}}
            >
                <Icon
                    size={isSub ? 15 : 17}
                    strokeWidth={active ? 2 : 1.75}
                    className="shrink-0"
                    style={active ? { color: accent } : {}}
                />
                <span className="flex-1">{label}</span>
                {badge > 0 && (
                    <span
                        className="min-w-[20px] h-5 flex items-center justify-center px-1.5 rounded-full text-[10px] font-bold text-white shadow-sm"
                        style={{ backgroundColor: accent, boxShadow: `0 0 10px ${accent}40` }}
                    >
                        {badge}
                    </span>
                )}
            </button>
        );
    };

    const SectionLabel = ({ children }) => (
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600 px-3 pt-5 pb-1.5 select-none">
            {children}
        </p>
    );

    return (
        <aside className={`
            w-64 flex flex-col fixed h-full z-50
            transition-transform duration-300
            ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
            style={{ background: '#0f172a' }}
        >
            {/* Logo Section */}
            <div className="h-28 flex flex-col items-center justify-center gap-2 shrink-0 border-b border-white/[0.06]">
                <div
                    className="w-14 h-14 rounded-full flex items-center justify-center ring-4 ring-white/5 transition-transform hover:scale-105"
                    style={{
                        background: `linear-gradient(135deg, ${accent}33, ${accent}11)`,
                        boxShadow: `0 0 20px -5px ${accent}40`
                    }}
                >
                    <Leaf size={32} style={{ color: accent }} strokeWidth={2.5} className="drop-shadow-sm" />
                </div>
                <span
                    className="text-sm font-black cursor-pointer tracking-[0.2em] uppercase italic"
                    style={{ color: accent }}
                    onClick={() => navigate('/')}
                >
                    NosPlanet
                </span>
            </div>

            {/* User card */}
            <div className="px-3 py-3 border-b border-white/[0.06] shrink-0">
                <div className="flex items-center gap-3 px-2 py-2.5 rounded-xl bg-white/[0.04]">
                    <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-lg"
                        style={{ background: `linear-gradient(135deg, ${accent}, ${accent}bb)`, boxShadow: `0 4px 12px ${accent}30` }}
                    >
                        {(user?.fullName?.[0] || 'U').toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                            {user?.fullName || 'Usuario'}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate font-medium">
                            {isAdmin ? 'Administrador' : 'Gestor Oficial'}
                        </p>
                    </div>
                    <div className="w-2 h-2 rounded-full shrink-0 animate-pulse" style={{ backgroundColor: accent, boxShadow: `0 0 8px ${accent}` }} />
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto no-scrollbar px-2 pb-4">

                <div className="mt-3">
                    <NavItem id="dashboard" label={isAdmin ? 'Panel General' : 'Mi Panel'} icon={LayoutGrid} />
                </div>

                <SectionLabel>Gestión</SectionLabel>

                {isAdmin && (
                    <>
                        <NavItem id="users" label="Usuarios" icon={Users} />
                        <NavItem id="gestores" label="Gestores" icon={UserPlus} />
                    </>
                )}

                {isAdmin && (
                    <NavItem
                        id="requests"
                        label="Solicitudes"
                        icon={FileText}
                        badge={requestsCount}
                    />
                )}

                {isAdmin && (
                    <NavItem
                        id="donations"
                        label={t.admin.menu.donations || 'Donaciones'}
                        icon={CreditCard}
                    />
                )}

                {/* Gestionar Programas Submenu - Visible for both roles */}
                <div>
                    <button
                        onClick={() => setProgramsOpen(!programsOpen)}
                        className={`
                            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                            text-sm font-medium transition-all duration-150
                            ${activeTab === 'programs'
                                ? 'text-white font-semibold'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }
                        `}
                        style={activeTab === 'programs' ? {
                            backgroundColor: `${accent}25`,
                            color: '#fff',
                            boxShadow: `inset 3px 0 0 ${accent}`,
                        } : {}}
                    >
                        <MapPin
                            size={17}
                            strokeWidth={activeTab === 'programs' ? 2 : 1.75}
                            className="shrink-0"
                            style={activeTab === 'programs' ? { color: accent } : {}}
                        />
                        <span className="flex-1 text-left">Gestionar Programas</span>
                        <ChevronDown
                            size={14}
                            className={`transition-transform duration-200 opacity-40 ${programsOpen ? 'rotate-180' : ''}`}
                        />
                    </button>

                    <div className={`overflow-hidden transition-all duration-300 ${programsOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
                        <div className="pl-3 mt-1 space-y-0.5 border-l border-white/[0.06] ml-[22px]">
                            <NavItem id="list" label="Programas" icon={LayoutGrid} isSub onClick={() => go('programs')} />
                            {programsLoading ? (
                                <div className="px-3 py-2 text-[10px] text-slate-500 animate-pulse uppercase tracking-widest font-black">Cargando...</div>
                            ) : (
                                programs.map(p => (
                                    <NavItem
                                        key={p._id}
                                        id={p._id}
                                        label={p.title}
                                        icon={MapPin}
                                        isSub
                                        onClick={() => go(`programs/${p._id}`)}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {isAdmin && (
                    <NavItem id="rewards" label="Premios" icon={Gift} />
                )}

                {isAdmin && (
                    <NavItem id="histories" label="Eco Historias" icon={Leaf} />
                )}

                {/* Socios submenu */}
                {isAdmin && (
                    <div>
                        <button
                            onClick={() => setPartnersOpen(!partnersOpen)}
                            className={`
                                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                                text-sm font-medium transition-all duration-150
                                ${activeTab === 'partners'
                                    ? 'text-white font-semibold'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }
                            `}
                            style={activeTab === 'partners' ? {
                                backgroundColor: `${accent}25`,
                                boxShadow: `inset 3px 0 0 ${accent}`,
                            } : {}}
                        >
                            <Users2 size={17} strokeWidth={1.75} className="shrink-0"
                                style={activeTab === 'partners' ? { color: accent } : {}} />
                            <span className="flex-1 text-left">Socios</span>
                            <ChevronDown
                                size={14}
                                className={`transition-transform duration-200 opacity-40 ${partnersOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        <div className={`overflow-hidden transition-all duration-200 ${partnersOpen ? 'max-h-24' : 'max-h-0'}`}>
                            <div className="pl-3 mt-0.5 space-y-0.5 border-l border-white/[0.06] ml-[22px]">
                                <NavItem id="requests" label="Solicitudes" icon={Bell} isSub onClick={() => go('partners/requests')} />
                                <NavItem id="list" label="Lista" icon={Users2} isSub onClick={() => go('partners/list')} />
                            </div>
                        </div>
                    </div>
                )}

                <SectionLabel>Sistema</SectionLabel>
                <NavItem id="settings" label="Configuración" icon={Settings} />
            </nav>

            {/* Logout */}
            <div className="px-3 pb-5 shrink-0">
                <div className="h-px bg-white/[0.06] mb-3 mx-1" />
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all font-bold"
                >
                    <LogOut size={17} strokeWidth={1.75} />
                    {t?.nav?.logout || 'Cerrar sesión'}
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
