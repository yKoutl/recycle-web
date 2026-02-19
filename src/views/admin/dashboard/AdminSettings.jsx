import React from 'react';
import { Moon, Sun, Globe, Bell, Shield, User, ChevronRight, Smartphone, Mail, Lock, Bot } from 'lucide-react';

const AdminSettings = ({ t, darkMode, setDarkMode, lang, setLang, user, showBot, setShowBot }) => {
    const sections = [
        {
            title: t.admin?.settings?.appearance || "Apariencia y Sistema",
            description: "Personaliza tu experiencia visual y regional.",
            items: [
                {
                    id: 'theme',
                    label: "Modo Oscuro",
                    sublabel: darkMode ? "Activado (Cuidando tus ojos)" : "Desactivado (Modo Claro)",
                    icon: darkMode ? Moon : Sun,
                    action: () => setDarkMode(!darkMode),
                    type: 'toggle',
                    value: darkMode
                },
                {
                    id: 'lang',
                    label: "Idioma del Sistema",
                    sublabel: "Solo Español disponible por ahora (BETA)",
                    icon: Globe,
                    type: 'select',
                    value: 'es',
                    disabled: true,
                    options: [
                        { value: 'es', label: 'Español' },
                        { value: 'en', label: 'English (Próximamente)' }
                    ],
                    onChange: (e) => setLang(e.target.value)
                },
                {
                    id: 'bot',
                    label: "Asistente PlanetBot",
                    sublabel: showBot ? "Activado (Visible en pantalla)" : "Desactivado (Oculto)",
                    icon: Bot,
                    type: 'toggle',
                    value: showBot,
                    action: () => setShowBot(!showBot)
                }
            ]
        },
        {
            title: "Perfil y Seguridad",
            description: "Gestiona tu información personal y acceso.",
            items: [
                {
                    id: 'profile',
                    label: "Información de Perfil",
                    sublabel: user?.fullName || "Administrador",
                    icon: User,
                    type: 'link',
                    badge: user?.role
                },
                {
                    id: 'email',
                    label: "Correo Vinculado",
                    sublabel: user?.email || "admin@recycleapp.com",
                    icon: Mail,
                    type: 'info'
                },
                {
                    id: 'security',
                    label: "Contraseña y Autenticación",
                    sublabel: "Último cambio hace 3 días",
                    icon: Lock,
                    type: 'button',
                    btnText: "Cambiar"
                }
            ]
        },
        {
            title: "Notificaciones",
            description: "Controla qué alertas deseas recibir.",
            items: [
                {
                    id: 'notif_email',
                    label: "Alertas por Correo",
                    sublabel: "Recibir resúmenes semanales",
                    icon: Bell,
                    type: 'toggle',
                    value: true
                },
                {
                    id: 'notif_push',
                    label: "Notificaciones Push",
                    sublabel: "Alertas en tiempo real",
                    icon: Smartphone,
                    type: 'toggle',
                    value: false
                }
            ]
        }
    ];

    return (
        <div className="space-y-8 animate-fade-in max-w-4xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-gray-100 dark:border-white/5 pb-6">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase italic mb-2">
                        Configuración <span className="text-[#018F64]">General</span>
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
                        Administra las preferencias globales de tu panel de control.
                    </p>
                </div>
            </div>

            <div className="grid gap-8">
                {sections.map((section, idx) => (
                    <div key={idx} className="bg-white dark:bg-[#111827] rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-200/20 dark:shadow-none overflow-hidden relative">
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 dark:bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none opacity-50" />

                        <div className="relative z-10 mb-8">
                            <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wider mb-1">
                                {section.title}
                            </h3>
                            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                {section.description}
                            </p>
                        </div>

                        <div className="space-y-4 relative z-10">
                            {section.items.map((item, itemIdx) => (
                                <div key={itemIdx} className="flex items-center justify-between p-4 rounded-3xl bg-gray-50/50 dark:bg-black/20 border border-transparent hover:border-[#018F64]/20 hover:bg-white dark:hover:bg-white/5 transition-all group">
                                    <div className="flex items-center gap-5">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-[#018F64] dark:text-[#B0EEDE] shadow-sm transition-transform group-hover:scale-110 ${item.value || item.value === undefined ? 'bg-white dark:bg-white/5' : 'bg-gray-200 dark:bg-white/5 grayscale'}`}>
                                            <item.icon size={22} strokeWidth={2} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                                {item.label}
                                            </h4>
                                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                                {item.sublabel}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        {item.type === 'toggle' && (
                                            <button
                                                onClick={item.action}
                                                className={`w-14 h-8 rounded-full p-1 transition-all duration-300 flex items-center ${item.value ? 'bg-[#018F64]' : 'bg-gray-300 dark:bg-gray-700'}`}
                                            >
                                                <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${item.value ? 'translate-x-6' : 'translate-x-0'}`} />
                                            </button>
                                        )}

                                        {item.type === 'select' && (
                                            <div className="relative">
                                                <select
                                                    value={item.value}
                                                    onChange={item.onChange}
                                                    disabled={item.disabled}
                                                    className={`appearance-none border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 pr-8 text-xs font-bold uppercase tracking-wider outline-none focus:border-[#018F64] transition-all ${item.disabled ? 'bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed' : 'bg-white dark:bg-black/40 text-gray-700 dark:text-gray-200 cursor-pointer'}`}
                                                >
                                                    {item.options.map(opt => (
                                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                    ))}
                                                </select>
                                                <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none rotate-90" />
                                            </div>
                                        )}

                                        {item.type === 'button' && (
                                            <button className="px-5 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg">
                                                {item.btnText}
                                            </button>
                                        )}

                                        {item.type === 'link' && item.badge && (
                                            <span className="px-3 py-1 bg-[#018F64]/10 text-[#018F64] dark:text-[#B0EEDE] rounded-lg text-[10px] font-black uppercase tracking-widest">
                                                {item.badge}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminSettings;
