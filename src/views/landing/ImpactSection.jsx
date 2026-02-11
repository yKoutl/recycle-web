import React, { useState } from 'react';
import { Recycle, Droplets, CloudSun, Zap } from 'lucide-react';

const ImpactSection = ({ t }) => {
    const [hoveredMetric, setHoveredMetric] = useState(null);

    const metrics = [
        {
            value: '85%',
            label: 'Residuos Recuperados',
            desc: 'Eficiencia en nuestra red de recolección.',
            icon: Recycle,
            color: '#10B981',
            image: 'https://plus.unsplash.com/premium_photo-1663089270259-5e23b75bfb99?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        },
        {
            value: '12M',
            label: 'Litros de Agua',
            desc: 'Ahorro masivo en procesos industriales.',
            icon: Droplets,
            color: '#3B82F6',
            image: 'https://images.unsplash.com/photo-1553564552-02656d6a2390?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        },
        {
            value: '450T',
            label: 'CO2 Evitado',
            desc: 'Reducción de huella en logística.',
            icon: CloudSun,
            color: '#F59E0B',
            image: 'https://images.unsplash.com/photo-1444491741275-3747c53c99b4?q=80&w=2000&auto=format&fit=crop'
        }
    ];

    const defaultImage = "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000&auto=format&fit=crop";

    return (
        <section id="impact" className="relative py-20 lg:py-28 bg-[#0a1a16] dark:bg-[#020617] overflow-hidden group transition-colors duration-1000">

            {/* 1. DYNAMIC BACKGROUND LAYERS - High Contrast and Moody for both modes */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {/* Default Background */}
                <img
                    src={defaultImage}
                    alt="Default Landscape"
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 
                        ${hoveredMetric !== null ? 'opacity-0' : 'opacity-40 dark:opacity-20 lg:opacity-50'}`}
                />

                {/* Metric Specific Backgrounds */}
                {metrics.map((metric, idx) => (
                    <img
                        key={idx}
                        src={metric.image}
                        alt={metric.label}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 scale-105
                            ${hoveredMetric === idx ? 'opacity-50 dark:opacity-30 lg:opacity-60 scale-100' : 'opacity-0'}`}
                    />
                ))}

                {/* Overlays - Dark cinematic feel for both day and night */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a16] via-transparent to-[#0a1a16]/40 dark:from-[#020617] dark:via-transparent dark:to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a1a16] via-transparent to-[#0a1a16] dark:from-[#020617] dark:to-[#020617]" />

                {/* Extra darkening for day mode to maintain night-like contrast */}
                <div className="absolute inset-0 bg-black/20 dark:hidden" />
            </div>

            <div className="container mx-auto px-6 relative z-10">

                {/* 2. HEADER - Always white text for impact */}
                <div className="max-w-3xl mb-16 lg:mb-20">


                    <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[0.9] mb-6 text-shadow-sm">
                        Resultados <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#B0EEDE]">
                            que transforman
                        </span>
                    </h2>

                    <p className="text-gray-300 dark:text-gray-400 text-lg lg:text-xl font-medium max-w-xl leading-relaxed">
                        Gestionamos datos reales para un compromiso sólido con la Tierra, integrando tecnología y consciencia.
                    </p>
                </div>

                {/* 3. SUBTLE QUOTE AT TOP RIGHT */}
                <div className="absolute top-12 right-8 lg:right-16 opacity-30 select-none pointer-events-none hidden lg:block">
                    <span className="text-sm lg:text-lg font-bold text-white italic tracking-widest whitespace-nowrap">
                        "El impacto real lo generas tú" — NOS PLANET
                    </span>
                </div>

                {/* 4. COMPACT GLASS PILLARS - Dark theme even in day mode */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">

                    {metrics.map((metric, idx) => (
                        <div
                            key={idx}
                            onMouseEnter={() => setHoveredMetric(idx)}
                            onMouseLeave={() => setHoveredMetric(null)}
                            className="relative group/card"
                        >
                            {/* The Glass Card - Dark Glass specifically refined for Day Mode */}
                            <div className={`relative h-full bg-black/40 dark:bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 transition-all duration-500 overflow-hidden
                                ${hoveredMetric === idx ? 'bg-black/60 dark:bg-white/[0.07] -translate-y-2 border-white/20' : 'grayscale-[20%]'}`}
                            >
                                {/* Context Image Preview */}
                                <div className={`absolute inset-0 -z-10 transition-opacity duration-700 pointer-events-none opacity-0 
                                    ${hoveredMetric === idx ? 'opacity-10 dark:opacity-20' : ''}`}
                                >
                                    <img src={metric.image} alt="" className="w-full h-full object-cover" />
                                </div>

                                {/* Icon Circle */}
                                <div
                                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl transition-all duration-500 
                                        group-hover/card:scale-110 group-hover/card:rotate-6 shadow-black/30"
                                    style={{ backgroundColor: metric.color }}
                                >
                                    <metric.icon size={24} strokeWidth={2.5} />
                                </div>

                                {/* Value */}
                                <div className="space-y-1 mb-4">
                                    <div className="text-6xl font-black text-white tracking-tighter leading-none">
                                        {metric.value}
                                    </div>
                                    <div className="text-[11px] font-black uppercase tracking-widest" style={{ color: metric.color }}>
                                        {metric.label}
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-gray-300 dark:text-gray-400 text-base font-medium leading-relaxed group-hover/card:text-white transition-colors">
                                    {metric.desc}
                                </p>
                            </div>

                            {/* Outer Glow */}
                            <div
                                className={`absolute inset-0 -z-20 rounded-[2.5rem] blur-2xl opacity-0 transition-opacity duration-500
                                ${hoveredMetric === idx ? 'opacity-20' : ''}`}
                                style={{ backgroundColor: metric.color }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .text-shadow-sm {
                    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                }
                @keyframes bounce-soft {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-4px); }
                }
                .animate-bounce-soft {
                    animation: bounce-soft 3s ease-in-out infinite;
                }
            `}} />
        </section>
    );
};

export default ImpactSection;
