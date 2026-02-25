import React, { useState, useEffect, useRef } from 'react';

const LazySection = ({ children, id, className = "", offset = "600px", forceVisible = false }) => {
    const [isVisible, setIsVisible] = useState(forceVisible);
    const sectionRef = useRef(null);

    useEffect(() => {
        if (forceVisible) {
            setIsVisible(true);
            return;
        }

        // Si el hash actual coincide con este ID, forzar visibilidad inmediata
        if (window.location.hash === `#${id}`) {
            setIsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                rootMargin: `0px 0px ${offset} 0px`,
                threshold: 0.01
            }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        const handleHashChange = () => {
            if (window.location.hash === `#${id}`) {
                setIsVisible(true);
            }
        };

        window.addEventListener('hashchange', handleHashChange);

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, [id, offset, forceVisible]);

    return (
        <div ref={sectionRef} id={id} className={className}>
            {isVisible ? children : <div className="min-h-[300px]" />}
        </div>
    );
};

export default LazySection;
