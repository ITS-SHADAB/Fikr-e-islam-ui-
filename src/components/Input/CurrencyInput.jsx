import PropTypes from "prop-types";
import { memo, useMemo } from "react";

import { FaInfoCircle } from "react-icons/fa";

import {
  capitalizeFirstCharacter,
  formatStatus,
  numberToWords,
} from "../../utils";

import { Tooltip } from "../Tooltip";

import { ErrorMessage, Label } from ".";

const CurrencyInput = ({
  border = "border border-slate-300 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary rounded-md outline-none transition-colors",
  className = "",
  inputClassName = "",
  labelClassName,
  id = "",
  name = "",
  label = "",
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
  limit,
  inputLabel = "",
  formatValue = false,
  currency = null,
  Type = "",
  showTooltip = false,
}) => {
  const borderClassname = errorMessage ? `${border} border-red-500` : border;

  const extractCurrencySymbol = (currencyLabel) => {
    const match = currencyLabel?.match(/\((.+?)\)/);
    return match ? match[1] : "";
  };

  const formatNumber = (val) => {
    if (typeof val === "number" || !isNaN(Number(val))) {
      try {
        // Format INR specifically using en-IN
        if (inputLabel?.toLowerCase().includes("inr")) {
          return new Intl.NumberFormat("en-IN").format(Number(val));
        }

        // Use provided currency ISO code if present
        if (currency) {
          return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(Number(val));
        }

        // Default formatting
        return new Intl.NumberFormat(undefined).format(Number(val));
      } catch (error) {
        return val;
      }
    }
    return val;
  };

  const handleChange = (e) => {
    let newValue = e.target.value.replace(/,/g, ""); // remove commas
    newValue = newValue.replace(/[^0-9.]/g, ""); // allow only digits and dot

    if (limit !== undefined) {
      newValue = newValue.slice(0, limit);
    }

    onChange({
      target: {
        name: e.target.name,
        value: newValue,
      },
    });
  };

  const displayValue = formatValue && value ? formatNumber(value) : value;

  // ✅ Convert number to words when formatValue = true
  const numberInWords = useMemo(() => {
    if (formatValue && value) {
      return numberToWords(value, currency || inputLabel);
    }
    return "";
  }, [value, formatValue, currency, inputLabel]);

  const remainingCharacters = limit
    ? Math.max(0, limit - String(value || "").length)
    : null;

  const capitalizedWords =
    numberInWords && capitalizeFirstCharacter(numberInWords);

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

      <div className="relative">
        {readOnly ? (
          <div
            className={`p-2 bg-gray-50 flex items-center gap-1 ${borderClassname} ${inputClassName}`}
          >
            {inputLabel && (
              <span className="text-sm text-gray-500">
                {extractCurrencySymbol(inputLabel)}
              </span>
            )}
            <span>
              {formatValue ? formatNumber(value) : value || "Not specified"}
            </span>
          </div>
        ) : (
          <div
            className={`flex items-center ${borderClassname} bg-white rounded overflow-hidden`}
          >
            {inputLabel && (
              <span className="pl-2 text-sm text-nowrap text-gray-500 border-gray-200">
                {extractCurrencySymbol(inputLabel)}
              </span>
            )}
            <input
              type="text"
              className={`flex-1 p-2 outline-0 placeholder-gray-500 bg-transparent ${inputClassName}`}
              id={id}
              name={name}
              title={title}
              placeholder={placeholder}
              min={min}
              max={max}
              step={step}
              value={displayValue}
              required={required}
              onChange={handleChange}
              onWheel={(e) => e.target.blur()}
              onKeyDown={(e) => {
                if (["e", "E", "+", "-"].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              disabled={disabled}
              readOnly={readOnly}
            />

            {Type && (
              <span className="bg-gradientSeeker font-semibold px-2 rounded-full mx-2">
                {formatStatus(Type)}
              </span>
            )}
          </div>
        )}

        {showTooltip && formatValue && capitalizedWords && (
          <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <Tooltip text={capitalizedWords} position="left">
              <span className="flex items-center cursor-pointer pointer-events-auto">
                <FaInfoCircle className="text-gray-500" />
              </span>
            </Tooltip>
          </div>
        )}
      </div>

      <ErrorMessage error={errorMessage} />

      <div className="flex justify-between">
        {!showTooltip && formatValue && capitalizedWords && (
          <div className="text-xs text-gray-600">{capitalizedWords}</div>
        )}

        {!readOnly && limit !== undefined && (
          <div className="text-xs text-gray-500">
            {remainingCharacters} digits left
          </div>
        )}
      </div>
    </div>
  );
};

CurrencyInput.propTypes = {
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
  step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  errorMessage: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  limit: PropTypes.number,
  inputLabel: PropTypes.string,
  formatValue: PropTypes.bool,
  currency: PropTypes.string,
  Type: PropTypes.string,
  showTooltip: PropTypes.bool,
};

export default memo(CurrencyInput);
