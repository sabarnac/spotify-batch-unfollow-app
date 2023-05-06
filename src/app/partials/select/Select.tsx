import ReactSelect from "react-select";

import { isNullOrUndefined } from "../../../util";

interface SelectOption<K, V> {
  id: K;
  label: V;
}

const isOption = <K, V>(option: unknown): option is SelectOption<K, V> =>
  typeof option === "object" && !isNullOrUndefined(option) && "id" in option && "label" in option;

interface SelectProps<K, V> {
  options: SelectOption<K, V>[];
  value: K;
  disabled?: boolean;
  onChange?: (id: K) => void;
}

const Select = <K, V>({ options, value, disabled = false, onChange }: SelectProps<K, V>): JSX.Element => (
  <ReactSelect
    styles={{
      option: (provided, state) => ({
        ...provided,
        background: state.isFocused ? "#282828" : "#121212",
        color: "#d8f3e0",
      }),
      control: (provided) => ({
        ...provided,
        border: "1px solid #d8f3e0",
        background: "#121212",
        borderRadius: "0",
      }),
      menu: (provided) => ({
        ...provided,
        background: "#121212",
        border: "1px solid #d8f3e0",
      }),
      singleValue: (provided) => ({
        ...provided,
        color: "#d8f3e0",
      }),
      valueContainer: (provided) => ({
        ...provided,
      }),
    }}
    captureMenuScroll={false}
    isDisabled={disabled}
    value={options.find((option) => option.id === value)}
    onChange={(option) => isOption(option) && onChange?.(option.id)}
    options={options}
  />
);

export default Select;
