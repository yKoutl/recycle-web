import React, { useState, useEffect, useRef } from 'react';

const LazySection = ({ children, id, className = "", offset = "600px" }) => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
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

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, [offset]);

    return (
        <div ref={sectionRef} id={id} className={className}>
            {isVisible ? children : <div className="min-h-[300px]" />}
        </div>
    );
};

export default LazySection;
