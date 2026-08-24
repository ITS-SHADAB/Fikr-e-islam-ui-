import { forwardRef, memo } from "react";
import PropTypes from "prop-types";

import { ErrorMessage, Label } from ".";

const SelectInput = forwardRef(
  (
    {
      className = "",
      id = "",
      name = "",
      title = "",
      label = "",
      value = "",
      labelClassName = "",
      selectClassName = "",
      border = "border border-slate-300 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary rounded-md outline-none transition-colors",
      options = [],
      onChange,
      errorMessage,
      showLabel = true,
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
    const cleanedSelectClassName = cleanInputClass(selectClassName);

    let borderClassname = errorMessage ? `${border} border-red-500` : border;

    return (
      <div
        ref={ref}
        className={`${label || errorMessage ? "space-y-1" : ""} ${className}`}
      >
        {label && showLabel && (
          <Label
            className={labelClassName}
            id={id}
            icon={icon}
            label={label}
            required={required}
            readOnly={readOnly}
          />
        )}

        {readOnly ? (
          <div className={`pt-2.5 pb-4 px-4 bg-gray-50 text-[16px] leading-relaxed ${borderClassname}`}>
            {value || "Not specified"}
          </div>
        ) : (
          <select
            id={id}
            name={name}
            title={title}
            value={value}
            onChange={onChange}
            // className={`p-2 w-full h-10 outline-0 bg-inherit text-[#272828B2] ${border} ${selectClassName}`}
            className={`pt-2.5 pb-4 px-4 w-full outline-0 text-[16px] leading-relaxed ${borderClassname} ${cleanedSelectClassName}`}
            disabled={disabled}
            readOnly={readOnly}
          >
            <option value="">{`Select ${label?.toLowerCase() || "..."}`}</option>

            {options.map((option, index) => (
              <option
                key={index}
                value={option.value || option}
                disabled={option?.disabled}
              >
                {option.label || option}
              </option>
            ))}
            {options?.length === 0 && <option disabled>No data found</option>}
          </select>
        )}

        <ErrorMessage error={errorMessage} />
      </div>
    );
  }
);
SelectInput.displayName = "SelectInput";

SelectInput.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  title: PropTypes.string,
  value: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  labelClassName: PropTypes.string,
  selectClassName: PropTypes.string,
  border: PropTypes.string,
  options: PropTypes.array,
  onChange: PropTypes.func,
  errorMessage: PropTypes.string,
  showLabel: PropTypes.bool,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

export default memo(SelectInput);
