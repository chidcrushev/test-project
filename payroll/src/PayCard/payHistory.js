import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PayComponent from './payComponent';
import { useLocation } from 'react-router-dom';
import { Card, Form, Row, Col } from 'react-bootstrap';
import  payHistoryImage from './payHistoryImg.png';

//  Current financial year
const getCurrentFinancialYear = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    return month >= 4 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
};

// Generate financial year options based on the joining date
const generateFinancialYears = (joiningDate) => {
    const currentYear = new Date().getFullYear();
    const startYear = new Date(joiningDate).getFullYear();
    const startMonth = new Date(joiningDate).getMonth() + 1;

    const years = [];
    for (let year = startYear; year <= currentYear + 1; year++) {
        if (year === startYear && startMonth >= 4) {
            years.push(`${year}-${year + 1}`);
        } else if (year !== startYear || (year === startYear && startMonth < 4)) {
            years.push(`${year - 1}-${year}`);
        }
    }
    return years;
};

//  Get months in a given financial year
const getMonthsInFinancialYear = (financialYear, joiningDate) => {
    const [startYear, endYear] = financialYear.split('-').map(Number);
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const joiningYear = new Date(joiningDate).getFullYear();
    const joiningMonth = new Date(joiningDate).getMonth() + 1;

    let months = [];

    if (financialYear === getCurrentFinancialYear()) {
        const limitMonth = currentMonth - 1;
        if (joiningYear === startYear && joiningMonth >= 4) {
            months = Array.from({ length: limitMonth - (joiningMonth - 1) }, (_, i) => ({ month: i + joiningMonth, year: startYear }));
        } else if (joiningYear === endYear && joiningMonth < 4) {
            months = Array.from({ length: limitMonth }, (_, i) => ({ month: i + 1, year: endYear }));
        } else {
            months = [
                ...Array.from({ length: limitMonth >= 4 ? limitMonth - 3 : 9 }, (_, i) => ({ month: i + 4, year: startYear })),
                ...Array.from({ length: limitMonth < 4 ? limitMonth : 0 }, (_, i) => ({ month: i + 1, year: endYear }))
            ].filter(({ month, year }) => year !== joiningYear || month >= joiningMonth);
        }
    } else {
        if (joiningYear === startYear && joiningMonth >= 4) {
            months = Array.from({ length: 12 - (joiningMonth - 1) }, (_, i) => ({ month: i + joiningMonth, year: startYear }));
        } else if (joiningYear === endYear && joiningMonth < 4) {
            months = Array.from({ length: 3 - (joiningMonth - 1) }, (_, i) => ({ month: i + joiningMonth, year: endYear }));
        } else {
            months = [
                ...Array.from({ length: 12 - 3 }, (_, i) => ({ month: i + 4, year: startYear })),
                ...Array.from({ length: 3 }, (_, i) => ({ month: i + 1, year: endYear }))
            ].filter(({ month, year }) => year !== joiningYear || month >= joiningMonth);
        }
    }

    return months;
};

const PayHistory = () => {
    const location = useLocation();
    const { employeeDetails } = location.state; 
    const joiningDate = employeeDetails.doj;
    const financialYears = generateFinancialYears(joiningDate);
    const [selectedFinancialYear, setSelectedFinancialYear] = useState(getCurrentFinancialYear());
    const [monthsInSelectedYear, setMonthsInSelectedYear] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');

    useEffect(() => {
        setMonthsInSelectedYear(getMonthsInFinancialYear(selectedFinancialYear, joiningDate));
    }, [selectedFinancialYear, joiningDate]);

    const handleFinancialYearChange = (event) => {
        setSelectedFinancialYear(event.target.value);
        setSelectedMonth('');
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    return (
        <div className="container mt-5">
            <h3>Pay Info</h3>
            <Row>
                <Col md={8}>
                    {selectedMonth ? (
                        monthsInSelectedYear
                            .filter(({ month }) => month === parseInt(selectedMonth))
                            .map(({ month, year }) => (
                                <Card key={`${year}-${month}`} className="shadow">
                                    <Card.Body>
                                        <PayComponent
                                            empId={employeeDetails.employeeId}
                                            month={month}
                                            year={year}
                                            employeeDetails={employeeDetails}
                                        />
                                    </Card.Body>
                                </Card>
                            ))
                    ) : (
                        <Card className="shadow mb-3">
                            <Card.Body>
                               <h5> <div>Select a financial year and month to view the pay details.</div> </h5>
                            </Card.Body>
                            <Card.Img variant="bottom" src={require('./payHistoryImg.png')}  alt="PayHistory"  className="mx-auto" style={{ width: '400px', height: 'auto' }} />
                        </Card>
                    )}
                </Col>
                <Col md={4}>
                    <Card className="shadow">
                        <Card.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Financial Year</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={selectedFinancialYear}
                                    onChange={handleFinancialYearChange}
                                    className="form-select"
                                    
                                >
                                    {financialYears.map(fy => (
                                        <option key={fy} value={fy}>{fy}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Month</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={selectedMonth}
                                    onChange={handleMonthChange}
                                    className="form-select"
                                >
                                    <option value="">Select month</option>
                                    {monthsInSelectedYear.map(({ month }) => (
                                        <option key={month} value={month}>
                                            {new Date(0, month - 1).toLocaleString('default', { month: 'long' })}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default PayHistory;