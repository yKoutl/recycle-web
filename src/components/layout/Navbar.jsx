import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Languages, LogIn, LogOut, X, Menu, ChevronRight, Home, Sprout, Users, Handshake, Leaf, Mail, ShieldCheck, Award, Rocket, Loader2, UserRound } from 'lucide-react';

import Button from '../shared/Button';
import logoNosPlanet from '../../assets/brand/logo_nos_planet.webp';

const Navbar = ({ lang, setLang, darkMode, setDarkMode, t, isAuthenticated, user, onLogout, forceScrolled = false }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isProcessingAction } = useSelector((state) => state.auth);
    const [isScrolled, setIsScrolled] = useState(forceScrolled);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileHovered, setIsProfileHovered] = useState(false);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
            document.body.classList.add('mobile-menu-open');
        } else {
            document.body.style.overflow = 'unset';
            document.body.classList.remove('mobile-menu-open');
        }
        return () => {
            document.body.style.overflow = 'unset';
            document.body.classList.remove('mobile-menu-open');
        };
    }, [isMobileMenuOpen]);

    useEffect(() => {
        const updateScrolledState = () => {
            const nextValue = window.scrollY > 20 || forceScrolled;
            setIsScrolled((prev) => (prev === nextValue ? prev : nextValue));
        };

        let ticking = false;
        const handleScroll = () => {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(() => {
                updateScrolledState();
                ticking = false;
            });
        };

        updateScrolledState();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [forceScrolled]);

    const scrollToSection = (id) => {
        setIsMobileMenuOpen(false);

        if (id === 'home' && location.pathname === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            navigate('/', { replace: true });
            return;
        }

        navigate(`/#${id}`);
    };

    const handleLoginClick = () => {
        if (isAuthenticated) {
            if (['ADMIN', 'MANAGER', 'COORDINATOR'].includes(user?.role?.toUpperCase())) {
                navigate('/admin/dashboard');
            }
        } else {
            navigate('/auth/login');
        }
    };

    const navLinks = [
        { name: t.nav.home, id: 'home', icon: Home, desc: 'Volver a la cima' },
        { name: t.nav.about, id: 'about', icon: Leaf, desc: 'Conoce nuestra misión' },
        { name: t.nav.programs, id: 'programs', icon: Sprout, desc: 'Proyectos sostenibles' },
        { name: t.nav.community, id: 'community', icon: Users, desc: 'Únete a la red verde' },
        { name: t.nav.partners, id: 'partners', icon: Handshake, desc: 'Nuestros aliados' },
        { name: t.nav.contact, id: 'contact', icon: Mail, desc: 'Escríbenos directamente' },
    ];

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-500 px-6 ${isScrolled ? 'pt-4' : 'pt-6'}`}>
            <div className={`container mx-auto max-w-7xl transition-all duration-500 ${isScrolled
                ? 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-2xl shadow-emerald-900/10 border border-white/20 dark:border-white/5 rounded-[2.5rem] py-3 px-6'
                : 'bg-transparent py-2 px-4'
                }`}>
                <div className="flex justify-between items-center">
                    {/* Logo Section */}
                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => scrollToSection('home')}
                    >
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center bg-white shadow-xl transition-all duration-500 group-hover:rotate-12 group-hover:scale-110`}>
                            <img src={logoNosPlanet} alt="Logo" className="w-9 h-9 object-contain" />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className={`text-xl font-extrabold tracking-tight ${isScrolled ? 'text-gray-900 dark:text-white' : 'text-white'}`}>
                                Recycle<span className="text-[#018F64]">App</span>
                            </span>
                            <span className={`text-[0.6rem] font-bold uppercase tracking-[0.2em] transition-opacity duration-500 ${isScrolled ? 'text-[#05835D] opacity-100' : 'text-white/60 opacity-0'}`}>
                                Nos Planet
                            </span>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden xl:flex items-center gap-1 ml-6">
                        <div className="flex items-center gap-1">
                            {navLinks.map((link) => (
                                <button
                                    key={link.id}
                                    onClick={() => scrollToSection(link.id)}
                                    className={`px-3 py-2.5 rounded-2xl text-[0.85rem] font-semibold transition-all duration-300 flex items-center gap-2 group/link ${isScrolled
                                        ? 'text-gray-700 dark:text-gray-400 hover:text-[#018F64] dark:hover:text-emerald-400 hover:bg-[#018F64]/5 dark:hover:bg-emerald-900/20'
                                        : 'text-white/90 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    <link.icon size={18} className="transition-transform group-hover/link:scale-110" />
                                    {link.name}
                                </button>
                            ))}
                        </div>

                        <div className={`h-8 w-px mx-2 ${isScrolled ? 'bg-gray-200 dark:bg-gray-800' : 'bg-white/20'}`}></div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isScrolled ? 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300' : 'hover:bg-white/20 text-white'}`}
                            >
                                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                            </button>

                            <button
                                onClick={() => {
                                    const newLang = lang === 'es' ? 'en' : 'es';
                                    setLang(newLang);
                                    try { localStorage.setItem('app_lang', newLang); } catch (e) { /* ignore */ }
                                    document.documentElement.lang = newLang;
                                }}
                                className={`h-10 px-3 rounded-xl transition-all duration-300 flex items-center gap-2 font-semibold text-xs uppercase tracking-widest ${isScrolled ? 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300' : 'hover:bg-white/20 text-white'}`}
                            >
                                <Languages size={18} /> {lang}
                            </button>

                            {/* User Actions Group (Desktop) */}
                            <div className="flex items-center gap-1">
                                {isAuthenticated ? (
                                    <>
                                        <button
                                            onClick={handleLoginClick}
                                            onMouseEnter={() => setIsProfileHovered(true)}
                                            onMouseLeave={() => setIsProfileHovered(false)}
                                            className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-2xl transition-all duration-500 border w-[164px] h-[52px] shadow-sm
                                                ${isScrolled
                                                    ? (isProfileHovered && user?.role?.toUpperCase() === 'ADMIN' ? 'bg-red-600 border-red-500 shadow-xl shadow-red-900/40 text-white' :
                                                        isProfileHovered && user?.role?.toUpperCase() === 'MANAGER' ? 'bg-orange-600 border-orange-500 shadow-xl shadow-orange-900/40 text-white' :
                                                            isProfileHovered && user?.role?.toUpperCase() === 'COORDINATOR' ? 'bg-blue-600 border-blue-500 shadow-xl shadow-blue-900/40 text-white' :
                                                                user?.role?.toUpperCase() === 'ADMIN' ? 'bg-red-50/50 dark:bg-red-900/10 border-red-500/20 shadow-lg shadow-red-900/5' :
                                                                    user?.role?.toUpperCase() === 'MANAGER' ? 'bg-orange-50/50 dark:bg-orange-900/10 border-orange-500/20 shadow-lg shadow-orange-900/5' :
                                                                        user?.role?.toUpperCase() === 'COORDINATOR' ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-500/20 shadow-lg shadow-blue-900/5' :
                                                                            'bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-500/20 shadow-lg shadow-indigo-900/5')
                                                    : (isProfileHovered && user?.role?.toUpperCase() === 'ADMIN' ? 'bg-red-600 border-red-500 shadow-2xl text-white' :
                                                        isProfileHovered && user?.role?.toUpperCase() === 'MANAGER' ? 'bg-orange-600 border-orange-500 shadow-2xl text-white' :
                                                            isProfileHovered && user?.role?.toUpperCase() === 'COORDINATOR' ? 'bg-blue-600 border-blue-500 shadow-2xl text-white' :
                                                                user?.role?.toUpperCase() === 'ADMIN' ? 'bg-red-950/90 backdrop-blur-xl border-red-500/20 shadow-2xl shadow-red-950/40' :
                                                                    user?.role?.toUpperCase() === 'MANAGER' ? 'bg-orange-950/90 backdrop-blur-xl border-orange-500/20 shadow-2xl shadow-orange-950/40' :
                                                                        user?.role?.toUpperCase() === 'COORDINATOR' ? 'bg-blue-950/90 backdrop-blur-xl border-blue-500/20 shadow-2xl shadow-blue-950/40' :
                                                                            'bg-[#06281C]/90 backdrop-blur-xl border-emerald-500/20 shadow-2xl shadow-emerald-950/40')}`}
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center relative shadow-lg transition-all duration-500 shrink-0
                                            ${user?.role?.toUpperCase() === 'ADMIN' ? 'bg-red-500 shadow-red-500/20' :
                                                    user?.role?.toUpperCase() === 'MANAGER' ? 'bg-emerald-500 shadow-emerald-500/20' :
                                                        user?.role?.toUpperCase() === 'COORDINATOR' ? 'bg-blue-500 shadow-blue-500/20' :
                                                            user?.membershipTier?.includes('VISIONARIO') || user?.membershipTier?.includes('HERO') ? 'bg-indigo-600 shadow-indigo-600/40' :
                                                                user?.membershipTier?.includes('EMBAJADOR') || user?.membershipTier?.includes('GROWTH') ? 'bg-teal-500 shadow-teal-500/40' :
                                                                    user?.membershipTier?.includes('SOCIO') || user?.membershipTier?.includes('STARTER') ? 'bg-emerald-400 shadow-emerald-400/40' :
                                                                        'bg-emerald-600 shadow-emerald-600/40'}`}>
                                                <div className="text-white">
                                                    {isProcessingAction ? (
                                                        <Loader2 size={16} strokeWidth={2.5} className="animate-spin" />
                                                    ) : user?.role?.toUpperCase() === 'ADMIN' ? (
                                                        <ShieldCheck size={16} strokeWidth={2.5} />
                                                    ) : user?.role?.toUpperCase() === 'COORDINATOR' ? (
                                                        <UserRound size={16} strokeWidth={2.5} />
                                                    ) : user?.membershipTier?.includes('VISIONARIO') || user?.membershipTier?.includes('HERO') ? (
                                                        <Rocket size={16} strokeWidth={2.5} />
                                                    ) : user?.membershipTier?.includes('EMBAJADOR') || user?.membershipTier?.includes('GROWTH') ? (
                                                        <Award size={16} strokeWidth={2.5} />
                                                    ) : user?.membershipTier?.includes('SOCIO') || user?.membershipTier?.includes('STARTER') ? (
                                                        <UserRound size={16} strokeWidth={2.5} />
                                                    ) : (
                                                        <Leaf size={16} strokeWidth={2.5} />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-col flex-1 items-center justify-center leading-none">
                                                {isProfileHovered && ['ADMIN', 'MANAGER', 'COORDINATOR'].includes(user?.role?.toUpperCase()) ? (
                                                    <div className="flex flex-col items-center justify-center leading-tight animate-in fade-in duration-300">
                                                        <span className="text-[11px] font-black tracking-tight mb-1">Ingresar al</span>
                                                        <span className="text-[6.5px] font-black uppercase tracking-[0.2em] transform translate-y-[-1px]">Panel</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center leading-tight">
                                                        <span className={`text-[11px] font-black tracking-tight mb-1 ${isScrolled ? 'text-gray-900 dark:text-white' : 'text-white'}`}>
                                                            Hola, {user?.fullName?.split(' ')[0] || 'Usuario'}
                                                        </span>
                                                        <div className="flex items-center gap-1.5">
                                                            <div className={`w-2 h-[1px] bg-gradient-to-l opacity-60
                                                                 ${user?.role?.toUpperCase() === 'ADMIN' ? 'from-red-500' :
                                                                    user?.role?.toUpperCase() === 'MANAGER' ? 'from-emerald-500' :
                                                                        user?.role?.toUpperCase() === 'COORDINATOR' ? 'from-blue-500' :
                                                                            isProcessingAction ? 'from-amber-400' :
                                                                                user?.membershipTier?.includes('VISIONARIO') || user?.membershipTier?.includes('HERO') ? 'from-indigo-500' :
                                                                                    user?.membershipTier?.includes('EMBAJADOR') || user?.membershipTier?.includes('GROWTH') ? 'from-teal-400' :
                                                                                        user?.membershipTier?.includes('SOCIO') || user?.membershipTier?.includes('STARTER') ? 'from-emerald-400' :
                                                                                            'from-emerald-600'} to-transparent`} />
                                                            <span className={`text-[6.5px] font-black uppercase tracking-[0.2em]
                                                                 ${user?.role?.toUpperCase() === 'ADMIN' ? 'text-red-500' :
                                                                    user?.role?.toUpperCase() === 'MANAGER' ? 'text-emerald-400' :
                                                                        user?.role?.toUpperCase() === 'COORDINATOR' ? 'text-blue-400' :
                                                                            isProcessingAction ? 'text-amber-400 animate-pulse' :
                                                                                user?.membershipTier?.includes('VISIONARIO') || user?.membershipTier?.includes('HERO') ? 'text-indigo-400' :
                                                                                    user?.membershipTier?.includes('EMBAJADOR') || user?.membershipTier?.includes('GROWTH') ? 'text-teal-400' :
                                                                                        user?.membershipTier?.includes('SOCIO') || user?.membershipTier?.includes('STARTER') ? 'text-[#10B981]' :
                                                                                            'text-emerald-500'}`}>
                                                                {isProcessingAction ? 'Validando' :
                                                                    user?.role?.toUpperCase() === 'ADMIN' ? 'Administrador' :
                                                                        user?.role?.toUpperCase() === 'MANAGER' ? 'Gestor' :
                                                                            user?.role?.toUpperCase() === 'COORDINATOR' ? 'Coordinador' :
                                                                                user?.membershipTier?.includes('VISIONARIO') ? 'Eco Visionario' :
                                                                                    user?.membershipTier?.includes('EMBAJADOR') ? 'Eco Embajador' :
                                                                                        user?.membershipTier?.includes('SOCIO') ? 'Eco Socio' : 'Eco Héroe'}
                                                            </span>
                                                            <div className={`w-2 h-[1px] bg-gradient-to-r opacity-60
                                                                 ${user?.role?.toUpperCase() === 'ADMIN' ? 'from-red-500' :
                                                                    user?.role?.toUpperCase() === 'MANAGER' ? 'from-emerald-500' :
                                                                        user?.role?.toUpperCase() === 'COORDINATOR' ? 'from-blue-500' :
                                                                            isProcessingAction ? 'from-amber-400' :
                                                                                user?.membershipTier?.includes('VISIONARIO') || user?.membershipTier?.includes('HERO') ? 'from-indigo-500' :
                                                                                    user?.membershipTier?.includes('EMBAJADOR') || user?.membershipTier?.includes('GROWTH') ? 'from-teal-400' :
                                                                                        user?.membershipTier?.includes('SOCIO') || user?.membershipTier?.includes('STARTER') ? 'from-emerald-400' :
                                                                                            'from-emerald-600'} to-transparent`} />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                        <button
                                            onClick={onLogout}
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                                                ${isScrolled
                                                    ? 'text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-500/10'
                                                    : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                                            title="Cerrar sesión"
                                        >
                                            <LogOut size={18} />
                                        </button>
                                    </>
                                ) : (
                                    <Button
                                        variant={isScrolled ? 'primary' : 'outline'}
                                        onClick={handleLoginClick}
                                        className={`rounded-xl font-bold text-sm h-11 px-6 shadow-lg transition-all duration-500 scale-100 hover:scale-105 active:scale-95 ${!isScrolled
                                            ? 'border-white/40 hover:bg-white hover:text-[#018F64] text-white'
                                            : 'bg-[#018F64] border-[#018F64] hover:bg-[#05835D] text-white shadow-[#018F64]/20'
                                            }`}
                                        icon={LogIn}
                                    >
                                        {t.nav.login}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className={`xl:hidden w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${isMobileMenuOpen ? 'bg-amber-500 text-white' : isScrolled ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' : 'bg-white/10 text-white'}`}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Native Mobile App Style Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <div className="xl:hidden fixed inset-0 z-[100000] isolate">
                        {/* Global Logic to Hide Bot Assistant */}
                        <style>
                            {`.planet-bot-wrapper { display: none !important; } .mobile-menu-active { overflow: hidden !important; }`}
                        </style>

                        {/* Standard Dark Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Mobile Drawer (Native Feel) */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="absolute top-0 right-0 bottom-0 w-[85%] max-w-[380px] bg-white dark:bg-gray-900 shadow-[-10px_0_40px_rgba(0,0,0,0.2)] flex flex-col rounded-l-[1.5rem] overflow-hidden"
                        >
                            {/* Mobile Header */}
                            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg shrink-0 overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                                        <img src={logoNosPlanet} alt="Logo" className="w-full h-full object-cover" />
                                    </div>
                                    <span className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-base">RecycleApp</span>
                                </div>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2.5 rounded-full text-gray-500 bg-gray-50 dark:bg-gray-800 active:scale-90 active:bg-gray-200 dark:active:bg-gray-700 transition-all"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                {/* User Section - Mobile Layout */}
                                <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                                    {isAuthenticated ? (
                                        <div className="flex flex-col gap-5">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 shadow-inner
                                                    ${user?.role?.toUpperCase() === 'ADMIN' ? 'bg-red-100 dark:bg-red-900/40 text-red-600' :
                                                        user?.role?.toUpperCase() === 'MANAGER' ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-600' :
                                                            user?.role?.toUpperCase() === 'COORDINATOR' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600' :
                                                                'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600'
                                                    }`}
                                                >
                                                    <UserRound size={28} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-lg text-gray-900 dark:text-white truncate">
                                                        {user?.fullName || 'Usuario'}
                                                    </span>
                                                    <span className={`text-xs font-semibold uppercase tracking-widest mt-0.5
                                                        ${user?.role?.toUpperCase() === 'ADMIN' ? 'text-red-500 dark:text-red-400' :
                                                            user?.role?.toUpperCase() === 'MANAGER' ? 'text-orange-500 dark:text-orange-400' :
                                                                user?.role?.toUpperCase() === 'COORDINATOR' ? 'text-blue-500 dark:text-blue-400' :
                                                                    'text-emerald-500 dark:text-emerald-400'
                                                        }`}
                                                    >
                                                        {user?.role}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => { handleLoginClick(); setIsMobileMenuOpen(false); }}
                                                    className={`flex-1 py-3.5 px-4 text-sm font-bold rounded-xl transition-colors text-center
                                                        ${user?.role?.toUpperCase() === 'ADMIN' ? 'text-red-700 bg-red-100/60 active:bg-red-200' :
                                                            user?.role?.toUpperCase() === 'MANAGER' ? 'text-orange-700 bg-orange-100/60 active:bg-orange-200' :
                                                                user?.role?.toUpperCase() === 'COORDINATOR' ? 'text-blue-700 bg-blue-100/60 active:bg-blue-200' :
                                                                    'text-emerald-700 bg-emerald-100/60 active:bg-emerald-200'
                                                        }`}
                                                >
                                                    Ir al Panel
                                                </button>
                                                <button
                                                    onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                                                    className="py-3.5 px-4 text-sm font-bold text-gray-600 bg-gray-100 active:bg-red-100 active:text-red-600 rounded-xl transition-colors flex items-center justify-center shadow-sm"
                                                    title="Cerrar sesión"
                                                >
                                                    <LogOut size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-4 text-center">
                                            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/30 mx-auto flex items-center justify-center text-emerald-500 mb-1">
                                                <Rocket size={24} />
                                            </div>
                                            <span className="text-base font-medium text-gray-700 dark:text-gray-300">Bienvenido a RecycleApp</span>
                                            <Button
                                                onClick={() => { handleLoginClick(); setIsMobileMenuOpen(false); }}
                                                className="w-full h-14 flex justify-center py-3 rounded-xl text-base font-bold bg-emerald-600 active:bg-emerald-700 text-white transition-colors shadow-lg shadow-emerald-500/20"
                                                icon={LogIn}
                                            >
                                                {t.nav.login}
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {/* Touch-Friendly Navigation Links */}
                                <nav className="p-4">
                                    <span className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-3 block">Accesos</span>
                                    <ul className="space-y-2">
                                        {navLinks.map((link) => (
                                            <li key={link.id}>
                                                <button
                                                    onClick={() => { scrollToSection(link.id); setIsMobileMenuOpen(false); }}
                                                    className="w-full flex items-center justify-between p-4 rounded-2xl text-gray-700 dark:text-gray-200 active:bg-gray-100 dark:active:bg-gray-800 transition-colors text-left group"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-emerald-500 group-active:scale-95 transition-transform">
                                                            <link.icon size={20} />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-base text-gray-900 dark:text-white">{link.name}</span>
                                                            <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mt-0.5">{link.desc}</span>
                                                        </div>
                                                    </div>
                                                    <ChevronRight size={18} className="text-gray-300 dark:text-gray-600" />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            </div>

                            {/* Mobile Footer Area */}
                            <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex justify-between gap-4">
                                <button
                                    onClick={() => setDarkMode(!darkMode)}
                                    className="flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-transparent active:border-emerald-500/30 active:bg-gray-100 dark:active:bg-gray-700 transition-all"
                                >
                                    <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 shadow flex items-center justify-center text-gray-600 dark:text-gray-300">
                                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{darkMode ? 'Luz' : 'Noche'}</span>
                                </button>
                                <button
                                    onClick={() => {
                                        const newLang = lang === 'es' ? 'en' : 'es';
                                        setLang(newLang);
                                        try { localStorage.setItem('app_lang', newLang); } catch (e) { }
                                        document.documentElement.lang = newLang;
                                    }}
                                    className="flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-transparent active:border-emerald-500/30 active:bg-gray-100 dark:active:bg-gray-700 transition-all"
                                >
                                    <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 shadow flex items-center justify-center text-gray-600 dark:text-gray-300">
                                        <Languages size={20} />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{lang === 'es' ? 'English' : 'Español'}</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </nav >
    );
};

export default React.memo(Navbar);
