import React from "react";

const InputField = ({
  label,
  name,
  type = "text",
  className = "",
  value,
  onChange,
  disabled = false,
  ...props
}) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
      {props.required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {type === "select" ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg transition-colors bg-white ${
          disabled ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
        {...props}
      >
        {props.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg transition-colors ${
          disabled ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
        {...props}
      />
    )}
  </div>
);

export default InputField;
