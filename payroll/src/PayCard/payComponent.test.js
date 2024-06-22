import React, { act } from 'react';
import { waitFor, render, screen, fireEvent } from '@testing-library/react';
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

jest.mock('react-chartjs-2', () => ({
    Doughnut: () => null,
  }))

const renderComponent = async () => {
    return render(
        <Router>
        <PayComponent empId="1" />
    </Router>
    )
}

describe('PayComponent', () => {
      
    beforeEach(() => {
        mockAxios.reset();
    });

    it('renders PayComponent correctly with initial state', async () => {

        mockAxios.onGet('http://localhost:8882/payroll/employeeDetails/1').reply(200, mockEmployeeDetails);
        mockAxios.onGet('http://localhost:8882/payroll/details').reply(200, mockSalaryDetails);

        const {container} = await renderComponent();
        await act (async () => {
            expect(container).toMatchSnapshot();
        })
        await act (async () => {
            // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
            expect(container.getElementsByClassName("gross-pay").length).toBe(1);
        });
        await act (async () => {
            // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
            expect(container.getElementsByClassName("salary-mask").length).toBe(3);
        })
    });

    // it('toggles visibility of salary details', async () => {
    //     mockAxios.onGet('http://localhost:8882/payroll/employeeDetails/1').reply(200, mockEmployeeDetails);
    //     mockAxios.onGet('http://localhost:8882/payroll/details').reply(200, mockSalaryDetails);

    //     render(
    //         <Router>
    //             <PayComponent empId="1" />
    //         </Router>
    //     );

    //     const {container} = await renderComponent();

    //     fireEvent.click(screen.getByRole('button', { name: /eye/i }));

    //     await act (async () => {
    //         expect(container).toMatchSnapshot();
    //     })

    //     await waitFor(() => {
    //         // Check unmasked state
    //         expect(screen.getByText('₹ 80,000.00')).toBeInTheDocument();
    //     });
    // });

    // it('handles view payslip button click', async () => {
    //     mockAxios.onGet('http://localhost:8882/payroll/employeeDetails/1').reply(200, mockEmployeeDetails);
    //     mockAxios.onGet('http://localhost:8882/payroll/details').reply(200, mockSalaryDetails);

    //     const { container } = render(
    //         <Router>
    //             <PayComponent empId="1" />
    //         </Router>
    //     );

    //     await waitFor(() => {
    //         expect(screen.getByText(/₹/)).toBeInTheDocument();
    //     });

       
    //     const button = container.querySelector('button');
    //     fireEvent.click(button);

    // });

    // it('handles pay history button click', async () => {
    //     mockAxios.onGet('http://localhost:8882/payroll/employeeDetails/1').reply(200, mockEmployeeDetails);
    //     mockAxios.onGet('http://localhost:8882/payroll/details').reply(200, mockSalaryDetails);

    //     const { container } = render(
    //         <Router>
    //             <PayComponent empId="123" isDashboard={true} />
    //         </Router>
    //     );

    //     await waitFor(() => {
            
    //         expect(screen.getByText(/₹/)).toBeInTheDocument();
    //     });

      
    //     const buttons = container.querySelectorAll('button');
    //     const payHistoryButton = buttons[1];
    //     fireEvent.click(payHistoryButton);
    // });
});
