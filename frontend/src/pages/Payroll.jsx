import React, { useState, useEffect } from "react";
import { useRole } from "../components/RoleContext";
import { AdminNavBar, HRNavBar } from "../components/NavBar";
import Button from "../components/Button";
import SalaryCard from "../components/SalaryCard";
import "./Payroll.css";
import "./AddEmployee.css";

export default function Payroll() {
  const { role } = useRole();
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState(null);
  const [workHours, setWorkHours] = useState({
    regularHours: "",
    overtimeHours: "",
    holidayHours: "",
    nightDiffHours: "",
  });
  const [salaryPeriod, setSalaryPeriod] = useState({
    from: "",
    to: "",
  });
  const [monthlyRate, setMonthlyRate] = useState(0);
  const [calculatedSalary, setCalculatedSalary] = useState(null);
  const [salaryCards, setSalaryCards] = useState([]);
  const [expandedCardIndex, setExpandedCardIndex] = useState(null);

  useEffect(() => {
    // Fetch employees from backend
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/employees");
        if (response.ok) {
          const data = await response.json();
          setEmployees(Array.isArray(data) ? data : []);
        } else {
          console.error("Failed to fetch employees");
          setEmployees([]);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        setEmployees([]);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    // When from date changes, auto-calculate to date (15 days later)
    if (salaryPeriod.from) {
      const fromDate = new Date(salaryPeriod.from);
      const toDate = new Date(fromDate);
      toDate.setDate(toDate.getDate() + 14); // 15 days including start date
      setSalaryPeriod((prev) => ({
        ...prev,
        to: toDate.toISOString().split("T")[0],
      }));
    }
  }, [salaryPeriod.from]);

  // Salary mapping based on position (same as ManageEmployee.jsx)
  const positionSalaries = {
    "Software Developer": 75000,
    "System Administrator": 70000,
    "IT Support": 45000,
    "DevOps Engineer": 85000,
    "HR Manager": 80000,
    Recruiter: 55000,
    "HR Assistant": 40000,
    "Training Coordinator": 50000,
    Accountant: 60000,
    "Financial Analyst": 65000,
    "Finance Manager": 90000,
    Auditor: 70000,
    "Marketing Manager": 75000,
    "Content Creator": 50000,
    "Digital Marketer": 55000,
    "Brand Manager": 70000,
    "Operations Manager": 85000,
    "Project Manager": 80000,
    "Business Analyst": 65000,
    "Quality Assurance": 55000,
  };

  useEffect(() => {
    // Set monthly rate when employee is selected
    if (selected?.position) {
      const salary =
        positionSalaries[selected.position] || selected.salary || 0;
      setMonthlyRate(salary);
    }
  }, [selected]);

  // Load salary periods when employee is selected
  useEffect(() => {
    if (selected?.id) {
      loadSalaryPeriods(selected.id);
    } else {
      setSalaryCards([]);
    }
  }, [selected]);

  const loadSalaryPeriods = async (employeeId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/salary-periods/employee/${employeeId}`
      );
      if (response.ok) {
        const data = await response.json();
        // Convert backend data to frontend format
        const cards = data.map((period) => ({
          period: {
            from: period.periodFrom,
            to: period.periodTo,
          },
          hours: {
            regularHours: period.regularHours || "",
            overtimeHours: period.overtimeHours || "",
            holidayHours: period.holidayHours || "",
            nightDiffHours: period.nightDiffHours || "",
          },
          monthlyRate: period.monthlyRate,
          calculation: {
            ratePerDay: period.ratePerDay,
            ratePerHour: period.ratePerHour,
            regularPay: period.regularPay,
            overtimePay: period.overtimePay,
            holidayPay: period.holidayPay,
            nightDiffPay: period.nightDiffPay,
            grossPay: period.grossPay,
            sssContribution: period.sssContribution,
            philhealthContribution: period.philhealthContribution,
            pagibigContribution: period.pagibigContribution,
            withholdingTax: period.withholdingTax,
            totalDeductions: period.totalDeductions,
            netPay: period.netPay,
          },
        }));
        setSalaryCards(cards);
      }
    } catch (error) {
      console.error("Error loading salary periods:", error);
    }
  };

  const saveSalaryPeriod = async (salaryData) => {
    if (!selected?.id) return false;

    try {
      const response = await fetch("http://localhost:8080/api/salary-periods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId: selected.id,
          periodFrom: salaryData.period.from,
          periodTo: salaryData.period.to,
          monthlyRate: salaryData.monthlyRate,
          regularHours: parseFloat(salaryData.hours.regularHours) || 0,
          overtimeHours: parseFloat(salaryData.hours.overtimeHours) || 0,
          holidayHours: parseFloat(salaryData.hours.holidayHours) || 0,
          nightDiffHours: parseFloat(salaryData.hours.nightDiffHours) || 0,
          ...(salaryData.calculation && {
            ratePerDay: salaryData.calculation.ratePerDay,
            ratePerHour: salaryData.calculation.ratePerHour,
            regularPay: salaryData.calculation.regularPay,
            overtimePay: salaryData.calculation.overtimePay,
            holidayPay: salaryData.calculation.holidayPay,
            nightDiffPay: salaryData.calculation.nightDiffPay,
            grossPay: salaryData.calculation.grossPay,
            sssContribution: salaryData.calculation.sssContribution,
            philhealthContribution:
              salaryData.calculation.philhealthContribution,
            pagibigContribution: salaryData.calculation.pagibigContribution,
            withholdingTax: salaryData.calculation.withholdingTax,
            totalDeductions: salaryData.calculation.totalDeductions,
            netPay: salaryData.calculation.netPay,
          }),
        }),
      });
      return response.ok;
    } catch (error) {
      console.error("Error saving salary period:", error);
      return false;
    }
  };

  const handleSelect = (emp) => {
    setSelected(emp);
    setWorkHours({
      regularHours: "",
      overtimeHours: "",
      holidayHours: "",
      nightDiffHours: "",
    });
    setSalaryPeriod({ from: "", to: "" });
  };

  const handleSubmit = async () => {
    const calculation = calculateSalary();
    const newCard = {
      period: { ...salaryPeriod },
      hours: { ...workHours },
      monthlyRate,
      calculation,
    };

    // Save to backend
    const saved = await saveSalaryPeriod(newCard);
    if (saved) {
      // Reload salary periods from backend to ensure consistency
      await loadSalaryPeriods(selected.id);

      // Reset form
      setWorkHours({
        regularHours: "",
        overtimeHours: "",
        holidayHours: "",
        nightDiffHours: "",
      });
      setSalaryPeriod({ from: "", to: "" });
      setCalculatedSalary(null);
    } else {
      alert("Failed to save salary period. Please try again.");
    }
  };

  // Philippine Payroll Calculation Function
  const calculateSalary = () => {
    if (
      !monthlyRate ||
      (!workHours.regularHours &&
        !workHours.overtimeHours &&
        !workHours.holidayHours &&
        !workHours.nightDiffHours)
    ) {
      return null;
    }

    const ratePerDay = monthlyRate / 30;
    const ratePerHour = ratePerDay / 8;

    // Convert string inputs to numbers
    const regularHours = parseFloat(workHours.regularHours) || 0;
    const overtimeHours = parseFloat(workHours.overtimeHours) || 0;
    const holidayHours = parseFloat(workHours.holidayHours) || 0;
    const nightDiffHours = parseFloat(workHours.nightDiffHours) || 0;

    // Philippine Payroll Calculation Standards
    const regularPay = regularHours * ratePerHour;
    const overtimePay = overtimeHours * ratePerHour * 1.25; // 25% overtime premium
    const holidayPay = holidayHours * ratePerHour * 2.0; // 100% holiday premium
    const nightDiffPay = nightDiffHours * ratePerHour * 0.1; // 10% night differential

    const grossPay = regularPay + overtimePay + holidayPay + nightDiffPay;

    // Basic deductions (simplified - in real scenarios these vary)
    const sssContribution = grossPay * 0.045; // 4.5% SSS contribution (employee share)
    const philHealthContribution = grossPay * 0.0175; // 1.75% PhilHealth premium (employee share)
    const pagIbigContribution = Math.min(grossPay * 0.02, 100); // 2% Pag-IBIG contribution, max 100 PHP

    // Tax calculation (simplified progressive tax)
    let withholdingTax = 0;
    const annualGross = grossPay * 24; // Assuming bi-monthly
    if (annualGross > 250000) {
      if (annualGross <= 400000) {
        withholdingTax = ((annualGross - 250000) * 0.15) / 24;
      } else if (annualGross <= 800000) {
        withholdingTax = (22500 + (annualGross - 400000) * 0.2) / 24;
      } else if (annualGross <= 2000000) {
        withholdingTax = (102500 + (annualGross - 800000) * 0.25) / 24;
      } else {
        withholdingTax = (402500 + (annualGross - 2000000) * 0.3) / 24;
      }
    }

    const totalDeductions =
      sssContribution +
      philHealthContribution +
      pagIbigContribution +
      withholdingTax;
    const netPay = grossPay - totalDeductions;

    return {
      ratePerDay,
      ratePerHour,
      regularPay,
      overtimePay,
      holidayPay,
      nightDiffPay,
      grossPay,
      sssContribution,
      philHealthContribution,
      pagIbigContribution,
      withholdingTax,
      totalDeductions,
      netPay,
    };
  };

  // Calculate salary whenever inputs change
  useEffect(() => {
    setCalculatedSalary(calculateSalary());
  }, [monthlyRate, workHours]);

  return (
    <div>
      {role === "admin" ? <AdminNavBar /> : <HRNavBar />}
      <div className="payroll-container">
        <div className="payroll-left">
          <h2>Employee List</h2>
          <div className="payroll-emp-list">
            {employees.length === 0 && (
              <div className="no-employees">No employees found.</div>
            )}
            {employees.map((emp) => (
              <div
                className={`payroll-emp-card${
                  selected && selected.id === emp.id ? " selected" : ""
                }`}
                key={emp.id || emp.lastName + emp.firstName}
                onClick={() => handleSelect(emp)}
              >
                <div className="payroll-emp-img">
                  <div className="payroll-img-placeholder">👤</div>
                </div>
                <div className="payroll-emp-name">
                  {emp.lastName}, {emp.firstName}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="payroll-right">
          {selected && (
            <div
              style={{
                display: "flex",
                gap: "2rem",
                alignItems: "flex-start",
                flexWrap: "wrap",
              }}
            >
              <div
                className="payroll-details"
                style={{ flex: 1, minWidth: 280, maxWidth: 350 }}
              >
                <div className="form-section">
                  <h3>Salary Computation</h3>
                  
                  <div className="form-group">
                    <label>Monthly Rate</label>
                    <input
                      type="number"
                      value={monthlyRate}
                      disabled
                      className="salary-input"
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Period From</label>
                      <input
                        type="date"
                        value={salaryPeriod.from}
                        onChange={(e) =>
                          setSalaryPeriod((prev) => ({
                            ...prev,
                            from: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Period To</label>
                      <input
                        type="date"
                        value={salaryPeriod.to}
                        onChange={(e) =>
                          setSalaryPeriod((prev) => ({
                            ...prev,
                            to: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Regular Hours</label>
                      <input
                        type="number"
                        value={workHours.regularHours}
                        onChange={(e) =>
                          setWorkHours((prev) => ({
                            ...prev,
                            regularHours: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Overtime Hours</label>
                      <input
                        type="number"
                        value={workHours.overtimeHours}
                        onChange={(e) =>
                          setWorkHours((prev) => ({
                            ...prev,
                            overtimeHours: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Holiday Hours</label>
                      <input
                        type="number"
                        value={workHours.holidayHours}
                        onChange={(e) =>
                          setWorkHours((prev) => ({
                            ...prev,
                            holidayHours: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Night Diff Hours</label>
                      <input
                        type="number"
                        value={workHours.nightDiffHours}
                        onChange={(e) =>
                          setWorkHours((prev) => ({
                            ...prev,
                            nightDiffHours: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  
                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn-submit"
                      onClick={handleSubmit}
                      disabled={!salaryPeriod.from || !salaryPeriod.to}
                      style={{ width: "100%" }}
                    >
                      Submit Salary Period
                    </button>
                  </div>
                </div>

                {calculatedSalary && (
                  <div
                    style={{
                      marginTop: "1.5rem",
                      padding: "1rem",
                      background: "#f8f9fa",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                    }}
                  >
                    <h4
                      style={{
                        margin: "0 0 1rem 0",
                        color: "#2563eb",
                      }}
                    >
                      Salary Calculation
                    </h4>

                    <div style={{ marginBottom: "1rem" }}>
                      <div>
                        <strong>Rate per Day:</strong> ₱
                        {(calculatedSalary.ratePerDay || 0).toFixed(2)}
                      </div>
                      <div>
                        <strong>Rate per Hour:</strong> ₱
                        {(calculatedSalary.ratePerHour || 0).toFixed(2)}
                      </div>
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                      <h5
                        style={{
                          margin: "0 0 0.5rem 0",
                          color: "#059669",
                        }}
                      >
                        Earnings
                      </h5>
                      <div>
                        Regular Pay: ₱
                        {(calculatedSalary.regularPay || 0).toFixed(2)}
                      </div>
                      <div>
                        Overtime Pay (25%): ₱
                        {(calculatedSalary.overtimePay || 0).toFixed(2)}
                      </div>
                      <div>
                        Holiday Pay (100%): ₱
                        {(calculatedSalary.holidayPay || 0).toFixed(2)}
                      </div>
                      <div>
                        Night Diff (10%): ₱
                        {(calculatedSalary.nightDiffPay || 0).toFixed(2)}
                      </div>
                      <div
                        style={{
                          fontWeight: "bold",
                          borderTop: "1px solid #ddd",
                          paddingTop: "0.5rem",
                          marginTop: "0.5rem",
                        }}
                      >
                        <strong>
                          Gross Pay: ₱
                          {(calculatedSalary.grossPay || 0).toFixed(2)}
                        </strong>
                      </div>
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                      <h5
                        style={{
                          margin: "0 0 0.5rem 0",
                          color: "#dc2626",
                        }}
                      >
                        Deductions
                      </h5>
                      <div>
                        SSS (4.5%): ₱
                        {(calculatedSalary.sssContribution || 0).toFixed(2)}
                      </div>
                      <div>
                        PhilHealth (1.75%): ₱
                        {(calculatedSalary.philHealthContribution || 0).toFixed(
                          2
                        )}
                      </div>
                      <div>
                        Pag-IBIG (2%): ₱
                        {(calculatedSalary.pagIbigContribution || 0).toFixed(2)}
                      </div>
                      <div>
                        Withholding Tax: ₱
                        {(calculatedSalary.withholdingTax || 0).toFixed(2)}
                      </div>
                      <div
                        style={{
                          fontWeight: "bold",
                          borderTop: "1px solid #ddd",
                          paddingTop: "0.5rem",
                          marginTop: "0.5rem",
                        }}
                      >
                        <strong>
                          Total Deductions: ₱
                          {(calculatedSalary.totalDeductions || 0).toFixed(2)}
                        </strong>
                      </div>
                    </div>

                    <div
                      style={{
                        padding: "0.75rem",
                        background: "#2563eb",
                        color: "white",
                        borderRadius: "6px",
                        textAlign: "center",
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                      }}
                    >
                      Net Pay: ₱{(calculatedSalary.netPay || 0).toFixed(2)}
                    </div>
                  </div>
                )}
              </div>
              <div className="salary-cards" style={{ flex: 1, minWidth: 320 }}>
                <h3>Salary Periods</h3>
                {salaryCards
                  .slice()
                  .sort(
                    (a, b) => new Date(a.period.from) - new Date(b.period.from)
                  )
                  .map((card, index) => (
                    <SalaryCard
                      key={index}
                      period={card.period}
                      hours={card.hours}
                      monthlyRate={card.monthlyRate}
                      calculation={card.calculation}
                      expanded={expandedCardIndex === index}
                      onClick={() =>
                        setExpandedCardIndex(
                          expandedCardIndex === index ? null : index
                        )
                      }
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
