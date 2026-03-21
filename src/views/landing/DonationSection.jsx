import React, { useState, useEffect } from 'react';
import { Sparkles, QrCode, HandHelping } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { onUpdateUser, setProcessingAction } from '../../store/auth/authSlice';
import { useCreateDonationMutation } from '../../store/donations/donationsApi';

// Sub-components
import DonationTierCard from './components/donation/DonationTierCard';
import DonationModal from './components/donation/DonationModal';
import { getDonationTiers } from '../../data/donationTiers';

const DonationSection = ({ t }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { status, user } = useSelector(state => state.auth);
    const isAuthenticated = status === 'authenticated';

    const [hoveredTier, setHoveredTier] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTier, setSelectedTier] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [contributionStep, setContributionStep] = useState('selection');
    const [countdown, setCountdown] = useState(300);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
    const [payerName, setPayerName] = useState('');
    const [isPayerSelf, setIsPayerSelf] = useState(true);

    const [successCountdown, setSuccessCountdown] = useState(0);

    const tiers = getDonationTiers();
    const [createDonation] = useCreateDonationMutation();

    useEffect(() => {
        document.body.style.overflow = isModalOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isModalOpen]);

    useEffect(() => {
        let timer;
        if (isModalOpen && contributionStep === 'payment' && countdown > 0) {
            timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
        } else if (isModalOpen && contributionStep === 'payment' && countdown === 0) {
            setIsModalOpen(false);
            setCountdown(300); // Reset timer for next time
        }
        return () => clearInterval(timer);
    }, [isModalOpen, contributionStep, countdown]);

    // Timer para el cierre automático tras el éxito
    useEffect(() => {
        let timer;
        if (isSuccess && successCountdown > 0) {
            timer = setInterval(() => setSuccessCountdown(prev => prev - 1), 1000);
        } else if (isSuccess && successCountdown === 0) {
            setIsModalOpen(false);
            setSelectedTier(null);
            setContributionStep('selection');
            setIsSuccess(false);
        }
        return () => clearInterval(timer);
    }, [isSuccess, successCountdown]);

    const handleOpenModal = (tier) => {
        setIsProcessing(false);
        setIsSuccess(false);
        setSuccessCountdown(0);
        setContributionStep('selection');
        setCountdown(300);
        setAcceptedTerms(false);
        setIsPaymentConfirmed(false);
        setIsPayerSelf(true);
        setPayerName(user?.fullName || '');
        setSelectedTier(tier);
        setIsModalOpen(true);
    };

    const handleConfirmContribution = async () => {
        setIsProcessing(true);
        dispatch(setProcessingAction(true));
        // Duración de 2 segundos según solicitud
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsProcessing(false);
        dispatch(setProcessingAction(false));
        setContributionStep('payment');
    };

    const handleFinalizePayment = async () => {
        if (!acceptedTerms) return;
        setIsPaymentConfirmed(true);
        dispatch(setProcessingAction(true));
        try {
            await createDonation({
                payerName: payerName,
                membershipTier: selectedTier.id,
                amount: parseFloat(t.donation.tiers[selectedTier.key].amount.replace(/[^\d.]/g, '')),
            }).unwrap();

            // 🏆 ACTUALIZACIÓN INSTANTÁNEA
            dispatch(onUpdateUser({
                membershipTier: selectedTier.id,
                membershipStatus: 'ACTIVE'
            }));

            setIsPaymentConfirmed(false);
            setIsSuccess(true);
            setSuccessCountdown(3);

            // Mantener "Validando" por 6 segundos en total
            setTimeout(() => {
                dispatch(setProcessingAction(false));
            }, 6000);

        } catch (error) {
            setIsPaymentConfirmed(false);
            dispatch(setProcessingAction(false));
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <section className="py-24 relative bg-[#FEFDFB] dark:bg-[#020617] transition-colors duration-500">
            {/* Spotlight Effect */}
            <div className={`hidden lg:block fixed inset-0 w-full h-full bg-black/55 backdrop-blur-[2px] transition-opacity duration-300 pointer-events-none z-[80] ${hoveredTier && !isModalOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} />

            <DonationModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                selectedTier={selectedTier}
                contributionStep={contributionStep}
                setContributionStep={setContributionStep}
                isAuthenticated={isAuthenticated}
                user={user}
                t={t}
                navigate={navigate}
                countdown={countdown}
                successCountdown={successCountdown}
                formatTime={formatTime}
                isProcessing={isProcessing}
                isSuccess={isSuccess}
                acceptedTerms={acceptedTerms}
                setAcceptedTerms={setAcceptedTerms}
                isPaymentConfirmed={isPaymentConfirmed}
                payerName={payerName}
                setPayerName={setPayerName}
                isPayerSelf={isPayerSelf}
                setIsPayerSelf={setIsPayerSelf}
                handleConfirmContribution={handleConfirmContribution}
                handleFinalizePayment={handleFinalizePayment}
            />

            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none opacity-50" />

            <div className="container mx-auto px-6 relative">
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-12 md:w-20 h-[2px] bg-gradient-to-l from-[#018F64] to-transparent dark:from-[#10B981]" />
                        <p className="text-[12px] md:text-[14px] font-black text-[#018F64] dark:text-[#10B981] uppercase tracking-[0.4em]">{t.donation.tag}</p>
                        <div className="w-12 md:w-20 h-[2px] bg-gradient-to-r from-[#018F64] to-transparent dark:from-[#10B981]" />
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter leading-[0.95]">
                        {t.donation.title.split(' ')[0]} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#018F64] to-[#10B981] dark:from-[#10B981] dark:to-[#B0EEDE]">{t.donation.title.split(' ').slice(1).join(' ')}</span>
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-32 max-w-5xl mx-auto items-center">
                    {tiers.map((tier, idx) => (
                        <DonationTierCard
                            key={tier.id}
                            tier={tier}
                            t={t}
                            idx={idx}
                            isHovered={hoveredTier === tier.id}
                            onMouseEnter={() => setHoveredTier(tier.id)}
                            onMouseLeave={() => setHoveredTier(null)}
                            onClick={handleOpenModal}
                        />
                    ))}
                </div>

                {/* Footer QR Info Section */}
                <div className="bg-[#FEFDFB] dark:bg-[#022C22]/20 rounded-[4rem] p-12 md:p-20 border border-gray-100 dark:border-white/5 relative overflow-hidden shadow-sm z-10 group/qr">
                    <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.1] pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #018F64 1px, transparent 0)`, backgroundSize: '24px 24px' }} />
                    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.12] dark:opacity-[0.25]">
                        <HandHelping size={180} className="absolute -top-10 -left-10 text-[#018F64] -rotate-12" />
                        <HandHelping size={240} className="absolute -bottom-20 right-1/4 text-[#018F64] -rotate-12" />
                    </div>
                    <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
                        <div className="space-y-10">
                            <h3 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter leading-tight">{t.donation.qrTitle}</h3>
                            <p className="text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-xl">{t.donation.qrSubtitle || 'Puedes realizar tu eco-aporte escaneando nuestro código oficial.'}</p>
                            <p className="text-[12px] font-medium text-gray-400 border-l-2 border-emerald-500/30 pl-6 italic">{t.donation.disclaimer}</p>
                        </div>
                        <div className="flex justify-center lg:justify-end">
                            <div className="relative group text-center space-y-8">
                                <div className="bg-white dark:bg-gray-800 p-16 rounded-[4rem] shadow-2xl border border-gray-100 dark:border-gray-700">
                                    <QrCode size={180} className="text-[#018F64] opacity-80" />
                                </div>
                                <div className="p-6 bg-white/40 dark:bg-black/40 backdrop-blur-md rounded-[2rem] border border-white/40 shadow-2xl">
                                    <div className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter">982 109 407</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DonationSection;
