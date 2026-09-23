import AnimatedHeading from '@/components/AnimatedHeading';
import { router, usePage } from '@inertiajs/react';
import * as Icons from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Slider, { CustomArrowProps } from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

type Dept = { id: number | string; icon?: string; title?: string; description?: string };

export default function DepartmentSection({ departments }: { departments: Dept[] }) {
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

    const toPascal = (name = '') =>
        name
            .toString()
            .split(/[-_ ]+/)
            .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
            .join('');

    function IconFromName({ name, ...props }) {
        if (!name) return null;
        const Comp = Icons[toPascal(name)];
        return Comp ? <Comp {...props} /> : null;
    }

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
        dots: false,
        infinite: true,
        speed: 1000,
        cssEase: 'linear',
        arrows: true,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />,
        autoplay: true,
        autoplaySpeed: 3000,
        slidesToShow: options.slidesToShow, // how many columns per row
        slidesToScroll: options.slidesToScroll,
        rows: options.rows, // 👈 two rows
        adaptiveHeight: false,
    };

    // Handle link click
    const handleLinkClick = (e, specialtyName) => {
        e.preventDefault();
        // In a real app, you would use Inertia.get or similar
        router.get(route('doctors.list.index', { specialty: specialtyName }));
    };

    return (
        <div ref={containerRef} className="container mx-auto bg-gray-50 py-10">
            <AnimatedHeading className="mb-1 justify-center text-center text-3xl font-bold">{appSettings?.department_heading}</AnimatedHeading>
            <p className="mb-10 text-center text-gray-500">{appSettings?.department_subheading}</p>

            {departments.length === 0 ? (
                <p className="text-center text-gray-500">No departments available.</p>
            ) : (
                <Slider key={`dept-${keySuffix}`} ref={sliderRef} {...settings}>
                    {departments.map((dept, index) => (
                        <div key={index} onClick={(e) => handleLinkClick(e, dept.title)} className="cursor-pointer p-3">
                            <div className="flex h-[150px] flex-col items-center rounded-lg border border-[var(--base-color)] bg-white p-2 text-center shadow-sm transition duration-300 hover:shadow-lg">
                                {dept.icon && (
                                    <div className="mb-1 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--base-color)] dark:bg-gray-800">
                                        <IconFromName name={dept.icon} className="h-10 w-10 text-white" />
                                    </div>
                                )}
                                <h3 className="mb-2 text-lg font-semibold text-gray-800">{dept.title}</h3>
                                {dept.description && <p className="text-sm text-gray-600">{dept.description}</p>}
                            </div>
                        </div>
                    ))}
                </Slider>
            )}
        </div>
    );
}
