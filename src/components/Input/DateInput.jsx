import PropTypes from "prop-types";
import { memo } from "react";

import { getTodayDate } from "../../utils";

import { ErrorMessage, Label } from ".";

const DateInput = ({
  type = "date",
  border = "border border-slate-300 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary rounded-md outline-none transition-colors",
  className = "",
  inputClassName = "",
  labelClassName = "",
  id = "",
  name = "",
  label = "",
  title = "",
  placeholder = "",
  min = getTodayDate(),
  max,
  value = "",
  errorMessage = "",
  onChange = () => {},
  disabled = false,
  readOnly = false,
  required = false,
  icon,
}) => {
  const cleanInputClass = (classes) => {
    if (!classes) return "";
    return classes
      .split(" ")
      .filter((c) => !/^(p[xy]?-\d+(\.\d+)?|h-\d+|max-h-\d+|text-sm)$/.test(c))
      .join(" ");
  };
  const cleanedInputClassName = cleanInputClass(inputClassName);

  let borderClassname = errorMessage ? `${border} border-red-500` : border;
  const date = value?.slice(0, 10);

  return (
    <div className={`${label || errorMessage ? "space-y-1" : ""} ${className}`}>
      <Label
        className={labelClassName}
        id={id}
        icon={icon}
        label={label}
        required={required}
        readOnly={readOnly}
      />

      {readOnly ? (
        <div className={`pt-2.5 pb-4 px-4 bg-gray-50 text-[16px] leading-relaxed ${borderClassname}`}>
          {date || "Not specified"}
        </div>
      ) : (
        <input
          type={type}
          className={`pt-2.5 pb-4 px-4 w-full outline-0 text-[16px] leading-relaxed placeholder-gray-500 ${borderClassname} ${cleanedInputClassName}`}
          id={id}
          name={name}
          title={title}
          placeholder={placeholder}
          value={date}
          required={required}
          onChange={onChange}
          min={min}
          max={max}
          disabled={disabled}
          readOnly={readOnly}
        />
      )}

      <ErrorMessage error={errorMessage} />
    </div>
  );
};

DateInput.propTypes = {
  type: PropTypes.string,
  border: PropTypes.string,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  title: PropTypes.string,
  placeholder: PropTypes.string,
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  errorMessage: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

export default memo(DateInput);
