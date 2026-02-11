import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Hero from './Hero';
import ProgramsSection from './ProgramsSection';
import ImpactSection from './ImpactSection';
import CommunitySection from './CommunitySection';
import PartnersSection from './PartnersSection';
import AboutSection from './AboutSection';
import ContactSection from './ContactSection';
import LazySection from '../../components/shared/LazySection';

const LandingView = ({ onLoginClick, lang, setLang, darkMode, setDarkMode, t }) => {
    return (
        <>
            <Navbar
                onLoginClick={onLoginClick}
                lang={lang}
                setLang={setLang}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                t={t}
            />
            <div id="home">
                <Hero onScrollToPrograms={() => document.getElementById('programs').scrollIntoView({ behavior: 'smooth' })} t={t} />
            </div>
            <div id="about">
                <AboutSection t={t} />
            </div>
            <div id="programs">
                <ProgramsSection t={t} />
            </div>
            <LazySection id="community">
                <CommunitySection t={t} />
            </LazySection>
            <LazySection id="partners">
                <PartnersSection t={t} />
            </LazySection>
            <LazySection id="impact">
                <ImpactSection t={t} />
            </LazySection>
            <LazySection id="contact">
                <ContactSection t={t} />
            </LazySection>
            <Footer t={t} />
        </>
    );
};

export default LandingView;
