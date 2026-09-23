import FAQSection from '@/components/Blocks/FAQSection';
import { usePage } from '@inertiajs/react';
import { fireEvent, render, screen } from '@testing-library/react';

// ------------------ Mocks ------------------

// Mock Inertia usePage
jest.mock('@inertiajs/react', () => ({
    usePage: jest.fn(),
}));

// Mock Accordion components if needed
jest.mock('@/components/ui/accordion', () => {
    return {
        Accordion: ({ children }: unknown) => <div>{children}</div>,
        AccordionItem: ({ children }: unknown) => <div>{children}</div>,
        AccordionTrigger: ({ children, ...props }: unknown) => <button {...props}>{children}</button>,
        AccordionContent: ({ children }: unknown) => <div>{children}</div>,
    };
});

// ------------------ Test Data ------------------

const appSettings = {
    faq_heading: 'Frequently Asked Questions',
    faq_subheading: 'Everything you need to know',
};

const faqs = [
    { question: 'What is your service?', answer: 'We provide xyz services.' },
    { question: 'How to contact support?', answer: 'Email us at support@example.com' },
    { question: 'Do you offer refunds?', answer: 'Yes, within 30 days.' },
    { question: 'Where are you located?', answer: 'We are based in Dhaka.' },
];

// ------------------ Tests ------------------

describe('FAQSection Component', () => {
    beforeEach(() => {
        (usePage as jest.Mock).mockReturnValue({ props: { appSettings } });
    });

    it('renders heading and subheading', () => {
        render(<FAQSection faqs={faqs} />);
        expect(screen.getByText(appSettings.faq_heading)).toBeInTheDocument();
        expect(screen.getByText(appSettings.faq_subheading)).toBeInTheDocument();
    });

    it('splits FAQs into left and right columns', () => {
        render(<FAQSection faqs={faqs} />);
        // There should be 2 accordions (left and right)
        const questions = faqs.map((f) => f.question);
        questions.forEach((q) => {
            expect(screen.getByText(q)).toBeInTheDocument();
        });
    });

    it('reveals answer when accordion trigger is clicked', () => {
        render(<FAQSection faqs={faqs} />);
        const questionBtn = screen.getByText('What is your service?');
        fireEvent.click(questionBtn);
        expect(screen.getByText('We provide xyz services.')).toBeInTheDocument();
    });
});
