import AnimatedHeading from '@/components/AnimatedHeading';
import { usePage } from '@inertiajs/react';
import { useKeenSlider } from 'keen-slider/react';
import { useEffect, useRef } from 'react';

export default function PartnerSection({ partners, interval = 3000 }) {
    const { appSettings } = usePage().props as { appSettings: Record<string, string> };
    const [sliderRef, slider] = useKeenSlider({
        loop: true,
        slides: {
            perView: 6,
            spacing: 15,
        },
        breakpoints: {
            '(max-width: 768px)': {
                slides: { perView: 2, spacing: 10 },
            },
        },
    });

    // autoplay
    const timer = useRef();
    useEffect(() => {
        if (!slider) return;
        timer.current = setInterval(() => {
            slider.current?.next();
        }, interval);
        return () => clearInterval(timer.current);
    }, [slider, interval]);

    return (
        <div className="container mx-auto bg-gray-50 py-10">
            <AnimatedHeading className="mb-1 justify-center text-center text-3xl font-bold">{appSettings?.partner_heading}</AnimatedHeading>
            {appSettings?.partner_subheading && <p className="mb-6 text-center text-gray-500">{appSettings?.partner_subheading}</p>}
            <div ref={sliderRef} className="keen-slider">
                {partners.map((partner, i) => (
                    <div key={i} className="keen-slider__slide flex items-center justify-center">
                        <a href={partner.url} target="_blank" rel="noreferrer">
                            <img src={partner.logo_image_url} alt={partner.name} className="mx-auto max-h-20 object-contain" />
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
