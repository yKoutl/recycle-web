import React from 'react';
import { Bell } from 'lucide-react';
import logoNosPlanet from '../../assets/Logo Nos Planet.png';

const AdminHeader = ({ t }) => {
    return (
        <>
            {/* Mobile Header */}
            <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md h-20 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 md:px-10 sticky top-0 z-10 md:hidden">
                <div className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2">
                    <div className="bg-white p-1 rounded"><img src={logoNosPlanet} alt="Logo" className="w-4 h-4 object-contain" /></div> AdminPanel
                </div>
                <div className="flex items-center gap-4">
                    <span className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center text-green-700 dark:text-green-400 font-bold text-xs">AD</span>
                </div>
            </header>

            {/* Desktop Header Info */}
            <div className="hidden md:flex justify-end items-center px-10 py-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10 transition-colors duration-500">
                <div className="flex items-center gap-4">
                    <button className="relative p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                        <Bell size={20} />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-900"></span>
                    </button>
                    <div className="h-8 w-px bg-gray-200 dark:bg-gray-800"></div>
                    <div className="flex items-center gap-3 pl-2">
                        <div className="text-right hidden lg:block">
                            <div className="text-sm font-bold text-gray-900 dark:text-white">Admin General</div>
                            <div className="text-xs text-green-600 dark:text-green-400">En línea</div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-green-500 to-emerald-400 p-0.5 shadow-sm cursor-pointer">
                            <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center text-green-600 dark:text-green-400 font-bold border-2 border-transparent">
                                AG
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminHeader;
