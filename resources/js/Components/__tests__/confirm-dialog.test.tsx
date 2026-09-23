import { ConfirmDialog } from '@/components/ConfirmDialog';
import { fireEvent, render, screen } from '@testing-library/react';

describe('ConfirmDialog', () => {
    const setup = (props = {}) => {
        const defaultProps = {
            isOpen: true,
            title: 'Delete Medicine',
            message: 'Are you sure you want to delete this?',
            onConfirm: jest.fn(),
            onCancel: jest.fn(),
        };
        return render(<ConfirmDialog {...defaultProps} {...props} />);
    };

    test('does not render when closed', () => {
        setup({ isOpen: false });
        expect(screen.queryByText('Delete Medicine')).not.toBeInTheDocument();
    });

    test('renders title and message when open', () => {
        setup();

        expect(screen.getByRole('heading', { name: /delete medicine/i })).toBeInTheDocument();

        expect(screen.getByText(/are you sure you want to delete this/i)).toBeInTheDocument();
    });

    test('calls onCancel when clicking cancel button', () => {
        const onCancel = jest.fn();
        setup({ onCancel });

        fireEvent.click(screen.getByRole('button', { name: /no, cancel/i }));

        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    test('calls onConfirm when clicking confirm button', () => {
        const onConfirm = jest.fn();
        setup({ onConfirm });

        fireEvent.click(screen.getByRole('button', { name: /yes, i'm sure/i }));

        expect(onConfirm).toHaveBeenCalledTimes(1);
    });
});
