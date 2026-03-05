import React, { useState } from 'react';
import { ChevronRight, ArrowRight, Sprout, Building } from 'lucide-react';


const LoginRoleSelection = ({ onRoleSelect, navigate }) => {


    const roles = [
        {
            id: 'ecoheroe',
            title: 'Eres Ecoheroe',
            desc: 'Recicla, gana recompensas y cuida el planeta.',
            icon: Sprout,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            border: 'hover:border-emerald-500/30'
        },
        {
            id: 'gestor',
            title: 'Eres Gestor',
            desc: 'Gestiono mi institución y coordino jornadas.',
            icon: Building,
            color: 'text-orange-400',
            bg: 'bg-orange-500/10',
            border: 'hover:border-orange-500/30'
        }
    ];

    return (
        <div className="space-y-4">
            <div className="space-y-2 text-center md:text-left">
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9]">
                    ¡BIEN<span className="text-[#018F64]">VENIDO!</span>
                </h1>
                <p className="text-gray-400 text-base font-medium">
                    Elige tu acceso para continuar transformando el mundo.
                </p>
            </div>

            <div className="space-y-4">
                {roles.map((role) => (
                    <button
                        key={role.id}
                        onClick={() => onRoleSelect(role.id)}
                        className={`group w-full bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 ${role.border} p-5 rounded-[1.5rem] transition-all duration-500 text-left flex items-center gap-5 active:scale-[0.98] shadow-xl`}
                    >
                        <div className={`w-12 h-12 rounded-xl ${role.bg} flex items-center justify-center ${role.color} transition-all duration-500 group-hover:scale-110 shadow-inner shrink-0`}>
                            <role.icon size={26} strokeWidth={2.2} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-white uppercase tracking-wide">{role.title}</h3>
                            <p className="text-gray-400 text-xs font-medium leading-relaxed">
                                {role.desc}
                            </p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-700 transition-colors group-hover:text-white group-hover:bg-[#018F64] shrink-0">
                            <ChevronRight size={16} />
                        </div>
                    </button>
                ))}
            </div>

            <div className="pt-4 space-y-5">
                <div className="h-px bg-gradient-to-r from-white/5 via-white/10 to-transparent w-full" />

                <div className="flex justify-center md:justify-start">
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-500 hover:text-[#018F64] transition-colors text-[10px] font-bold uppercase tracking-widest">
                        <ArrowRight size={14} className="rotate-180" /> Volver al Inicio
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginRoleSelection;
