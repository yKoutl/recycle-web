import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Sun, Moon, Languages, LogIn, LogOut, X, Menu, ChevronRight, Home, Sprout, Globe, Users, Handshake, Leaf, Mail, ShieldCheck, UserPlus, Award, Rocket, Loader2, User as UserIcon, LayoutGrid, Heart, Star, UserRound } from 'lucide-react';

import Button from '../shared/Button';
import logoNosPlanet from '../../assets/logo_nos_planet.webp';

const Navbar = ({ lang, setLang, darkMode, setDarkMode, t, isAuthenticated, user, onLogout, forceScrolled = false }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { isProcessingAction } = useSelector((state) => state.auth);
    const [isScrolled, setIsScrolled] = useState(forceScrolled);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileHovered, setIsProfileHovered] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20 || forceScrolled);
        window.addEventListener('scroll', handleScroll);
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
            if (['ADMIN', 'MANAGER'].includes(user?.role?.toUpperCase())) {
                navigate('/admin/dashboard');
            }
        } else {
            navigate('/auth/login');
        }
    };

    const navLinks = [
        { name: t.nav.home, id: 'home', icon: Home },
        { name: t.nav.about, id: 'about', icon: Leaf },
        { name: t.nav.programs, id: 'programs', icon: Sprout },
        { name: t.nav.community, id: 'community', icon: Users },
        { name: t.nav.partners, id: 'partners', icon: Handshake },
        { name: t.nav.contact, id: 'contact', icon: Mail },
    ];

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-500 px-6 ${isScrolled ? 'pt-4' : 'pt-6'}`}>
            <div className={`container mx-auto max-w-7xl transition-all duration-500 ${isScrolled
                ? 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-2xl shadow-emerald-900/10 border border-white/20 dark:border-white/5 rounded-[2.5rem] py-3 px-6'
                : 'bg-transparent py-2 px-4'
                }`}>
                <div className="flex justify-between items-center">
                    {/* Logo */}
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

                        {/* Toggles & Login */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isScrolled ? 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300' : 'hover:bg-white/20 text-white'}`}
                            >
                                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                            </button>

                            <button
                                onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
                                className={`h-10 px-3 rounded-xl transition-all duration-300 flex items-center gap-2 font-semibold text-xs uppercase tracking-widest ${isScrolled ? 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300' : 'hover:bg-white/20 text-white'}`}
                            >
                                <Languages size={18} /> {lang}
                            </button>

                            {/* User Actions Group */}
                            <div className="flex items-center gap-1">
                                {isAuthenticated ? (
                                    <>
                                        <button
                                            onClick={handleLoginClick}
                                            onMouseEnter={() => setIsProfileHovered(true)}
                                            onMouseLeave={() => setIsProfileHovered(false)}
                                            className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-2xl transition-all duration-500 hover:scale-[1.02] active:scale-95 border min-w-[150px] h-[52px]
                                                ${isScrolled
                                                    ? (isProfileHovered && user?.role?.toUpperCase() === 'ADMIN' ? 'bg-red-600 border-red-500 shadow-xl shadow-red-900/40 text-white' :
                                                        isProfileHovered && user?.role?.toUpperCase() === 'MANAGER' ? 'bg-orange-600 border-orange-500 shadow-xl shadow-orange-900/40 text-white' :
                                                            user?.role?.toUpperCase() === 'ADMIN' ? 'bg-red-50/50 dark:bg-red-900/10 border-red-500/20 shadow-lg shadow-red-900/5' :
                                                                user?.role?.toUpperCase() === 'MANAGER' ? 'bg-orange-50/50 dark:bg-orange-900/10 border-orange-500/20 shadow-lg shadow-orange-900/5' :
                                                                    'bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-500/20 shadow-lg shadow-indigo-900/5')
                                                    : (isProfileHovered && user?.role?.toUpperCase() === 'ADMIN' ? 'bg-red-600 border-red-500 shadow-2xl text-white' :
                                                        isProfileHovered && user?.role?.toUpperCase() === 'MANAGER' ? 'bg-orange-600 border-orange-500 shadow-2xl text-white' :
                                                            user?.role?.toUpperCase() === 'ADMIN' ? 'bg-red-950/90 backdrop-blur-xl border-red-500/20 shadow-2xl shadow-red-950/40' :
                                                                user?.role?.toUpperCase() === 'MANAGER' ? 'bg-orange-950/90 backdrop-blur-xl border-orange-500/20 shadow-2xl shadow-orange-950/40' :
                                                                    'bg-[#06281C]/90 backdrop-blur-xl border-emerald-500/20 shadow-2xl shadow-emerald-950/40')}`}
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center relative shadow-lg transition-all duration-500 shrink-0
                                            ${user?.role?.toUpperCase() === 'ADMIN' ? 'bg-red-500 shadow-red-500/20' :
                                                    user?.role?.toUpperCase() === 'MANAGER' ? 'bg-emerald-500 shadow-emerald-500/20' :
                                                        user?.membershipTier?.includes('VISIONARIO') || user?.membershipTier?.includes('HERO') ? 'bg-indigo-600 shadow-indigo-600/40' :
                                                            user?.membershipTier?.includes('EMBAJADOR') || user?.membershipTier?.includes('GROWTH') ? 'bg-teal-500 shadow-teal-500/40' :
                                                                user?.membershipTier?.includes('SOCIO') || user?.membershipTier?.includes('STARTER') ? 'bg-emerald-400 shadow-emerald-400/40' :
                                                                    'bg-emerald-600 shadow-emerald-600/40'}`}>
                                                <div className="text-white">
                                                    {isProcessingAction ? (
                                                        <Loader2 size={16} strokeWidth={2.5} className="animate-spin" />
                                                    ) : user?.role?.toUpperCase() === 'ADMIN' ? (
                                                        <ShieldCheck size={16} strokeWidth={2.5} />
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
                                                {isProfileHovered && ['ADMIN', 'MANAGER'].includes(user?.role?.toUpperCase()) ? (
                                                    <div className="flex flex-col items-center leading-tight animate-in fade-in slide-in-from-bottom-1 duration-300">
                                                        <span className="text-[8px] font-black tracking-[0.3em] whitespace-nowrap">— PANEL —</span>
                                                        <span className="text-[11px] font-black tracking-widest uppercase">
                                                            {user?.role?.toUpperCase() === 'ADMIN' ? 'ADMIN' : 'GESTOR'}
                                                        </span>
                                                        <span className="text-[8px] font-black opacity-40">—</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span className={`text-[11px] font-black tracking-tight mb-1 ${isScrolled ? 'text-gray-900 dark:text-white' : 'text-white'}`}>
                                                            Hola, {user?.fullName?.split(' ')[0] || 'Usuario'}
                                                        </span>
                                                        <div className="flex items-center gap-1.5">
                                                            <div className={`w-2 h-[1px] bg-gradient-to-l opacity-60
                                                                 ${user?.role?.toUpperCase() === 'ADMIN' ? 'from-red-500' :
                                                                    user?.role?.toUpperCase() === 'MANAGER' ? 'from-emerald-500' :
                                                                        isProcessingAction ? 'from-amber-400' :
                                                                            user?.membershipTier?.includes('VISIONARIO') || user?.membershipTier?.includes('HERO') ? 'from-indigo-500' :
                                                                                user?.membershipTier?.includes('EMBAJADOR') || user?.membershipTier?.includes('GROWTH') ? 'from-teal-400' :
                                                                                    user?.membershipTier?.includes('SOCIO') || user?.membershipTier?.includes('STARTER') ? 'from-emerald-400' :
                                                                                        'from-emerald-600'} to-transparent`} />
                                                            <span className={`text-[6.5px] font-black uppercase tracking-[0.2em]
                                                                 ${user?.role?.toUpperCase() === 'ADMIN' ? 'text-red-500' :
                                                                    user?.role?.toUpperCase() === 'MANAGER' ? 'text-emerald-400' :
                                                                        isProcessingAction ? 'text-amber-400 animate-pulse' :
                                                                            user?.membershipTier?.includes('VISIONARIO') || user?.membershipTier?.includes('HERO') ? 'text-indigo-400' :
                                                                                user?.membershipTier?.includes('EMBAJADOR') || user?.membershipTier?.includes('GROWTH') ? 'text-teal-400' :
                                                                                    user?.membershipTier?.includes('SOCIO') || user?.membershipTier?.includes('STARTER') ? 'text-[#10B981]' :
                                                                                        'text-emerald-500'}`}>
                                                                {isProcessingAction ? 'Validando' :
                                                                    user?.role?.toUpperCase() === 'ADMIN' ? 'Administrador' :
                                                                        user?.role?.toUpperCase() === 'MANAGER' ? 'Gestor' :
                                                                            user?.membershipTier?.includes('VISIONARIO') ? 'Eco Visionario' :
                                                                                user?.membershipTier?.includes('EMBAJADOR') ? 'Eco Embajador' :
                                                                                    user?.membershipTier?.includes('SOCIO') ? 'Eco Socio' : 'Eco Héroe'}
                                                            </span>
                                                            <div className={`w-2 h-[1px] bg-gradient-to-r opacity-60
                                                                 ${user?.role?.toUpperCase() === 'ADMIN' ? 'from-red-500' :
                                                                    user?.role?.toUpperCase() === 'MANAGER' ? 'from-emerald-500' :
                                                                        isProcessingAction ? 'from-amber-400' :
                                                                            user?.membershipTier?.includes('VISIONARIO') || user?.membershipTier?.includes('HERO') ? 'from-indigo-500' :
                                                                                user?.membershipTier?.includes('EMBAJADOR') || user?.membershipTier?.includes('GROWTH') ? 'from-teal-400' :
                                                                                    user?.membershipTier?.includes('SOCIO') || user?.membershipTier?.includes('STARTER') ? 'from-emerald-400' :
                                                                                        'from-emerald-600'} to-transparent`} />
                                                        </div>
                                                    </>
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
                        className={`xl:hidden w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${isScrolled ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' : 'bg-white/10 text-white'}`}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {
                isMobileMenuOpen && (
                    <div className="xl:hidden fixed inset-0 z-[60] bg-white dark:bg-gray-950 animate-in fade-in zoom-in-95 duration-300">
                        <div className="flex flex-col h-full">
                            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-900">
                                <div className="flex items-center gap-3">
                                    <img src={logoNosPlanet} alt="Logo" className="w-8 h-8 object-contain" />
                                    <span className="text-xl font-extrabold dark:text-white">Recycle<span className="text-emerald-500">App</span></span>
                                </div>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center dark:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {navLinks.map((link) => (
                                    <button
                                        key={link.id}
                                        onClick={() => scrollToSection(link.id)}
                                        className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-all hover:bg-emerald-50 dark:hover:bg-emerald-900/20 group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                                                <link.icon size={20} />
                                            </div>
                                            <span className="font-bold text-lg">{link.name}</span>
                                        </div>
                                        <ChevronRight size={20} className="text-gray-400" />
                                    </button>
                                ))}
                            </div>

                            <div className="p-6 border-t border-gray-100 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-900/50">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <button onClick={() => setDarkMode(!darkMode)} className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                                        {darkMode ? <Sun size={24} /> : <Moon size={24} />}
                                        <span className="text-xs font-bold uppercase">{darkMode ? 'Claro' : 'Oscuro'}</span>
                                    </button>
                                    <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                                        <Languages size={24} />
                                        <span className="text-xs font-bold uppercase">{lang === 'es' ? 'English' : 'Español'}</span>
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {isAuthenticated ? (
                                        <button
                                            onClick={() => { handleLoginClick(); setIsMobileMenuOpen(false); }}
                                            className={`w-full relative flex items-center gap-5 p-5 rounded-[2.5rem] border shadow-2xl overflow-hidden group text-left
                                            ${user?.role?.toUpperCase() === 'ADMIN' ? 'bg-red-600 border-red-400 shadow-red-500/30' :
                                                    user?.role?.toUpperCase() === 'MANAGER' ? 'bg-emerald-600 border-emerald-400 shadow-emerald-500/30' :
                                                        user?.membershipTier?.includes('VISIONARIO') || user?.membershipTier?.includes('HERO') ? 'bg-indigo-600 border-indigo-400 shadow-indigo-500/30' :
                                                            user?.membershipTier?.includes('EMBAJADOR') || user?.membershipTier?.includes('GROWTH') ? 'bg-teal-600 border-teal-400 shadow-teal-500/30' :
                                                                user?.membershipTier?.includes('SOCIO') || user?.membershipTier?.includes('STARTER') ? 'bg-emerald-700 border-emerald-500 shadow-emerald-500/30' :
                                                                    'bg-emerald-600 border-emerald-400 shadow-emerald-500/30'}`}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                                            <div className="w-14 h-14 rounded-2xl bg-white shadow-xl flex items-center justify-center shrink-0 group-active:scale-95 transition-transform"
                                                style={{
                                                    color: user?.role?.toUpperCase() === 'ADMIN' ? '#dc2626' :
                                                        user?.role?.toUpperCase() === 'MANAGER' ? '#10B981' :
                                                            user?.membershipTier?.includes('VISIONARIO') || user?.membershipTier?.includes('HERO') ? '#6366f1' :
                                                                user?.membershipTier?.includes('EMBAJADOR') || user?.membershipTier?.includes('GROWTH') ? '#2dd4bf' :
                                                                    user?.membershipTier?.includes('SOCIO') || user?.membershipTier?.includes('STARTER') ? '#10B981' :
                                                                        '#059669'
                                                }}>
                                                {isProcessingAction ? (
                                                    <Loader2 size={28} strokeWidth={2.5} className="animate-spin" />
                                                ) : user?.role?.toUpperCase() === 'ADMIN' ? (
                                                    <ShieldCheck size={28} strokeWidth={2.5} />
                                                ) : user?.role?.toUpperCase() === 'MANAGER' ? (
                                                    <Handshake size={28} strokeWidth={2.5} />
                                                ) : user?.membershipTier?.includes('VISIONARIO') || user?.membershipTier?.includes('HERO') ? (
                                                    <Rocket size={28} strokeWidth={2.5} />
                                                ) : user?.membershipTier?.includes('EMBAJADOR') || user?.membershipTier?.includes('GROWTH') ? (
                                                    <Award size={28} strokeWidth={2.5} />
                                                ) : user?.membershipTier?.includes('SOCIO') || user?.membershipTier?.includes('STARTER') ? (
                                                    <UserRound size={28} strokeWidth={2.5} />
                                                ) : (
                                                    <Leaf size={28} strokeWidth={2.5} />
                                                )}
                                            </div>
                                            <div className="flex flex-col items-start leading-none gap-2">
                                                <span className="text-base font-black text-white italic tracking-tight">
                                                    Hola, {user?.fullName?.split(' ')[0] || 'Usuario'}
                                                </span>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-5 h-[1px] bg-white/30" />
                                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/90">
                                                        {isProcessingAction ? 'Validando...' :
                                                            user?.role?.toUpperCase() === 'ADMIN' ? 'Administrador' :
                                                                user?.role?.toUpperCase() === 'MANAGER' ? 'Gestor' :
                                                                    user?.membershipTier?.includes('VISIONARIO') ? 'Visionario' :
                                                                        user?.membershipTier?.includes('EMBAJADOR') ? 'Embajador' :
                                                                            user?.membershipTier?.includes('SOCIO') ? 'Socio' : 'Eco Héroe'}
                                                    </span>
                                                    <div className="w-5 h-[1px] bg-white/30" />
                                                </div>
                                            </div>
                                        </button>
                                    ) : (
                                        <Button
                                            onClick={() => { handleLoginClick(); setIsMobileMenuOpen(false); }}
                                            className="w-full h-14 rounded-2xl text-lg font-extrabold shadow-xl shadow-emerald-500/20"
                                            icon={LogIn}
                                        >
                                            {t.nav.login}
                                        </Button>
                                    )}

                                    {isAuthenticated && (
                                        <button
                                            onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                                            className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl text-red-500 font-bold uppercase tracking-widest text-xs hover:bg-red-50 dark:hover:bg-red-900/20 transition-all border border-red-100 dark:border-red-900/30"
                                        >
                                            <LogOut size={18} /> Cerrar Sesión
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </nav >
    );
};

export default React.memo(Navbar);
