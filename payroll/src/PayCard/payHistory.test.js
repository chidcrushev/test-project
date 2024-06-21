import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PayHistory from './payHistory';
import { BrowserRouter as Router } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(),
}));

const mockEmployeeDetails = {
    employeeId: '1',
    employeeName: 'Anu',
    designation: 'Developer',
    location: 'Chennai',
    uanNo: 'UAN123456',
    pfNo: 'PF123456',
    doj: '2020-01-01',
    panId: 'PAN123456',
    bankName: 'XYZ Bank',
    department: 'IT',
    accountNo: '1234567890',
};

describe('PayHistory', () => {
    beforeEach(() => {
        useLocation.mockReturnValue({
            state: { employeeDetails: mockEmployeeDetails }
        });
    });

    it('renders PayHistory component correctly', async () => {
        render(
            <Router>
                <PayHistory />
            </Router>
        );

        
        expect(screen.getByText('Pay Info')).toBeInTheDocument();

        
        expect(screen.getByLabelText('Financial Year')).toBeInTheDocument();

        expect(screen.getByLabelText('Month')).toBeInTheDocument();

        
        expect(screen.getByText('Select a financial year and month to view the pay details.')).toBeInTheDocument();
    });

    it('updates months when financial year is changed', async () => {
        render(
            <Router>
                <PayHistory />
            </Router>
        );

        const financialYearSelect = screen.getByLabelText('Financial Year');
        fireEvent.change(financialYearSelect, { target: { value: '2019-2020' } });

        await waitFor(() => {
        
            expect(screen.getByLabelText('Month').children.length).toBeGreaterThan(1);
        });
    });

    it('displays PayComponent when a month is selected', async () => {
        render(
            <Router>
                <PayHistory />
            </Router>
        );

        const financialYearSelect = screen.getByLabelText('Financial Year');
        fireEvent.change(financialYearSelect, { target: { value: '2019-2020' } });

        await waitFor(() => {
            const monthSelect = screen.getByLabelText('Month');
            fireEvent.change(monthSelect, { target: { value: '4' } });
        });

        await waitFor(() => {
        
            expect(screen.getByText('Gross pay')).toBeInTheDocument();
        });
    });

    it('displays default image and message when no month is selected', async () => {
        render(
            <Router>
                <PayHistory />
            </Router>
        );

        const defaultImage = screen.getByAltText('PayHistory');
        expect(defaultImage).toBeInTheDocument();

        expect(screen.getByText('Select a financial year and month to view the pay details.')).toBeInTheDocument();
    });
});
