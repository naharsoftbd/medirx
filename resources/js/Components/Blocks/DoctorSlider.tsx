import AnimatedHeading from '@/components/AnimatedHeading';
import { Link, usePage } from '@inertiajs/react';
import { Facebook, GraduationCap, Linkedin, MapPin, Star, Twitter } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Slider, { CustomArrowProps } from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

interface Doctor {
    id: number;
    name: string;
    photo: string;
    specialty?: string;
    specialization?: string;
    degree?: string;
    location?: string;
    featured?: boolean;
    social?: {
        facebook?: string;
        twitter?: string;
        linkedin?: string;
    };
}

interface DoctorSliderProps {
    doctors: Doctor[];
}

export default function DoctorSlider({ doctors, type = 'all' }: DoctorSliderProps) {
    const { appSettings } = usePage().props as { appSettings: Record<string, string> };

    const containerRef = useRef<HTMLDivElement | null>(null);
    const sliderRef = useRef<Slider | null>(null);

    // slider options state that we derive from container width
    const [options, setOptions] = useState(() => ({
        slidesToShow: 4,
        slidesToScroll: 1,
        rows: 2,
    }));

    // small key to force remount when options change
    const [keySuffix, setKeySuffix] = useState(0);

    // helper to compute options based on width
    function computeOptionsFromWidth(w: number) {
        // example rules — tweak thresholds as needed
        if (w >= 1200) return { slidesToShow: 4, slidesToScroll: 1, rows: 2 };
        if (w >= 900) return { slidesToShow: 3, slidesToScroll: 1, rows: 2 };
        if (w >= 640) return { slidesToShow: 2, slidesToScroll: 1, rows: 2 };
        return { slidesToShow: 1, slidesToScroll: 1, rows: 2 };
    }

    // debounce helper
    function debounce<T extends (...args: unknown[]) => void>(fn: T, wait = 100) {
        let t: number | undefined;
        return (...args: Parameters<T>) => {
            if (t) window.clearTimeout(t);
            t = window.setTimeout(() => fn(...args), wait);
        };
    }

    useEffect(() => {
        if (!containerRef.current) return;
        // initial compute
        const initialW = Math.round(containerRef.current.getBoundingClientRect().width);
        const initial = computeOptionsFromWidth(initialW);
        setOptions(initial);

        // ResizeObserver to track changes to the container's size
        const ro = new ResizeObserver(
            debounce((entries: ResizeObserverEntry[]) => {
                const entry = entries[0];
                if (!entry) return;
                const w = Math.round(entry.contentRect.width);
                const computed = computeOptionsFromWidth(w);
                // shallow compare
                if (
                    computed.slidesToShow !== options.slidesToShow ||
                    computed.slidesToScroll !== options.slidesToScroll ||
                    computed.rows !== options.rows
                ) {
                    setOptions(computed);
                    // bump key to force remount (react-slick will re-init)
                    setKeySuffix((s) => s + 1);
                }
            }, 120),
        );

        ro.observe(containerRef.current);

        return () => {
            ro.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // run once on mount

    // optional: reset slider to first slide when options change
    useEffect(() => {
        if (sliderRef.current && sliderRef.current.slickGoTo) {
            try {
                sliderRef.current?.slickGoTo?.(0);
            } catch {
                // ignore
            }
        }
    }, [keySuffix]);

    // Custom Prev Arrow
    const PrevArrow = ({ onClick }: CustomArrowProps) => (
        <button
            onClick={onClick}
            className="absolute top-1/2 left-2 z-10 -translate-y-1/2 rounded-full bg-[var(--btn-base-color)] p-2 text-white shadow hover:bg-[var(--btn-base-hover-color)] dark:bg-gray-800"
        >
            ‹
        </button>
    );

    // Custom Next Arrow
    const NextArrow = ({ onClick }: CustomArrowProps) => (
        <button
            onClick={onClick}
            className="absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full bg-[var(--btn-base-color)] p-2 text-white shadow hover:bg-[var(--btn-base-hover-color)] dark:bg-gray-800"
        >
            ›
        </button>
    );

    const settings = {
        infinite: true,
        slidesToShow: options.slidesToShow,
        slidesToScroll: options.slidesToScroll,
        autoplay: true,
        autoplaySpeed: 3000,
        speed: 1000,
        cssEase: 'linear',
        arrows: true,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />,
        adaptiveHeight: false,
    };

    return (
        <div ref={containerRef} className="container mx-auto bg-gray-50 py-10">
            {type === 'featured' ? (
                <div>
                    <AnimatedHeading className="mb-1 justify-center text-center text-3xl font-bold">
                        {appSettings?.featured_doctor_heading}
                    </AnimatedHeading>
                    <p className="mb-10 text-center text-gray-500">{appSettings?.featured_doctor_subheading}</p>
                </div>
            ) : (
                <div>
                    <AnimatedHeading className="mb-1 justify-center text-center text-3xl font-bold">{appSettings?.doctor_heading}</AnimatedHeading>
                    <p className="mb-10 text-center text-gray-500">{appSettings?.doctor_subheading}</p>
                </div>
            )}
            <Slider key={`dept-${keySuffix}`} ref={sliderRef} {...settings}>
                {doctors.map((doc) => (
                    <div key={doc.id} className="h-full p-2">
                        <div className="flex h-full flex-col rounded-xl border border-[var(--base-color)] bg-white p-6 text-center shadow-md transition hover:shadow-lg">
                            <div className="relative mb-4 inline-block flex-shrink-0">
                                <img src={doc.photo} alt={doc.name} className="mx-auto w-full border-4 border-gray-100 object-cover" />
                                {type === 'featured' && doc.featured && (
                                    <span className="absolute -top-2 -right-2 rounded-full bg-yellow-400 p-2 text-white">
                                        <Star size={16} />
                                    </span>
                                )}
                                {doc.specialty && (
                                    <span className="absolute -top-2 -left-2 rounded-full bg-[var(--base-color)] px-2 py-1 text-white dark:bg-gray-800">
                                        {doc.specialty}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-1 flex-col justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">{doc.name}</h3>
                                    {doc.specialization && (
                                        <span className="rounded-md bg-[var(--base-color)] p-1 text-sm text-white dark:bg-gray-800">
                                            {doc.specialization}
                                        </span>
                                    )}
                                    {doc.degree && (
                                        <div className="mt-2 flex items-center justify-center text-sm text-gray-500">
                                            <GraduationCap size={16} className="mr-1 text-[var(--base-color)]" />
                                            {doc.degree}
                                        </div>
                                    )}
                                    {doc.location && (
                                        <div className="flex items-center justify-center text-sm text-gray-500">
                                            <MapPin size={16} className="mr-1 text-[var(--base-color)]" />
                                            {doc.location}
                                        </div>
                                    )}
                                    <div className="mt-2">
                                        <Link
                                            href={route('doctors.frontend.show', { uuid: doc.uuid })}
                                            className="rounded-lg border bg-[var(--btn-base-color)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--btn-base-hover-color)] dark:bg-gray-800"
                                        >
                                            VIEW PROFILE
                                        </Link>
                                    </div>
                                </div>

                                <div className="mt-3 flex min-h-[36px] flex-shrink-0 justify-center gap-3">
                                    {doc.social?.facebook && (
                                        <a
                                            href={doc.social.facebook}
                                            target="_blank"
                                            className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--btn-base-color)] text-white transition hover:bg-[var(--btn-base-hover-color)]"
                                        >
                                            <Facebook size={18} />
                                        </a>
                                    )}
                                    {doc.social?.twitter && (
                                        <a
                                            href={doc.social.twitter}
                                            target="_blank"
                                            className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--btn-base-color)] text-white transition hover:bg-[var(--btn-base-hover-color)]"
                                        >
                                            <Twitter size={18} />
                                        </a>
                                    )}
                                    {doc.social?.linkedin && (
                                        <a
                                            href={doc.social.linkedin}
                                            target="_blank"
                                            className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--btn-base-color)] text-white transition hover:bg-[var(--btn-base-hover-color)]"
                                        >
                                            <Linkedin size={18} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
}
