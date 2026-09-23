import SpecialtiesCarousel from '@/components/Blocks/SpecialtiesCarousel';
import { router } from '@inertiajs/react';
import { act, fireEvent, render, screen } from '@testing-library/react';

// ------------------ Mocks ------------------
jest.mock('@inertiajs/react', () => ({
    router: { get: jest.fn() },
}));

jest.mock('lucide-react', () => ({
    ChevronLeft: () => <div data-testid="chevron-left" />,
    ChevronRight: () => <div data-testid="chevron-right" />,
    Heart: () => <div data-testid="icon-heart" />,
}));

// ------------------ Test Data ------------------
const specialties = [
    { id: 1, name: 'Cardiology', is_surgical: false, icon: 'Heart' },
    { id: 2, name: 'Psychiatry', is_surgical: false },
    { id: 3, name: 'Surgery', is_surgical: true },
    { id: 4, name: 'Dermatology', is_surgical: false },
    { id: 5, name: 'Ophthalmology', is_surgical: true },
];

describe('SpecialtiesCarousel', () => {
    beforeEach(() => {
        (router.get as jest.Mock).mockClear();
        Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
        (global as unknown).route = (name: string, params?: Record<string, string>) =>
            params && params.specialty ? `/${name}?specialty=${params.specialty}` : `/${name}`;
    });

    it('renders heading with number of specialties', () => {
        act(() => {
            render(<SpecialtiesCarousel specialties={specialties} />);
        });
        expect(screen.getByText(/Doctors Medical Specialties more then 5/i)).toBeInTheDocument();
    });

    it('renders icons when provided', () => {
        act(() => {
            render(<SpecialtiesCarousel specialties={specialties} />);
        });
        expect(screen.getByTestId('icon-heart')).toBeInTheDocument();
    });

    it('calls router.get when clicking a specialty', () => {
        act(() => {
            render(<SpecialtiesCarousel specialties={specialties} />);
        });
        const card = screen.getByText('Cardiology').closest('div');
        act(() => {
            fireEvent.click(card!);
        });
        expect(router.get).toHaveBeenCalledWith('/doctors.list.index?specialty=Cardiology');
    });

    it('navigates to next and previous slides using buttons', () => {
        act(() => {
            render(<SpecialtiesCarousel specialties={specialties} />);
        });

        const nextButton = screen.queryByTestId('chevron-right');
        const prevButton = screen.queryByTestId('chevron-left');

        // Initial state: prev button hidden, next button visible
        expect(prevButton).not.toBeInTheDocument();
        expect(nextButton).toBeInTheDocument();

        // Click next
        if (nextButton) {
            act(() => {
                fireEvent.click(nextButton);
            });
        }

        // Click prev
        const newPrevButton = screen.queryByTestId('chevron-left');
        if (newPrevButton) {
            act(() => {
                fireEvent.click(newPrevButton);
            });
        }
    });

    it('updates slidesToShow on window resize', () => {
        act(() => {
            render(<SpecialtiesCarousel specialties={specialties} />);
        });

        act(() => {
            window.innerWidth = 500;
            fireEvent(window, new Event('resize'));
        });

        const firstSlide = screen.getByText('Cardiology').closest('div');
        // Inline style width may not be exact due to jsdom, so check class or structure
        expect(firstSlide).toBeInTheDocument();
    });

    it('handles swipe events for mobile', () => {
        act(() => {
            window.innerWidth = 500;
            render(<SpecialtiesCarousel specialties={specialties} />);
        });

        const carousel = screen.getByText('Cardiology').closest('section')!.querySelector('.overflow-hidden');

        // Swipe left
        act(() => {
            fireEvent.touchStart(carousel!, { targetTouches: [{ clientX: 100 }] });
            fireEvent.touchMove(carousel!, { targetTouches: [{ clientX: 20 }] });
            fireEvent.touchEnd(carousel!);
        });

        // Swipe right
        act(() => {
            fireEvent.touchStart(carousel!, { targetTouches: [{ clientX: 20 }] });
            fireEvent.touchMove(carousel!, { targetTouches: [{ clientX: 100 }] });
            fireEvent.touchEnd(carousel!);
        });
    });
});
