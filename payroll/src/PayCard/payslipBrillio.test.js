import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PayslipBrillio from './payslipBrillio';
import { BrowserRouter as Router } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(),
}));

jest.mock('jspdf');
jest.mock('html2canvas');

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
    ytdBasicPay: 600000,
    ytdHouseRentAllowance: 240000,
    ytdSpecialAllowance: 120000,
    ytdGrossEarnings: 960000,
    epf: 5000,
    incomeTax: 10000,
    professionalTax: 2000,
    grossDeduction: 17000,
    ytdEpf: 60000,
    ytdIncomeTax: 120000,
    ytdProfessionalTax: 24000,
    netPay: 63000,
    lop: 0,
};

describe('PayslipBrillio', () => {
    beforeEach(() => {
        useLocation.mockReturnValue({
            state: {
                employeeDetails: mockEmployeeDetails,
                salaryDetails: mockSalaryDetails,
                month: 6,
                year: 2023,
            },
        });
    });

    it('renders PayslipBrillio component correctly', () => {
        render(
            <Router>
                <PayslipBrillio />
            </Router>
        );

        expect(screen.getByText('Preview - June 2023 Payslip')).toBeInTheDocument();

      
        expect(screen.getByText('EMPCODE:')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();

     
        expect(screen.getByText('Basic Pay')).toBeInTheDocument();
        expect(screen.getByText('50,000.00')).toBeInTheDocument();

        expect(screen.getByText('Provident Fund')).toBeInTheDocument();
        expect(screen.getByText('5,000.00')).toBeInTheDocument();
    });

    it('downloads the PDF when the button is clicked', async () => {
        html2canvas.mockResolvedValue({
            toDataURL: jest.fn().mockReturnValue('data:image/png'),
        });

        const saveMock = jest.fn();
        jsPDF.mockImplementation(() => ({
            addImage: jest.fn(),
            save: saveMock,
            internal: { pageSize: { getWidth: jest.fn().mockReturnValue(210), getHeight: jest.fn().mockReturnValue(297) } },
        }));

        render(
            <Router>
                <PayslipBrillio />
            </Router>
        );

        const downloadButton = screen.getByText('Download');
        fireEvent.click(downloadButton);

        await waitFor(() => {
            expect(html2canvas).toHaveBeenCalled();
            expect(jsPDF).toHaveBeenCalled();
            expect(saveMock).toHaveBeenCalledWith('payslip.pdf');
        });
    });
});