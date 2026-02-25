import React, { useEffect } from 'react';
import { X, Gift, Users2, Trophy, ExternalLink, Quote, Target, Heart, ArrowRight, Sparkles, MessageSquare } from 'lucide-react';
import Button from '../shared/Button';

const PartnerModal = ({ isOpen, onClose, partner }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = ''; };
        }
    }, [isOpen]);

    if (!isOpen || !partner) return null;

    // Brand orientation and colors
    const brandColor = partner.hex || '#018F64';
    const textColor = partner.textColor || 'text-emerald-600';

    return (
        <div className="fixed inset-0 z-[100] flex justify-start overflow-hidden outline-none">

            {/* Dynamic Scrollbar Style */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar-${partner.id}::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar-${partner.id}::-webkit-scrollbar-track {
                    background: rgba(0,0,0,0.02);
                }
                .custom-scrollbar-${partner.id}::-webkit-scrollbar-thumb {
                    background: ${brandColor};
                    border-radius: 10px;
                    border: 2px solid transparent;
                    background-clip: content-box;
                }
                .custom-scrollbar-${partner.id}::-webkit-scrollbar-thumb:hover {
                    background: ${brandColor};
                    background-clip: padding-box;
                }
                @keyframes slide-in-left {
                    from { transform: translateX(-100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .animate-slide-in-left {
                    animation: slide-in-left 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}} />

            {/* Backdrop with Eco Image and Blur */}
            <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-end pointer-events-none">
                <img
                    src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1600"
                    alt="Eco background"
                    className="absolute inset-0 w-full h-full object-cover opacity-[0.12] scale-105"
                />

                {/* Dynamic Brand Quote Area (Visible on Web) */}
                <div className="relative z-10 mr-12 lg:mr-24 max-w-lg p-12 bg-white/5 backdrop-blur-sm rounded-[3rem] border border-white/10 hidden md:block text-right transition-all duration-700">
                    <div className="flex items-center justify-end gap-3 mb-6 opacity-30">
                        <Heart size={32} style={{ color: brandColor }} className="fill-current" />
                        <Sparkles size={40} style={{ color: brandColor }} />
                    </div>
                    <p className="text-2xl lg:text-3xl font-black text-gray-800 dark:text-gray-100 leading-tight italic tracking-tighter">
                        "{partner.details?.about || 'Estamos redefiniendo el impacto social a través de acciones climáticas directas y tecnología responsable.'}"
                    </p>
                    <p className="mt-6 text-[11px] font-black uppercase tracking-[0.4em]" style={{ color: brandColor }}>
                        — COMPROMISO {partner.name.toUpperCase()}
                    </p>
                </div>

                <div
                    className="absolute inset-0 bg-gray-100/40 dark:bg-[#020617]/90 backdrop-blur-md transition-opacity duration-500 pointer-events-auto"
                    onClick={onClose}
                />
            </div>

            {/* Side Panel - Media Luna Style */}
            <div className="relative z-10 w-full max-w-xl bg-white dark:bg-[#0f172a] h-full shadow-[30px_0_60px_rgba(0,0,0,0.3)] animate-slide-in-left flex flex-col border-none">

                {/* Vertical Phrase on the Left Edge */}
                <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center pointer-events-none hidden lg:flex">
                    <p className="whitespace-nowrap -rotate-90 text-[10px] font-black text-gray-200 dark:text-gray-800 uppercase tracking-[0.6em]">
                        DETALLES DE LA ALIANZA
                    </p>
                </div>

                {/* SVG Media Luna Edge */}
                <div className="absolute top-0 bottom-0 -right-[63px] w-[64px] pointer-events-none hidden lg:block overflow-hidden">
                    <svg width="64" height="100%" viewBox="0 0 64 1024" preserveAspectRatio="none" className="block -translate-x-[1px] scale-x-[-1]">
                        <path
                            d="M64 0C64 0 0 150 0 512C0 874 64 1024 64 1024V0Z"
                            fill="currentColor"
                            className="text-white dark:text-[#0f172a]"
                        />
                    </svg>
                </div>

                {/* Header Section */}
                <div className="px-12 pt-12 flex items-center justify-between z-20 flex-row-reverse">
                    <button
                        onClick={onClose}
                        className="flex items-center gap-3 text-gray-400 dark:text-gray-500 hover:opacity-70 transition-all group flex-row-reverse"
                    >
                        <X size={24} className="group-hover:rotate-90 transition-transform" />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] font-ui">CERRAR</span>
                    </button>
                    <div
                        style={{ backgroundColor: brandColor }}
                        className={`w-12 h-12 flex items-center justify-center text-white shadow-lg overflow-hidden ${partner.id === 1 ? 'rounded-full' : 'rounded-2xl'}`}
                    >
                        {typeof partner.logo === 'string' && !partner.logo.includes('/') ? (
                            <span className="text-xl font-black">{partner.logo}</span>
                        ) : partner.logo ? (
                            <img
                                src={partner.logo}
                                alt={partner.name}
                                className={`w-full h-full object-cover ${partner.id === 1 ? 'scale-110' : 'p-1'}`}
                            />
                        ) : (
                            <span className="text-xl font-black">{partner.name[0]}</span>
                        )}
                    </div>
                </div>

                {/* Main Content Area - Scroll on LEFT */}
                <div
                    className={`flex-1 overflow-y-auto custom-scrollbar-${partner.id} flex flex-col`}
                    style={{ direction: 'rtl' }}
                >
                    <div style={{ direction: 'ltr' }} className="px-12 lg:pr-16 lg:pl-24 py-4 pb-20">
                        <div className="space-y-12 w-full">
                            {/* Title Section */}
                            <div>
                                <span
                                    className="inline-flex px-3 py-1 rounded-lg bg-gray-50 dark:bg-white/5 text-[9px] font-black uppercase tracking-widest mb-4"
                                    style={{ color: brandColor }}
                                >
                                    {partner.category}
                                </span>
                                <h3 className="text-5xl lg:text-6xl font-black text-gray-900 dark:text-white leading-tight tracking-tighter">
                                    {partner.name}
                                </h3>
                                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500 mt-2">
                                    ALIADO ESTRATÉGICO CONFIRMADO
                                </p>
                            </div>

                            {/* Description */}
                            <div className="space-y-4">
                                <h4
                                    className="text-[10px] font-black uppercase tracking-widest flex items-center gap-3"
                                    style={{ color: brandColor }}
                                >
                                    <Target size={14} strokeWidth={3} />
                                    <span>Misión & Propósito</span>
                                </h4>
                                <p className="text-gray-600 dark:text-gray-400 text-lg font-medium leading-relaxed bg-gray-50/50 dark:bg-white/5 p-8 rounded-[2rem] border border-gray-100 dark:border-white/5">
                                    {partner.details?.desc || 'Comprometidos con la transformación ambiental y la creación de valor sostenible para toda nuestra comunidad.'}
                                </p>
                            </div>

                            {/* Stats / Impact */}
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { icon: Gift, value: partner.stats?.prizes || '10+', label: 'Premios' },
                                    { icon: Users2, value: partner.stats?.exchanges || '500+', label: 'Canjes' }
                                ].map((stat, i) => (
                                    <div key={i} className="p-6 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                                            style={{ backgroundColor: `${brandColor}15`, color: brandColor }}
                                        >
                                            <stat.icon size={20} strokeWidth={2.5} />
                                        </div>
                                        <div className="text-2xl font-black text-gray-900 dark:text-white leading-none">{stat.value}</div>
                                        <div className="text-[9px] uppercase font-bold tracking-widest text-gray-400 mt-1">{stat.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Engagement Block (Only visible on Mobile) */}
                            <div
                                style={{ backgroundColor: brandColor }}
                                className="p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group shadow-lg md:hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full" />
                                <div className="flex items-center gap-3 mb-4 relative z-10">
                                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                                        <Heart size={20} className="fill-white" />
                                    </div>
                                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em]">Compromiso Verde</h4>
                                </div>
                                <p className="text-emerald-50 text-base leading-relaxed font-medium relative z-10 opacity-90">
                                    {partner.details?.about || 'Estamos redefiniendo el impacto social a través de acciones climáticas directas y tecnología responsable.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Decor */}
                <div className="py-12 p-12 border-t border-gray-100 dark:border-white/5 bg-white/50 dark:bg-[#0f172a]/50 backdrop-blur-sm mt-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-gray-300 dark:text-gray-700 uppercase tracking-[0.6em]">RECYCLEAPP</span>
                            <span className="text-xs font-bold text-gray-900 dark:text-white">Alianzas 2026</span>
                        </div>
                        <Button
                            className="h-14 px-8 rounded-2xl text-white font-black border-none"
                            icon={ExternalLink}
                            style={{ backgroundColor: brandColor, boxShadow: `0 10px 30px -5px ${brandColor}40` }}
                        >
                            Ir al Sitio
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartnerModal;
