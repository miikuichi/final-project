import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

/**
 * Reusable Button component
 * @param {string} label - The button text
 * @param {string} to - Route to navigate to (optional)
 * @param {function} onClick - Custom click handler (optional)
 * @param {string} type - Button type (button, submit, etc.)
 * @param {object} style - Inline style (optional)
 * @param {string} className - Additional className (optional)
 * @param {object} rest - Other native button props
 */
export default function Button({
  label,
  to,
  onClick,
  type = "button",
  style,
  className = "",
  ...rest
}) {
  const navigate = useNavigate();

  const handleClick = useCallback(
    (e) => {
      if (onClick) {
        onClick(e);
      } else if (to) {
        navigate(to);
      }
    },
    [onClick, to, navigate]
  );

  return (
    <button
      type={type}
      className={`custom-btn${className ? " " + className : ""}`}
      style={style}
      onClick={handleClick}
      {...rest}
    >
      {label}
    </button>
  );
}
