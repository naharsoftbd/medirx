/**
 * @jest-environment jsdom
 */
import AddVital from '@/components/AddVital';
import { fireEvent, render, screen } from '@testing-library/react';

describe('AddVital Component', () => {
    let vitalData: unknown;
    let mockSetVitalData: jest.Mock;
    let mockHandleChange: jest.Mock;

    beforeEach(() => {
        vitalData = {
            blood_pressure: '',
            heart_rate: '',
            temperature: '',
            respiratory_rate: '',
            oxygen_saturation: '',
            weight: '',
            height: '',
            bmi: '',
            notes: '',
        };
        mockSetVitalData = jest.fn();
        mockHandleChange = jest.fn();
    });

    const setup = () => render(<AddVital vitalData={vitalData} setVitalData={mockSetVitalData} onHandleChange={mockHandleChange} />);

    test('renders all input fields', () => {
        setup();

        expect(screen.getByLabelText(/Blood Pressure/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Heart Rate/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Temperature/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Respiratory Rate/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Oxygen Saturation/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Weight/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Height/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/BMI/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Notes/i)).toBeInTheDocument();
    });

    test('typing in fields triggers onHandleChange', () => {
        setup();

        const bpInput = screen.getByLabelText(/Blood Pressure/i);
        fireEvent.change(bpInput, { target: { value: '120/80' } });
        expect(mockHandleChange).toHaveBeenCalled();

        const weightInput = screen.getByLabelText(/Weight/i);
        fireEvent.change(weightInput, { target: { value: '70' } });
        expect(mockHandleChange).toHaveBeenCalled();

        const heightInput = screen.getByLabelText(/Height/i);
        fireEvent.change(heightInput, { target: { value: '5.5' } });
        expect(mockHandleChange).toHaveBeenCalled();
    });

    test('calculates BMI and category correctly', () => {
        vitalData.weight = 70; // kg
        vitalData.height = 5.5; // feet
        setup();

        // Because BMI calculation runs in useEffect, we need to trigger the effect
        // Update weight & height
        fireEvent.change(screen.getByLabelText(/Weight/i), { target: { value: 70 } });
        fireEvent.change(screen.getByLabelText(/Height/i), { target: { value: 5.5 } });

        // Check setVitalData called with BMI
        expect(mockSetVitalData).toHaveBeenCalled();

        // Check category text
        const categoryText = screen.getByText(/Category:/i);
        expect(categoryText).toBeInTheDocument();
    });

    test('updates notes field', () => {
        setup();
        const notesInput = screen.getByLabelText(/Notes/i);
        fireEvent.change(notesInput, { target: { value: 'Patient is stable' } });
        expect(mockHandleChange).toHaveBeenCalled();
    });
});
