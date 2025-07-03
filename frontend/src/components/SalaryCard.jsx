import React, { useState } from "react";
import "../styles.css";

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
      <div className="salary-card-header">
        <div className="salary-period">
          <span className="period-label">From:</span>
          <span className="period-date">{period.from}</span>
        </div>
        <div className="salary-period">
          <span className="period-label">To:</span>
          <span className="period-date">{period.to}</span>
        </div>
        <div className="expand-indicator">{expanded ? "▼" : "▶"}</div>
      </div>
      {expanded && (
        <div className="salary-details">
          <div className="hours-section">
            <h4 className="section-title">Hours Worked</h4>
            {hours.regularHours && (
              <div className="hours-row">
                <span className="hours-label">Regular Hours:</span>
                <span className="hours-value">{hours.regularHours}</span>
              </div>
            )}
            {hours.overtimeHours && (
              <div className="hours-row">
                <span className="hours-label">Overtime Hours:</span>
                <span className="hours-value">{hours.overtimeHours}</span>
              </div>
            )}
            {hours.holidayHours && (
              <div className="hours-row">
                <span className="hours-label">Holiday Hours:</span>
                <span className="hours-value">{hours.holidayHours}</span>
              </div>
            )}
            {hours.nightDiffHours && (
              <div className="hours-row">
                <span className="hours-label">Night Differential Hours:</span>
                <span className="hours-value">{hours.nightDiffHours}</span>
              </div>
            )}
          </div>

          {calculation && (
            <div className="salary-breakdown">
              <div className="rates-section">
                <h4 className="section-title">Rates</h4>
                <div className="rate-row">
                  <span className="rate-label">Monthly Rate:</span>
                  <span className="rate-value">
                    ₱
                    {monthlyRate?.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="rate-row">
                  <span className="rate-label">Rate per Day:</span>
                  <span className="rate-value">
                    ₱{(calculation.ratePerDay || 0).toFixed(2)}
                  </span>
                </div>
                <div className="rate-row">
                  <span className="rate-label">Rate per Hour:</span>
                  <span className="rate-value">
                    ₱{(calculation.ratePerHour || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="earnings-section">
                <h4 className="section-title earnings-title">Earnings</h4>
                <div className="earning-row">
                  <span className="earning-label">Regular Pay:</span>
                  <span className="earning-value">
                    ₱{(calculation.regularPay || 0).toFixed(2)}
                  </span>
                </div>
                <div className="earning-row">
                  <span className="earning-label">Overtime Pay:</span>
                  <span className="earning-value">
                    ₱{(calculation.overtimePay || 0).toFixed(2)}
                  </span>
                </div>
                <div className="earning-row">
                  <span className="earning-label">Holiday Pay:</span>
                  <span className="earning-value">
                    ₱{(calculation.holidayPay || 0).toFixed(2)}
                  </span>
                </div>
                <div className="earning-row">
                  <span className="earning-label">Night Diff:</span>
                  <span className="earning-value">
                    ₱{(calculation.nightDiffPay || 0).toFixed(2)}
                  </span>
                </div>
                <div className="total-row gross-pay">
                  <span className="total-label">Gross Pay:</span>
                  <span className="total-value">
                    ₱{(calculation.grossPay || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="deductions-section">
                <h4 className="section-title deductions-title">Deductions</h4>
                <div className="deduction-row">
                  <span className="deduction-label">SSS:</span>
                  <span className="deduction-value">
                    ₱{(calculation.sssContribution || 0).toFixed(2)}
                  </span>
                </div>
                <div className="deduction-row">
                  <span className="deduction-label">PhilHealth:</span>
                  <span className="deduction-value">
                    ₱{(calculation.philHealthContribution || 0).toFixed(2)}
                  </span>
                </div>
                <div className="deduction-row">
                  <span className="deduction-label">Pag-IBIG:</span>
                  <span className="deduction-value">
                    ₱{(calculation.pagIbigContribution || 0).toFixed(2)}
                  </span>
                </div>
                <div className="deduction-row">
                  <span className="deduction-label">Withholding Tax:</span>
                  <span className="deduction-value">
                    ₱{(calculation.withholdingTax || 0).toFixed(2)}
                  </span>
                </div>
                <div className="total-row total-deductions">
                  <span className="total-label">Total Deductions:</span>
                  <span className="total-value">
                    ₱{(calculation.totalDeductions || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="net-pay-section">
                <div className="net-pay-row">
                  <span className="net-pay-label">Net Pay:</span>
                  <span className="net-pay-value">
                    ₱{(calculation.netPay || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
