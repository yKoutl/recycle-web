import React, { useState, useEffect } from 'react';
import { MessageSquare, Sparkles, Leaf } from 'lucide-react';
import Button from '../../components/shared/Button';
import AddCommentModal from '../../components/modals/AddCommentModal';
import ReviewCard from '../../components/cards/ReviewCard';
import { INITIAL_REVIEWS } from '../../data/mockData';

const CommunitySection = ({ t }) => {
    const [reviews, setReviews] = useState(INITIAL_REVIEWS(t));
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Update reviews when language changes
    useEffect(() => {
        setReviews(prevReviews => {
            const newReviews = INITIAL_REVIEWS(t);
            // Preserve likes/liked state
            return newReviews.map((rev, index) => ({
                ...rev,
                likes: prevReviews[index]?.likes || rev.likes,
                liked: prevReviews[index]?.liked || rev.liked
            }));
        });
    }, [t]);

    const toggleLike = (id) => {
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

            <AddCommentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} t={t} />

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
                                    onClick={() => setIsModalOpen(true)}
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
                    {reviews.map((review, index) => (
                        <ReviewCard key={review.id} review={review} t={t} onToggleLike={toggleLike} index={index} />
                    ))}
                </div>

                {/* Bottom Badge */}
                <div className="mt-20 flex justify-center">
                    <div className="px-6 py-2 bg-[#018F64] dark:bg-[#B0EEDE] rounded-full shadow-xl shadow-[#018F64]/20">
                        <span className="text-white dark:text-[#020617] font-black text-[10px] uppercase tracking-[0.3em]">
                            Más de 10,000 ecos-guardianes activos
                        </span>
                    </div>
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
