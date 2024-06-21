import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PayComponent from './payComponent';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';

const mockAxios = new MockAdapter(axios);

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
    accountNo: '1234567890'
};

const mockSalaryDetails = {
    basicPay: 50000,
    houseRentAllowance: 20000,
    specialAllowance: 10000,
    grossEarning: 80000,
    epf: 6000,
    incomeTax: 5000,
    professionalTax: 2000,
    grossDeduction: 13000,
    netPay: 67000,
    ytdBasicPay: 600000,
    ytdHouseRentAllowance: 240000,
    ytdSpecialAllowance: 120000,
    ytdEpf: 72000,
    ytdIncomeTax: 60000,
    ytdProfessionalTax: 24000,
    ytdGrossEarnings: 960000,
    ytdGrossDeductions: 130000,
};

describe('PayComponent', () => {
    beforeEach(() => {
        mockAxios.reset();
    });

    it('renders PayComponent correctly with initial state', async () => {
        mockAxios.onGet('http://localhost:8882/payroll/employeeDetails/1').reply(200, mockEmployeeDetails);
        mockAxios.onGet('http://localhost:8882/payroll/details').reply(200, mockSalaryDetails);

        render(
            <Router>
                <PayComponent empId="1" />
            </Router>
        );

        
        expect(screen.getByText('Gross pay')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText(/₹/)).toBeInTheDocument();
        });
    });

    it('toggles visibility of salary details', async () => {
        mockAxios.onGet('http://localhost:8882/payroll/employeeDetails/1').reply(200, mockEmployeeDetails);
        mockAxios.onGet('http://localhost:8882/payroll/details').reply(200, mockSalaryDetails);

        render(
            <Router>
                <PayComponent empId="1" />
            </Router>
        );

        await waitFor(() => {
            // Check initial masked state
            expect(screen.getByText(/₹/)).toBeInTheDocument();
        });

        // Toggle visibility
        fireEvent.click(screen.getByRole('button', { name: /eye/i }));

        await waitFor(() => {
            // Check unmasked state
            expect(screen.getByText('₹ 80,000.00')).toBeInTheDocument();
        });
    });

    it('handles view payslip button click', async () => {
        mockAxios.onGet('http://localhost:8882/payroll/employeeDetails/1').reply(200, mockEmployeeDetails);
        mockAxios.onGet('http://localhost:8882/payroll/details').reply(200, mockSalaryDetails);

        const { container } = render(
            <Router>
                <PayComponent empId="1" />
            </Router>
        );

        await waitFor(() => {
           
            expect(screen.getByText(/₹/)).toBeInTheDocument();
        });

       
        const button = container.querySelector('button');
        fireEvent.click(button);

    });

    it('handles pay history button click', async () => {
        mockAxios.onGet('http://localhost:8882/payroll/employeeDetails/1').reply(200, mockEmployeeDetails);
        mockAxios.onGet('http://localhost:8882/payroll/details').reply(200, mockSalaryDetails);

        const { container } = render(
            <Router>
                <PayComponent empId="123" isDashboard={true} />
            </Router>
        );

        await waitFor(() => {
            
            expect(screen.getByText(/₹/)).toBeInTheDocument();
        });

      
        const buttons = container.querySelectorAll('button');
        const payHistoryButton = buttons[1];
        fireEvent.click(payHistoryButton);
    });
});
