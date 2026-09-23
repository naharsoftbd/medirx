/**
 * @jest-environment jsdom
 */

import AddPatient from '@/components/AddPatient';
import { fireEvent, render, screen } from '@testing-library/react';

// Mock AntD Select
jest.mock('antd', () => {
    const antd = jest.requireActual('antd');
    return {
        ...antd,
        Select: ({ onChange, value, options, 'data-testid': testid }: unknown) => (
            <select data-testid={testid} value={value} onChange={(e) => onChange(e.target.value)}>
                {options?.map((opt: unknown) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        ),
    };
});

describe('AddPatient Component', () => {
    const mockSetPatientData = jest.fn();
    const mockHandleChange = jest.fn();

    const mockErrors = {
        name: 'Name is required',
        phone: 'Phone is required',
        email: 'Email is required',
        gender: 'Gender is required',
        blood_group: 'Blood group is required',
        date_of_birth: 'DOB is required',
    };

    const initialData = {
        name: '',
        phone: '',
        email: '',
        gender: '',
        blood_group: '',
        address: '',
        city: '',
        date_of_birth: '',
    };

    const setup = () => {
        return render(
            <AddPatient patientData={initialData} setPatientData={mockSetPatientData} onHandleChange={mockHandleChange} errorsPateint={mockErrors} />,
        );
    };

    test('renders all input fields', () => {
        setup();

        expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Phone')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter address')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter city')).toBeInTheDocument();
    });

    test('typing in name triggers onHandleChange', () => {
        setup();

        const nameInput = screen.getByPlaceholderText('Name');
        fireEvent.change(nameInput, { target: { value: 'John Doe' } });

        expect(mockHandleChange).toHaveBeenCalled();
    });

    test('select gender triggers setPatientData', () => {
        setup();

        const select = screen.getByTestId('select-gender');
        fireEvent.change(select, { target: { value: 'male' } });

        expect(mockSetPatientData).toHaveBeenCalledWith('gender', 'male');
    });

    test('select blood group triggers setPatientData', async () => {
        setup();
        const select = screen.getByTestId('blood-group-select');
        fireEvent.change(select, { target: { value: 'A+' } });
        expect(mockSetPatientData).toHaveBeenCalledWith('blood_group', 'A+');
    });

    test('shows validation errors when fields are empty', () => {
        setup();

        expect(screen.getByText('Name is required')).toBeInTheDocument();
        expect(screen.getByText('Phone is required')).toBeInTheDocument();
        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getByText('Gender is required')).toBeInTheDocument();
        expect(screen.getByText('Blood group is required')).toBeInTheDocument();
        expect(screen.getByText('DOB is required')).toBeInTheDocument();
    });
});
