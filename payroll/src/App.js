
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import PayslipBrillio from './PayCard/payslipBrillio';
import PayHistory from './PayCard/payHistory';
import PayComponent from './PayCard/payComponent';

function App() {

  // const empId = '1';
  // const month = 6;   
  // const year = 2024; 
  // const joiningDate = '2022-01-01'; 
  return (
    <div className="App">
{/*  
    <PayDashboard empId={EmpId} /> */}
    {/* <PayslipBrillio/> */}
    {/* <PayMonth empId={EmpId} month={month} year={year} /> */}
    {/* <PayHistory empId={EmpId} joiningDate={joiningDate} /> */}
    {/* <Dummy/> */}
        <Router>
            <Routes>
                {/* <Route path="/dashboard" element={<PayDashboard empId="1" />} />
                <Route path="/payslip" element={<PayslipBrillio />} />
                <Route path="/payhistory" element={<PayHistory />} /> */}
                {/* <Route path="/payslip" element={<PayslipBrillio />} /> */}
                <Route path="/dashboard" element={<PayComponent empId="1" isDashboard={true} />} />
                <Route path="/payslip" element={<PayslipBrillio />} />
                <Route path="/payhistory" element={<PayHistory />} />
            </Routes>
        </Router>
 
</div>
  );
}

export default App;
