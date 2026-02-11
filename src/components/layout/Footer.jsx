import React, { useState } from 'react';
import { Instagram, Twitter, Linkedin, Github, Facebook, Youtube, Send, ArrowUpRight } from 'lucide-react';
import logoNosPlanet from '../../assets/logo_nos_planet.webp';
import TermsModal from '../planet-bot/TermsModal';

const Footer = ({ t }) => {
    const [showTerms, setShowTerms] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="relative bg-white dark:bg-[#020617] text-gray-500 dark:text-gray-400 pt-16 pb-12 overflow-hidden border-t border-gray-100 dark:border-white/5 transition-colors duration-500">
            {showTerms && <TermsModal type="web" onClose={() => setShowTerms(false)} />}

            {/* Ambient background glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#018F64]/5 dark:bg-[#018F64]/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#018F64]/5 dark:bg-[#018F64]/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Top Row: Brand & CTA */}
                <div className="grid lg:grid-cols-12 gap-12 pb-12 border-b border-gray-100 dark:border-white/5">
                    <div className="lg:col-span-5 space-y-8">
                        <div
                            className="flex items-center gap-3 cursor-pointer group w-fit"
                            onClick={scrollToTop}
                        >
                            <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center p-2 shadow-xl group-hover:rotate-12 transition-transform duration-500 border border-gray-100 dark:border-gray-700">
                                <img src={logoNosPlanet} alt="Logo" className="w-full h-full object-contain" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                                    Recycle<span className="text-[#018F64]">App</span>
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#05835D] dark:text-emerald-500/60">Nos Planet</span>
                            </div>
                        </div>
                        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-md font-sans">
                            {t.footer.desc.replace(/LA PLATAFORMA LÍDER/i, 'La plataforma líder').replace(/CONECTAMOS PERSONAS/i, 'Conectamos personas')}
                        </p>

                        {/* Newsletter-ish small CTA */}
                        <div className="relative max-w-sm group">
                            <input
                                type="email"
                                placeholder="Tu correo electrónico"
                                className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm focus:outline-none focus:border-[#018F64] dark:focus:border-[#018F64] transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-sm"
                            />
                            <button className="absolute right-2 top-2 bottom-2 w-12 bg-[#018F64] text-white rounded-xl flex items-center justify-center hover:bg-[#05835D] transition-colors shadow-lg shadow-[#018F64]/20">
                                <Send size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8 font-ui">
                        {/* Explore */}
                        <div className="space-y-6">
                            <h5 className="text-gray-900 dark:text-white font-bold text-sm uppercase tracking-widest">Explorar</h5>
                            <ul className="space-y-4">
                                {[
                                    { id: 'home', label: t.nav.home },
                                    { id: 'about', label: t.nav.about },
                                    { id: 'programs', label: t.nav.programs },
                                    { id: 'community', label: t.nav.community },
                                    { id: 'partners', label: t.nav.partners }
                                ].map((link) => (
                                    <li key={link.id}>
                                        <button
                                            onClick={() => document.getElementById(link.id).scrollIntoView({ behavior: 'smooth' })}
                                            className="text-gray-600 dark:text-gray-400 hover:text-[#018F64] dark:hover:text-emerald-400 transition-all flex items-center gap-1 group/link text-sm font-semibold"
                                        >
                                            <span className="relative">
                                                {link.label}
                                                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#018F64] dark:bg-emerald-400 transition-all group-hover/link:w-full"></span>
                                            </span>
                                            <ArrowUpRight size={14} className="opacity-0 -translate-y-1 translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-y-0 group-hover/link:translate-x-0 transition-all" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal */}
                        <div className="space-y-6">
                            <h5 className="text-gray-900 dark:text-white font-bold text-sm uppercase tracking-widest">Legal</h5>
                            <ul className="space-y-4">
                                <li>
                                    <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#018F64] dark:hover:text-emerald-400 transition-all text-sm block font-semibold">{t.footer.links.privacy}</a>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setShowTerms(true)}
                                        className="text-gray-600 dark:text-gray-400 hover:text-[#018F64] dark:hover:text-emerald-400 transition-all text-sm text-left font-semibold"
                                    >
                                        {t.footer.links.terms}
                                    </button>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#018F64] dark:hover:text-emerald-400 transition-all text-sm block font-semibold">Política de Cookies</a>
                                </li>
                            </ul>
                        </div>

                        {/* Social & Contact */}
                        <div className="col-span-2 md:col-span-1 space-y-6">
                            <h5 className="text-gray-900 dark:text-white font-bold text-sm uppercase tracking-widest">Síguenos</h5>
                            <div className="flex flex-wrap gap-4">
                                {[
                                    { Icon: Instagram, color: 'hover:bg-[#018F64]' },
                                    { Icon: Facebook, color: 'hover:bg-[#018F64]' },
                                    { Icon: Twitter, color: 'hover:bg-[#018F64]' },
                                    { Icon: Linkedin, color: 'hover:bg-[#018F64]' }
                                ].map((social, idx) => (
                                    <a
                                        key={idx}
                                        href="#"
                                        className={`w-12 h-12 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${social.color} shadow-lg shadow-gray-200/20 dark:shadow-none`}
                                    >
                                        <social.Icon size={22} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-8 font-ui">
                    <p className="text-gray-400 dark:text-gray-600 text-[10px] font-bold uppercase tracking-widest text-center md:text-left">
                        {t.footer.rights}
                    </p>

                    <div className="flex items-center gap-4">
                        <span className="text-gray-400 dark:text-gray-600 text-[10px] font-bold uppercase tracking-widest">Powered by</span>
                        <div className="px-4 py-2 bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 group hover:border-[#018F64]/30 transition-colors shadow-sm">
                            <span className="text-[#018F64] dark:text-emerald-400 font-black text-xs tracking-tighter">NOS PLANET</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
