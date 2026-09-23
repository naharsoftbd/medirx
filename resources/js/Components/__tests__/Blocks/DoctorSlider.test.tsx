import DoctorSlider from '@/components/Blocks/DoctorSlider';
import { router, usePage } from '@inertiajs/react';
import { render, screen } from '@testing-library/react';

// ------------------ Mocks ------------------

// Mock Inertia
jest.mock('@inertiajs/react', () => ({
    usePage: jest.fn(),
    router: { get: jest.fn() },
    Link: ({ children, ...props }: unknown) => <a {...props}>{children}</a>,
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
    Facebook: () => <div data-testid="icon-facebook" />,
    Twitter: () => <div data-testid="icon-twitter" />,
    Linkedin: () => <div data-testid="icon-linkedin" />,
    MapPin: () => <div data-testid="icon-mappin" />,
    Star: () => <div data-testid="icon-star" />,
    GraduationCap: () => <div data-testid="icon-graduationcap" />,
}));

// Mock route helper globally
(global as unknown).route = (name: string, params?: Record<string, string>) => (params && params.uuid ? `/${name}?uuid=${params.uuid}` : `/${name}`);

// Mock ResizeObserver
class MockResizeObserver {
    observe = jest.fn();
    disconnect = jest.fn();
}
(global as unknown).ResizeObserver = MockResizeObserver;

// ------------------ Test Data ------------------

const appSettings = {
    doctor_heading: 'Our Doctors',
    doctor_subheading: 'Meet our specialists',
    featured_doctor_heading: 'Featured Doctors',
    featured_doctor_subheading: 'Top rated doctors',
};

const doctors = [
    {
        id: 1,
        uuid: 'doc-1',
        name: 'Dr. John Doe',
        photo: '/john.jpg',
        specialty: 'Cardiology',
        specialization: 'Heart',
        degree: 'MD',
        location: 'Dhaka',
        featured: true,
        social: {
            facebook: 'https://facebook.com/john',
            twitter: 'https://twitter.com/john',
            linkedin: 'https://linkedin.com/in/john',
        },
    },
    {
        id: 2,
        uuid: 'doc-2',
        name: 'Dr. Jane Smith',
        photo: '/jane.jpg',
        specialty: 'Neurology',
    },
];

// ------------------ Tests ------------------

describe('DoctorSlider Component', () => {
    beforeEach(() => {
        (usePage as jest.Mock).mockReturnValue({ props: { appSettings } });
        (router.get as jest.Mock).mockClear();
    });

    it('renders headings for type="all"', () => {
        render(<DoctorSlider doctors={doctors} type="all" />);
        expect(screen.getByText(appSettings.doctor_heading)).toBeInTheDocument();
        expect(screen.getByText(appSettings.doctor_subheading)).toBeInTheDocument();
    });

    it('renders headings for type="featured"', () => {
        render(<DoctorSlider doctors={doctors} type="featured" />);
        expect(screen.getByText(appSettings.featured_doctor_heading)).toBeInTheDocument();
        expect(screen.getByText(appSettings.featured_doctor_subheading)).toBeInTheDocument();
    });

    it('renders doctor names and images', () => {
        render(<DoctorSlider doctors={doctors} />);
        const doctorNames = screen.getAllByText('Dr. John Doe');
        expect(doctorNames.length).toBeGreaterThan(0);

        const doctorImages = screen.getAllByAltText('Dr. John Doe');
        expect(doctorImages.length).toBeGreaterThan(0);
    });

    it('renders social icons when provided', () => {
        render(<DoctorSlider doctors={doctors} />);
        const facebookIcons = screen.getAllByTestId('icon-facebook');
        expect(facebookIcons.length).toBeGreaterThan(0);

        const twitterIcons = screen.getAllByTestId('icon-twitter');
        expect(twitterIcons.length).toBeGreaterThan(0);

        const linkedinIcons = screen.getAllByTestId('icon-linkedin');
        expect(linkedinIcons.length).toBeGreaterThan(0);
    });

    it('clicking VIEW PROFILE calls route correctly', () => {
        render(<DoctorSlider doctors={doctors} />);
        const profileLink = screen.getByRole('link', {
            name: /view profile/i,
            // You could also filter by closest parent containing the doctor's name
        });
        expect(profileLink).toHaveAttribute('href', `/doctors.frontend.show?uuid=${doctors[0].uuid}`);
    });
});
