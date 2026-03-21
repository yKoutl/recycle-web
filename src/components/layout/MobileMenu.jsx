import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Sun, Moon, Languages, LogOut, ShieldCheck, UserRound, LogIn, Loader2 } from 'lucide-react';
import Button from '../shared/Button';

const MobileMenu = ({
    isOpen,
    onClose,
    navLinks,
    scrollToSection,
    isAuthenticated,
    user,
    onLogout,
    handleLoginClick,
    isProcessingAction,
    darkMode,
    setDarkMode,
    lang,
    setLang,
    t,
    logoNosPlanet
}) => {
    // Body Scroll Lock
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Add iOS padding fix if needed
            document.body.style.touchAction = 'none';
        } else {
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] xl:hidden isolate">
                    {/* Glass Overlay with heavy blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gray-950/40 backdrop-blur-md"
                        onClick={onClose}
                    />

                    {/* Side Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
                        className="absolute right-0 top-0 bottom-0 w-full max-w-[320px] bg-white dark:bg-gray-950 shadow-[-20px_0_50px_-10px_rgba(0,0,0,0.2)] flex flex-col border-l border-white/10"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center px-6 py-8 border-b border-gray-100 dark:border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-2xl bg-white shadow-2xl flex items-center justify-center p-2">
                                    <img src={logoNosPlanet} alt="Logo" className="w-full h-full object-contain" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xl font-black dark:text-white tracking-tighter leading-none italic">
                                        Recycle<span className="text-emerald-500 not-italic">App</span>
                                    </span>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1 italic">Nos Planet</span>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center dark:text-white shadow-sm active:scale-90 transition-transform"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Navigation Links (Scrollable) */}
                        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2 custom-scrollbar">
                            {navLinks.map((link, idx) => (
                                <motion.button
                                    key={link.id}
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 + idx * 0.05 }}
                                    onClick={() => {
                                        scrollToSection(link.id);
                                        onClose();
                                    }}
                                    className="w-full flex items-center justify-between p-4 rounded-[1.75rem] transition-all hover:bg-emerald-50 dark:hover:bg-emerald-900/10 group active:scale-95"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 shadow-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 group-hover:rotate-6 transition-all">
                                            <link.icon size={22} />
                                        </div>
                                        <span className="font-extrabold text-[1.1rem] text-gray-900 dark:text-white tracking-tight">{link.name}</span>
                                    </div>
                                    <ChevronRight size={20} className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
                                </motion.button>
                            ))}
                        </div>

                        {/* Footer (Theme & Session) */}
                        <div className="p-6 bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-white/5 space-y-6">
                            {/* Toggles */}
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setDarkMode(!darkMode)}
                                    className="flex items-center justify-center gap-3 p-4 rounded-3xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-white/5 active:scale-95 transition-all text-gray-700 dark:text-gray-300"
                                >
                                    <div className={`p-2 rounded-xl ${darkMode ? 'bg-amber-500/10' : 'bg-blue-500/10'}`}>
                                        {darkMode ? <Sun size={20} className="text-amber-500" /> : <Moon size={20} className="text-blue-500" />}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">{darkMode ? 'Luz' : 'Noche'}</span>
                                </button>
                                <button
                                    onClick={() => {
                                        const newLang = lang === 'es' ? 'en' : 'es';
                                        setLang(newLang);
                                        try { localStorage.setItem('app_lang', newLang); } catch (e) { }
                                        document.documentElement.lang = newLang;
                                    }}
                                    className="flex items-center justify-center gap-3 p-4 rounded-3xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-white/5 active:scale-95 transition-all text-gray-700 dark:text-gray-300"
                                >
                                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                                        <Languages size={20} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">{lang === 'es' ? 'English' : 'Spanish'}</span>
                                </button>
                            </div>

                            {/* Authentication Section */}
                            {isAuthenticated ? (
                                <div className="space-y-4">
                                    <motion.button
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => { handleLoginClick(); onClose(); }}
                                        className={`w-full relative flex items-center gap-5 p-5 rounded-[2.5rem] border shadow-2xl overflow-hidden group
                                        ${user?.role?.toUpperCase() === 'ADMIN' ? 'bg-red-600 border-red-500 shadow-red-500/40 text-white' :
                                                user?.role?.toUpperCase() === 'MANAGER' ? 'bg-emerald-600 border-emerald-500 shadow-emerald-500/40 text-white' :
                                                    user?.role?.toUpperCase() === 'COORDINATOR' ? 'bg-blue-600 border-blue-500 shadow-blue-500/40 text-white' :
                                                        'bg-emerald-700 border-emerald-500 shadow-emerald-500/40 text-white'}`}
                                    >
                                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="w-14 h-14 rounded-2xl bg-white shadow-xl flex items-center justify-center shrink-0">
                                            <div style={{ color: user?.role?.toUpperCase() === 'ADMIN' ? '#dc2626' : '#10B981' }}>
                                                {user?.role?.toUpperCase() === 'ADMIN' ? <ShieldCheck size={28} strokeWidth={2.5} /> : <UserRound size={28} strokeWidth={2.5} />}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-start leading-none gap-2">
                                            <span className="text-[1.1rem] font-black italic tracking-tighter">
                                                Hola, {user?.fullName?.split(' ')[0] || 'Admin'}
                                            </span>
                                            <div className="flex items-center gap-3">
                                                <div className="w-5 h-[1.5px] bg-white/30" />
                                                <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-80 italic">
                                                    {user?.role?.toUpperCase() === 'ADMIN' ? 'ADMINISTRADOR' :
                                                        user?.role?.toUpperCase() === 'MANAGER' ? 'GESTOR' : 'COORDINADOR'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="ml-auto w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                            <ChevronRight size={18} />
                                        </div>
                                    </motion.button>

                                    <button
                                        onClick={() => { onLogout(); onClose(); }}
                                        className="w-full h-14 rounded-[1.75rem] text-red-500 font-bold uppercase text-[10px] tracking-[0.4em] border border-red-500/20 active:bg-red-500 active:text-white transition-all shadow-sm flex items-center justify-center gap-3"
                                    >
                                        <LogOut size={16} /> CERRAR SESIÓN
                                    </button>
                                </div>
                            ) : (
                                <Button
                                    onClick={() => { handleLoginClick(); onClose(); }}
                                    className="w-full h-16 rounded-[2rem] text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-emerald-500/20 bg-[#018F64] text-white"
                                    icon={LogIn}
                                >
                                    {t.nav.login}
                                </Button>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default MobileMenu;
