import React from 'react';
import { Globe, Heart } from 'lucide-react';
import Button from '../../components/shared/Button';

const AboutSection = ({ t }) => (
    <section className="py-24 bg-gray-900 dark:bg-black text-white relative overflow-hidden transition-colors duration-500">
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-green-900/40 to-transparent"></div>
        <div className="container mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
                <div>
                    <span className="text-green-400 font-bold tracking-wider uppercase text-sm mb-2 block">{t.about.tag}</span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">{t.about.title}</h2>
                    <p className="text-gray-300 text-lg leading-relaxed mb-8">
                        {t.about.subtitle}
                    </p>

                    <div className="grid sm:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white/5 backdrop-blur border border-white/10 p-5 rounded-xl">
                            <div className="text-green-400 mb-3"><Globe size={28} /></div>
                            <h4 className="font-bold text-lg mb-1">{t.about.global.title}</h4>
                            <p className="text-sm text-gray-400">{t.about.global.desc}</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur border border-white/10 p-5 rounded-xl">
                            <div className="text-green-400 mb-3"><Heart size={28} /></div>
                            <h4 className="font-bold text-lg mb-1">{t.about.passion.title}</h4>
                            <p className="text-sm text-gray-400">{t.about.passion.desc}</p>
                        </div>
                    </div>

                    <Button variant="primary">{t.about.btn}</Button>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <img src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=600" className="rounded-3xl shadow-2xl transform translate-y-12 hover:-translate-y-10 transition-transform duration-700 ease-in-out opacity-90 hover:opacity-100" alt="Team" />
                    <img src="https://images.unsplash.com/photo-1591522810850-58128c5fb089?auto=format&fit=crop&q=80&w=600" className="rounded-3xl shadow-2xl hover:translate-y-2 transition-transform duration-500 opacity-90 hover:opacity-100" alt="Community" />
                </div>
            </div>
        </div>
    </section>
);

export default AboutSection;
