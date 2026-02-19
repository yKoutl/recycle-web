import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sun, Moon, Languages, LogIn, LogOut, X, Menu, ChevronRight, Home, Sprout, Globe, Users, Handshake, Leaf, Mail, ShieldCheck } from 'lucide-react';

import Button from '../shared/Button';
import logoNosPlanet from '../../assets/logo_nos_planet.webp';

const Navbar = ({ lang, setLang, darkMode, setDarkMode, t, isAuthenticated, user, onLogout, forceScrolled = false }) => {
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(forceScrolled);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20 || forceScrolled);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [forceScrolled]);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMobileMenuOpen(false);
        } else {
            // Si estamos en otra página (ej: admin), ir a home y scroll
            navigate('/');
            setTimeout(() => {
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };

    const handleLoginClick = () => {
        if (isAuthenticated) {
            if (['ADMIN', 'OFFICIAL'].includes(user?.role?.toUpperCase())) {
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
                ? 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-2xl shadow-emerald-900/10 border border-white/20 dark:border-white/5 rounded-[2.5rem] py-3 px-8'
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

                            <Button
                                variant={isScrolled ? 'primary' : 'outline'}
                                onClick={handleLoginClick}
                                className={`rounded-xl font-bold text-sm h-11 px-6 shadow-lg transition-all duration-500 scale-100 hover:scale-105 active:scale-95 ${!isScrolled
                                    ? 'border-white/40 hover:bg-white hover:text-[#018F64] text-white'
                                    : 'bg-[#018F64] border-[#018F64] hover:bg-[#05835D] text-white shadow-[#018F64]/20'
                                    } ${isAuthenticated && !isScrolled ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white' : ''}`}
                                icon={isAuthenticated ? ShieldCheck : LogIn}
                            >
                                {isAuthenticated
                                    ? (['ADMIN', 'OFFICIAL'].includes(user?.role) ? 'Panel Admin' : `Hola, ${user?.fullName?.split(' ')[0] || 'Usuario'}`)
                                    : t.nav.login}
                            </Button>

                            {isAuthenticated && (
                                <button
                                    onClick={onLogout}
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isScrolled ? 'hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500' : 'hover:bg-white/20 text-white'}`}
                                    title="Cerrar sesión"
                                >
                                    <LogOut size={20} />
                                </button>
                            )}
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
            {isMobileMenuOpen && (
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
                            <div className="space-y-3">
                                <Button
                                    onClick={() => { handleLoginClick(); setIsMobileMenuOpen(false); }}
                                    className="w-full h-14 rounded-2xl text-lg font-extrabold shadow-xl shadow-emerald-500/20"
                                    icon={isAuthenticated ? ShieldCheck : LogIn}
                                >
                                    {isAuthenticated
                                        ? (['ADMIN', 'OFFICIAL'].includes(user?.role) ? 'Panel Admin' : `Hola, ${user?.fullName?.split(' ')[0] || 'Usuario'}`)
                                        : t.nav.login}
                                </Button>

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
            )}
        </nav>
    );
};

export default React.memo(Navbar);
