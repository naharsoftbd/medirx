import AnimatedHeading from '@/components/AnimatedHeading';
import { usePage } from '@inertiajs/react';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { useEffect, useRef } from 'react';

export default function TestimonialSection({ testimonials, interval = 3000 }) {
    const { appSettings } = usePage().props;

    const [sliderRef, slider] = useKeenSlider({
        loop: true,
        slides: {
            perView: 3,
            spacing: 20,
        },
        breakpoints: {
            '(max-width: 1024px)': {
                slides: { perView: 2, spacing: 15 },
            },
            '(max-width: 640px)': {
                slides: { perView: 1, spacing: 10 },
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
        <div className="container mx-auto bg-white py-10">
            <AnimatedHeading className="mb-1 justify-center text-center text-3xl font-bold">{appSettings?.testimonial_heading}</AnimatedHeading>
            {appSettings?.testimonial_subheading && <p className="mb-10 text-center text-gray-500">{appSettings?.testimonial_subheading}</p>}

            <div ref={sliderRef} className="keen-slider mb-1">
                {testimonials.map((t, i) => (
                    <div key={i} className="keen-slider__slide rounded-2xl border border-[var(--base-color)] p-6 shadow transition hover:shadow-lg">
                        <p className="text-lg leading-relaxed text-gray-700 italic">“{t.message}”</p>
                        <div className="mt-6 flex items-center">
                            <img
                                src={t.avatar_url || '/default-avatar.png'}
                                alt={t.name}
                                className="mr-4 h-14 w-14 rounded-full border object-cover"
                            />
                            <div>
                                <h4 className="font-semibold text-gray-900">{t.name}</h4>
                                <p className="text-sm text-gray-500">{t.designation}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
