import PropTypes from "prop-types";
import { memo } from "react";

import { ErrorMessage } from ".";

function CheckBox({
  className = "",
  checkBoxClassName = "",
  id = "",
  name = "",
  title = "",
  required = false,
  checked = false,
  label = "",
  errorMessage = "",
  onChange = () => {},
  disabled = false,
  readOnly = false,
}) {
  return (
    <>
      <div className={`flex items-center gap-2 ${className}`}>
        <input
          type="checkbox"
          id={id}
          name={name}
          title={title}
          className={`size-5 accent-primary cursor-pointer ${checkBoxClassName}`}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          readOnly={readOnly}
        />
        {label && (
          <label htmlFor={id} className="text-gray-500 text-sm">
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
        )}
      </div>

      <ErrorMessage error={errorMessage} />
    </>
  );
}

CheckBox.propTypes = {
  className: PropTypes.string,
  checkBoxClassName: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  title: PropTypes.string,
  required: PropTypes.bool,
  checked: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  errorMessage: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
};

export default memo(CheckBox);
