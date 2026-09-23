import SpecialtiesCarousel from '@/components/Blocks/SpecialtiesCarousel';
import { router, usePage } from '@inertiajs/react';
import { Select } from 'antd';
import { Search, Stethoscope } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import DoctorCard from './DoctorCard';

export default function DoctorsList() {
    const { doctorlist, specialties, filters } = usePage().props;

    const [doctorList, setDoctorList] = useState(doctorlist.data);
    const [nextPageUrl, setNextPageUrl] = useState(doctorlist.next_page_url);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState(filters.search || '');

    const observerRef = useRef<HTMLDivElement | null>(null);
    const firstLoad = useRef(true);

    // Reset only when filters/search change (not on load more)
    const loadMore = useCallback(() => {
        if (!nextPageUrl || loading) return;

        setLoading(true);

        router.get(
            nextPageUrl,
            {},
            {
                preserveState: true,
                preserveScroll: true, // <-- Add this line
                replace: true, // optional: prevents adding a new history entry
                onSuccess: (page) => {
                    setDoctorList((prev) => [...prev, ...(page.props.doctorlist.data || [])]);
                    setNextPageUrl(page.props.doctorlist.next_page_url || null);
                },
                onFinish: () => setLoading(false),
            },
        );
    }, [nextPageUrl, loading]);

    // Infinite scroll setup
    useEffect(() => {
        if (!observerRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            },
            { rootMargin: '200px' }, // start loading slightly before reaching the bottom
        );

        observer.observe(observerRef.current);

        return () => observer.disconnect();
    }, [loadMore]);

    const specialtieoptions = specialties.map((s) => ({ value: s.name, label: s.name }));

    const handleFilterChange = (filterType, value) => {
        const newFilters = { ...filters };

        if (value === '' || value === null) {
            delete newFilters[filterType]; // remove empty value from query
        } else {
            newFilters[filterType] = value; // set search value
        }

        router.get(window.location.pathname, newFilters, {
            preserveState: true,
            replace: true,
            preserveScroll: false,
            onSuccess: (page) => {
                setDoctorList(page.props.doctorlist.data);
                setNextPageUrl(page.props.doctorlist.next_page_url);
            },
        });
    };

    useEffect(() => {
        if (firstLoad.current) {
            firstLoad.current = false;
            return;
        }
        const delay = setTimeout(() => {
            handleFilterChange('search', searchText);
        }, 100);

        return () => clearTimeout(delay);
    }, [searchText]);

    return (
        <main className="container mx-auto py-2">
            {/* Page Title and Filters */}
            <div className="mb-4 flex flex-col items-start justify-between md:flex-row md:items-center">
                <div>
                    <p className="mt-2 text-gray-600">Book appointments with the best specialists</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-4 md:mt-0">
                    <div className="relative w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Search doctors..."
                            className="w-full rounded-md border border-gray-300 bg-white py-2 pr-10 pl-3 text-gray-700 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none md:w-64"
                            value={searchText || ''}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <Search className="mr-2 text-xl font-medium text-[var(--base-color)]" />
                        </div>
                    </div>
                    <div className="relative w-full md:w-auto">
                        <Select
                            allowClear
                            showSearch
                            placeholder="All Specialties"
                            optionFilterProp="label"
                            className="!h-[40px] w-full rounded-md border border-gray-300 bg-white text-gray-700 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none md:w-60"
                            value={filters.specialty || undefined}
                            onChange={(value) => handleFilterChange('specialty', value)}
                            options={specialtieoptions}
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <Stethoscope className="mr-2 text-xl font-medium text-[var(--base-color)]" />
                        </div>
                    </div>
                </div>
            </div>

            {loading && (
                <div className="fixed top-24 left-1/2 z-50 flex -translate-x-1/2 items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-[var(--base-color)] border-t-transparent"></div>
                </div>
            )}

            <SpecialtiesCarousel specialties={specialties} />

            {/* Doctor Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {doctorList.map((doctor) => (
                    <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
            </div>

            {doctorList.length === 0 && (
                <div className="py-12 text-center">
                    <i className="fas fa-search mb-4 text-4xl text-gray-400"></i>
                    <h3 className="text-xl font-semibold text-gray-700">No doctors found</h3>
                    <p className="mt-2 text-gray-600">Try adjusting your search or filter criteria</p>
                </div>
            )}

            {/* Invisible div at the bottom for intersection observer */}
            {nextPageUrl && <div ref={observerRef} className="h-10 w-full" />}
        </main>
    );
}
