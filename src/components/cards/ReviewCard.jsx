import { Heart, Quote, Sparkles, Leaf, Award, Rocket, UserRound } from 'lucide-react';
import { motion } from 'framer-motion';

const ReviewCard = ({ review, t, onToggleLike, index, variant = 'landing' }) => {
    // Rotation logic - using transform for performance
    const rotations = ['rotate(2deg)', 'rotate(-3deg)', 'rotate(1deg)', 'rotate(-2deg)', 'rotate(3deg)'];
    const initialRotation = rotations[index % rotations.length];

    const isWall = variant === 'wall';

    // Tier-based specific styling - Balanced Membership Style
    const tierStyles = {
        ECO_VISIONARIO: {
            bg: 'bg-gradient-to-br from-[#1E1B4B] via-[#312E81] to-[#4338CA] border-white/10 shadow-[0_20px_50px_-12px_rgba(67,56,202,0.3)]',
            text: 'text-white',
            subtext: 'text-white/60',
            icon: 'text-white',
            badge: 'bg-white/10 text-white border-white/20',
            glow: 'from-white/5 via-transparent to-transparent',
            Icon: Rocket
        },
        ECO_EMBAJADOR: {
            bg: 'bg-gradient-to-br from-[#064E3B] via-[#065F46] to-[#0D9488] border-white/10 shadow-[0_20px_50px_-12px_rgba(13,148,136,0.2)]',
            text: 'text-white',
            subtext: 'text-white/60',
            icon: 'text-white',
            badge: 'bg-white/10 text-white border-white/20',
            glow: 'from-white/5 via-transparent to-transparent',
            Icon: Award
        },
        ECO_SOCIO: {
            bg: 'bg-gradient-to-br from-[#022C22] via-[#064E3B] to-[#047857] border-white/10 shadow-[0_20px_50px_-12px_rgba(5,46,22,0.2)]',
            text: 'text-white',
            subtext: 'text-white/60',
            icon: 'text-white',
            badge: 'bg-white/10 text-white border-white/20',
            glow: 'from-white/5 via-transparent to-transparent',
            Icon: UserRound
        },
        NONE: {
            bg: 'bg-white dark:bg-slate-900 border-gray-100 dark:border-white/10 shadow-sm',
            text: 'text-slate-900 dark:text-slate-100',
            subtext: 'text-slate-500',
            glow: 'from-slate-500/5 via-transparent to-transparent',
            Icon: Leaf
        }
    };

    const currentTierStyle = tierStyles[review.tier] || tierStyles.NONE;

    const bgColors = isWall ? [
        'bg-white dark:bg-slate-900 border-white dark:border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]',
        'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100/50 dark:border-emerald-500/10 shadow-[0_20px_60px_-15px_rgba(16,185,129,0.05)]',
        'bg-amber-50/30 dark:bg-amber-950/20 border-amber-100/50 dark:border-amber-500/10 shadow-[0_20px_60px_-15px_rgba(245,158,11,0.05)]',
    ] : [
        'bg-white dark:bg-slate-900 border-gray-100 dark:border-white/10',
        'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100/50 dark:border-emerald-500/10',
        'bg-amber-50/30 dark:bg-amber-950/20 border-amber-100/50 dark:border-amber-500/10',
    ];
    const bgColorClass = currentTierStyle ? currentTierStyle.bg : bgColors[index % bgColors.length];

    return (
        <motion.div
            initial={isWall ? { opacity: 0, scale: 0.9, y: 20 } : {}}
            whileInView={isWall ? { opacity: 1, scale: 1, y: 0 } : {}}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className={`group relative overflow-hidden ${currentTierStyle.bg} border-2 ${isWall ? 'p-10' : 'p-8'} transition-all duration-300 flex flex-col h-full pointer-events-auto ${isWall
                ? 'hover:border-white/60 dark:hover:border-white/20 hover:-translate-y-4'
                : 'hover:border-white/60 dark:hover:border-white/20'
                } ${review.isFeatured ? 'ring-2 ring-yellow-400/40 shadow-[0_0_40px_rgba(251,191,36,0.15)]' : ''}`}
            style={{
                borderRadius: isWall
                    ? (index % 2 === 0 ? '3rem 6rem 3rem 6rem' : '6rem 3rem 6rem 3rem')
                    : (index % 2 === 0 ? '2.5rem 5rem 2.5rem 5rem' : '5rem 2.5rem 5rem 2.5rem'),
                transform: initialRotation,
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = isWall ? 'scale(1.04) rotate(0.5deg)' : 'scale(1.05) rotate(0.5deg)';
                e.currentTarget.style.zIndex = isWall ? '30' : '20';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = initialRotation;
                e.currentTarget.style.zIndex = '1';
            }}
        >
            {/* Very Sublte Ambient Light */}
            <div className={`absolute inset-0 bg-gradient-to-br ${currentTierStyle.glow} opacity-20`} />

            {/* Ultra Minimal Noise */}
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

            {/* Sublte Ambient Glow */}
            {isWall && <div className="absolute -inset-1 bg-gradient-to-r from-white/0 via-white/5 to-white/0 rounded-[inherit] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>}

            {/* Featured Badge */}
            {review.isFeatured && (
                <div className="absolute -top-3 -right-3 z-30">
                    <motion.div
                        animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="bg-gradient-to-br from-yellow-400 to-amber-600 p-2 rounded-xl shadow-lg border-2 border-white text-white"
                    >
                        <Star size={14} fill="currentColor" />
                    </motion.div>
                </div>
            )}

            {/* Stem icon */}
            <div className={`absolute ${index % 2 === 0 ? '-top-3 -right-3' : '-top-3 -left-3'} w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg z-20 border border-white/20`}>
                {currentTierStyle.Icon ? (
                    <currentTierStyle.Icon size={20} className="text-white" />
                ) : (
                    <Leaf size={20} className="text-[#018F64]" fill="currentColor" />
                )}
            </div>

            {/* Quote Icon - Optional for Wall if we use the top mark */}
            {!isWall && (
                <div className="absolute top-6 right-6 text-[#018F64]/10 dark:text-white/5 transition-colors duration-500">
                    <Quote size={40} fill="currentColor" strokeWidth={0} />
                </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-center mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    {/* Icon next to stars */}
                    {currentTierStyle.Icon && (
                        <div className={`p-1.5 rounded-lg bg-white/10 border border-white/20 shadow-sm ${currentTierStyle.icon || 'text-white'}`}>
                            <currentTierStyle.Icon size={14} />
                        </div>
                    )}
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, n) => (
                            <Sparkles
                                key={n}
                                size={10}
                                className={n < review.rating
                                    ? (review.tier !== 'NONE' ? "text-white" : "text-[#018F64] dark:text-[#B0EEDE]")
                                    : (review.tier !== 'NONE' ? "text-white/30" : "text-gray-200 dark:text-gray-800")}
                                fill={n < review.rating ? "currentColor" : "none"}
                            />
                        ))}
                    </div>
                </div>
                <motion.button
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleLike(review.id);
                    }}
                    className={`flex items-center gap-2 ${isWall ? 'px-4 py-2 text-[10px]' : 'px-3 py-1.5 text-[9px]'} rounded-2xl font-black uppercase tracking-widest transition-all backdrop-blur-md ${review.liked
                        ? 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.3)]'
                        : `${currentTierStyle.badge} hover:brightness-110 shadow-sm shadow-black/5`
                        }`}
                >
                    <Heart
                        size={isWall ? 14 : 10}
                        className={`transition-transform duration-300 ${review.liked ? 'fill-current scale-110' : ''}`}
                    />
                    <span>{review.likes}</span>
                </motion.button>
            </div>

            {/* Content - Testimonial */}
            <div className={`relative z-10 ${isWall ? 'mb-12 mt-4 flex-grow flex items-center' : 'mb-8 flex-grow'}`}>
                <div className="relative w-full">
                    <p className={`${isWall ? 'text-xl md:text-2xl font-black leading-[1.15]' : 'text-base md:text-lg font-bold'} tracking-tighter
                        ${currentTierStyle.text}`}>
                        {(review.comment || review.text || "").replace(/"/g, '')}
                    </p>
                </div>
            </div>

            <div className={`mt-auto flex items-center gap-4 relative z-10 border-t pt-6
                ${review.tier !== 'NONE' ? 'border-white/10' : 'border-gray-500/10'}`}>
                <div className="relative">
                    <img
                        src={review.image || (review.avatar ? `https://i.pravatar.cc/150?img=${review.avatar}` : `https://ui-avatars.com/api/?name=${review.name}&background=018F64&color=fff`)}
                        alt={review.name}
                        className={`w-12 h-12 rounded-xl object-cover border-2 transition-all duration-300
                            ${review.tier === 'ECO_VISIONARIO' ? 'border-white/30 shadow-lg shadow-indigo-500/10' :
                                review.tier === 'ECO_EMBAJADOR' ? 'border-white/30 shadow-lg shadow-emerald-500/10' :
                                    review.tier === 'ECO_SOCIO' ? 'border-white/30 shadow-lg shadow-teal-500/10' : 'border-white/50 dark:border-white/10'}`}
                    />
                    {review.tier !== 'NONE' && currentTierStyle.Icon && (
                        <div className={`absolute -top-2 -right-2 w-5 h-5 rounded-lg flex items-center justify-center text-white shadow-xl ring-1 ring-white/20
                            ${review.tier === 'ECO_VISIONARIO' ? 'bg-indigo-600' :
                                review.tier === 'ECO_EMBAJADOR' ? 'bg-emerald-600' :
                                    review.tier === 'ECO_SOCIO' ? 'bg-teal-600' : ''}`}>
                            <currentTierStyle.Icon size={10} fill="currentColor" />
                        </div>
                    )}
                </div>
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        {currentTierStyle.Icon && <currentTierStyle.Icon size={11} className={currentTierStyle.subtext} />}
                        <span className={`text-[10px] font-black uppercase tracking-[0.25em] ${currentTierStyle.subtext}`}>
                            {review.tier === 'ECO_VISIONARIO' ? 'Eco-Visionario' :
                                review.tier === 'ECO_EMBAJADOR' ? 'Eco-Embajador' :
                                    review.tier === 'ECO_SOCIO' ? 'Eco-Socio' : 'Eco-Héroe'}
                        </span>
                    </div>
                    <span className={`font-black text-sm tracking-tight ${currentTierStyle.text}`}>
                        {review.name}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default ReviewCard;
