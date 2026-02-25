import React, { Suspense, lazy } from 'react';

// Cargamos lottie-react solo cuando se necesita
const Lottie = lazy(() => import('lottie-react'));

const LazyLottie = ({ animationData, className, ...props }) => {
    return (
        <Suspense fallback={<div className={`${className} animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg`} />}>
            <Lottie
                animationData={animationData}
                className={className}
                {...props}
            />
        </Suspense>
    );
};

export default LazyLottie;
