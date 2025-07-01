import React, { useState, useEffect, useMemo } from "react";
import { useRole } from "../components/RoleContext";
import { AdminNavBar, HRNavBar } from "../components/NavBar";
import Button from "../components/Button";
import SalaryCard from "../components/SalaryCard";
import SearchBar from "../components/SearchBar";
import "./Payroll.css";

export default function Payroll() {
  const { role } = useRole();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
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
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Maximum hours per month (matching backend validation)
  const MAX_REGULAR_HOURS = 184.0;
  const MAX_OVERTIME_HOURS = 80.0;
  const MAX_HOLIDAY_HOURS = 64.0;
  const MAX_NIGHT_DIFF_HOURS = 184.0;

  useEffect(() => {
    // Fetch employees from backend
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/employees");
        if (response.ok) {
          const data = await response.json();
          const empData = Array.isArray(data) ? data : [];
          setEmployees(empData);
          setFilteredEmployees(empData);
        } else {
          console.error("Failed to fetch employees");
          setEmployees([]);
          setFilteredEmployees([]);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        setEmployees([]);
        setFilteredEmployees([]);
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

      if (!response.ok) {
        // Try to get error message from response
        try {
          const errorData = await response.json();
          setErrors({
            submit: errorData.error || "Failed to save salary period",
          });
        } catch {
          setErrors({ submit: "Failed to save salary period" });
        }
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error saving salary period:", error);
      setErrors({ submit: "Network error. Please try again." });
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
    setErrors({});
    setCalculatedSalary(null);
  };

  // Validation functions
  const validateHours = (value, type, maxValue) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0) {
      return `${type} must be a positive number`;
    }
    if (numValue > maxValue) {
      return `${type} cannot exceed ${maxValue} hours per month`;
    }
    return null;
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate period dates
    if (!salaryPeriod.from) {
      newErrors.periodFrom = "Start date is required";
    }
    if (!salaryPeriod.to) {
      newErrors.periodTo = "End date is required";
    }
    if (
      salaryPeriod.from &&
      salaryPeriod.to &&
      new Date(salaryPeriod.from) >= new Date(salaryPeriod.to)
    ) {
      newErrors.periodTo = "End date must be after start date";
    }

    // Validate at least one hour type is entered
    const hasHours =
      workHours.regularHours ||
      workHours.overtimeHours ||
      workHours.holidayHours ||
      workHours.nightDiffHours;
    if (!hasHours) {
      newErrors.hours = "At least one hour type must be entered";
    }

    // Validate individual hour fields
    if (workHours.regularHours) {
      const error = validateHours(
        workHours.regularHours,
        "Regular hours",
        MAX_REGULAR_HOURS
      );
      if (error) newErrors.regularHours = error;
    }
    if (workHours.overtimeHours) {
      const error = validateHours(
        workHours.overtimeHours,
        "Overtime hours",
        MAX_OVERTIME_HOURS
      );
      if (error) newErrors.overtimeHours = error;
    }
    if (workHours.holidayHours) {
      const error = validateHours(
        workHours.holidayHours,
        "Holiday hours",
        MAX_HOLIDAY_HOURS
      );
      if (error) newErrors.holidayHours = error;
    }
    if (workHours.nightDiffHours) {
      const error = validateHours(
        workHours.nightDiffHours,
        "Night differential hours",
        MAX_NIGHT_DIFF_HOURS
      );
      if (error) newErrors.nightDiffHours = error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleHoursChange = (field, value) => {
    setWorkHours((prev) => ({ ...prev, [field]: value }));

    // Clear specific error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        if (errors.hours) delete newErrors.hours; // Clear general hours error
        return newErrors;
      });
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});
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
      setErrors({});
    } else {
      setErrors({ submit: "Failed to save salary period. Please try again." });
    }
    setIsSubmitting(false);
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
          <div className="payroll-search">
            <SearchBar
              data={employees}
              onFilter={setFilteredEmployees}
              placeholder="Search by name..."
              searchKeys={["firstName", "lastName"]}
              className="payroll-search-bar"
            />
          </div>
          <div className="payroll-emp-list">
            {filteredEmployees.length === 0 && (
              <div className="no-employees">
                {employees.length === 0
                  ? "No employees found."
                  : "No employees match your search."}
              </div>
            )}
            {filteredEmployees.map((emp) => (
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
            <div className="payroll-columns">
              <div
                className={`payroll-details${
                  calculatedSalary ? " expanded" : ""
                }`}
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
                        max={new Date().toISOString().split("T")[0]}
                        onChange={(e) => {
                          setSalaryPeriod((prev) => ({
                            ...prev,
                            from: e.target.value,
                          }));
                          if (errors.periodFrom) {
                            setErrors((prev) => {
                              const newErrors = { ...prev };
                              delete newErrors.periodFrom;
                              return newErrors;
                            });
                          }
                        }}
                        className={errors.periodFrom ? "error" : ""}
                        required
                      />
                      {errors.periodFrom && (
                        <span className="error-message">
                          {errors.periodFrom}
                        </span>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Period To</label>
                      <input
                        type="date"
                        value={salaryPeriod.to}
                        max={new Date().toISOString().split("T")[0]}
                        onChange={(e) => {
                          setSalaryPeriod((prev) => ({
                            ...prev,
                            to: e.target.value,
                          }));
                          if (errors.periodTo) {
                            setErrors((prev) => {
                              const newErrors = { ...prev };
                              delete newErrors.periodTo;
                              return newErrors;
                            });
                          }
                        }}
                        className={errors.periodTo ? "error" : ""}
                      />
                      {errors.periodTo && (
                        <span className="error-message">{errors.periodTo}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Regular Hours (max {MAX_REGULAR_HOURS})</label>
                      <input
                        type="number"
                        min="0"
                        max={MAX_REGULAR_HOURS}
                        step="0.1"
                        value={workHours.regularHours}
                        onChange={(e) =>
                          handleHoursChange("regularHours", e.target.value)
                        }
                        className={errors.regularHours ? "error" : ""}
                        placeholder="0.0"
                      />
                      {errors.regularHours && (
                        <span className="error-message">
                          {errors.regularHours}
                        </span>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Overtime Hours (max {MAX_OVERTIME_HOURS})</label>
                      <input
                        type="number"
                        min="0"
                        max={MAX_OVERTIME_HOURS}
                        step="0.1"
                        value={workHours.overtimeHours}
                        onChange={(e) =>
                          handleHoursChange("overtimeHours", e.target.value)
                        }
                        className={errors.overtimeHours ? "error" : ""}
                        placeholder="0.0"
                      />
                      {errors.overtimeHours && (
                        <span className="error-message">
                          {errors.overtimeHours}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Holiday Hours (max {MAX_HOLIDAY_HOURS})</label>
                      <input
                        type="number"
                        min="0"
                        max={MAX_HOLIDAY_HOURS}
                        step="0.1"
                        value={workHours.holidayHours}
                        onChange={(e) =>
                          handleHoursChange("holidayHours", e.target.value)
                        }
                        className={errors.holidayHours ? "error" : ""}
                        placeholder="0.0"
                      />
                      {errors.holidayHours && (
                        <span className="error-message">
                          {errors.holidayHours}
                        </span>
                      )}
                    </div>
                    <div className="form-group">
                      <label>
                        Night Diff Hours (max {MAX_NIGHT_DIFF_HOURS})
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={MAX_NIGHT_DIFF_HOURS}
                        step="0.1"
                        value={workHours.nightDiffHours}
                        onChange={(e) =>
                          handleHoursChange("nightDiffHours", e.target.value)
                        }
                        className={errors.nightDiffHours ? "error" : ""}
                        placeholder="0.0"
                      />
                      {errors.nightDiffHours && (
                        <span className="error-message">
                          {errors.nightDiffHours}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="form-actions">
                    {errors.hours && (
                      <span className="error-message">{errors.hours}</span>
                    )}
                    {errors.submit && (
                      <span className="error-message">{errors.submit}</span>
                    )}
                    <button
                      type="button"
                      className="btn-submit"
                      onClick={handleSubmit}
                      disabled={
                        isSubmitting || !salaryPeriod.from || !salaryPeriod.to
                      }
                      style={{ width: "100%" }}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Salary Period"}
                    </button>
                  </div>
                </div>

                {calculatedSalary && (
                  <div className="salary-calculation-box">
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
              <div className="salary-cards">
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
