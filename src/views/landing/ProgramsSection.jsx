import React from 'react';
import ProgramCard from '../../components/cards/ProgramCard';
import { MOCK_PROGRAMS } from '../../data/mockData';

const ProgramsSection = ({ t }) => (
    <section className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-500 relative">
        <div className="container mx-auto px-6">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 space-y-4">
                <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase">
                    {t.programs.tag}
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">{t.programs.title}</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t.programs.subtitle}
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {MOCK_PROGRAMS(t).map((program) => (
                    <ProgramCard key={program.id} program={program} t={t} />
                ))}
            </div>
        </div>
    </section>
);

export default ProgramsSection;
