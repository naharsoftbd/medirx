// ------------------ Mocks MUST be first ------------------

jest.mock('@inertiajs/react', () => {
    return {
        usePage: jest.fn(),
        useForm: jest.fn(),
        router: { post: jest.fn() },
    };
});

jest.mock('lucide-react', () => ({
    Mail: () => <div data-testid="icon-mail" />,
    Phone: () => <div data-testid="icon-phone" />,
    MapPin: () => <div data-testid="icon-mappin" />,
}));

// ------------------ Now import the component ------------------
import ContactForm from '@/components/Blocks/ContactForm';
import { useForm, usePage } from '@inertiajs/react';
import { fireEvent, render, screen } from '@testing-library/react';

// ------------------ Setup mocks ------------------
describe('ContactForm Component', () => {
    const mockAppSettings = {
        contact_heading: 'Contact Us',
        contact_subheading: 'We are here to help',
    };

    const mockUseForm = {
        data: { name: '', email: '', subject: '', message: '' },
        setData: jest.fn(),
        post: jest.fn(),
        processing: false,
        errors: {},
        reset: jest.fn(),
    };

    beforeEach(() => {
        (usePage as jest.Mock).mockReturnValue({ props: { appSettings: mockAppSettings } });
        (useForm as jest.Mock).mockReturnValue(mockUseForm);
        jest.clearAllMocks();
    });

    it('renders all input fields and button', () => {
        render(<ContactForm />);
        expect(screen.getByLabelText('Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Subject')).toBeInTheDocument();
        expect(screen.getByLabelText('Message')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
    });

    it('allows typing into inputs', () => {
        render(<ContactForm />);
        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } });
        expect(mockUseForm.setData).toHaveBeenCalledWith('name', 'John Doe');
    });

    it('calls form.post when form is submitted', () => {
        render(<ContactForm />);
        fireEvent.submit(screen.getByRole('form'));
        expect(mockUseForm.post).toHaveBeenCalled();
    });

    it('displays errors when provided by useForm', () => {
        (useForm as jest.Mock).mockReturnValue({ ...mockUseForm, errors: { name: 'Name is required' } });
        render(<ContactForm />);
        expect(screen.getByText('Name is required')).toBeInTheDocument();
    });
});
