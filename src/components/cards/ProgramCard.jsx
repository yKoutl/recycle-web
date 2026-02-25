import React from 'react';
import { Building2, MapPin, ChevronRight, Users2, Star } from 'lucide-react';

const getProgramTheme = (type) => {
    switch (type) {
        case 'government': return { primary: '#3B82F6', text: 'text-blue-500', glow: 'rgba(59, 130, 246, 0.4)', label: 'ESTADO PERUANO' };
        case 'company': return { primary: '#018F64', text: 'text-emerald-500', glow: 'rgba(1, 143, 100, 0.4)', label: 'NOS PLANÉT CORE' };
        case 'ong': return { primary: '#EF4444', text: 'text-red-500', glow: 'rgba(239, 68, 68, 0.4)', label: 'PROYECTO ONG' };
        default: return { primary: '#018F64', text: 'text-emerald-500', glow: 'rgba(1, 143, 100, 0.4)', label: 'PARTNER' };
    }
};

const ProgramCard = ({ program, t, isFocused }) => {
    const theme = getProgramTheme(program.type);

    return (
        <div className={`group h-full flex flex-col transition-all duration-700 ${isFocused ? 'brightness-110' : ''}`}>
            {/* 1. DATA HEADER (Premium Editorial Stats) */}
            <div className="px-6 space-y-6 mb-8 order-1">
                <div className={`flex items-center justify-between pb-6 border-b border-gray-100 dark:border-white/5 transition-all duration-700 ${isFocused ? 'border-emerald-500/30' : ''}`}>
                    <div className="flex items-center gap-8">
                        {/* Metrics */}
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] leading-none">COMUNIDAD</p>
                            <div className="flex items-center gap-2 mt-1">
                                <Users2 size={16} className={`${isFocused ? theme.text : 'text-gray-400'} transition-colors duration-500`} />
                                <span className={`text-base font-black transition-colors duration-500 ${isFocused ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-gray-400'}`}>
                                    +{program.participants}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-1 border-l border-gray-100 dark:border-white/5 pl-8">
                            <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] leading-none">UBICACIÓN</p>
                            <div className="flex items-center gap-2 mt-1">
                                <MapPin size={16} className={`${isFocused ? theme.text : 'text-gray-400'} transition-colors duration-500`} />
                                <span className={`text-sm font-black uppercase tracking-tighter transition-colors duration-500 ${isFocused ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-gray-400'}`}>
                                    {program.location.split(',')[0]}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Rotating Identity Icon (Editorial Style) */}
                    <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700 border
                            ${isFocused
                                ? 'bg-gray-900 text-white border-transparent rotate-45 scale-110'
                                : 'bg-white dark:bg-white/5 text-gray-400 border-gray-100 dark:border-white/5'}`}
                    >
                        <Building2 size={24} className={isFocused ? '-rotate-45' : ''} />
                    </div>
                </div>
            </div>

            {/* 2. CINEMATIC IMAGE AREA (Bottom) */}
            <div className={`relative aspect-[4/5] rounded-[3rem] overflow-hidden order-2 transition-all duration-[1s] ease-out 
                ${isFocused
                    ? `shadow-[0_40px_100px_-20px_${theme.glow}] -translate-y-2 scale-[1.02]`
                    : 'shadow-2xl'}`}>

                {/* Main Visual */}
                <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
                />

                {/* Editorial Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/40 via-transparent to-transparent opacity-40" />

                {/* Action Badge (Top Right) */}
                <div className={`absolute top-8 right-8 transition-all duration-700 
                    ${isFocused ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-10 opacity-0 scale-90'}`}>
                    <div className="bg-white text-gray-900 px-5 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 font-black text-[10px] tracking-widest uppercase">
                        <span>UNIRSE</span>
                        <ChevronRight size={14} strokeWidth={4} className="text-emerald-500" />
                    </div>
                </div>

                {/* Ecopoints - High Visibility Editorial Style */}
                <div className="absolute top-8 left-8">
                    <div className="bg-gray-900/80 backdrop-blur-xl border border-white/20 pl-2 pr-5 py-2 rounded-2xl flex items-center gap-3 shadow-2xl overflow-hidden group/points">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white scale-90 group-hover/points:scale-100 transition-transform">
                            <Star size={16} className="fill-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] font-black text-white leading-none">+{program.ecopoints}</span>
                            <span className="text-[7px] font-black text-emerald-400 uppercase tracking-widest leading-none mt-1">ECOPOINTS</span>
                        </div>
                    </div>
                </div>

                {/* Program Brand & Title */}
                <div className="absolute bottom-12 left-10 right-10 space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-[2px] rounded-full" style={{ backgroundColor: theme.primary }} />
                        <span className="text-[10px] font-black text-emerald-100 uppercase tracking-[0.3em]">
                            {theme.label}
                        </span>
                    </div>
                    <h3 className="text-4xl lg:text-5xl font-black text-white leading-[0.9] tracking-tighter transition-colors duration-500 first-letter:uppercase">
                        {program.title}
                    </h3>
                </div>
            </div>
        </div>
    );
};

export default ProgramCard;
