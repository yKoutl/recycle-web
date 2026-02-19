import React, { useState, useEffect } from 'react';
import { Handshake, ChevronUp, ChevronDown, Sparkles, Star, Target, Zap, Leaf, ArrowRight, ClipboardList, FileText, ShieldCheck, FileCheck, GraduationCap, Heart } from 'lucide-react';
import Button from '../../components/shared/Button';
import PartnerModal from '../../components/modals/PartnerModal';
import JoinPartnerModal from '../../components/modals/JoinPartnerModal';
import { MOCK_PARTNERS } from '../../data/mockData';
import { useGetPartnersQuery } from '../../store/partners';

const PartnersSection = ({ t }) => {
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    const { data: dbPartners = [], isLoading } = useGetPartnersQuery();

    // Reactive check for mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Combinar Mock (Nos Planet) con data Real (DB)
    const partners = [
        MOCK_PARTNERS(t)[0], // Nos Planet siempre primero
        ...dbPartners
            .filter(p => p.isVisible) // Solo los que activaste con el "ojito"
            .map(p => ({
                id: p._id,
                name: p.name,
                category: p.typeLabel || 'Aliado',
                logo: p.logo,
                hex: p.mainColor || '#018F64',
                textColor: 'text-emerald-600',
                details: {
                    desc: p.description,
                    about: p.description
                }
            }))
    ];

    // Configuration constants
    const cardHeight = isMobile ? 320 : 420;
    const smallCardHeight = isMobile ? 80 : 130;
    const gap = 24;
    const containerHeight = isMobile ? 360 : 680;

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % partners.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + partners.length) % partners.length);
    };

    const handleCardClick = (partner) => {
        setSelectedPartner(partner);
        setIsProductModalOpen(true);
    };

    const getPartnerIcon = (index, size = 26) => {
        const icons = [ClipboardList, FileText, ShieldCheck, FileCheck, GraduationCap, Heart, Zap, Star];
        const Icon = icons[index % icons.length];
        return <Icon size={size} />;
    };

    const translateY = -(currentIndex * (smallCardHeight + gap)) + (containerHeight / 2 - cardHeight / 2);

    return (
        <section id="partners" className="py-16 lg:py-24 bg-[#FEFDFB] dark:bg-[#020617] relative overflow-hidden transition-colors duration-500">
            {/* Grid background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.08] dark:opacity-[0.04]"
                style={{
                    backgroundImage: `linear-gradient(#018F6420 1px, transparent 1px), linear-gradient(90deg, #018F6420 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            ></div>

            <PartnerModal
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                partner={selectedPartner}
            />

            <JoinPartnerModal
                isOpen={isJoinModalOpen}
                onClose={() => setIsJoinModalOpen(false)}
            />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-0 max-w-7xl mx-auto">

                    {/* LEFT SIDE */}
                    <div className="w-full lg:w-[42%] space-y-6 lg:space-y-8 text-left z-20">
                        <div className="inline-block">
                            <div className="flex items-center gap-3">
                                <p className="text-[10px] font-black text-[#018F64] dark:text-[#10B981] uppercase tracking-[0.3em] whitespace-nowrap">
                                    ALIADOS ESTRATÉGICOS
                                </p>
                                <div className="w-12 h-[2px] bg-[#018F64] dark:bg-[#10B981]" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-gray-900 dark:text-white tracking-tighter leading-[0.95] lg:-ml-1">
                                Todo lo que <br className="hidden lg:block" /> necesitas para <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#018F64] to-[#018F64] dark:from-[#B0EEDE] dark:to-[#B0EEDE]">
                                    alianzas de impacto
                                </span>
                            </h2>
                        </div>

                        <p className="text-gray-500 dark:text-gray-400 text-lg lg:text-xl font-medium max-w-md leading-relaxed">
                            Conectamos empresas conscientes con tecnología avanzada para facilitar la economía circular.
                        </p>

                        <div className="pt-2 lg:pt-4">
                            <Button
                                onClick={() => setIsJoinModalOpen(true)}
                                className="h-14 lg:h-16 px-10 lg:px-12 rounded-2xl text-base lg:text-lg font-black bg-[#018F64] dark:bg-[#B0EEDE] dark:text-[#020617] text-white shadow-2xl shadow-[#018F64]/30 border-none transition-all hover:scale-105 active:scale-95 flex items-center gap-4"
                                icon={Handshake}
                            >
                                Quiero ser Aliado
                            </Button>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="w-full lg:w-[58%] flex flex-col lg:flex-row items-center justify-center lg:justify-end gap-4 lg:gap-8 min-h-[500px] lg:min-h-[750px] relative mt-4 lg:mt-0">

                        {/* 1. ICON PILL INDICATORS */}
                        <div className="w-full lg:w-auto flex justify-center lg:order-3 mb-2 lg:mb-0 lg:ml-6 shrink-0 z-30">
                            <div className="bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl rounded-[2rem] lg:rounded-[3rem] p-3 lg:p-5 shadow-2xl border border-gray-100 dark:border-white/5 grid grid-rows-2 grid-cols-5 lg:grid-cols-2 lg:grid-rows-5 lg:grid-flow-col gap-3 lg:gap-4 transition-all duration-700">
                                {partners.map((p, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentIndex(idx)}
                                        style={{ backgroundColor: idx === currentIndex ? p.hex : 'transparent' }}
                                        className={`w-10 h-10 lg:w-14 lg:h-14 rounded-full flex items-center justify-center shrink-0 transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) overflow-hidden
                                            ${idx === currentIndex
                                                ? 'text-white shadow-2xl ring-4 ring-gray-400/10 scale-110'
                                                : 'text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                                            }`}
                                    >
                                        {p.logo ? (
                                            <img
                                                src={p.logo}
                                                alt={p.name}
                                                className={`w-full h-full object-cover ${p.id === 1 ? 'scale-110' : 'p-2'}`}
                                            />
                                        ) : (
                                            getPartnerIcon(idx, isMobile ? 18 : 22)
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-4 lg:gap-8 w-full lg:w-auto">

                            {/* 2. ARROWS (Solo escritorio) */}
                            <div className="hidden lg:flex flex-col justify-center gap-4 shrink-0 transition-all duration-500 z-30">
                                <button
                                    onClick={prevSlide}
                                    className="w-10 h-10 lg:w-16 lg:h-16 rounded-full bg-white dark:bg-gray-800 shadow-2xl flex items-center justify-center text-gray-400 hover:text-emerald-500 transition-all border border-gray-100 dark:border-gray-700 hover:scale-110 active:scale-95 group"
                                >
                                    <ChevronUp size={isMobile ? 24 : 32} className="group-hover:-translate-y-1 transition-transform" />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="w-10 h-10 lg:w-16 lg:h-16 rounded-full bg-white dark:bg-gray-800 shadow-2xl flex items-center justify-center text-gray-400 hover:text-emerald-500 transition-all border border-gray-100 dark:border-gray-700 hover:scale-110 active:scale-95 group"
                                >
                                    <ChevronDown size={isMobile ? 24 : 32} className="group-hover:translate-y-1 transition-transform" />
                                </button>
                            </div>

                            {/* 3. CENTER CAROUSEL */}
                            <div className={`relative w-[300px] md:w-[320px] lg:w-[450px] overflow-hidden mask-vertical`} style={{ height: `${containerHeight}px` }}>
                                <div
                                    className="absolute inset-x-0 top-0 flex flex-col items-center gap-6 transition-transform duration-1000 cubic-bezier(0.23, 1, 0.32, 1)"
                                    style={{
                                        transform: `translateY(${translateY}px)`
                                    }}
                                >
                                    {partners.map((partner, index) => {
                                        const isCenter = index === currentIndex;

                                        return (
                                            <div
                                                key={`${partner.id}-${index}`}
                                                onClick={() => isCenter && handleCardClick(partner)}
                                                style={{
                                                    height: isCenter ? `${cardHeight}px` : `${smallCardHeight}px`,
                                                    boxShadow: isCenter ? `0 40px 100px -20px ${partner.hex}40` : 'none',
                                                    borderColor: isCenter ? `${partner.hex}20` : undefined
                                                }}
                                                className={`w-full bg-white dark:bg-[#0f172a] rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden transition-all duration-1000 cubic-bezier(0.23, 1, 0.32, 1) cursor-pointer border border-gray-100 dark:border-white/5 flex flex-col shrink-0
                                                    ${isCenter
                                                        ? 'z-20 opacity-100 scale-100 ring-2'
                                                        : 'z-0 opacity-20 scale-[0.85] blur-[3px] pointer-events-none'}`}
                                            >
                                                <div
                                                    style={{ backgroundColor: partner.hex }}
                                                    className={`transition-all duration-1000 cubic-bezier(0.23, 1, 0.32, 1) ${isCenter ? 'h-20 lg:h-36' : 'h-10 lg:h-16'} relative flex items-center justify-center shrink-0`}
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                                                    <div className={`rounded-full border-[4px] lg:border-[6px] ring-2 lg:ring-4 ring-white/15 shadow-xl flex items-center justify-center text-white transition-all duration-1000 cubic-bezier(0.23, 1, 0.32, 1) overflow-hidden
                                                        ${isCenter ? 'w-16 h-16 lg:w-24 lg:h-24' : 'w-8 h-8 lg:w-12 lg:h-12 opacity-30 shadow-none'}`}
                                                        style={{ backgroundColor: partner.hex, borderColor: partner.hex }}
                                                    >
                                                        {partner.logo ? (
                                                            <img src={partner.logo} alt={partner.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <>
                                                                {index % 4 === 0 && <Target size={isCenter ? (isMobile ? 30 : 48) : 16} />}
                                                                {index % 4 === 1 && <Star size={isCenter ? (isMobile ? 30 : 48) : 16} />}
                                                                {index % 4 === 2 && <Zap size={isCenter ? (isMobile ? 30 : 48) : 16} />}
                                                                {index % 4 === 3 && <Sparkles size={isCenter ? (isMobile ? 30 : 48) : 16} />}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Content Wrapper specifically for Action Button visibility */}
                                                <div className={`relative p-6 lg:p-8 flex flex-col flex-1 transition-all duration-1000 cubic-bezier(0.23, 1, 0.32, 1) ${isCenter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                                    <div className={`inline-flex self-start px-2 py-0.5 lg:px-3 lg:py-1 rounded-lg bg-gray-50 dark:bg-white/5 text-[8px] lg:text-[10px] font-black uppercase tracking-[0.2em] mb-3 lg:mb-4 ${partner.textColor}`}>
                                                        ALIADO ESTRATÉGICO
                                                    </div>
                                                    <h4 className="text-2xl lg:text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter leading-none">{partner.name}</h4>
                                                    <p className="text-xs lg:text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-4 line-clamp-2 lg:line-clamp-none max-w-[90%]">
                                                        {partner.details.desc || 'Beneficios exclusivos en la plataforma Nos Planet para impulsar tu rentabilidad y sostenibilidad.'}
                                                    </p>

                                                    {/* Absolute Action Arrow to prevent flex/rounding clipping issues */}
                                                    <div className={`absolute bottom-6 right-6 lg:bottom-8 lg:right-8 transition-all duration-1000 delay-300 ${isCenter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                                                        <div
                                                            style={{ backgroundColor: partner.hex }}
                                                            className="w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center text-white shadow-2xl shadow-gray-400/30 group hover:scale-110 active:scale-95 transition-all"
                                                        >
                                                            <ArrowRight size={isMobile ? 18 : 28} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes bounce-soft {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-4px); }
                }
                .animate-bounce-soft {
                    animation: bounce-soft 3s ease-in-out infinite;
                }
                .mask-vertical {
                    mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
                    -webkit-mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}} />
        </section>
    );
};

export default React.memo(PartnersSection);
