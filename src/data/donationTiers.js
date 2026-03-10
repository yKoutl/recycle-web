import { Award, Rocket, UserRound } from 'lucide-react';

const defaultBenefits = [
    'Acceso al canal exclusivo de Eco-Socios',
    'Insignia digital básica en tu perfil',
    'Reporte mensual de impacto educativo'
];

export const getDonationTiers = () => [
    {
        id: 'ECO_SOCIO',
        icon: UserRound,
        key: 'starter',
        color: 'from-[#052E16] via-[#064E3B] to-[#065F46]',
        darkColor: 'dark:from-[#020617] dark:via-[#052E16] dark:to-[#064E3B]',
        textColor: 'text-white',
        btnColor: 'bg-emerald-600 text-white',
        glow: 'shadow-emerald-900/40',
        benefits: defaultBenefits
    },
    {
        id: 'ECO_EMBAJADOR',
        icon: Award,
        key: 'growth',
        color: 'from-[#042F2E] to-[#0D9488]',
        darkColor: 'dark:from-[#020617] dark:to-[#134E4A]',
        textColor: 'text-white',
        btnColor: 'bg-teal-500 text-white',
        glow: 'shadow-teal-500/10',
        benefits: defaultBenefits
    },
    {
        id: 'ECO_VISIONARIO',
        icon: Rocket,
        key: 'hero',
        color: 'from-[#1E1B4B] via-[#4338CA] to-[#701A75]',
        darkColor: 'dark:from-[#020617] dark:via-[#1E1B4B] dark:to-[#4C1D95]',
        textColor: 'text-white',
        btnColor: 'bg-indigo-600 text-white',
        glow: 'shadow-indigo-500/40',
        benefits: defaultBenefits
    }
];
