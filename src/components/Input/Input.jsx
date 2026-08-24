import { forwardRef, memo } from "react";
import PropTypes from "prop-types";



import { ErrorMessage, Label } from ".";
import { getLocaleDateTime } from "../../utils/utils";

const Input = forwardRef(
  (
    {
      id = "",
      name = "",
      type = "text",
      helpText = "",
      value = "",
      autoComplete = "off",
      label = "",
      className = "",
      border = "border border-slate-300 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary rounded-md outline-none transition-colors",
      inputClassName = "",
      labelClassName = "",
      placeholder = "",
      placeholderClassName = "placeholder-gray-500",
      onChange = () => { },
      onClick = () => { },
      onKeyDown = () => { },
      onFocus = () => { },
      min,
      max,
      title = "",
      errorMessage = "",
      disabled = false,
      readOnly = false,
      required = false,
      icon,
      isSpecialCharsAllowed = true,
      isInputForEmail = false,
      limit,
      onlyFloorValue = false,
      textOverflow = false,
      autoFocus = false,
      extraLabel = <></>,
      checked = false,
    },
    ref
  ) => {
    let borderClassname = errorMessage ? `${border} border-red-500` : border;

    const handleChange = (e) => {
      let newValue = e.target.value;

      // Prioritize isInputForEmail — overrides isSpecialCharsAllowed
      const allowEmailInput = isInputForEmail === true;
      const allowSpecialChars =
        !allowEmailInput && isSpecialCharsAllowed === true;

      if (type === "number") {
        if (onlyFloorValue) {
          // Allow only digits, no decimal points
          newValue = newValue.replace(/[^0-9]/g, "");
        } else {
          // Allow digits and a single decimal point
          newValue = newValue.replace(/[^0-9.]/g, "");
          const parts = newValue.split(".");
          if (parts.length > 2) {
            // If more than one decimal point, keep only the first one
            newValue = parts[0] + "." + parts.slice(1).join("");
          }
        }
      } else if (allowEmailInput) {
        // Allow only letters, numbers, @, and .
        newValue = newValue.replace(/[^a-zA-Z0-9@._-]/g, "");
      } else if (!allowSpecialChars) {
        // Allow only letters, numbers, and spaces
        newValue = newValue.replace(/[^a-zA-Z0-9\s]/g, "");
      }

      if (limit) {
        newValue = newValue.substring(0, limit);
      }

      onChange({
        target: {
          name: e.target.name,
          value: newValue,
        },
      });
    };

    const displayValue = !isSpecialCharsAllowed
      ? (value || "").replace(/[^a-zA-Z0-9\s]/g, "")
      : value || "";

    const cleanInputClass = (classes) => {
      if (!classes) return "";
      return classes
        .split(" ")
        .filter((c) => !/^(p[xy]?-\d+(\.\d+)?|h-\d+|max-h-\d+|text-sm)$/.test(c))
        .join(" ");
    };
    const cleanedInputClassName = cleanInputClass(inputClassName);

    const remainingCharacters = limit
      ? Math.max(0, limit - displayValue.length)
      : null;

    return (
      <div
        className={`${label || errorMessage ? "space-y-1" : ""} ${className}`}
        ref={ref}
      >
        <div className="flex items-center justify-between">
          <Label
            className={labelClassName}
            id={id}
            icon={icon}
            label={label}
            required={required}
            readOnly={readOnly}
            helpText={helpText}
          />
          {extraLabel}
        </div>

        {readOnly ? (
          <div
            className={`pt-2.5 pb-4 px-4 bg-gray-50 text-[16px] leading-relaxed ${borderClassname} ${cleanedInputClassName} ${textOverflow ? "overflow-x-auto whitespace-nowrap" : "truncate"
              }`}
          >
            {type === "date"
              ? getLocaleDateTime(value, "date") || "مخصوص نہیں"
              : value || "مخصوص نہیں"}
          </div>
        ) : (
          <input
            type={type}
            className={`pt-2.5 pb-4 px-4 w-full outline-0 text-[16px] leading-relaxed ${placeholderClassName} ${borderClassname} ${cleanedInputClassName}`}
            id={id}
            name={name}
            title={title}
            placeholder={placeholder}
            value={value}
            required={required}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            onChange={handleChange}
            onClick={onClick}
            onKeyDown={onKeyDown}
            onFocus={onFocus}
            min={min}
            max={max}
            disabled={disabled}
            readOnly={readOnly}
            checked={checked}
          />
        )}

        {errorMessage ? (
          <ErrorMessage error={errorMessage} />
        ) : (
          !readOnly &&
          limit !== undefined && (
            <div className="text-xs text-gray-500 ">
              {remainingCharacters} حروف باقی ہیں
            </div>
          )
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

Input.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  helpText: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  autoComplete: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  className: PropTypes.string,
  border: PropTypes.string,
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  inputClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  placeholderClassName: PropTypes.string,
  placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  onFocus: PropTypes.func,
  onKeyDown: PropTypes.func,
  errorMessage: PropTypes.string,
  title: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  isSpecialCharsAllowed: PropTypes.bool,
  limit: PropTypes.number,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  isInputForEmail: PropTypes.bool,
  onlyFloorValue: PropTypes.bool,
  textOverflow: PropTypes.bool,
  autoFocus: PropTypes.bool,
  extraLabel: PropTypes.node,
  checked: PropTypes.bool,
};

export default memo(Input);
