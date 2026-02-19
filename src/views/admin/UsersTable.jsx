import React from 'react';
import { Search, FileText, RotateCw } from 'lucide-react';

const UsersTable = ({ t }) => {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden animate-in fade-in duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-xl">{t.admin.menu.users}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Gestiona los permisos y cuentas.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        onClick={() => window.location.reload()}
                        className="p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-green-600 rounded-xl transition-all active:scale-95 border border-transparent hover:border-gray-200 dark:hover:border-white/10 group"
                        title="Refrescar lista"
                    >
                        <RotateCw size={18} className="group-active:rotate-180 transition-transform duration-500" />
                    </button>
                    <div className="relative flex-1 sm:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="text" placeholder="Buscar usuario..." className="w-full sm:w-64 pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-4 focus:ring-green-50 dark:focus:ring-green-900/30 focus:border-green-500 dark:focus:border-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none transition-all" />
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 uppercase text-xs font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4">{t.admin.table.id}</th>
                            <th className="px-6 py-4">{t.admin.table.user}</th>
                            <th className="px-6 py-4">{t.admin.table.role}</th>
                            <th className="px-6 py-4">{t.admin.table.status}</th>
                            <th className="px-6 py-4 text-right">{t.admin.table.actions}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <tr key={i} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors">
                                <td className="px-6 py-4 text-gray-400 font-mono">#{1000 + i}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                                            U{i}
                                        </div>
                                        <span className="font-medium text-gray-900 dark:text-gray-200">Usuario {i}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4"><span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md text-xs font-bold border border-blue-100 dark:border-blue-800">Ciudadano</span></td>
                                <td className="px-6 py-4"><span className="px-2.5 py-1 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-md text-xs font-bold border border-green-100 dark:border-green-800 flex items-center gap-1 w-fit"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Activo</span></td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-gray-400 hover:text-green-600 dark:hover:text-green-400 p-2 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"><FileText size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersTable;
