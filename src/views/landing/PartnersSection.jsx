import React from 'react';
import { Zap, ArrowRight } from 'lucide-react';
import Button from '../../components/shared/Button';
import PartnerCard from '../../components/cards/PartnerCard';
import { MOCK_PARTNERS } from '../../data/mockData';

const PartnersSection = ({ t }) => (
    <section className="py-24 bg-white dark:bg-gray-950 transition-colors duration-500">
        <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                <div className="max-w-xl">
                    <span className="text-gray-500 dark:text-gray-400 font-bold tracking-wider uppercase text-sm mb-2 block">{t.partners.tag}</span>
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t.partners.title}</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">{t.partners.subtitle}</p>
                </div>
                <Button variant="secondary" icon={Zap}>{t.partners.btn}</Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {MOCK_PARTNERS(t).map((partner) => (
                    <PartnerCard key={partner.id} partner={partner} />
                ))}
                <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 hover:border-green-300 dark:hover:border-green-600 hover:bg-green-50/30 dark:hover:bg-green-900/10 transition-all cursor-pointer">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-full p-4 mb-3 transition-colors">
                        <ArrowRight size={24} />
                    </div>
                    <span className="font-bold">{t.partners.viewAll}</span>
                </div>
            </div>
        </div>
    </section>
);

export default PartnersSection;
