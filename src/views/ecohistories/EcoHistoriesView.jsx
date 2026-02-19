import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ReviewCard from '../../components/cards/ReviewCard';
import { useGetApprovedHistoriesQuery, useGetFeaturedHistoriesQuery, useLikeHistoryMutation } from '../../store/eco-histories/ecoHistoriesApi';
import LoginPromptModal from '../../components/modals/LoginPromptModal';
import { INITIAL_REVIEWS } from '../../data/mockData';
import { ArrowLeft, Leaf, Star, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

// Componente de Fondo de Partículas y Hojas
const EcoParticlesBackground = () => {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-gradient-to-b from-emerald-50 to-white dark:from-gray-950 dark:to-gray-900 transition-colors duration-700">
            {/* Hojas y partículas flotantes */}
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        opacity: 0,
                        x: Math.random() * 100 + '%',
                        y: Math.random() * 100 + '%',
                        rotate: Math.random() * 360,
                        scale: Math.random() * 0.5 + 0.5
                    }}
                    animate={{
                        y: ['-10%', '110%'],
                        rotate: [0, 360],
                        opacity: [0, 0.4, 0]
                    }}
                    transition={{
                        duration: Math.random() * 20 + 15,
                        repeat: Infinity,
                        ease: "linear",
                        delay: Math.random() * 20
                    }}
                    className="absolute text-emerald-500/30 dark:text-emerald-400/20"
                >
                    <Leaf size={Math.random() * 30 + 10} />
                </motion.div>
            ))}

            {/* Partículas pequeñas de brillo */}
            {[...Array(30)].map((_, i) => (
                <motion.div
                    key={`p-${i}`}
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.1, 0.5, 0.1],
                        y: [0, -20, 0]
                    }}
                    transition={{
                        duration: Math.random() * 3 + 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: Math.random() * 5
                    }}
                    className="absolute bg-emerald-400/40 rounded-full blur-[1px]"
                    style={{
                        width: Math.random() * 4 + 2 + 'px',
                        height: Math.random() * 4 + 2 + 'px',
                        left: Math.random() * 100 + '%',
                        top: Math.random() * 100 + '%',
                    }}
                />
            ))}

            {/* Luces de fondo (Glows) */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-300/20 dark:bg-emerald-600/10 blur-[150px] rounded-full"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-300/10 dark:bg-blue-600/5 blur-[150px] rounded-full"></div>
        </div>
    );
};

