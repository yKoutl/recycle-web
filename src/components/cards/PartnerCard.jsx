import React from 'react';

const PartnerCard = ({ partner, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="group relative bg-[#D5F6ED] dark:bg-emerald-900/40 backdrop-blur-md border border-white/20 dark:border-emerald-500/30 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
        >
            {/* Colored Header */}
            <div className={`h-24 w-full ${partner.bgHeader || 'bg-gray-500'} relative`}>
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent"></div>
            </div>

            {/* Logo Container - Floating overlap */}
            <div className="flex justify-center -mt-10 relative z-10">
                <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md border-4 border-white dark:border-gray-900 text-2xl font-bold text-gray-700 dark:text-white transition-transform duration-300 group-hover:scale-110">
                    {partner.logo}
                </div>
            </div>

            {/* Content */}
            <div className="p-6 pt-2 text-center flex-1 flex flex-col items-center">
                <span className="inline-block bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded-md mb-2 uppercase tracking-wide">
                    {partner.category}
                </span>
                <h4 className="font-bold text-gray-900 dark:text-white text-xl mb-2">{partner.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-4">
                    {partner.details?.desc || 'Aliado estratégico para el reciclaje.'}
                </p>

                <div className="mt-auto w-full pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-green-600 dark:text-green-400 font-bold text-sm group-hover:underline">
                    <span>Ver beneficios</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </div>
            </div>
        </div>
    );
};

export default PartnerCard;
