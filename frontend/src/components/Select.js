import React from "react";

export default function Select({ label, name, value, onChange, options, className = "" }) {
  return (
    <div className={`form-group ${className}`}>
      {label && <label htmlFor={name}>{label}</label>}
      <select id={name} name={name} value={value} onChange={onChange}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
