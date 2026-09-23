import DepartmentSection from '@/components/Blocks/DepartmentSection';
import { router, usePage } from '@inertiajs/react';
import { fireEvent, render, screen } from '@testing-library/react';

// Mock Inertia
jest.mock('@inertiajs/react', () => ({
    usePage: jest.fn(),
    router: { get: jest.fn() },
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => new Proxy({}, { get: (target, prop) => () => <div data-testid={`icon-${String(prop)}`} /> }));

// Mock global route helper
(global as unknown).route = (name: string, params?: Record<string, string>) => {
    if (params) {
        const query = new URLSearchParams(params).toString();
        return `/${name}${query ? '?' + query : ''}`;
    }
    return `/${name}`;
};

// Mock ResizeObserver (used in the component)
class MockResizeObserver {
    observe = jest.fn();
    disconnect = jest.fn();
}
(global as unknown).ResizeObserver = MockResizeObserver;

describe('DepartmentSection Component', () => {
    const appSettings = {
        department_heading: 'Departments',
        department_subheading: 'Explore our departments',
    };

    const departments = [
        { id: 1, title: 'Cardiology', icon: 'heart', description: 'Heart specialists' },
        { id: 2, title: 'Neurology', icon: 'brain', description: 'Brain specialists' },
    ];

    beforeEach(() => {
        (usePage as jest.Mock).mockReturnValue({ props: { appSettings } });
        (router.get as jest.Mock).mockClear();
    });

    it('renders heading and subheading', () => {
        render(<DepartmentSection departments={departments} />);
        expect(screen.getByText(appSettings.department_heading)).toBeInTheDocument();
        expect(screen.getByText(appSettings.department_subheading)).toBeInTheDocument();
    });

    it('renders departments', () => {
        render(<DepartmentSection departments={departments} />);
        expect(screen.getByText('Cardiology')).toBeInTheDocument();
        expect(screen.getByText('Neurology')).toBeInTheDocument();
    });

    it('clicking a department calls router.get with correct params', () => {
        render(<DepartmentSection departments={departments} />);
        const cardiologyCard = screen.getByText('Cardiology').closest('div');
        fireEvent.click(cardiologyCard!);
        expect(router.get).toHaveBeenCalledWith('/doctors.list.index?specialty=Cardiology');
    });

    it('renders empty state when no departments', () => {
        render(<DepartmentSection departments={[]} />);
        expect(screen.getByText('No departments available.')).toBeInTheDocument();
    });
});
