import { useState } from "react";
import { InputProps } from "./input.types";
import { inputStyles } from "./input.styles";

export const Input = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  type = "text",
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div style={inputStyles.container}>
      <label style={inputStyles.label}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          ...inputStyles.input,
          ...(isFocused ? inputStyles.focus : {}),
          ...(error ? inputStyles.error : {}),
        }}
      />
      {error && <span style={inputStyles.errorText}>{error}</span>}
    </div>
  );
}