import PropTypes from "prop-types";
import { forwardRef, memo } from "react";

import { ErrorMessage, Label } from ".";

const NumberInput = forwardRef(
  (
    {
      border = "border border-slate-300 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary rounded-md outline-none transition-colors",
      className = "",
      inputClassName = "",
      labelClassName,
      id = "",
      name = "",
      label = "",
      helpText = "",
      title = "",
      placeholder = "",
      min,
      max,
      step,
      value,
      errorMessage,
      onChange = () => {},
      disabled = false,
      readOnly = false,
      required = false,
      icon,
    },
    ref
  ) => {
    const cleanInputClass = (classes) => {
      if (!classes) return "";
      return classes
        .split(" ")
        .filter((c) => !/^(p[xy]?-\d+(\.\d+)?|h-\d+|max-h-\d+|text-sm)$/.test(c))
        .join(" ");
    };
    const cleanedInputClassName = cleanInputClass(inputClassName);

    let borderClassname = errorMessage ? `${border} border-red-500` : border;

    return (
      <div
        className={`${label || errorMessage ? "space-y-1" : ""} ${className}`}
        ref={ref}
      >
        <Label
          className={labelClassName}
          id={id}
          icon={icon}
          label={label}
          helpText={helpText}
          required={required}
          readOnly={readOnly}
        />
        {readOnly ? (
          <div className={`pt-2.5 pb-4 px-4 bg-gray-50 text-[16px] leading-relaxed ${borderClassname}`}>
            {value || "Not specified"}
          </div>
        ) : (
          <input
            type="number"
            className={`pt-2.5 pb-4 px-4 w-full outline-0 text-[16px] leading-relaxed placeholder-gray-500 ${borderClassname} ${cleanedInputClassName}`}
            id={id}
            name={name}
            title={title}
            placeholder={placeholder}
            min={min}
            max={max}
            step={step}
            value={value}
            required={required}
            onChange={onChange}
            onWheel={(e) => e.target.blur()}
            onKeyDown={(e) => {
              if (["e", "E", "+", "-", "."].includes(e.key)) {
                e.preventDefault();
              }
            }}
            disabled={disabled}
            readOnly={readOnly}
          />
        )}

        <ErrorMessage error={errorMessage} />
      </div>
    );
  }
);

NumberInput.displayName = "NumberInput";

NumberInput.propTypes = {
  border: PropTypes.string,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  helpText: PropTypes.string,
  title: PropTypes.string,
  placeholder: PropTypes.string,
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  errorMessage: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

export default memo(NumberInput);
