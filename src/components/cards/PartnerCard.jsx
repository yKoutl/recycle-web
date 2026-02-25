import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const PartnerCard = ({ partner, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="group relative bg-white border border-slate-100 rounded-[2.5rem] p-8 transition-all duration-500 cursor-pointer flex flex-col hover:shadow-[0_20px_60px_-15px_rgba(15,23,42,0.1)] hover:border-emerald-100"
        >
            {/* Top Row: Logo & Category */}
            <div className="flex justify-between items-start mb-8">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 overflow-hidden">
                    {typeof partner.logo === 'string' && !partner.logo.includes('/') ? (
                        <span className="text-xl font-black text-slate-900">{partner.logo}</span>
                    ) : partner.logo ? (
                        <img src={partner.logo} alt={partner.name} className="w-full h-full object-cover p-2" />
                    ) : (
                        <span className="text-xl font-black text-slate-900">{partner.name[0]}</span>
                    )}
                </div>
                <span className="px-3 py-1 rounded-lg bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">
                    {partner.category}
                </span>
            </div>

            {/* Content */}
            <h4 className="text-xl font-extrabold text-slate-900 mb-3 tracking-tight group-hover:text-emerald-600 transition-colors">
                {partner.name}
            </h4>
            <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium line-clamp-2">
                {partner.details?.desc || 'Aliado estratégico comprometido con el impacto ambiental.'}
            </p>

            {/* Footer */}
            <div className="mt-auto flex items-center justify-between group-hover:translate-x-1 transition-transform">
                <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">
                    Ver beneficios
                </span>
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                    <ArrowUpRight size={16} strokeWidth={3} />
                </div>
            </div>
        </div>
    );
};


export default PartnerCard;
