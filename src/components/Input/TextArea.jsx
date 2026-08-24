import PropTypes from "prop-types";
import { memo, useRef, useEffect, forwardRef } from "react";

import { ErrorMessage, Label } from ".";

const TextArea = forwardRef(
  (
    {
      id = "",
      name = "",
      type = "text",
      helpText = "",
      value = "",
      autoComplete,
      className = "",
      border = "border border-slate-300 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary rounded-md outline-none transition-colors",
      textareaClassName = "",
      labelClassName = "",
      placeholder,
      onChange,
      onClick,
      title,
      label = "",
      errorMessage,
      disabled = false,
      readOnly = false,
      required = false,
      rows,

      limit, // NEW PROP
    },
    ref
  ) => {
    const textAreaRef = useRef(null);
    let borderClassname = errorMessage ? `${border} border-red-500` : border;

    useEffect(() => {
      if (textAreaRef.current) {
        adjustHeight();
      }
    }, [value]);

    const adjustHeight = () => {
      if (textAreaRef.current) {
        textAreaRef.current.style.height = "auto";
        const maxHeight = 200;
        const newHeight = Math.min(textAreaRef.current.scrollHeight, maxHeight);
        textAreaRef.current.style.height = `${newHeight}px`;
      }
    };

    const handleChange = (e) => {
      const newValue = e.target.value;
      if (!limit || newValue.length <= limit) {
        onChange(e);
        adjustHeight();
      }
    };

    const remainingChars = limit ? `${value.length} / ${limit}` : null;

    return (
      <div
        ref={ref}
        className={`${label || errorMessage ? "space-y-1" : ""} ${className}`}
      >
        <Label
          className={labelClassName}
          id={id}
          label={label}
          required={required}
          readOnly={readOnly}
          helpText={helpText}
        />

        {readOnly ? (
          <div
            className={`p-2 bg-gray-50 ${borderClassname} max-h-[160px] overflow-y-auto`}
          >
            {value || "Not specified"}
          </div>
        ) : (
          <>
            <textarea
              id={id}
              name={name}
              value={value}
              autoComplete={autoComplete}
              ref={textAreaRef}
              className={`p-2 w-full outline-none placeholder-gray-500 bg-inherit ${borderClassname} ${textareaClassName}`}
              type={type}
              title={title}
              maxLength={limit}
              placeholder={placeholder}
              disabled={disabled}
              readOnly={readOnly}
              onChange={handleChange}
              onClick={onClick}
              rows={rows}
            />

            {(limit || errorMessage) && (
              <div
                className={`flex gap-4 ${
                  !errorMessage ? "place-content-end" : ""
                }`}
              >
                <ErrorMessage error={errorMessage} className="w-1/2" />

                {limit && (
                  <p className="w-1/2 text-right text-xs text-gray-500">
                    {remainingChars}
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    );
  }
);
TextArea.displayName = "TextArea";
TextArea.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  autoComplete: PropTypes.string,
  className: PropTypes.string,
  border: PropTypes.string,
  helpText: PropTypes.string,
  textareaClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  errorMessage: PropTypes.string,
  title: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  limit: PropTypes.number, // NEW PROP
  rows: PropTypes.number, // NEW PROP
};

export default memo(TextArea);
