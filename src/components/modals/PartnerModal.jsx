import React from 'react';
import { X, Gift, Users, Trophy, ExternalLink, Quote } from 'lucide-react';
import Button from '../shared/Button';

const PartnerModal = ({ isOpen, onClose, partner }) => {
    if (!isOpen || !partner) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}></div>

            <div className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col md:flex-row max-h-[90vh]">

                {/* Left Side: Visual Identity & Stats */}
                <div className={`${partner.bgHeader || 'bg-gray-600'} md:w-2/5 p-8 text-white relative flex flex-col items-center justify-center text-center`}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-black/20 mix-blend-overlay pattern-diagonal-lines opacity-50"></div>

                    <div className="relative z-10 flex flex-col items-center w-full h-full justify-between">
                        <div className="mt-8">
                            <div className="w-32 h-32 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center mb-6 border-4 border-white/30 text-4xl font-bold font-mono shadow-2xl">
                                {partner.logo}
                            </div>
                            <h2 className="text-3xl font-bold mb-2 tracking-tight">{partner.name}</h2>
                            <span className="inline-flex items-center gap-1.5 bg-white/20 px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wider backdrop-blur-md">
                                <Trophy size={14} className="text-yellow-300" />
                                {partner.category}
                            </span>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 w-full mt-10">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                                <Gift size={24} className="mx-auto mb-2 opacity-90" />
                                <div className="text-2xl font-bold">{partner.stats.prizes}</div>
                                <div className="text-xs uppercase tracking-wide opacity-75">Premios</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                                <Users size={24} className="mx-auto mb-2 opacity-90" />
                                <div className="text-2xl font-bold">{partner.stats.exchanges}</div>
                                <div className="text-xs uppercase tracking-wide opacity-75">Canjes</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Content */}
                <div className="md:w-3/5 flex flex-col bg-[#D5F6ED] dark:bg-gray-950">
                    <div className="flex justify-end p-4">
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="px-8 pb-8 overflow-y-auto custom-scrollbar flex-1">
                        <div className="space-y-8">
                            {/* Description */}
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                                    Sobre la alianza
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                                    {partner.details.desc}
                                </p>
                            </div>

                            {/* Commitment Section */}
                            <div className="bg-white/60 dark:bg-gray-900/50 rounded-2xl p-6 border border-white/50 dark:border-gray-800">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg">
                                        <Users size={20} />
                                    </div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">Compromiso Ambiental</h4>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 italic border-l-4 border-green-500 pl-4 py-1">
                                    "{partner.details.about}"
                                </p>
                            </div>

                            {/* Vision/Quote */}
                            <div className="relative pl-8 pt-2">
                                <Quote className="absolute top-0 left-0 text-gray-200 dark:text-gray-800 w-8 h-8 transform -scale-x-100" />
                                <p className="text-gray-500 dark:text-gray-400 font-medium text-sm leading-relaxed">
                                    {partner.details.commitment}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer Action */}
                    <div className="p-8 pt-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                        <div className="flex items-center justify-between gap-4">
                            <div className="hidden sm:block">
                                <div className="text-sm font-bold text-gray-900 dark:text-white">1 Beneficio Disponible</div>
                                <div className="text-xs text-gray-500">Exclusivo para usuarios Nivel 2+</div>
                            </div>
                            <Button className="flex-1 sm:flex-none shadow-lg shadow-green-900/10" icon={ExternalLink}>
                                Ver Beneficios
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartnerModal;
