import React from "react";
import { useNavigate } from "react-router-dom";
import "./Button.css";

/**
 * Reusable Button component
 * @param {string} label - The button text
 * @param {string} to - Route to navigate to (optional)
 * @param {function} onClick - Custom click handler (optional)
 * @param {string} type - Button type (button, submit, etc.)
 * @param {object} style - Inline style (optional)
 * @param {string} className - Additional className (optional)
 */
export default function Button({
  label,
  to,
  onClick,
  type = "button",
  style,
  className,
}) {
  const navigate = useNavigate();
  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    } else if (to) {
      navigate(to);
    }
  };
  return (
    <button
      type={type}
      className={`custom-btn${className ? " " + className : ""}`}
      style={style}
      onClick={handleClick}
    >
      {label}
    </button>
  );
}
