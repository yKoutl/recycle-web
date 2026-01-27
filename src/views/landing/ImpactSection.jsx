import React from 'react';
import { CheckCircle, BarChart3, Recycle, Droplets, CloudSun } from 'lucide-react';
import Button from '../../components/shared/Button';

const ImpactSection = ({ t }) => (
    <section className="py-24 bg-white dark:bg-gray-950 transition-colors duration-500">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative">
                <div className="absolute -left-10 -top-10 w-40 h-40 bg-[#D5F6ED] dark:bg-[#109A71]/20 rounded-full blur-3xl"></div>
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#B7ECDC] dark:bg-[#109A71]/20 rounded-full blur-3xl"></div>
                <div className="relative bg-white/50 dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-xl backdrop-blur-sm">
                    <div className="grid grid-cols-2 gap-6">
                        {/* Card 1: Recovered - #D5F6ED */}
                        <div className="bg-[#D5F6ED] dark:bg-emerald-900/30 p-6 rounded-2xl border border-transparent dark:border-emerald-800 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col items-center justify-center text-center h-full">
                            <div className="mb-4 p-3 bg-white/60 dark:bg-[#109A71]/30 text-[#109A71] dark:text-emerald-400 rounded-full group-hover:scale-110 transition-transform duration-300">
                                <Recycle size={28} strokeWidth={1.5} />
                            </div>
                            <div className="text-4xl font-extrabold text-[#109A71] dark:text-white mb-2 tracking-tight">85%</div>
                            <div className="text-xs font-bold text-[#109A71]/80 dark:text-emerald-200/80 uppercase tracking-widest">{t.impact.stats.recovered}</div>
                        </div>

                        {/* Card 2: Water - #B7ECDC */}
                        <div className="bg-[#B7ECDC] dark:bg-emerald-900/30 p-6 rounded-2xl border border-transparent dark:border-emerald-800 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col items-center justify-center text-center h-full">
                            <div className="mb-4 p-3 bg-white/60 dark:bg-[#109A71]/30 text-[#109A71] dark:text-emerald-400 rounded-full group-hover:scale-110 transition-transform duration-300">
                                <Droplets size={28} strokeWidth={1.5} />
                            </div>
                            <div className="text-4xl font-extrabold text-[#109A71] dark:text-white mb-2 tracking-tight">12M</div>
                            <div className="text-xs font-bold text-[#109A71]/80 dark:text-emerald-200/80 uppercase tracking-widest">{t.impact.stats.water}</div>
                        </div>

                        {/* Card 3: CO2 - Mint Green Tint */}
                        <div className="bg-[#F0FDF4] dark:bg-gray-800 p-8 rounded-2xl border-2 border-[#D5F6ED] dark:border-emerald-900 shadow-sm hover:shadow-md hover:border-[#109A71] dark:hover:border-emerald-600 transition-all duration-300 group col-span-2 flex items-center justify-between">
                            <div className="text-left">
                                <div className="text-5xl font-extrabold text-[#109A71] dark:text-white mb-2 tracking-tight">450 Ton</div>
                                <div className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{t.impact.stats.co2}</div>
                            </div>
                            <div className="p-4 bg-[#D5F6ED] dark:bg-emerald-900/30 text-[#109A71] dark:text-emerald-400 rounded-full group-hover:scale-110 transition-transform duration-300">
                                <CloudSun size={36} strokeWidth={1.5} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="order-1 md:order-2">
                <span className="bg-[#D5F6ED] dark:bg-emerald-900/40 text-[#109A71] dark:text-emerald-400 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase inline-block mb-3">
                    {t.impact.tag}
                </span>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">{t.impact.title}</h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-6 leading-relaxed">
                    {t.impact.desc}
                </p>
                <ul className="space-y-4 mb-8">
                    {t.impact.list.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-[#D5F6ED] dark:bg-emerald-900/40 flex items-center justify-center text-[#109A71] dark:text-emerald-400">
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
