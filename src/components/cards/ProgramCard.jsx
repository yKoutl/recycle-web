import React from 'react';
import { Award, ArrowRight } from 'lucide-react';

const ProgramCard = ({ program, t }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group border border-gray-100 dark:border-gray-700 flex flex-col">
            <div className="h-56 overflow-hidden relative">
                <div className="absolute inset-0 bg-gray-900/20 group-hover:bg-gray-900/10 transition-colors z-10" />
                <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 z-20">
                    <span className="bg-white/95 dark:bg-gray-900/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-gray-800 dark:text-gray-200 shadow-sm uppercase tracking-wider">
                        {program.category}
                    </span>
                </div>
                <div className="absolute bottom-4 right-4 z-20">
                    <div className="bg-green-600 text-white px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
                        <Award size={14} /> {program.points} {t.programs.points}
                    </div>
                </div>
            </div>
            <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{program.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed flex-1">{program.description}</p>
                <button className="w-full py-3 rounded-xl border-2 border-green-100 dark:border-green-800 text-green-700 dark:text-green-400 font-bold hover:bg-green-600 hover:text-white hover:border-green-600 transition-all duration-300 flex items-center justify-center gap-2 group-hover:gap-3">
                    {t.programs.cardBtn} <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default ProgramCard;
