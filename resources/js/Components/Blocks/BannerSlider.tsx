import { useEffect, useState } from 'react';

export default function BannerSlider({ banners, interval = 5000 }) {
    const [current, setCurrent] = useState(0);

    const nextSlide = () => setCurrent((current + 1) % banners.length);
    const prevSlide = () => setCurrent((current - 1 + banners.length) % banners.length);

    // ✅ Auto play effect
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % banners.length);
        }, interval);

        return () => clearInterval(timer); // cleanup on unmount
    }, [banners.length, interval]);

    return (
        <div className="relative aspect-video w-full overflow-hidden bg-gray-200">
            {banners.map((banner, i) => (
                <div
                    key={i}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${i === current ? 'opacity-100' : 'opacity-0'}`}
                    style={{
                        backgroundImage: `url(${banner.banner_image_url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div className="flex h-full w-full flex-col items-center justify-center bg-black/50 text-white">
                        {banner.title && <h2 className="text-3xl font-bold">{banner.title}</h2>}
                        {banner.subtitle && <p className="text-lg">{banner.subtitle}</p>}
                        {/* ✅ Call To Action Button */}
                        {banner.link && (
                            <a
                                href={banner.link}
                                className="cursor-pointer rounded-lg bg-[var(--btn-base-color)] px-6 py-3 text-white shadow transition hover:bg-[var(--btn-base-hover-color)] dark:bg-gray-800"
                            >
                                {banner.cta_text || 'Learn More'}
                            </a>
                        )}
                    </div>
                </div>
            ))}

            {/* Controls */}
            <button
                onClick={prevSlide}
                className="absolute top-1/2 left-4 -translate-y-1/2 rounded bg-[var(--base-color)] px-2 py-1 text-white dark:bg-gray-800"
            >
                ‹
            </button>
            <button
                onClick={nextSlide}
                className="absolute top-1/2 right-4 -translate-y-1/2 rounded bg-[var(--base-color)] px-2 py-1 text-white dark:bg-gray-800"
            >
                ›
            </button>

            {/* Indicators */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                {banners.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`h-3 w-3 rounded-full ${i === current ? 'bg-[var(--base-color)] dark:bg-gray-800' : 'bg-white/50'}`}
                    ></button>
                ))}
            </div>
        </div>
    );
}
