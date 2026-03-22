import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Hero from './Hero';
import ProgramsSection from './ProgramsSection';
import ImpactSection from './ImpactSection';
import CommunitySection from './CommunitySection';
import DonationSection from './DonationSection';
import PartnersSection from './PartnersSection';
import AboutSection from './AboutSection';
import ContactSection from './ContactSection';
import LazySection from '../../components/shared/LazySection';

const LandingView = ({ onLoginClick, lang, setLang, darkMode, setDarkMode, t, isAuthenticated, user, onLogout }) => {
    const { hash } = useLocation();

    const [forceAllVisible, setForceAllVisible] = React.useState(!!hash);

    useEffect(() => {
        if (hash) {
            setForceAllVisible(true);
            const id = hash.replace('#', '');
            let shouldCancelAutoScroll = false;
            const timers = [];

            const performScroll = () => {
                if (shouldCancelAutoScroll) return;
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            };

            const cancelAutoScroll = () => {
                shouldCancelAutoScroll = true;
            };

            // Intentos sucesivos para asegurar que el scroll llegue al punto exacto
            performScroll();
            timers.push(setTimeout(performScroll, 100));
            timers.push(setTimeout(performScroll, 500));
            timers.push(setTimeout(performScroll, 1500));

            window.addEventListener('wheel', cancelAutoScroll, { passive: true });
            window.addEventListener('touchstart', cancelAutoScroll, { passive: true });
            window.addEventListener('keydown', cancelAutoScroll);
            window.addEventListener('mousedown', cancelAutoScroll);

            return () => {
                timers.forEach(clearTimeout);
                window.removeEventListener('wheel', cancelAutoScroll);
                window.removeEventListener('touchstart', cancelAutoScroll);
                window.removeEventListener('keydown', cancelAutoScroll);
                window.removeEventListener('mousedown', cancelAutoScroll);
            };
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [hash]);
    return (
        <>
            <Navbar
                onLoginClick={onLoginClick}
                lang={lang}
                setLang={setLang}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                t={t}
                isAuthenticated={isAuthenticated}
                user={user}
                onLogout={onLogout}
            />


            <div id="home">
                <Hero onScrollToPrograms={() => document.getElementById('programs').scrollIntoView({ behavior: 'smooth' })} t={t} />
            </div>

            <div id="about">
                <AboutSection t={t} />
            </div>

            <div id="programs">
                <ProgramsSection t={t} isAuthenticated={isAuthenticated} user={user} />
            </div>
            <LazySection id="community" forceVisible={forceAllVisible}>
                <CommunitySection t={t} isAuthenticated={isAuthenticated} />
            </LazySection>
            <LazySection id="partners" forceVisible={forceAllVisible}>
                <PartnersSection t={t} />
            </LazySection>
            <LazySection id="impact" forceVisible={forceAllVisible}>
                <ImpactSection t={t} />
            </LazySection>

            <LazySection id="donate" forceVisible={forceAllVisible}>
                <DonationSection t={t} />
            </LazySection>
            <LazySection id="contact" forceVisible={forceAllVisible}>
                <ContactSection t={t} />
            </LazySection>
            <Footer t={t} />
        </>
    );
};

export default LandingView;
