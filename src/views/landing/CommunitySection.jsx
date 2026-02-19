import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MessageSquare, Sparkles, Leaf, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../../components/shared/Button';
import AddCommentModal from '../../components/modals/AddCommentModal';
import LoginPromptModal from '../../components/modals/LoginPromptModal';
import ReviewCard from '../../components/cards/ReviewCard';
import { INITIAL_REVIEWS } from '../../data/mockData';
import { useGetFeaturedHistoriesQuery } from '../../store/eco-histories/ecoHistoriesApi';

const CommunitySection = ({ t, isAuthenticated }) => {
    const navigate = useNavigate();
    const { data: featuredReviews, isLoading: loadingFeatured } = useGetFeaturedHistoriesQuery();

    const [reviews, setReviews] = useState([]);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    // Sincronizar destacados para el grid principal
    useEffect(() => {
        if (featuredReviews && featuredReviews.length > 0) {
            const mappedReviews = featuredReviews.map(h => ({
                id: h._id,
                name: h.user?.fullName || 'Eco-Héroe',
                role: 'Eco-Héroe',
                comment: h.message,
                likes: 0,
                liked: false,
                image: h.user?.avatarUrl || `https://ui-avatars.com/api/?name=${h.user?.fullName}&background=018F64&color=fff`,
                rating: 5
            }));
            setReviews(mappedReviews.slice(0, 3));
        } else {
            setReviews([]);
        }
    }, [featuredReviews, t]);

    const toggleLike = (id) => {
        if (!isAuthenticated) {
            setIsLoginModalOpen(true);
            return;
        }

        setReviews(reviews.map(review => {
            if (review.id === id) {
                return {
                    ...review,
                    liked: !review.liked,
                    likes: review.liked ? review.likes - 1 : review.likes + 1
                };
            }
            return review;
        }));
    };

    return (
        <section id="community" className="py-24 relative overflow-hidden transition-colors duration-500 bg-[#FEFDFB] dark:bg-[#020617]">
            {/* Background Decorative Patterns */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute inset-0 opacity-[0.1] dark:opacity-[0.05]"
                    style={{
                        backgroundImage: `radial-gradient(circle, #018F64 1px, transparent 1px)`,
                        backgroundSize: '32px 32px'
                    }}
                ></div>

                {/* Glows */}
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#B0EEDE]/20 dark:bg-[#018F64]/10 rounded-full blur-[140px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#018F64]/10 dark:bg-[#B0EEDE]/5 rounded-full blur-[140px] animate-pulse"></div>
            </div>

            <AddCommentModal isOpen={isCommentModalOpen} onClose={() => setIsCommentModalOpen(false)} t={t} />
            <LoginPromptModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} t={t} />

            <div className="container mx-auto px-6 relative z-10">
                {/* Header Section - Split Layout */}
                <div className="grid lg:grid-cols-2 gap-12 items-end mb-20">
                    <div className="space-y-6">
                        <div className="inline-block">
                            <div className="flex items-center gap-3">
                                <p className="text-[10px] font-black text-[#018F64] dark:text-[#10B981] uppercase tracking-[0.3em] whitespace-nowrap">
                                    {t.community.tag || "TU VOZ IMPORTA"}
                                </p>
                                <div className="w-12 h-[2px] bg-[#018F64] dark:bg-[#10B981]" />
                            </div>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-[1.1]">
                            Lo que dicen nuestros <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#018F64] to-[#05835D] dark:from-[#B0EEDE] dark:to-[#018F64]">Eco-Héroes</span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-xl leading-relaxed max-w-xl font-sans font-medium">
                            Únete a miles de personas que ya están transformando su impacto ambiental con RecycleApp.
                        </p>
                    </div>

                    <div className="relative lg:text-right py-6">
                        <div className="relative inline-block rotate-[3deg] hover:rotate-0 transition-transform duration-700">
                            <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#018F64] dark:text-[#10B981] leading-[0.9] mb-6 tracking-tighter">
                                COMPARTE TU <br />
                                <span className="text-gray-900 dark:text-white italic">ECO-HISTORIA</span><br />
                                <span className="text-xl lg:text-2xl">¿CÓMO RECICLAS TÚ?</span>
                            </h3>
                            <div className="flex justify-end pr-4">
                                <Button
                                    className="h-12 px-8 rounded-xl text-base font-black bg-[#018F64] hover:bg-[#05835D] text-white border-none transition-all hover:scale-105 active:scale-95 flex items-center gap-3 shadow-xl shadow-emerald-900/20"
                                    onClick={() => setIsCommentModalOpen(true)}
                                    icon={MessageSquare}
                                >
                                    {t.community.addComment}
                                </Button>
                            </div>
                            <div className="absolute -bottom-2 -left-8 rotate-[-12deg] opacity-20 dark:opacity-10 pointer-events-none">
                                <Leaf size={80} className="text-[#018F64]" fill="currentColor" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {reviews.length > 0 ? (
                        reviews.map((review, index) => (
                            <ReviewCard key={review.id} review={review} t={t} onToggleLike={toggleLike} index={index} variant="wall" />
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center text-center py-12">
                            <div className="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                <Sparkles size={40} className="text-gray-400 dark:text-gray-600" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-800 dark:text-gray-200 mb-2">
                                Por ahora no tenemos historias
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
                                ¡Pero tú puedes ser el primero o el siguiente!
                            </p>
                        </div>
                    )}
                </div>

                {/* Bottom Badge & Improved View All Button */}
                <div className="mt-20 flex flex-col items-center gap-10 relative z-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="relative z-50 pointer-events-auto">
                            <Link
                                to="/eco-historias"
                                onClick={() => {
                                    window.scrollTo(0, 0);
                                }}
                                className="group relative flex items-center gap-4 px-12 py-5 bg-gradient-to-br from-[#018F64] via-[#05835D] to-[#018F64] rounded-[2.5rem] text-sm font-black uppercase tracking-[0.25em] text-white shadow-[0_20px_50px_rgba(1,143,100,0.3)] hover:shadow-[0_25px_60px_rgba(1,143,100,0.5)] transition-all hover:-translate-y-2 active:scale-95 overflow-hidden"
                            >
                                {/* Animated Background Shine */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                                    animate={{ x: ['100%', '-100%'] }}
                                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                />

                                <div className="relative flex items-center gap-3">
                                    <Sparkles size={20} className="group-hover:rotate-12 transition-transform text-emerald-200" />
                                    <span>Ver todas las historias</span>
                                    <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-2 transition-transform" />
                                </div>
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="px-8 py-3 bg-[#018F64]/10 dark:bg-[#B0EEDE]/5 border border-[#018F64]/20 dark:border-[#B0EEDE]/10 rounded-full backdrop-blur-sm"
                    >
                        <span className="text-[#018F64] dark:text-[#B0EEDE] font-black text-[11px] uppercase tracking-[0.3em]">
                            Más de 10,000 ecos-guardianes activos
                        </span>
                    </motion.div>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes bounce-soft {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-4px); }
                }
                .animate-bounce-soft {
                    animation: bounce-soft 3s ease-in-out infinite;
                }
            `}} />
        </section>
    );
};

export default React.memo(CommunitySection);
