import React, { useState } from 'react';
import { X, Handshake, CheckCircle, Mail, Phone, Globe, ArrowRight, Send } from 'lucide-react';
import Button from '../shared/Button';

const JoinPartnerModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1); // 1: Form, 2: Success
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        comment: ''
    });

    if (!isOpen) return null;

    const benefits = [
        "Visibilidad en nuestra plataforma global",
        "Conexión con comunidad eco-consciente",
        "Promoción de productos sostenibles",
        "Contribuye al cuidado del planeta"
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        // Basic validation
        if (!formData.name || !formData.email) return;

        // Simulate API call
        setTimeout(() => {
            setStep(2);
        }, 500);
    };

    const handleClose = () => {
        setStep(1);
        setFormData({ name: '', email: '', comment: '' });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={handleClose}></div>

            <div className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col md:flex-row h-auto max-h-[90vh]">

                {/* Visual Side (Left) */}
                <div className="hidden md:flex md:w-2/5 bg-emerald-600 p-8 text-white relative flex-col justify-between overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-white/10 pattern-circuit opacity-20"></div>

                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/30">
                            <Handshake size={32} />
                        </div>
                        <h2 className="text-3xl font-bold mb-4 leading-tight">Únete a nuestra rede de aliados</h2>
                        <p className="text-emerald-50 mb-8 opacity-90">
                            Conecta tu empresa con miles de usuarios comprometidos con el medio ambiente.
                        </p>

                        <div className="space-y-4">
                            <h3 className="font-bold border-b border-white/20 pb-2 mb-4 text-sm uppercase tracking-wider opacity-80">Beneficios</h3>
                            <ul className="space-y-3">
                                {benefits.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-sm">
                                        <div className="mt-0.5 min-w-[18px] h-[18px] bg-emerald-500/50 rounded-full flex items-center justify-center">
                                            <CheckCircle size={12} />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="relative z-10 mt-8 pt-6 border-t border-white/10 text-xs opacity-70">
                        <p>¿Dudas? Contáctanos:</p>
                        <p className="font-bold mt-1">convenios@nosplanet.pe</p>
                    </div>
                </div>

                {/* Form Side (Right) */}
                <div className="w-full md:w-3/5 bg-white dark:bg-gray-900 flex flex-col">
                    <div className="flex justify-end p-4">
                        <button onClick={handleClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="px-8 pb-8 overflow-y-auto custom-scrollbar flex-1">
                        {step === 1 ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Solicitud de alianza</h3>
                                    <p className="text-gray-500 text-sm">Completa tus datos y nos pondremos en contacto.</p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nombre o Razón Social</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                                            placeholder="Ej. EcoSolutions SAC"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Correo Corporativo</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                                            placeholder="contacto@empresa.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Comentario o Mensaje</label>
                                        <textarea
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all min-h-[100px] dark:text-white resize-none"
                                            placeholder="Cuéntanos brevemente sobre tu empresa y por qué te gustaría ser aliado..."
                                            value={formData.comment}
                                            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                        ></textarea>
                                    </div>
                                </div>

                                <Button type="submit" className="w-full py-4 text-lg justify-center shadow-lg shadow-emerald-500/20" icon={Send}>
                                    Enviar Solicitud
                                </Button>
                            </form>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center py-12 animate-in slide-in-from-right-5 duration-500">
                                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce-once">
                                    <CheckCircle size={48} />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">¡Solicitud Recibida!</h3>
                                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl max-w-sm mx-auto mb-8 border border-gray-100 dark:border-gray-700">
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                                        Gracias <strong>{formData.name}</strong>. Hemos enviado un correo de confirmación a <strong>{formData.email}</strong>.
                                        <br /><br />
                                        Nuestro equipo comercial revisará tu perfil y te contactará en las próximas 24 horas.
                                    </p>
                                </div>
                                <Button onClick={handleClose} variant="outline" className="px-8">
                                    Volver al inicio
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JoinPartnerModal;
