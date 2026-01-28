import React from 'react';
import { Star, Building2, Users, MapPin, ChevronRight } from 'lucide-react';

const ProgramCard = ({ program, t }) => {
    // Helper to determine styling based on type
    const getTypeStyles = (type) => {
        switch (type) {
            case 'government':
                return {
                    badge: 'Estado Peruano',
                    bg: 'bg-blue-500',
                    btn: 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/30'
                };
            case 'company':
                return {
                    badge: 'Nos Planet',
                    bg: 'bg-[#018F64]',
                    btn: 'bg-[#018F64] hover:bg-[#017F58] shadow-[#018F64]/30'
                };
            case 'ong':
                return {
                    badge: 'ONG',
                    bg: 'bg-rose-500',
                    btn: 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/30'
                };
            default:
                return {
                    badge: 'Programa',
                    bg: 'bg-gray-500',
                    btn: 'bg-gray-500 hover:bg-gray-600 shadow-gray-500/30'
                };
        }
    };

    const styles = getTypeStyles(program.type);

    return (
        <div className="bg-white dark:bg-[#112A22] rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-emerald-900/40 transition-all duration-300 border border-gray-100 dark:border-emerald-700/30 flex flex-col h-full transform hover:-translate-y-1 group">
            {/* Image Header */}
            <div className="h-56 relative overflow-hidden">
                <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />

                {/* Ecopoints Badge (Top Left) */}
                <div className="absolute top-4 left-4">
                    <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md border border-gray-100">
                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-bold text-yellow-600">{program.ecopoints} ecopuntos</span>
                    </div>
                </div>

                {/* Type Badge (Top Right) */}
                <div className="absolute top-4 right-4">
                    <span className={`${styles.bg} text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-md uppercase tracking-wide`}>
                        {styles.badge}
                    </span>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-6 flex-1 flex flex-col">
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-emerald-400 transition-colors mb-2 leading-tight">
                    {program.title}
                </h3>

                {/* Organization */}
                <div className="flex items-center gap-2 mb-5">
                    <Building2 size={16} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-500 dark:text-emerald-200/70">
                        {program.organization}
                    </span>
                </div>

                {/* Stats Row */}
                <div className="border-t border-gray-100 dark:border-gray-700 my-4"></div>

                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Users size={16} className="text-[#018F64] dark:text-emerald-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-300 font-bold">{program.participants} participantes</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-[#018F64] dark:text-emerald-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-300 font-bold">{program.location}</span>
                    </div>
                </div>

                {/* Button */}
                <button className={`w-full py-3 rounded-xl text-white font-bold text-sm tracking-wide shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 mt-auto ${styles.btn}`}>
                    {t.programs.cardBtn || 'Ver programa'} <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default ProgramCard;
