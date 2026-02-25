import React, { useState } from 'react';
import { Search, RotateCw, User, Mail, Shield, Eye, Trash2, Power, Users } from 'lucide-react';

const UsersTable = ({ t, themeColor }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const accent = themeColor || '#018F64';

    const [isLoading, setIsLoading] = useState(false);
    const users = [
        { _id: '1', fullName: 'Juan Perez', email: 'juan@example.com', role: 'ADMIN', isActive: true, createdAt: '2023-10-01' },
        { _id: '2', fullName: 'Maria Garcia', email: 'maria@example.com', role: 'OFFICIAL', isActive: true, createdAt: '2023-10-05' },
        { _id: '3', fullName: 'Carlos Lopez', email: 'carlos@example.com', role: 'USER', isActive: false, createdAt: '2023-10-10' },
        { _id: '4', fullName: 'Ana Martinez', email: 'ana@example.com', role: 'USER', isActive: true, createdAt: '2023-10-15' },
    ];

    const handleRefresh = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 800);
    };

    const filteredUsers = users.filter(u =>
        u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeCount = filteredUsers.filter(u => u.isActive).length;

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)`, boxShadow: `0 8px 20px ${accent}30` }}>
                        <Users size={22} strokeWidth={1.75} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                            Gestión de Usuarios
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            Administra todos los usuarios registrados en la plataforma.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Search ── */}
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} strokeWidth={1.75} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o correo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none transition-all text-gray-900 dark:text-white"
                        style={{
                            outline: 'none',
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = accent;
                            e.target.style.boxShadow = `0 0 0 4px ${accent}15`;
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '';
                            e.target.style.boxShadow = '';
                        }}
                    />
                </div>
                <button
                    onClick={handleRefresh}
                    className="p-2.5 text-gray-500 hover:text-gray-800 dark:hover:text-white bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl transition-all"
                    title="Actualizar"
                >
                    <RotateCw size={15} strokeWidth={1.75} className={isLoading ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* ── Stats bar ── */}
            <div className="flex items-center justify-end gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {filteredUsers.length} total
                </span>
                <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-black/5 dark:border-white/5"
                    style={{ backgroundColor: `${accent}15`, color: accent }}
                >
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accent }} />
                    {activeCount} activos
                </span>
            </div>

            {/* ── Table / Mobile Cards ── */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm">
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-white/5" style={{ background: `linear-gradient(to right, ${accent}10, ${accent}05)` }}>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>Usuario</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400 text-center">Rol</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400 text-center">Estado</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-white/[0.04]">
                            {filteredUsers.map((u) => (
                                <tr key={u._id} className="hover:bg-gray-50/70 dark:hover:bg-white/[0.025] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ring-4 ring-slate-50 dark:ring-white/5 shadow-md shadow-gray-200/50 dark:shadow-none"
                                                style={{ backgroundColor: accent }}
                                            >
                                                {(u.fullName?.[0] || 'U').toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900 dark:text-white">{u.fullName}</div>
                                                <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                                    <Mail size={11} strokeWidth={1.75} />
                                                    {u.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${u.role === 'ADMIN' ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-500/20' :
                                            u.role === 'OFFICIAL' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-500/20' :
                                                'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10'
                                            }`}>
                                            {u.role === 'ADMIN' ? 'ADMINISTRADOR' : u.role === 'OFFICIAL' ? 'GESTOR' : 'ECO-HÉROE'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {u.isActive ? (
                                            <span
                                                className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold border border-black/5 dark:border-white/5"
                                                style={{ backgroundColor: `${accent}15`, color: accent }}
                                            >
                                                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: accent }} /> Activo
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-gray-400 text-[10px] font-bold">
                                                <span className="w-1 h-1 rounded-full bg-gray-400" /> Inactivo
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all">
                                                <Eye size={16} strokeWidth={1.75} />
                                            </button>
                                            <button className="p-2 rounded-lg text-gray-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-all">
                                                <Power size={16} strokeWidth={1.75} />
                                            </button>
                                            <button className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                                                <Trash2 size={16} strokeWidth={1.75} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden divide-y divide-gray-50 dark:divide-white/[0.04]">
                    {filteredUsers.map((u) => (
                        <div key={u._id} className="p-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md"
                                        style={{ backgroundColor: accent }}
                                    >
                                        {(u.fullName?.[0] || 'U').toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900 dark:text-white text-base">{u.fullName}</div>
                                        <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                            <Mail size={11} />
                                            {u.email}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1.5">
                                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${u.role === 'ADMIN' ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-500/20' :
                                        u.role === 'OFFICIAL' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-500/20' :
                                            'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10'
                                        }`}>
                                        {u.role === 'ADMIN' ? 'ADMINISTRADOR' : u.role === 'OFFICIAL' ? 'GESTOR' : 'ECO-HÉROE'}
                                    </span>
                                    {u.isActive ? (
                                        <span
                                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border border-black/5 dark:border-white/5"
                                            style={{ backgroundColor: `${accent}15`, color: accent }}
                                        >
                                            <span className="w-1 h-1 rounded-full" style={{ backgroundColor: accent }} /> Activo
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/5 text-gray-400 text-[9px] font-bold">
                                            <span className="w-1 h-1 rounded-full bg-gray-400" /> Inactivo
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-50 dark:border-white/5">
                                <button className="flex-1 py-2 rounded-xl text-gray-500 hover:text-blue-500 bg-gray-50 dark:bg-white/5 flex justify-center items-center gap-2 text-xs font-bold transition-all">
                                    <Eye size={14} /> VER
                                </button>
                                <button className="flex-1 py-2 rounded-xl text-gray-500 hover:text-orange-500 bg-gray-50 dark:bg-white/5 flex justify-center items-center gap-2 text-xs font-bold transition-all">
                                    <Power size={14} /> ESTADO
                                </button>
                                <button className="flex-1 py-2 rounded-xl text-gray-500 hover:text-red-500 bg-gray-50 dark:bg-white/5 flex justify-center items-center gap-2 text-xs font-bold transition-all">
                                    <Trash2 size={14} /> BORRAR
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UsersTable;
