import React, { useState, useEffect } from 'react';
import { Sun, Moon, Languages, LogIn, X, Menu, ChevronRight } from 'lucide-react';
import Button from '../shared/Button';
import logoNosPlanet from '../../assets/Logo Nos Planet.png';

const Navbar = ({ onLoginClick, lang, setLang, darkMode, setDarkMode, t }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMobileMenuOpen(false);
        }
    };

    const navLinks = [
        { name: t.nav.home, id: 'home' },
        { name: t.nav.programs, id: 'programs' },
        { name: t.nav.impact, id: 'impact' },
        { name: t.nav.community, id: 'community' },
        { name: t.nav.partners, id: 'partners' },
        { name: t.nav.about, id: 'about' },
    ];

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled
            ? 'bg-white/90 dark:bg-gray-950/90 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800 py-3'
            : 'bg-transparent py-5'
            }`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                {/* Logo */}
                <div
                    className="flex items-center gap-2.5 cursor-pointer group"
                    onClick={() => scrollToSection('home')}
                >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-lg transition-transform group-hover:rotate-12`}>
                        <img src={logoNosPlanet} alt="Logo" className="w-8 h-8 object-contain" />
                    </div>
                    <span className={`text-2xl font-bold tracking-tight ${isScrolled ? 'text-gray-900 dark:text-white' : 'text-white drop-shadow-md'}`}>
                        Recycle<span className={isScrolled ? 'text-primary-day dark:text-primary-night' : 'text-primary-day dark:text-primary-night'}>App</span>
                    </span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden xl:flex items-center gap-1">
                    <div className="flex items-center gap-1 mr-4 bg-white/5 backdrop-blur-sm rounded-2xl p-1 border border-white/10">
                        {navLinks.map((link) => (
                            <button
                                key={link.id}
                                onClick={() => scrollToSection(link.id)}
                                className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300 ${isScrolled
                                    ? 'text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                    : 'text-white/90 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {link.name}
                            </button>
                        ))}
                    </div>

                    <div className={`h-6 w-px mx-2 ${isScrolled ? 'bg-gray-200 dark:bg-gray-700' : 'bg-white/20'}`}></div>

                    {/* Toggles & Login */}
                    <div className="flex items-center gap-2 ml-2">
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`p-2.5 rounded-full transition-all duration-300 ${isScrolled ? 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300' : 'hover:bg-white/20 text-white'}`}
                        >
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <button
                            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
                            className={`p-2.5 rounded-full transition-all duration-300 flex items-center gap-1 font-medium text-xs ${isScrolled ? 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300' : 'hover:bg-white/20 text-white'}`}
                        >
                            <Languages size={20} /> {lang.toUpperCase()}
                        </button>

                        <Button
                            variant={isScrolled ? 'primary' : 'outline'}
                            onClick={onLoginClick}
                            className="px-5 text-sm ml-2"
                            icon={LogIn}
                        >
                            {t.nav.login}
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="xl:hidden p-2 rounded-lg hover:bg-white/10 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen
                        ? <X className={isScrolled ? 'text-gray-800 dark:text-white' : 'text-white'} />
                        : <Menu className={isScrolled ? 'text-gray-800 dark:text-white' : 'text-white'} />
                    }
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="xl:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-xl border-t border-gray-100 dark:border-gray-800 animate-in slide-in-from-top-5 duration-300 h-screen overflow-y-auto pb-24">
                    <div className="flex flex-col p-4 space-y-2">
                        {navLinks.map((link) => (
                            <button
                                key={link.id}
                                onClick={() => scrollToSection(link.id)}
                                className="text-left px-4 py-3 text-gray-600 dark:text-gray-300 font-medium hover:bg-green-50 dark:hover:bg-gray-800 hover:text-green-700 dark:hover:text-green-400 rounded-lg transition-colors flex items-center justify-between text-lg"
                            >
                                {link.name}
                                <ChevronRight size={16} className="text-gray-300 dark:text-gray-600" />
                            </button>
                        ))}
                        <div className="h-px bg-gray-100 dark:bg-gray-800 my-4"></div>

                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => setDarkMode(!darkMode)} className="flex items-center justify-center gap-2 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-transparent hover:border-green-200 dark:hover:border-green-800 transition-all">
                                {darkMode ? <Sun size={20} /> : <Moon size={20} />} {darkMode ? 'Claro' : 'Oscuro'}
                            </button>
                            <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="flex items-center justify-center gap-2 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-transparent hover:border-green-200 dark:hover:border-green-800 transition-all">
                                <Languages size={20} /> {lang === 'es' ? 'English' : 'Español'}
                            </button>
                        </div>

                        <div className="mt-4 pt-4">
                            <Button onClick={() => { onLoginClick(); setIsMobileMenuOpen(false); }} className="w-full justify-center py-4 text-lg" icon={LogIn}>
                                {t.nav.login}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
