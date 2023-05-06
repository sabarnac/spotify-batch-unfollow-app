import "react-toggle/style.css";

import React from "react";
import Toggle from "react-toggle";

interface CheckboxProps {
  checked: boolean;
  disabled?: boolean;
  onChange: (isChecked: boolean) => void;
}

const Checkbox = ({ checked, disabled, onChange }: CheckboxProps): JSX.Element => (
  <Toggle checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
);

export default Checkbox;
