import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

// SpecialtiesCarousel Component
export default function SpecialtiesCarousel({ specialties = [] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const carouselRef = useRef(null);

    // Sample data if none provided
    const sampleSpecialties = [
        { id: 1, name: 'Cardiology', parent_id: null, is_surgical: false },
        { id: 2, name: 'Psychiatry', parent_id: null, is_surgical: false },
        { id: 3, name: 'Surgery', parent_id: null, is_surgical: true },
        { id: 4, name: 'Dermatology', parent_id: null, is_surgical: false },
        { id: 5, name: 'Ophthalmology', parent_id: null, is_surgical: true },
        { id: 6, name: 'ENT', parent_id: null, is_surgical: true },
        { id: 7, name: 'Pediatrics', parent_id: null, is_surgical: false },
        { id: 8, name: 'Anesthesiology', parent_id: null, is_surgical: false },
        { id: 9, name: 'Radiology', parent_id: null, is_surgical: false },
        { id: 10, name: 'Pathology', parent_id: null, is_surgical: false },
    ];

    // Use sample data if no specialties provided
    const displaySpecialties = specialties.length > 0 ? specialties : sampleSpecialties;

    useEffect(() => {
        // Check if mobile on initial render and window resize
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);

        return () => {
            window.removeEventListener('resize', checkIsMobile);
        };
    }, []);

    // Calculate how many slides to show based on screen size
    const getSlidesToShow = useCallback(() => {
        if (typeof window === 'undefined') return 3;

        const width = window.innerWidth;
        if (width < 640) return 1;
        if (width < 1024) return 2;
        return 4;
    }, []);

    const [slidesToShow, setSlidesToShow] = useState(getSlidesToShow());
    const maxIndex = Math.max(0, displaySpecialties.length - slidesToShow);

    // Update slidesToShow on window resize
    useEffect(() => {
        const handleResize = () => {
            setSlidesToShow(getSlidesToShow());
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [getSlidesToShow]);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
    }, [maxIndex]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }, []);

    // Touch event handlers for mobile swipe
    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const minSwipeDistance = 50; // Minimum distance for a swipe to be registered

        if (distance > minSwipeDistance) {
            // Swipe left - next slide
            nextSlide();
        } else if (distance < -minSwipeDistance) {
            // Swipe right - previous slide
            prevSlide();
        }
    };

    // Auto-advance slides
    useEffect(() => {
        if (isMobile) return; // Don't auto-advance on mobile

        const interval = setInterval(() => {
            if (currentIndex >= maxIndex) {
                setCurrentIndex(0);
            } else {
                nextSlide();
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [currentIndex, isMobile, maxIndex, nextSlide]);

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

    // Handle link click
    const handleLinkClick = (e, specialtyName) => {
        e.preventDefault();
        // In a real app, you would use Inertia.get or similar
        router.get(route('doctors.list.index', { specialty: specialtyName }));
    };

    return (
        <section className="mx-auto max-w-full px-4 pb-10">
            <h2 className="mb-4 text-center text-2xl font-semibold">Doctors Medical Specialties more then {specialties?.length}</h2>

            <div className="relative">
                {/* Navigation Arrows */}
                {currentIndex > 0 && (
                    <Button
                        onClick={prevSlide}
                        className="absolute top-1/2 left-0 z-10 -translate-y-1/2 transform rounded-full p-2 shadow-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        aria-label="Previous specialties"
                    >
                        <ChevronLeft className="h-5 w-5 text-white" />
                    </Button>
                )}

                {currentIndex < maxIndex && (
                    <Button
                        onClick={nextSlide}
                        className="absolute top-1/2 right-0 z-10 -translate-y-1/2 transform rounded-full p-2 shadow-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        aria-label="Next specialties"
                    >
                        <ChevronRight className="h-5 w-5 text-white" />
                    </Button>
                )}

                {/* Carousel Container */}
                <div
                    ref={carouselRef}
                    className="overflow-hidden"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div
                        className="flex transition-transform duration-300 ease-in-out"
                        style={{
                            transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)`,
                        }}
                    >
                        {displaySpecialties.map((s) => {
                            return (
                                <div key={s.id} className="flex-none px-2" style={{ width: `${100 / slidesToShow}%` }}>
                                    <motion.article
                                        whileHover={{ y: -6 }}
                                        className="h-full cursor-pointer rounded-2xl border bg-gradient-to-br from-white to-[var(--base-color)] p-4 shadow-sm transition-shadow hover:shadow-lg"
                                    >
                                        <div onClick={(e) => handleLinkClick(e, s.name)} className="flex items-center gap-3">
                                            {s.icon && (
                                                <div className="mb-1 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--btn-base-color)]">
                                                    <IconFromName name={s.icon} className="h-10 w-10 text-white" />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <h3 className="truncate text-lg font-medium">{s.name}</h3>
                                                <p className="mt-1 text-sm text-white">{s.is_surgical ? 'Surgical' : 'Non-surgical'}</p>
                                            </div>
                                        </div>
                                    </motion.article>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Dots Indicator */}
                {/* {maxIndex > 0 && (
                    <div className="flex justify-center mt-6 space-x-2">
                        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`h-2 w-2 rounded-full transition-colors ${
                                    index === currentIndex ? 'bg-indigo-600' : 'bg-gray-300'
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )} */}
            </div>

            {/* Mobile swipe instructions */}
            {isMobile && (
                <div className="mt-4 text-center text-sm text-gray-500">
                    <p>Swipe left or right to view more specialties</p>
                </div>
            )}
        </section>
    );
}
