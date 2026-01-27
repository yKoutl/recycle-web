import React from 'react';
import { Handshake } from 'lucide-react';
import Button from '../../components/shared/Button';
import PartnerCard from '../../components/cards/PartnerCard';
import PartnerModal from '../../components/modals/PartnerModal';
import JoinPartnerModal from '../../components/modals/JoinPartnerModal';
import { MOCK_PARTNERS } from '../../data/mockData';

const PartnersSection = ({ t }) => {
    const [selectedPartner, setSelectedPartner] = React.useState(null);
    const [isProductModalOpen, setIsProductModalOpen] = React.useState(false);
    const [isJoinModalOpen, setIsJoinModalOpen] = React.useState(false);

    const handleCardClick = (partner) => {
        setSelectedPartner(partner);
        setIsProductModalOpen(true);
    };

    return (
        <section className="py-24 bg-white dark:bg-gray-950 transition-colors duration-500 relative">
            <PartnerModal
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                partner={selectedPartner}
            />

            <JoinPartnerModal
                isOpen={isJoinModalOpen}
                onClose={() => setIsJoinModalOpen(false)}
            />

            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-xl">
                        <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase inline-block mb-3">
                            {t.partners.tag}
                        </span>
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t.partners.title}</h2>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">{t.partners.subtitle}</p>
                    </div>
                    {/* Header Button now triggers Join Modal with Handshake icon */}
                    <Button
                        onClick={() => setIsJoinModalOpen(true)}
                        className="bg-[#00C6A0] hover:bg-[#00A88D] text-white shadow-lg shadow-[#00C6A0]/20"
                        icon={Handshake}
                    >
                        Quiero ser Aliado
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {MOCK_PARTNERS(t).map((partner) => (
                        <PartnerCard
                            key={partner.id}
                            partner={partner}
                            onClick={() => handleCardClick(partner)}
                        />
                    ))}
                    {/* View All Card Removed as requested */}
                </div>
            </div>
        </section>
    );
};

export default PartnersSection;
