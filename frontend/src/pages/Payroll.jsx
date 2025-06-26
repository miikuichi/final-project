import React, { useState, useEffect } from 'react';
import { useRole } from '../components/RoleContext';
import { AdminNavBar, HRNavBar } from '../components/NavBar';
import { getEmployees } from '../components/employeeStorage';
import './Payroll.css';

// Philippine leave law (minimum): Service Incentive Leave (SIL) = 5 days/year for rank-and-file, plus others (e.g. SSS, maternity, etc. not always paid by employer)
const PH_LEAVE_TYPES = [
  { type: 'Service Incentive Leave', allowed: 5 },
  // Add more leave types as needed
];

// Example work hour categories (user can add more)
const DEFAULT_WORK_CATEGORIES = [
  { label: 'Normal', key: 'normal' },
  { label: 'Overtime', key: 'overtime' },
  { label: 'Rest Day', key: 'restday' },
  { label: 'Special Holiday', key: 'special' },
  { label: 'Regular Holiday', key: 'regular' },
  // Add more as needed
];

// Formula for salary computation in the Philippines (basic):
// Salary = (Basic Daily Rate x Days Worked) + (OT Rate x OT Hours) + (Holiday Rate x Holiday Hours) - Deductions
// For semi-monthly: Salary = (Monthly Rate / 2) + adjustments

export default function Payroll() {
  const { role } = useRole();
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState(null);
  const [workHours, setWorkHours] = useState({});
  const [periodDays, setPeriodDays] = useState(20); // default 20 working days/month
  const [monthlyRate, setMonthlyRate] = useState(20000); // Example: 20,000 PHP/month

  // Calculate rates
  const ratePerDay = monthlyRate / periodDays;
  const ratePerHour = ratePerDay / 8;

  useEffect(() => {
    // getEmployees is async, so use async/await
    (async () => {
      const emps = await getEmployees();
      setEmployees(emps);
    })();
  }, []);

  const handleSelect = emp => {
    setSelected(emp);
    setWorkHours({});
  };

  const computeSalary = () => {
    const normal = Number(workHours.normal || 0);
    const overtime = Number(workHours.overtime || 0);
    const restday = Number(workHours.restday || 0);
    const special = Number(workHours.special || 0);
    const regular = Number(workHours.regular || 0);
    const otRate = 1.25;
    const restdayRate = 1.3;
    const specialRate = 1.3;
    const regularRate = 2.0;
    return (
      normal * ratePerHour +
      overtime * ratePerHour * otRate +
      restday * ratePerHour * restdayRate +
      special * ratePerHour * specialRate +
      regular * ratePerHour * regularRate
    );
  };

  return (
    <div>
      {role === 'admin' ? (
        <AdminNavBar onHome={() => window.location.assign('/admin')} onLogout={() => { localStorage.removeItem('userRole'); window.location.assign('/'); }} />
      ) : (
        <HRNavBar onHome={() => window.location.assign('/hr')} onIssueTicket={() => window.location.assign('/issue-ticket')} onLogout={() => { localStorage.removeItem('userRole'); window.location.assign('/'); }} />
      )}
      <div className="payroll-container">
        <div className="payroll-left">
          <h2>Employee List</h2>
          <div className="payroll-emp-list">
            {employees.length === 0 && <div className="no-employees">No employees found.</div>}
            {employees.map(emp => (
              <div className={`payroll-emp-card${selected && selected.employeeId === emp.employeeId ? ' selected' : ''}`} key={emp.employeeId || emp.lastName + emp.firstName} onClick={() => handleSelect(emp)}>
                <div className="payroll-emp-img">
                  {emp.image ? (
                    <img src={typeof emp.image === 'string' ? emp.image : URL.createObjectURL(emp.image)} alt="Employee" />
                  ) : (
                    <div className="payroll-img-placeholder">?</div>
                  )}
                </div>
                <div className="payroll-emp-name">{emp.lastName}, {emp.firstName}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="payroll-right">
          {selected ? (
            <>
              <div className="payroll-emp-header" style={{ position: 'relative' }}>
                <button
                  className="payroll-close-btn"
                  style={{ position: 'absolute', top: 0, right: 0, background: 'transparent', border: 'none', fontSize: '1.8rem', cursor: 'pointer', color: '#888', zIndex: 2 }}
                  onClick={() => setSelected(null)}
                  aria-label="Close"
                >
                  &times;
                </button>
                <div className="payroll-emp-img-large">
                  {selected.image ? (
                    <img src={typeof selected.image === 'string' ? selected.image : URL.createObjectURL(selected.image)} alt="Employee" />
                  ) : (
                    <div className="payroll-img-placeholder-large">?</div>
                  )}
                </div>
                <div className="payroll-emp-name-large">{selected.lastName}, {selected.firstName}</div>
              </div>
              <div className="payroll-leaves">
                <h4>Allowed Leaves (PH Law)</h4>
                <ul>
                  {PH_LEAVE_TYPES.map(leave => (
                    <li key={leave.type}>{leave.type}: {leave.allowed} days/year</li>
                  ))}
                </ul>
              </div>
              <div className="payroll-salary-box">
                <h4>Salary Computation</h4>
                <div className="payroll-salary-form">
                  <label>Salary Period (days): <input type="number" min={1} max={31} value={periodDays} onChange={e => setPeriodDays(Number(e.target.value))} /></label>
                  <label>Monthly Rate (PHP): <input type="number" min={1} value={monthlyRate} onChange={e => setMonthlyRate(Number(e.target.value))} /></label>
                  <div>Rate/Day: ₱{ratePerDay.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
                  <div>Rate/Hour: ₱{ratePerHour.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
                  {DEFAULT_WORK_CATEGORIES.map(cat => (
                    <label key={cat.key}>{cat.label} Hours: <input type="number" min={0} value={workHours[cat.key] || ''} onChange={e => setWorkHours(w => ({ ...w, [cat.key]: e.target.value }))} /></label>
                  ))}
                  <div className="payroll-salary-result">
                    <b>Computed Salary:</b> ₱{computeSalary().toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}
                  </div>
                </div>
                <div className="payroll-salary-note">
                  <b>Formula:</b> (Normal x Rate/Hour) + (OT x Rate/Hour x 1.25) + (Rest Day x Rate/Hour x 1.3) + (Special Holiday x Rate/Hour x 1.3) + (Regular Holiday x Rate/Hour x 2.0)
                </div>
              </div>
            </>
          ) : (
            <div className="payroll-select-prompt">Select an employee to view payroll details.</div>
          )}
        </div>
      </div>
    </div>
  );
}
