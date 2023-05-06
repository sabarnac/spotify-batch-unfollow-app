import "./Input.css";

interface InputProps {
  value: string;
  placeholder?: string;
  onChange: (id: string) => void;
}

const Input = ({ value, placeholder, onChange }: InputProps): JSX.Element => (
  <input type="text" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
);

export default Input;
