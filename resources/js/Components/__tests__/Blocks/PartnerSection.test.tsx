import PartnerSection from '@/components/Blocks/PartnerSection';
import { usePage } from '@inertiajs/react';
import { render, screen } from '@testing-library/react';
import { useKeenSlider } from 'keen-slider/react';

// ------------------ Mocks ------------------

// Mock Inertia usePage
jest.mock('@inertiajs/react', () => ({
    usePage: jest.fn(),
}));

// Mock Keen Slider
jest.mock('keen-slider/react', () => ({
    useKeenSlider: jest.fn(),
}));

// ------------------ Test Data ------------------

const appSettings = {
    partner_heading: 'Our Partners',
    partner_subheading: 'We work with top organizations',
};

const partners = [
    { name: 'Partner A', logo_image_url: '/a.png', url: 'https://partner-a.com' },
    { name: 'Partner B', logo_image_url: '/b.png', url: 'https://partner-b.com' },
    { name: 'Partner C', logo_image_url: '/c.png', url: 'https://partner-c.com' },
];

// ------------------ Tests ------------------

describe('PartnerSection Component', () => {
    const mockSliderRef = { current: { next: jest.fn() } };
    const mockSlider = { current: { next: jest.fn() } };

    beforeEach(() => {
        (usePage as jest.Mock).mockReturnValue({ props: { appSettings } });
        (useKeenSlider as jest.Mock).mockReturnValue([mockSliderRef, mockSlider]);
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.resetAllMocks();
    });

    it('renders heading and subheading', () => {
        render(<PartnerSection partners={partners} />);
        expect(screen.getByText(appSettings.partner_heading)).toBeInTheDocument();
        expect(screen.getByText(appSettings.partner_subheading)).toBeInTheDocument();
    });

    it('renders all partner logos with correct links', () => {
        render(<PartnerSection partners={partners} />);
        partners.forEach((partner) => {
            const logoImg = screen.getByAltText(partner.name) as HTMLImageElement;
            expect(logoImg).toBeInTheDocument();
            expect(logoImg.src).toContain(partner.logo_image_url);

            const link = logoImg.closest('a');
            expect(link).toHaveAttribute('href', partner.url);
            expect(link).toHaveAttribute('target', '_blank');
            expect(link).toHaveAttribute('rel', 'noreferrer');
        });
    });

    it('calls slider.next automatically after interval', () => {
        render(<PartnerSection partners={partners} interval={3000} />);
        // Fast-forward time by interval
        jest.advanceTimersByTime(3000);
        expect(mockSlider.current.next).toHaveBeenCalled();
    });
});
