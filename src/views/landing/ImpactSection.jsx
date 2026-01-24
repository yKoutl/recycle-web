import React from 'react';
import { CheckCircle, BarChart3 } from 'lucide-react';
import Button from '../../components/shared/Button';

const ImpactSection = ({ t }) => (
    <section className="py-20 bg-white dark:bg-gray-950 transition-colors duration-500">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative">
                <div className="absolute -left-10 -top-10 w-40 h-40 bg-orange-100 dark:bg-orange-900/20 rounded-full blur-3xl"></div>
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-green-100 dark:bg-green-900/20 rounded-full blur-3xl"></div>
                <div className="relative bg-gray-50 dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-xl">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm text-center">
                            <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">85%</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{t.impact.stats.recovered}</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm text-center">
                            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">12M</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{t.impact.stats.water}</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm text-center col-span-2">
                            <div className="text-4xl font-bold text-orange-500 dark:text-orange-400 mb-2">450 Ton</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{t.impact.stats.co2}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="order-1 md:order-2">
                <span className="text-orange-500 dark:text-orange-400 font-bold tracking-wider uppercase text-sm mb-2 block">{t.impact.tag}</span>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">{t.impact.title}</h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-6 leading-relaxed">
                    {t.impact.desc}
                </p>
                <ul className="space-y-4 mb-8">
                    {t.impact.list.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-600 dark:text-green-400">
                                <CheckCircle size={14} />
                            </div>
                            <span className="text-gray-700 dark:text-gray-300">{item}</span>
                        </li>
                    ))}
                </ul>
                <Button icon={BarChart3}>{t.impact.btn}</Button>
            </div>
        </div>
    </section>
);

export default ImpactSection;
