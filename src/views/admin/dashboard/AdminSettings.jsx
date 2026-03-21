import React from 'react';
import {
    Moon, Sun, Globe, Bell, Shield, User,
    Smartphone, Mail, Lock, Bot, Settings,
    Palette, Check, Languages, MessageSquare,
    Sparkles, ShieldCheck, Laptop, BellRing,
    ChevronRight, Fingerprint, Zap, Activity, Loader2, CheckCircle2, XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForgotPasswordMutation } from '../../../store/auth/authApi';

const AdminSettings = ({ t, darkMode, setDarkMode, lang, setLang, user, showBot, setShowBot, themeColor, setThemeColor }) => {
    const [forgotPassword, { isLoading: isSendingReset }] = useForgotPasswordMutation();
    const [resetModal, setResetModal] = React.useState({
        open: false,
        type: 'success',
        title: '',
        message: ''
    });

    const themes = [
        { id: 'forest', name: 'Esmeralda', color: '#018F64', glow: 'rgba(1, 143, 100, 0.4)', desc: 'Frecuencia Ecológica' },
        { id: 'earth', name: 'Carmesí', color: '#FF3B3B', glow: 'rgba(255, 59, 59, 0.4)', desc: 'Alerta Global' },
        { id: 'sunset', name: 'Ámbar', color: '#f97316', glow: 'rgba(249, 115, 22, 0.4)', desc: 'Resiliencia' },
        { id: 'ocean', name: 'Zafiro', color: '#2563eb', glow: 'rgba(37, 99, 235, 0.4)', desc: 'Profundidad' },
        { id: 'purple', name: 'Púrpura', color: '#6439FF', glow: 'rgba(100, 57, 255, 0.4)', desc: 'Coordinación' }
    ];

    const accent = themeColor || '#018F64';

    const handleSendResetAccess = async () => {
        const email = user?.email;

        if (!email) {
            setResetModal({
                open: true,
                type: 'error',
                title: 'Correo no disponible',
                message: 'No encontramos un correo asociado al usuario actual.'
            });
            return;
        }

        try {
            await forgotPassword(email).unwrap();
            setResetModal({
                open: true,
                type: 'success',
                title: 'Correo enviado',
                message: `Se envió el enlace de restablecimiento a ${email}.`
            });
        } catch (err) {
            setResetModal({
                open: true,
                type: 'error',
                title: 'No se pudo enviar',
                message: err?.data?.message || 'No pudimos enviar el correo de restablecimiento. Intenta nuevamente.'
            });
        }
    };

    return (
        <div className="space-y-10 animate-fade-in pb-24">
            {resetModal.open && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setResetModal((prev) => ({ ...prev, open: false }))} />
                    <div className="relative w-full max-w-md bg-white dark:bg-[#111827] rounded-[2rem] p-7 border border-gray-100 dark:border-white/10 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-200">
                        <div className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center ${resetModal.type === 'success' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                            {resetModal.type === 'success' ? (
                                <CheckCircle2 className="text-emerald-500" size={30} />
                            ) : (
                                <XCircle className="text-red-500" size={30} />
                            )}
                        </div>
                        <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">{resetModal.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{resetModal.message}</p>
                        <button
                            onClick={() => setResetModal((prev) => ({ ...prev, open: false }))}
                            className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 ${resetModal.type === 'success' ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-red-600 hover:bg-red-500 text-white'}`}
                        >
                            Aceptar
                        </button>
                    </div>
                </div>
            )}

            {/* ── Header de Configuración ── */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-6 border-b border-gray-100 dark:border-white/5 relative overflow-hidden">
                <div className="flex items-center gap-5 relative z-10 w-full md:w-auto text-center md:text-left flex-col md:flex-row">
                    <div className="relative group">
                        <div
                            className="absolute -inset-1.5 rounded-2xl blur-lg opacity-10 group-hover:opacity-20 transition duration-1000"
                            style={{ background: `linear-gradient(to right, ${accent}, ${accent}dd)` }}
                        ></div>
                        <div className="relative p-3.5 rounded-xl text-white shadow-lg bg-[#1a2234] border border-white/5 flex items-center justify-center">
                            <Bot size={22} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform duration-500" style={{ color: accent }} />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter uppercase flex items-center justify-center md:justify-start gap-2">
                            Configuración <span style={{ color: accent }}>PlanetBot</span>
                        </h2>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                            Ajustes del sistema y preferencias de {user?.role?.toUpperCase() === 'ADMIN' ? 'administrador' : 'gestor'}
                        </p>
                    </div>
                </div>
            </div>

            {/* ── 4-Grid Command Center ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* 1. APARIENCIA */}
                <div className="group relative bg-white dark:bg-[#0f172a] rounded-[2rem] p-6 border border-gray-100 dark:border-white/5 shadow-lg overflow-hidden flex flex-col">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 dark:bg-white/[0.01] rounded-bl-[60px] -z-0" />

                    <div className="relative z-10 flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-white/5 text-gray-400 group-hover:text-emerald-500 transition-all">
                                <Palette size={18} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-wider leading-tight">Apariencia</h3>
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Personaliza tu interfaz</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 space-y-8 flex-1">
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1 opacity-60">Colores del Tema</p>
                            <div className="grid grid-cols-4 gap-4">
                                {themes.map((theme) => (
                                    <button
                                        key={theme.id}
                                        onClick={() => setThemeColor(theme.color)}
                                        className="relative flex flex-col items-center gap-3 group/theme"
                                    >
                                        <div className="relative">
                                            <AnimatePresence>
                                                {accent === theme.color && (
                                                    <motion.div
                                                        layoutId="swatchGlow"
                                                        className="absolute -inset-2 rounded-xl border-2 z-0 opacity-20"
                                                        style={{ borderColor: theme.color, boxShadow: `0 0 10px ${theme.color}40` }}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 0.6, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 1.1 }}
                                                    />
                                                )}
                                            </AnimatePresence>
                                            <div
                                                className={`w-11 h-11 rounded-xl shadow-md transition-all duration-500 group-hover/theme:scale-105 flex items-center justify-center z-10 relative overflow-hidden`}
                                                style={{ background: `linear-gradient(135deg, ${theme.color}, ${theme.color}dd)` }}
                                            >
                                                {accent === theme.color && <Check size={18} className="text-white drop-shadow-md" strokeWidth={4} />}
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <p className={`text-[9px] font-black uppercase tracking-tight transition-colors ${accent === theme.color ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                                                {theme.name}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-gray-50/50 dark:bg-black/30 border border-transparent hover:border-gray-100 dark:hover:border-white/10 transition-all flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-11 h-11 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center shadow-sm" style={{ color: accent }}>
                                    {darkMode ? <Sun size={20} strokeWidth={2.5} /> : <Moon size={20} strokeWidth={2.5} />}
                                </div>
                                <div className="text-left">
                                    <p className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-tight">Modo Visual</p>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{darkMode ? 'Oscuro Activo' : 'Claro Activo'}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className={`w-14 h-8 rounded-full p-1.5 transition-all duration-700 flex items-center ${darkMode ? '' : 'bg-gray-200 dark:bg-gray-700'}`}
                                style={{ backgroundColor: darkMode ? accent : '' }}
                            >
                                <motion.div
                                    animate={{ x: darkMode ? 24 : 0 }}
                                    className="w-5 h-5 rounded-full bg-white shadow-md"
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. CONFIGURACIÓN DE SISTEMA */}
                <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] p-6 border border-gray-100 dark:border-white/5 shadow-lg flex flex-col group">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-white/5 text-gray-400 group-hover:text-blue-500 transition-all">
                            <Globe size={18} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h3 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-wider leading-tight">Configuración</h3>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Preferencias regionales</p>
                        </div>
                    </div>

                    <div className="space-y-4 flex-1">
                        <div className="p-4 rounded-2xl bg-gray-50/50 dark:bg-black/30 border border-transparent hover:border-blue-100 dark:hover:border-blue-900/40 transition-all flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-11 h-11 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center shadow-sm text-blue-500">
                                    <Languages size={20} />
                                </div>
                                <div>
                                    <p className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-tight">Idioma</p>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">{lang === 'es' ? 'Español' : 'English'}</p>
                                </div>
                            </div>
                            <button onClick={() => {
                                const newLang = lang === 'es' ? 'en' : 'es';
                                setLang(newLang);
                                try { localStorage.setItem('app_lang', newLang); } catch (e) { }
                                document.documentElement.lang = newLang;
                            }} className="px-4 py-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg text-[9px] font-black uppercase tracking-wider hover:bg-blue-600 hover:text-white transition-all">
                                Cambiar
                            </button>
                        </div>

                        <div className="p-4 rounded-2xl bg-gray-50/50 dark:bg-black/30 border border-transparent hover:border-emerald-100 dark:hover:border-emerald-900/40 transition-all flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-11 h-11 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center shadow-sm" style={{ color: accent }}>
                                    <BellRing size={20} />
                                </div>
                                <div>
                                    <p className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-tight">Notificaciones</p>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Sugerencias activas</p>
                                </div>
                            </div>
                            <div className="w-14 h-7 rounded-full p-1 flex items-center" style={{ backgroundColor: accent }}>
                                <div className="w-5 h-5 rounded-full bg-white shadow-md translate-x-7" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. PLANETBOT IA */}
                <div className="group relative bg-[#131a2b] rounded-[2rem] p-7 border border-white/5 shadow-xl overflow-hidden flex flex-col">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-accent/5 pointer-events-none" />

                    <div className="relative z-10 flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-white/5 text-purple-400/80 border border-white/10 transition-all duration-700">
                                <Sparkles size={18} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-white uppercase tracking-wider">PlanetBot IA</h3>
                                <p className="text-[9px] text-purple-400/70 font-black uppercase tracking-widest mt-1">Asistente Inteligente</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 flex-1 flex flex-col justify-between">
                        <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 mb-6 backdrop-blur-xl transition-all">
                            <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                                Operando para automatizar tus reportes y diagnosticar el estado del sistema.
                            </p>
                            <div className="mt-4 flex gap-1 items-end h-6">
                                {[4, 9, 5, 12, 7, 10, 6, 4, 8, 11].map((h, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: showBot ? h * 1.5 : 3 }}
                                        transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                                        className="flex-1 bg-purple-500/40 rounded-t-sm"
                                    />
                                ))}
                            </div>
                        </div>

                        <div className={`p-6 rounded-2xl transition-all duration-700 ${showBot ? 'bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-white/10' : 'bg-white/5 shadow-inner'}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-2xl flex items-center justify-center border border-white/10">
                                        <Bot size={24} className={`text-white transition-all duration-700 ${showBot ? 'opacity-80 drop-shadow-[0_0_5px_white]' : 'opacity-10'}`} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-0.5 leading-none">Estado</p>
                                        <p className="text-xl font-black text-white italic tracking-tighter leading-none">{showBot ? 'ACTIVO' : 'HIBERNANDO'}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowBot(!showBot)}
                                    className={`w-14 h-8 rounded-full p-1.5 transition-all duration-700 flex items-center ${showBot ? 'bg-white shadow-md' : 'bg-white/10 border border-white/5'}`}
                                >
                                    <motion.div
                                        animate={{ x: showBot ? 24 : 0 }}
                                        className={`w-5 h-5 rounded-full shadow-lg ${showBot ? 'bg-purple-900' : 'bg-white/20'}`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. SEGURIDAD */}
                <div className="group relative bg-white dark:bg-[#0f172a] rounded-[2rem] p-6 border border-gray-100 dark:border-white/5 shadow-lg flex flex-col">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-white/5 text-gray-400 group-hover:text-emerald-500 transition-all">
                            <ShieldCheck size={18} strokeWidth={2.5} style={{ color: accent }} />
                        </div>
                        <div>
                            <h3 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-wider leading-tight">Seguridad</h3>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Gestión de accesos</p>
                        </div>
                    </div>

                    <div className="space-y-6 flex-1">
                        <div className="p-6 rounded-2xl bg-gray-50/50 dark:bg-black/30 border border-transparent shadow-sm group/mail overflow-hidden relative">
                            <div className="flex items-center justify-between mb-2 color-gray-400">
                                <p className="text-[9px] font-black uppercase tracking-widest flex items-center gap-2" style={{ color: accent }}>
                                    <Mail size={12} strokeWidth={3} /> Correo de {user?.role?.toUpperCase() === 'ADMIN' ? 'Administrador' : 'Gestor'}
                                </p>
                            </div>
                            <p className="text-lg font-black text-gray-900 dark:text-white truncate tracking-tight leading-none">
                                {user?.email || 'admin@nosplanet.com'}
                            </p>
                        </div>

                        <button
                            onClick={handleSendResetAccess}
                            disabled={isSendingReset}
                            className="w-full group/btn relative overflow-hidden p-5 rounded-[1.5rem] bg-gray-50/50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 dark:hover:shadow-white/5 hover:-translate-y-1 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            {/* Glow Effect on Hover */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover/btn:opacity-10 transition-opacity duration-500"
                                style={{ background: `radial-gradient(circle at center, ${accent}, transparent 70%)` }}
                            />

                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 flex items-center justify-center shadow-sm border border-gray-100 dark:border-white/10 group-hover/btn:scale-110 transition-transform duration-500">
                                        <Lock size={20} strokeWidth={2.5} style={{ color: accent }} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight leading-none">Restablecer Acceso</p>
                                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1.5">Cambiar contraseña maestra</p>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 dark:text-white/20 transition-all group-hover/btn:bg-gray-900 dark:group-hover/btn:bg-white group-hover/btn:text-white dark:group-hover/btn:text-gray-900">
                                    {isSendingReset ? (
                                        <Loader2 size={18} strokeWidth={3} className="animate-spin" />
                                    ) : (
                                        <ChevronRight size={18} strokeWidth={3} />
                                    )}
                                </div>
                            </div>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminSettings;
