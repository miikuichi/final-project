import React, { useState } from "react";
import "./SalaryCard.css";

export default function SalaryCard({
  period,
  hours,
  monthlyRate,
  calculation,
  expanded,
  onClick,
}) {
  return (
    <div
      className={`salary-card ${expanded ? "expanded" : ""}`}
      onClick={onClick}
    >
      <div className="salary-period">
        <span>From: {period.from}</span>
        <span>To: {period.to}</span>
      </div>
      {expanded && (
        <div className="salary-details">
          {hours.regularHours && (
            <div className="hours-row">
              <span>Regular Hours:</span>
              <span>{hours.regularHours}</span>
            </div>
          )}
          {hours.overtimeHours && (
            <div className="hours-row">
              <span>Overtime Hours:</span>
              <span>{hours.overtimeHours}</span>
            </div>
          )}
          {hours.holidayHours && (
            <div className="hours-row">
              <span>Holiday Hours:</span>
              <span>{hours.holidayHours}</span>
            </div>
          )}
          {hours.nightDiffHours && (
            <div className="hours-row">
              <span>Night Differential Hours:</span>
              <span>{hours.nightDiffHours}</span>
            </div>
          )}

          {calculation && (
            <div
              className="salary-breakdown"
              style={{ marginTop: "1rem", fontSize: "0.95em" }}
            >
              <div>
                <strong>Monthly Rate:</strong> ₱
                {monthlyRate?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </div>
              <div>
                <strong>Rate per Day:</strong> ₱
                {(calculation.ratePerDay || 0).toFixed(2)}
              </div>
              <div>
                <strong>Rate per Hour:</strong> ₱
                {(calculation.ratePerHour || 0).toFixed(2)}
              </div>
              <div style={{ margin: "0.5rem 0 0.25rem 0", color: "#059669" }}>
                <strong>Earnings</strong>
              </div>
              <div>
                Regular Pay: ₱{(calculation.regularPay || 0).toFixed(2)}
              </div>
              <div>
                Overtime Pay: ₱{(calculation.overtimePay || 0).toFixed(2)}
              </div>
              <div>
                Holiday Pay: ₱{(calculation.holidayPay || 0).toFixed(2)}
              </div>
              <div>
                Night Diff: ₱{(calculation.nightDiffPay || 0).toFixed(2)}
              </div>
              <div
                style={{
                  fontWeight: "bold",
                  borderTop: "1px solid #ddd",
                  paddingTop: "0.5rem",
                  marginTop: "0.5rem",
                }}
              >
                Gross Pay: ₱{(calculation.grossPay || 0).toFixed(2)}
              </div>
              <div style={{ margin: "0.5rem 0 0.25rem 0", color: "#dc2626" }}>
                <strong>Deductions</strong>
              </div>
              <div>SSS: ₱{(calculation.sssContribution || 0).toFixed(2)}</div>
              <div>
                PhilHealth: ₱
                {(calculation.philHealthContribution || 0).toFixed(2)}
              </div>
              <div>
                Pag-IBIG: ₱{(calculation.pagIbigContribution || 0).toFixed(2)}
              </div>
              <div>
                Withholding Tax: ₱{(calculation.withholdingTax || 0).toFixed(2)}
              </div>
              <div
                style={{
                  fontWeight: "bold",
                  borderTop: "1px solid #ddd",
                  paddingTop: "0.5rem",
                  marginTop: "0.5rem",
                }}
              >
                Total Deductions: ₱
                {(calculation.totalDeductions || 0).toFixed(2)}
              </div>
              <div
                style={{
                  padding: "0.5rem",
                  background: "#2563eb",
                  color: "white",
                  borderRadius: "6px",
                  textAlign: "center",
                  fontWeight: "bold",
                  marginTop: "0.5rem",
                }}
              >
                Net Pay: ₱{(calculation.netPay || 0).toFixed(2)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
