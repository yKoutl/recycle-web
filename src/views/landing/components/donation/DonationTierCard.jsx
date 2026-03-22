import React from 'react';
import { ArrowRight } from 'lucide-react';

const DonationTierCard = ({ tier, t, isHovered, onMouseEnter, onMouseLeave, onClick, idx }) => {
    const amountText = t.donation.tiers[tier.key].amount;
    const amountParts = amountText.split(' /');

    return (
        <div
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={() => onClick(tier)}
            className={`group relative p-8 md:p-10 rounded-[3.5rem] transition-all duration-300 overflow-hidden flex flex-col items-center text-center h-full cursor-pointer transform-gpu will-change-transform
                bg-gradient-to-br ${tier.color} ${tier.darkColor} animate-in fade-in slide-in-from-bottom-20
                ${isHovered
                    ? `z-[200] scale-[1.03] lg:scale-[1.05] shadow-[0_28px_70px_-22px_rgba(0,0,0,0.5)] ${tier.glow}`
                    : 'z-20 scale-100 shadow-xl opacity-100'}
            `}
            style={{ animationDelay: `${idx * 150}ms`, animationFillMode: 'both' }}
        >
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '30px 30px' }} />

            <div className="relative z-10 space-y-8 w-full flex flex-col items-center">
                <div className={`w-20 h-20 rounded-2xl bg-white/40 dark:bg-black/20 backdrop-blur-sm flex items-center justify-center ${tier.textColor} shadow-2xl transform group-hover:rotate-6 transition-all duration-500 border border-white/30 dark:border-white/10`}>
                    <tier.icon size={40} strokeWidth={2.5} />
                </div>

                <div className="space-y-3">
                    <h3 className={`text-3xl font-black tracking-tighter ${tier.textColor}`}>
                        {t.donation.tiers[tier.key].title}
                    </h3>
                    <p className={`text-base font-bold leading-relaxed opacity-90 max-w-xs ${tier.textColor}`}>
                        {t.donation.tiers[tier.key].desc}
                    </p>
                </div>

                <div className="pt-8 border-t border-white/20 w-full">
                    <div className="flex items-baseline justify-center gap-1 mb-8">
                        <span className={`text-5xl font-black tracking-tighter ${tier.textColor}`}>
                            {amountParts[0]}
                        </span>
                        {amountParts[1] && (
                            <span className={`text-[12px] font-black uppercase tracking-widest opacity-80 ${tier.textColor}`}>
                                /{amountParts[1]}
                            </span>
                        )}
                    </div>

                    <button className={`w-full py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest transition-all duration-300 shadow-2xl 
                        ${tier.btnColor} transform group-hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3`}>
                        <span>{t.donation.btn}</span>
                        <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DonationTierCard;
