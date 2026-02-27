import { Bell, Moon, Sun, Menu, X, Leaf, Check } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminHeader = ({ t, darkMode, setDarkMode, setIsSidebarOpen, isSidebarOpen, themeColor }) => {
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
    const accent = themeColor || '#018F64';
    const [showNotifications, setShowNotifications] = useState(false);

    const iconBtn = `p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-95 cursor-pointer flex items-center justify-center`;

    return (
        <>
            {/* ── Mobile Header ── */}
            <header
                className="h-20 flex items-center justify-between px-6 sticky top-0 z-40 md:hidden border-b shadow-2xl"
                style={{
                    background: 'linear-gradient(to bottom, #0f172a, #0b1121)',
                    borderColor: 'rgba(255,255,255,0.08)'
                }}
            >
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className={iconBtn}
                        aria-label="Toggle Menu"
                    >
                        {isSidebarOpen ? <X size={26} strokeWidth={2} /> : <Menu size={26} strokeWidth={2} />}
                    </button>
                    <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => navigate('/')}>
                        <div
                            className="p-1.5 rounded-lg transition-transform group-hover:rotate-12"
                            style={{ backgroundColor: `${accent}20` }}
                        >
                            <Leaf size={18} style={{ color: accent }} strokeWidth={2.5} />
                        </div>
                        <span className="text-base font-black text-white italic tracking-wider">
                            NosPlanet
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <button
                            className={`relative ${iconBtn}`}
                            onClick={() => setShowNotifications(!showNotifications)}
                        >
                            <Bell size={24} strokeWidth={2} />
                            <span
                                className="absolute top-2 right-2 w-2 h-2 rounded-full ring-2 ring-[#0f172a] animate-pulse"
                                style={{ backgroundColor: accent }}
                            />
                        </button>
                        <AnimatePresence>
                            {showNotifications && (
                                <>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="fixed inset-0 z-40"
                                        onClick={() => setShowNotifications(false)}
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="fixed top-24 inset-x-4 bg-slate-900/98 backdrop-blur-3xl border border-white/20 rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)] z-50 overflow-hidden"
                                    >
                                        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-white/[0.03]">
                                            <h3 className="text-white font-black text-[10px] uppercase tracking-[0.2em]">Notificaciones</h3>
                                            <span
                                                className="text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest bg-white/10 text-white"
                                            >
                                                0 NUEVAS
                                            </span>
                                        </div>
                                        <div className="p-12 flex flex-col items-center justify-center text-center">
                                            <div className="w-20 h-20 bg-white/[0.05] rounded-full flex items-center justify-center mb-6 ring-1 ring-white/10 relative">
                                                <div className="absolute inset-0 rounded-full blur-xl opacity-20" style={{ backgroundColor: accent }} />
                                                <Bell size={28} className="text-white opacity-40 relative z-10" />
                                            </div>
                                            <p className="text-white font-bold text-base">Todo despejado</p>
                                            <p className="text-slate-400 text-xs mt-2 font-medium leading-relaxed opacity-80">No hay alertas pendientes en tu bandeja.</p>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setDarkMode(!darkMode);
                        }}
                        className={iconBtn}
                        title={darkMode ? 'Modo Claro' : 'Modo Oscuro'}
                    >
                        {darkMode ? <Sun size={22} strokeWidth={2} /> : <Moon size={22} strokeWidth={2} />}
                    </button>
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg"
                        style={{ background: `linear-gradient(135deg, ${accent}, ${accent}bb)`, boxShadow: `0 4px 12px ${accent}40` }}
                    >
                        {(user?.fullName?.[0] || 'A').toUpperCase()}
                    </div>
                </div>
            </header>

            {/* ── Desktop Header ── */}
            <div
                className="hidden md:flex justify-end items-center px-10 h-24 sticky top-0 z-40 border-b"
                style={{
                    background: '#1e293b',
                    borderColor: 'rgba(255,255,255,0.1)',
                }}
            >
                <div className="flex items-center gap-5">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setDarkMode(!darkMode);
                        }}
                        className={iconBtn}
                        title={darkMode ? 'Modo Claro' : 'Modo Oscuro'}
                    >
                        {darkMode ? <Sun size={26} strokeWidth={2} /> : <Moon size={26} strokeWidth={2} />}
                    </button>

                    <div className="relative">
                        <button
                            className={`relative ${iconBtn}`}
                            onClick={() => setShowNotifications(!showNotifications)}
                        >
                            <Bell size={26} strokeWidth={2} />
                            <span
                                className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full ring-2 ring-[#1e293b] animate-pulse"
                                style={{ backgroundColor: accent }}
                            />
                        </button>

                        <AnimatePresence>
                            {showNotifications && (
                                <>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="fixed inset-0 z-40"
                                        onClick={() => setShowNotifications(false)}
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, y: -20, scale: 0.95, transformOrigin: 'top right' }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                        className="absolute right-0 mt-6 w-80 bg-slate-900/95 backdrop-blur-3xl border border-white/20 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] z-50 overflow-hidden"
                                    >
                                        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-white/[0.04]">
                                            <h3 className="text-white font-black text-[10px] uppercase tracking-[0.2em]">Centro de Alertas</h3>
                                            <span
                                                className="text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest ring-1 ring-white/20 text-white"
                                            >
                                                0 NUEVAS
                                            </span>
                                        </div>
                                        <div className="p-14 flex flex-col items-center justify-center text-center">
                                            <div className="w-24 h-24 bg-white/[0.04] rounded-[2rem] flex items-center justify-center mb-8 ring-1 ring-white/10 relative -rotate-3 group-hover:rotate-0 transition-transform">
                                                <div className="absolute inset-x-0 bottom-0 h-1/2 rounded-full blur-2xl opacity-20" style={{ backgroundColor: accent }} />
                                                <Bell size={36} className="text-white opacity-40 relative z-10" />
                                            </div>
                                            <p className="text-white font-bold text-lg tracking-tight">¡Todo en orden!</p>
                                            <p className="text-slate-400 text-xs mt-3 leading-relaxed font-medium opacity-70">No tienes alertas pendientes en este momento. ¡Sigue así!</p>
                                        </div>
                                        <button className="w-full p-5 bg-white/[0.03] hover:bg-white/[0.08] text-white/50 text-[9px] font-black uppercase tracking-[0.3em] transition-all border-t border-white/10 hover:text-white">
                                            Historial de actividad
                                        </button>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="w-px h-8 bg-white/10 mx-4" />

                    <div className="flex items-center gap-2.5 cursor-pointer group pl-1">
                        <div className="text-right">
                            <div className="text-sm font-semibold text-white truncate max-w-[160px]">
                                {user?.fullName || 'Admin'}
                            </div>
                            <div className="text-[10px] font-medium mt-0.5 truncate text-slate-400">
                                {user?.role?.toUpperCase() === 'ADMIN' ? 'Administrador' : `Gestor · ${user?.institution || ''}`}
                            </div>
                        </div>
                        <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 transition-transform group-hover:scale-105 shadow-lg"
                            style={{ background: `linear-gradient(135deg, ${accent}, ${accent}bb)`, boxShadow: `0 4px 12px ${accent}40` }}
                        >
                            {(user?.fullName?.[0] || 'A').toUpperCase()}
                            {(user?.fullName?.split(' ')[1]?.[0] || '').toUpperCase()}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminHeader;
