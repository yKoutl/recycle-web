import React, { useEffect } from 'react';
import { X, Building2, Users, MapPin, Star, CheckCircle, Info, Phone, Mail, Globe, Heart } from 'lucide-react';

const ProgramModal = ({ program, isOpen, onClose }) => {
    // Robust scroll locking
    useEffect(() => {
        if (isOpen) {
            const originalStyle = window.getComputedStyle(document.body).overflow;
            document.body.style.overflow = 'hidden';

            return () => {
                document.body.style.overflow = originalStyle === 'hidden' ? '' : originalStyle;
                if (!document.body.style.overflow) document.body.style.overflow = '';
            };
        }
    }, [isOpen]);

    if (!isOpen || !program) return null;

    const getTypeStyles = (type) => {
        switch (type) {
            case 'government':
                return { badge: 'Estado Peruano', bg: 'bg-blue-500', text: 'text-blue-500', btn: 'bg-blue-500 hover:bg-blue-600' };
            case 'company':
                return { badge: 'Nos Planet', bg: 'bg-[#018F64]', text: 'text-[#018F64]', btn: 'bg-[#018F64] hover:bg-[#017F58]' };
            case 'ong':
                return { badge: 'ONG', bg: 'bg-rose-500', text: 'text-rose-500', btn: 'bg-rose-500 hover:bg-rose-600' };
            default:
                return { badge: 'Programa', bg: 'bg-gray-500', text: 'text-gray-500', btn: 'bg-gray-500 hover:bg-gray-600' };
        }
    };

    const styles = getTypeStyles(program.type);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Container - Max Width Increased and Horizontal Flex Layout for Web */}
            <div className="relative w-full max-w-6xl bg-white dark:bg-[#0D201A] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row h-[85vh] animate-in fade-in zoom-in-95 duration-300">

                {/* Close Button - Absolute to the whole modal container (top right) */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors backdrop-blur-sm shadow-lg"
                >
                    <X size={20} />
                </button>

                {/* LEFT SIDE: Image (35% width approx on desktop) */}
                <div className="relative h-48 lg:h-full lg:w-4/12 shrink-0">
                    <img
                        src={program.image}
                        alt={program.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-6 left-6 z-10">
                        <span className={`${styles.bg} text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg`}>
                            {styles.badge}
                        </span>
                    </div>
                    {/* Gradient overlay for better text contrast if needed on mobile, or visual style */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent lg:hidden" />
                </div>

                {/* RIGHT SIDE: Content (65% width approx on desktop) - Flex column to keep footer sticky */}
                <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-[#0D201A] relative">

                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8 lg:p-10 space-y-8">

                        {/* Title & Organization */}
                        <div>
                            {/* Badge shows on left image for large screens, but maybe duplicate here for clarity? No, visual hierarchy is better with just title here. */}
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">{program.title}</h2>
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                <Building2 size={20} />
                                <span className="font-medium text-lg">{program.organization}</span>
                            </div>
                        </div>

                        {/* Stats Row - Horizontal Strip */}
                        <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-5 flex flex-wrap justify-between items-center gap-4 border border-gray-100 dark:border-white/10">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${styles.bg} bg-opacity-10 text-${styles.text.split('-')[1]}-600 dark:text-${styles.text.split('-')[1]}-400`}>
                                    <Users size={20} className={styles.text} />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900 dark:text-white text-base">{program.participants}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Participantes</div>
                                </div>
                            </div>
                            <div className="w-px h-10 bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${styles.bg} bg-opacity-10`}>
                                    <MapPin size={20} className={styles.text} />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900 dark:text-white text-base">{program.location}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Ubicación</div>
                                </div>
                            </div>
                            <div className="w-px h-10 bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                                    <Star size={20} className="text-yellow-500 fill-yellow-500" />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900 dark:text-white text-base">{program.ecopoints}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Ecopuntos</div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white mb-3">
                                <Info size={20} className="text-gray-400" /> Sobre el Programa
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                                {program.details.about}
                            </p>
                        </div>

                        {/* Objectives & Activities Grid */}
                        <div className="grid sm:grid-cols-2 gap-8">
                            <div>
                                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white mb-4">
                                    <div className={`${styles.bg} p-1 rounded-md text-white`}><CheckCircle size={16} /></div> Objetivos
                                </h3>
                                <ul className="space-y-3">
                                    {program.details.objectives.map((obj, idx) => (
                                        <li key={idx} className="flex gap-3 text-gray-600 dark:text-gray-300 text-sm md:text-base">
                                            <div className={`mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full ${styles.bg}`} />
                                            <span>{obj}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white mb-4">
                                    <div className="bg-orange-500 p-1 rounded-md text-white"><CheckCircle size={16} /></div> Actividades
                                </h3>
                                <ul className="space-y-3">
                                    {program.details.activities.map((act, idx) => (
                                        <li key={idx} className="flex gap-3 text-gray-600 dark:text-gray-300 text-sm md:text-base">
                                            <div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-gray-400" />
                                            <span>{act}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Contact Info (Compact Row) */}
                        <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-5 border border-blue-100 dark:border-blue-900/20">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">Información de Contacto</h3>
                            <div className="grid sm:grid-cols-3 gap-4">
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm truncate">
                                    <Mail size={16} className="shrink-0 text-blue-500" /> <span className="truncate">{program.details.contact.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm truncate">
                                    <Phone size={16} className="shrink-0 text-blue-500" /> <span>{program.details.contact.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm truncate">
                                    <Globe size={16} className="shrink-0 text-blue-500" /> <span className="truncate">{program.details.contact.web}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Button - Sticky at bottom right */}
                    <div className="p-6 lg:p-8 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 z-10 shrink-0 backdrop-blur-sm">
                        <button className={`${styles.btn} w-full py-4 rounded-xl text-white font-bold text-lg shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 hover:-translate-y-1 transition-all duration-300 ring-4 ring-white dark:ring-gray-900`}>
                            <Heart className="fill-white animate-pulse" size={24} /> Quiero Participar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgramModal;