const EcoHistoriesView = ({ t, lang, setLang, darkMode, setDarkMode, isAuthenticated, user, onLogout }) => {
    const navigate = useNavigate();
    const { data: featuredBackend, isLoading: loadingFeatured } = useGetFeaturedHistoriesQuery();
    const { data: allApprovedBackend, isLoading: loadingAll } = useGetApprovedHistoriesQuery();
    const [likeHistory] = useLikeHistoryMutation();

    const [featured, setFeatured] = useState([]);
    const [allStories, setAllStories] = useState([]);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const { scrollYProgress } = useScroll();
    const headerScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Mapear historias destacadas preservando likes locales
    useEffect(() => {
        if (featuredBackend && featuredBackend.length > 0) {
            setFeatured(prev => {
                // Aseguramos que solo sean los pimeros 3
                return featuredBackend.slice(0, 3).map(h => {
                    const existing = prev.find(p => p.id === h._id);
                    return {
                        id: h._id,
                        name: h.user?.fullName || 'Eco-Héroe',
                        role: 'Eco-Héroe',
                        comment: h.message,
                        likes: h.likes || 0,
                        liked: existing ? existing.liked : false,
                        image: h.user?.avatarUrl || `https://ui-avatars.com/api/?name=${h.user?.fullName}&background=018F64&color=fff`,
                        rating: 5
                    };
                });
            });
        } else if (!loadingFeatured) {
            setFeatured([]);
        }
    }, [featuredBackend, t]);

    // Mapear todas las historias aprobadas preservando likes locales
    useEffect(() => {
        if (allApprovedBackend && allApprovedBackend.length > 0) {
            setAllStories(prev => {
                // Filtramos para que NO aparezcan los que ya están en destacados
                // Primero obtenemos los IDs de los destacados (usamos featuredBackend para tener la referencia fresca o featured del state)
                const featuredIds = featuredBackend?.slice(0, 3).map(f => f._id) || [];

                const filteredList = allApprovedBackend.filter(h => !featuredIds.includes(h._id));

                return filteredList.map(h => {
                    const existing = prev.find(p => p.id === h._id);
                    return {
                        id: h._id,
                        name: h.user?.fullName || 'Eco-Héroe',
                        role: 'Eco-Héroe',
                        comment: h.message,
                        likes: h.likes || 0,
                        liked: existing ? existing.liked : false,
                        image: h.user?.avatarUrl || `https://ui-avatars.com/api/?name=${h.user?.fullName}&background=018F64&color=fff`,
                        rating: 5
                    };
                });
            });
        } else if (!loadingAll) {
            setAllStories([]);
        }
    }, [allApprovedBackend, t]);

    const toggleLike = async (id, type) => {
        if (!isAuthenticated) {
            setIsLoginModalOpen(true);
            return;
        }

        // Optimistic Update
        const updateList = (list) => list.map(review => {
            if (review.id === id) {
                return {
                    ...review,
                    liked: !review.liked,
                    likes: review.liked ? review.likes - 1 : review.likes + 1
                };
            }
            return review;
        });

        if (type === 'featured') setFeatured(updateList(featured));
        else setAllStories(updateList(allStories));

        // Backend call
        try {
            await likeHistory(id).unwrap();
        } catch (error) {
            console.error('Error al dar like:', error);
        }
    };

    return (
        <div className="min-h-screen relative flex flex-col bg-white dark:bg-gray-950 transition-colors duration-700">
            {/* Nuevo Fondo de Partículas Dinámicas */}
            <EcoParticlesBackground />

            <LoginPromptModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} t={t} />

            {/* Navbar with forceScrolled={true} for better visibility on this dynamic background */}
            <Navbar
                lang={lang}
                setLang={setLang}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                t={t}
                isAuthenticated={isAuthenticated}
                user={user}
                onLogout={onLogout}
                forceScrolled={true}
            />

            <main className="flex-grow pt-32 pb-24 relative z-10">
                <div className="container mx-auto px-6">

                    {/* Strong Back Button */}
                    <div className="flex justify-start mb-20">
                        <motion.button
                            whileHover={{ scale: 1.05, x: -5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                navigate('/');
                                window.scrollTo(0, 0);
                            }}
                            className="group flex items-center gap-3 px-8 py-3 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border-2 border-emerald-500/20 text-[#018F64] dark:text-emerald-400 font-black uppercase tracking-[0.2em] text-[12px] rounded-2xl shadow-xl shadow-emerald-900/5 transition-all hover:border-emerald-500"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span>Regresar al inicio</span>
                        </motion.button>
                    </div>

                    {/* Balanced Header with Parallax Scale */}
                    <motion.div
                        style={{ scale: headerScale }}
                        className="text-center max-w-5xl mx-auto mb-20 px-4"
                    >
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ type: "spring", stiffness: 50 }}
                            className="text-4xl md:text-7xl lg:text-8xl font-black text-gray-900 dark:text-white tracking-tighter leading-[1.15] uppercase italic mb-8 py-4 "
                        >
                            EL MURO DE LAS <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#018F64] via-[#05835D] to-[#018F64] dark:from-[#B0EEDE] dark:via-[#018F64] dark:to-[#B0EEDE] bg-[length:200%_auto] animate-gradient-slow drop-shadow-sm">
                                ECO-HISTORIAS
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-lg md:text-2xl text-gray-700 dark:text-gray-300 font-bold leading-relaxed max-w-4xl mx-auto italic opacity-90"
                        >
                            "Descubre los testimonios que están construyendo un futuro sostenible. Cada acción cuenta en nuestra misión compartida."
                        </motion.p>
                    </motion.div>

                    {/* Content Sections */}
                    <section className="mb-32">
                        <div className="flex flex-col items-center text-center gap-4 mb-20 text-gray-900 dark:text-white">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 5 }}
                                className="p-5 bg-yellow-400/20 rounded-3xl text-yellow-600 shadow-xl backdrop-blur-md border border-yellow-400/10"
                            >
                                <Star size={40} fill="currentColor" />
                            </motion.div>
                            <div>
                                <h2 className="text-4xl font-black uppercase tracking-tight italic">Relatos que Inspiran</h2>
                                <div className="h-1.5 w-24 bg-yellow-400 rounded-full mx-auto mt-4"></div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {loadingFeatured ? (
                                [1, 2, 3].map(i => <div key={i} className="h-64 bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-[3rem] animate-pulse border border-white/20"></div>)
                            ) : (
                                featured.map((review, index) => (
                                    <ReviewCard
                                        key={`featured-${review.id}`}
                                        review={review}
                                        t={t}
                                        onToggleLike={(id) => toggleLike(id, 'featured')}
                                        index={index}
                                        variant="wall"
                                    />
                                ))
                            )}
                            {!loadingFeatured && featured.length === 0 && (
                                <div className="col-span-full flex flex-col items-center justify-center text-center py-12 opacity-60">
                                    <div className="w-20 h-20 bg-yellow-400/10 rounded-full flex items-center justify-center mb-4">
                                        <Star size={32} className="text-yellow-500/50" />
                                    </div>
                                    <p className="text-lg font-bold italic text-gray-500 dark:text-gray-400">
                                        Aún no hay historias destacadas. ¡Tu historia podría ser la primera!
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="mb-40">
                        <div className="flex flex-col items-center text-center gap-4 mb-20 text-gray-900 dark:text-white">
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ repeat: Infinity, duration: 3 }}
                                className="p-5 bg-emerald-500/20 rounded-3xl text-[#018F64] shadow-xl backdrop-blur-md border border-emerald-500/10"
                            >
                                <MessageSquare size={40} fill="currentColor" />
                            </motion.div>
                            <div>
                                <h2 className="text-4xl font-black uppercase tracking-tight italic">El Muro Completo</h2>
                                <div className="h-1.5 w-24 bg-emerald-500 rounded-full mx-auto mt-4"></div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {loadingAll ? (
                                [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-56 bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-[3rem] animate-pulse border border-white/20"></div>)
                            ) : (
                                allStories.map((review, index) => (
                                    <ReviewCard
                                        key={`all-${review.id}`}
                                        review={review}
                                        t={t}
                                        onToggleLike={(id) => toggleLike(id, 'all')}
                                        index={index}
                                        variant="wall"
                                    />
                                ))
                            )}
                            {!loadingAll && allStories.length === 0 && (
                                <div className="col-span-full flex flex-col items-center justify-center text-center py-12">
                                    <div className="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                        <MessageSquare size={40} className="text-gray-400 dark:text-gray-600" />
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
                    </section>
                </div>
            </main>

            <Footer t={t} />
        </div>
    );
};

export default EcoHistoriesView;
