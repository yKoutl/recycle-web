import React from 'react';
import { Bell, CheckCircle, XCircle, User, RotateCw } from 'lucide-react';

const RequestsList = ({ requests, t, onStatusChange }) => {
    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between group hover:border-orange-200 dark:hover:border-orange-800 transition-colors">
                    <div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">{t.admin.status.pending}</div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">{requests.filter(r => r.statusKey === 'pending').length}</div>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-xl text-orange-500 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/40 transition-colors"><Bell size={24} /></div>
                </div>
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between group hover:border-green-200 dark:hover:border-green-800 transition-colors">
                    <div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">{t.admin.status.approved}</div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">{requests.filter(r => r.statusKey === 'approved').length}</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl text-green-500 group-hover:bg-green-100 dark:group-hover:bg-green-900/40 transition-colors"><CheckCircle size={24} /></div>
                </div>
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between group hover:border-red-200 dark:hover:border-red-800 transition-colors">
                    <div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">{t.admin.status.rejected}</div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">{requests.filter(r => r.statusKey === 'rejected').length}</div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl text-red-500 group-hover:bg-red-100 dark:group-hover:bg-red-900/40 transition-colors"><XCircle size={24} /></div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">{t.admin.requestsTitle}</h3>
                    <button
                        onClick={() => window.location.reload()}
                        className="p-2 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-orange-500 rounded-xl transition-all active:scale-95 group"
                    >
                        <RotateCw size={16} className="group-active:rotate-180 transition-transform duration-500" />
                    </button>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {requests.map((req) => (
                        <div key={req.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className={`mt-1 p-2 rounded-lg ${req.statusKey === 'approved' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                                    req.statusKey === 'rejected' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                                        'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                                    }`}>
                                    {req.statusKey === 'approved' ? <CheckCircle size={20} /> : req.statusKey === 'rejected' ? <XCircle size={20} /> : <Bell size={20} />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="font-bold text-gray-900 dark:text-white text-lg">{req.type}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wide border ${req.statusKey === 'approved' ? 'bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 border-green-100 dark:border-green-800' :
                                            req.statusKey === 'rejected' ? 'bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 border-red-100 dark:border-red-800' :
                                                'bg-orange-50 dark:bg-orange-900/10 text-orange-700 dark:text-orange-400 border-orange-100 dark:border-orange-800'
                                            }`}>
                                            {req.status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                        <User size={14} /> Solicitado por <span className="font-medium text-gray-700 dark:text-gray-300">{req.user}</span> • {req.date}
                                    </div>
                                </div>
                            </div>
                            {req.statusKey === 'pending' && (
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => onStatusChange(req.id, 'approved')}
                                        className="px-4 py-2 bg-green-600 dark:bg-green-500 text-white text-sm font-bold rounded-lg hover:bg-green-700 dark:hover:bg-green-600 shadow-md hover:shadow-lg transition-all"
                                    >
                                        {t.admin.actions.approve}
                                    </button>
                                    <button
                                        onClick={() => onStatusChange(req.id, 'rejected')}
                                        className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm font-bold rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800 transition-all"
                                    >
                                        {t.admin.actions.reject}
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RequestsList;
