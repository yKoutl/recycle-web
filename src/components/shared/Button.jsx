import React from 'react';

const Button = ({ children, variant = 'primary', className = '', icon: Icon, ...props }) => {
    const baseStyles = "px-5 py-2.5 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-green-500/30",
        secondary: "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-500 hover:text-green-700 dark:hover:text-green-400 hover:bg-green-50/50 dark:hover:bg-gray-700 shadow-sm",
        outline: "border-2 border-white/30 text-white hover:bg-white/10 hover:border-white",
        ghost: "text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800 hover:text-green-600 dark:hover:text-green-400",
        danger: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40",
        icon: "p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
    };

    return (
        <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
            {Icon && <Icon size={18} />}
            {children}
        </button>
    );
};

export default Button;
