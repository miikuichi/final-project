import React, { useState, useEffect } from "react";
import { useRole } from "../components/RoleContext";
import { AdminNavBar, HRNavBar } from "../components/NavBar";
import { getEmployees } from "../components/employeeStorage";
import Button from "../components/Button";
import SalaryCard from "../components/SalaryCard";
import "./Payroll.css";

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
  const [salaryCards, setSalaryCards] = useState([]);
  const [expandedCardIndex, setExpandedCardIndex] = useState(null);

  useEffect(() => {
    (async () => {
      const emps = await getEmployees();
      setEmployees(emps);
    })();
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

  useEffect(() => {
    // Fetch salary floor when employee is selected
    if (selected?.position) {
      fetch(`http://localhost:8080/api/positions/${selected.position}`)
        .then((res) => res.json())
        .then((salaryFloor) => {
          setMonthlyRate(salaryFloor);
        })
        .catch(console.error);
    }
  }, [selected]);

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

  const handleSubmit = () => {
    const newCard = {
      period: { ...salaryPeriod },
      hours: { ...workHours },
      monthlyRate,
    };
    setSalaryCards((prev) => [newCard, ...prev]);

    // Reset form
    setWorkHours({
      regularHours: "",
      overtimeHours: "",
      holidayHours: "",
      nightDiffHours: "",
    });
    setSalaryPeriod({ from: "", to: "" });
  };

  return (
    <div>
      {role === "admin" ? (
        <AdminNavBar
          onHome={() => window.location.assign("/admin")}
          onLogout={() => {
            localStorage.removeItem("userRole");
            window.location.assign("/");
          }}
        />
      ) : (
        <HRNavBar
          onHome={() => window.location.assign("/hr")}
          onIssueTicket={() => window.location.assign("/issue-ticket")}
          onLogout={() => {
            localStorage.removeItem("userRole");
            window.location.assign("/");
          }}
        />
      )}
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
                  selected && selected.employeeId === emp.employeeId
                    ? " selected"
                    : ""
                }`}
                key={emp.employeeId || emp.lastName + emp.firstName}
                onClick={() => handleSelect(emp)}
              >
                <div className="payroll-emp-img">
                  {emp.image ? (
                    <img
                      src={
                        typeof emp.image === "string"
                          ? emp.image
                          : URL.createObjectURL(emp.image)
                      }
                      alt="Employee"
                    />
                  ) : (
                    <div className="payroll-img-placeholder">?</div>
                  )}
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
            <>
              <div className="payroll-details">
                <h3>Salary Computation</h3>
                <div className="form-group">
                  <label>Monthly Rate:</label>
                  <input
                    type="number"
                    value={monthlyRate}
                    disabled
                    className="salary-input"
                  />
                </div>
                <div className="form-group">
                  <label>Period From:</label>
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
                    className="salary-input"
                  />
                </div>
                <div className="form-group">
                  <label>Period To:</label>
                  <input
                    type="date"
                    value={salaryPeriod.to}
                    onChange={(e) =>
                      setSalaryPeriod((prev) => ({
                        ...prev,
                        to: e.target.value,
                      }))
                    }
                    className="salary-input"
                  />
                </div>
                <div className="form-group">
                  <label>Regular Hours:</label>
                  <input
                    type="number"
                    value={workHours.regularHours}
                    onChange={(e) =>
                      setWorkHours((prev) => ({
                        ...prev,
                        regularHours: e.target.value,
                      }))
                    }
                    className="salary-input"
                  />
                </div>
                <div className="form-group">
                  <label>Overtime Hours:</label>
                  <input
                    type="number"
                    value={workHours.overtimeHours}
                    onChange={(e) =>
                      setWorkHours((prev) => ({
                        ...prev,
                        overtimeHours: e.target.value,
                      }))
                    }
                    className="salary-input"
                  />
                </div>
                <div className="form-group">
                  <label>Holiday Hours:</label>
                  <input
                    type="number"
                    value={workHours.holidayHours}
                    onChange={(e) =>
                      setWorkHours((prev) => ({
                        ...prev,
                        holidayHours: e.target.value,
                      }))
                    }
                    className="salary-input"
                  />
                </div>
                <div className="form-group">
                  <label>Night Differential Hours:</label>
                  <input
                    type="number"
                    value={workHours.nightDiffHours}
                    onChange={(e) =>
                      setWorkHours((prev) => ({
                        ...prev,
                        nightDiffHours: e.target.value,
                      }))
                    }
                    className="salary-input"
                  />
                </div>
                <Button
                  label="Submit Salary Period"
                  onClick={handleSubmit}
                  disabled={!salaryPeriod.from || !salaryPeriod.to}
                  style={{ width: "100%", marginTop: "1rem" }}
                />
              </div>
              <div className="salary-cards">
                <h3>Salary Periods</h3>
                {salaryCards.map((card, index) => (
                  <SalaryCard
                    key={index}
                    period={card.period}
                    hours={card.hours}
                    expanded={expandedCardIndex === index}
                    onClick={() =>
                      setExpandedCardIndex(
                        expandedCardIndex === index ? null : index
                      )
                    }
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
