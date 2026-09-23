import TestimonialSection from '@/components/Blocks/TestimonialSection';
import { act, render, screen } from '@testing-library/react';

jest.mock('@inertiajs/react', () => ({
    usePage: () => ({
        props: {
            appSettings: {
                testimonial_heading: 'Client Testimonials',
                testimonial_subheading: 'See what people say',
            },
        },
    }),
}));

// Mock Keen Slider
const mockNext = jest.fn();
const mockSliderObject = {
    current: { next: mockNext },
};

jest.mock('keen-slider/react', () => ({
    useKeenSlider: () => {
        return [
            jest.fn(), // sliderRef
            mockSliderObject, // slider instance
        ];
    },
}));

// Prevent CSS import crash
jest.mock('keen-slider/keen-slider.min.css', () => ({}));

describe('TestimonialSection Component', () => {
    const testimonials = [
        { name: 'Alice', message: 'Great service!', designation: 'CEO', avatar_url: '/a.png' },
        { name: 'Bob', message: 'Amazing experience!', designation: 'Manager', avatar_url: '/b.png' },
        { name: 'Charlie', message: 'Very satisfied.', designation: 'Developer', avatar_url: '/c.png' },
    ];

    beforeEach(() => {
        jest.useFakeTimers();
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('renders heading and subheading', () => {
        render(<TestimonialSection testimonials={testimonials} />);

        expect(screen.getByText('Client Testimonials')).toBeInTheDocument();
        expect(screen.getByText('See what people say')).toBeInTheDocument();
    });

    it('renders all testimonial slides', () => {
        render(<TestimonialSection testimonials={testimonials} />);

        expect(screen.getByText('“Great service!”')).toBeInTheDocument();
        expect(screen.getByText('“Amazing experience!”')).toBeInTheDocument();
        expect(screen.getByText('“Very satisfied.”')).toBeInTheDocument();
    });

    it('auto-plays and calls slider.next()', () => {
        render(<TestimonialSection testimonials={testimonials} interval={2000} />);

        // Fast-forward timers
        act(() => {
            jest.advanceTimersByTime(2000);
        });

        expect(mockNext).toHaveBeenCalledTimes(1);

        act(() => {
            jest.advanceTimersByTime(2000);
        });

        expect(mockNext).toHaveBeenCalledTimes(2);
    });
});
