import React, { useState } from "react";
import "./SalaryCard.css";

export default function SalaryCard({ period, hours, expanded, onClick }) {
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
        </div>
      )}
    </div>
  );
}
