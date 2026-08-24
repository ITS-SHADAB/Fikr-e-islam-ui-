import { COLORS } from '@/utils/themeColors';
import PropTypes from "prop-types";
import { memo, useEffect, useState } from "react";

import { validatePassword } from "../../utils";

import { eye, eyeOff } from "../../assets";

import { ErrorMessage, Label } from ".";

const PasswordInput = ({
  border = "border border-slate-300 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary rounded-md outline-none transition-colors",
  className = "",
  inputClassName = "",
  labelClassName = "",
  id = "",
  name = "",
  label = "",
  title = "",
  placeholder = "",
  required = false,
  value = "",
  errorMessage = "",
  onChange = () => {},
  setFormError,
  isPasswordValidationRequired = true,
  disabled = false,
  readOnly = false,
}) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [passwordStrengthScore, setPasswordStrengthScore] = useState(0);
  const [passwordError, setPasswordError] = useState("");

  const cleanInputClass = (classes) => {
    if (!classes) return "";
    return classes
      .split(" ")
      .filter((c) => !/^(p[xy]?-\d+(\.\d+)?|h-\d+|max-h-\d+|text-sm)$/.test(c))
      .join(" ");
  };
  const cleanedInputClassName = cleanInputClass(inputClassName);

  let borderClassname = errorMessage ? `${border} border-red-500` : border;

  const strengthColors = [
    COLORS.error, // Weak
    COLORS.accent, // Fair
    COLORS.accent, // Good
    COLORS.teal, // Strong
    COLORS.success, // Very strong,
  ];
  const strengthScore = Math.min(passwordStrengthScore, 4);
  const progress = (strengthScore / 4) * 100;

  const strengthText =
    strengthScore === 1
      ? "Weak"
      : strengthScore === 2
      ? "Fair"
      : strengthScore === 3
      ? "Good"
      : strengthScore === 4
      ? "Strong"
      : "";

  useEffect(() => {
    if (!value) return;

    if (isPasswordValidationRequired) {
      const { score, errors } = validatePassword(value);
      setPasswordStrengthScore(score);
      setPasswordError(errors);
      setFormError?.((prev) => ({
        ...prev,
        [name]: errors?.length === 0 ? "" : errors,
      }));
    }
  }, [value, isPasswordValidationRequired]);

  return (
    <div className={`${label || errorMessage ? "space-y-1" : ""} ${className}`}>
      {label && (
        <div className="text-sm flex items-center justify-between">
          <Label
            className={labelClassName}
            id={id}
            label={label}
            required={required}
            readOnly={readOnly}
          />

          {isPasswordValidationRequired && (
            <span style={{ color: strengthColors[passwordStrengthScore - 1] }}>
              {value !== "" && strengthText}
            </span>
          )}
        </div>
      )}
      {readOnly ? (
        <p className={`pt-2.5 pb-4 px-4 bg-gray-50 text-[16px] leading-relaxed ${borderClassname}`}>{value}</p>
      ) : (
        <div className="flex items-center">
          <input
            type={isPasswordShown ? "text" : "password"}
            id={id}
            name={name}
            title={title}
            placeholder={placeholder}
            value={value}
            className={`pt-2.5 pb-4 px-4 max-h-[52px] w-full outline-0 text-[16px] leading-relaxed placeholder-gray-500 bg-inherit ${borderClassname} ${cleanedInputClassName}`}
            required={required}
            onChange={onChange}
            disabled={disabled}
            readOnly={readOnly}
          />
          {value?.length > 0 && (
            <span
              className="-m-7"
              onClick={(e) => {
                e.stopPropagation();
                setIsPasswordShown(!isPasswordShown);
              }}
            >
              <img
                src={isPasswordShown ? eyeOff : eye}
                alt=""
                className="size-5"
              />
            </span>
          )}
        </div>
      )}

      {typeof errorMessage === "string" && (
        <ErrorMessage error={errorMessage} />
      )}

      {value && passwordError?.length > 0 && isPasswordValidationRequired && (
        <>
          <div className="h-1 bg-grayLight mt-2">
            <div
              className="h-full"
              style={{
                width: `${progress}%`,
                backgroundColor: strengthColors[passwordStrengthScore - 1],
              }}
            />
          </div>

          <div className="h-8 text-xs overflow-y-scroll no-scrollbar">
            {passwordError?.map((e, index) => (
              <span key={index} className="block text-red-500">
                {e}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

PasswordInput.propTypes = {
  border: PropTypes.string,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  title: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  errorMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  onChange: PropTypes.func,
  setFormError: PropTypes.func,
  isPasswordValidationRequired: PropTypes.bool,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
};

export default memo(PasswordInput);
