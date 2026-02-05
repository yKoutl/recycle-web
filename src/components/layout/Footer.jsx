import React, { useState } from 'react';
import logoNosPlanet from '../../assets/Logo Nos Planet.png';
import TermsModal from '../eco-bot/TermsModal'; // Reutilizamos el modal de estilo PDF

const Footer = ({ t }) => {
    const [showTerms, setShowTerms] = useState(false);

    return (
        <footer className="bg-gray-50 dark:bg-black text-gray-600 dark:text-gray-400 py-16 border-t border-gray-200 dark:border-gray-800 transition-colors duration-500">
            {showTerms && <TermsModal type="web" onClose={() => setShowTerms(false)} />}

            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                            <div className="bg-white p-1 rounded-lg border border-gray-100 dark:border-none"><img src={logoNosPlanet} alt="Logo" className="w-5 h-5 object-contain" /></div>
                            <span className="text-2xl ">RecycleApp</span>
                        </div>
                        <p className="max-w-sm text-sm leading-relaxed text-gray-500 dark:text-gray-500">
                            {t.footer.desc}
                        </p>
                    </div>
                    <div>
                        <h5 className="text-gray-900 dark:text-white font-bold mb-6 text-sm uppercase tracking-wider">{t.footer.explore}</h5>
                        <ul className="space-y-3 text-sm">
                            <li><button onClick={() => document.getElementById('home').scrollIntoView({ behavior: 'smooth' })} className="hover:text-green-600 dark:hover:text-green-400 transition-colors">{t.nav.home}</button></li>
                            <li><button onClick={() => document.getElementById('programs').scrollIntoView({ behavior: 'smooth' })} className="hover:text-green-600 dark:hover:text-green-400 transition-colors">{t.nav.programs}</button></li>
                            <li><button onClick={() => document.getElementById('impact').scrollIntoView({ behavior: 'smooth' })} className="hover:text-green-600 dark:hover:text-green-400 transition-colors">{t.nav.impact}</button></li>
                            <li><a href="#" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">{t.footer.links.blog}</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="text-gray-900 dark:text-white font-bold mb-6 text-sm uppercase tracking-wider">{t.footer.legal}</h5>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">{t.footer.links.privacy}</a></li>
                            <li>
                                <button
                                    onClick={() => setShowTerms(true)}
                                    className="hover:text-green-600 dark:hover:text-green-400 transition-colors text-left"
                                >
                                    {t.footer.links.terms}
                                </button>
                            </li>
                            <li><a href="#" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">{t.footer.links.cookies}</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col items-center gap-4 text-xs font-medium text-center">
                    <p>{t.footer.rights}</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-green-600 dark:hover:text-white transition-colors">Instagram</a>
                        <a href="#" className="hover:text-green-600 dark:hover:text-white transition-colors">Twitter (X)</a>
                        <a href="#" className="hover:text-green-600 dark:hover:text-white transition-colors">LinkedIn</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
