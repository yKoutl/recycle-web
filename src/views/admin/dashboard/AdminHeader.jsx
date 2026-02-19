import React from 'react';
import { Bell, Moon, Sun } from 'lucide-react';
import logoNosPlanet from '../../../assets/Logo Nos Planet.png';
import { useSelector } from 'react-redux';

const AdminHeader = ({ t, darkMode, setDarkMode }) => {
    const { user } = useSelector(state => state.auth);

    return (
        <>
            {/* Mobile Header */}
            <header className="bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl h-24 border-b border-gray-100 dark:border-white/5 flex items-center justify-between px-8 sticky top-0 z-10 md:hidden">
                <div className="flex items-center gap-3">
                    <div className="bg-white p-1.5 rounded-lg shadow-lg">
                        <img src={logoNosPlanet} alt="Logo" className="w-5 h-5 object-contain" />
                    </div>
                    <span className="text-xl font-black uppercase tracking-tighter italic text-gray-900 dark:text-white">
                        Nos<span className="text-[#018F64]">Planet</span>
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2.5 text-gray-400 hover:text-[#018F64] dark:hover:text-green-400 transition-all active:scale-90 bg-gray-100 dark:bg-white/5 rounded-xl"
                    >
                        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    <div className="w-10 h-10 bg-gradient-to-tr from-[#018F64] to-emerald-400 rounded-full flex items-center justify-center text-white font-black text-xs shadow-lg shadow-[#018F64]/20 border-2 border-white dark:border-gray-950">
                        AD
                    </div>
                </div>
            </header>

            {/* Desktop Header Info */}
            <div className="hidden md:flex justify-end items-center px-12 h-24 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 sticky top-0 z-40 transition-all duration-500">
                <div className="flex items-center gap-5">
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2.5 text-gray-400 hover:text-[#018F64] dark:hover:text-green-400 transition-all active:scale-90 bg-gray-100 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm"
                    >
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <button className="relative p-2.5 text-gray-400 hover:text-[#018F64] dark:hover:text-green-400 transition-all active:scale-90 bg-gray-100 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
                        <Bell size={20} />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white dark:border-gray-950"></span>
                    </button>

                    <div className="h-10 w-[1px] bg-gray-200 dark:bg-white/10 mx-2"></div>

                    <div className="flex items-center gap-4 group cursor-pointer">
                        <div className="text-right hidden lg:block">
                            <div className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest leading-none">
                                {user?.fullName || user?.name || user?.username || 'Admin'}
                            </div>
                            <div className="text-[10px] text-[#018F64] font-black uppercase tracking-[0.1em] mt-1.5 flex items-center justify-end gap-1.5">
                                {(user?.role?.toUpperCase() === 'ADMIN') ? 'Administrador' : 'Funcionario'}
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#018F64] to-emerald-400 p-[1.5px] shadow-lg shadow-[#018F64]/10 transform transition-transform group-hover:scale-110">
                            <div className="w-full h-full rounded-[0.9rem] bg-white dark:bg-gray-950 flex items-center justify-center text-[#018F64] font-black text-sm border border-white/50 dark:border-white/5">
                                {(user?.fullName?.[0] || user?.name?.[0] || user?.username?.[0] || 'A').toUpperCase()}
                                {(user?.fullName?.split(' ')[1]?.[0] || user?.name?.split(' ')[1]?.[0] || user?.username?.[1] || 'D').toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminHeader;
