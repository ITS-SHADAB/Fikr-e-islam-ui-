import PropTypes from "prop-types";
import { memo, useState } from "react";

function Label({
  className = "",
  id = "",
  label = "",
  required = false,
  readOnly = false,
  helpText = "",
}) {
  const [showHelp, setShowHelp] = useState(false);
  return (
    label && (
      <div className="flex justify-start items-center gap-2">
        {readOnly ? (
          <div
            className={`text-xs text-gray-500 truncate flex items-center gap-0.5 ${className}`}
          >
            <span>{label}</span>
            {required && !readOnly && <span className="text-red-500">*</span>}
          </div>
        ) : (
          <label
            className={`text-xs text-gray-500 truncate flex items-center gap-0.5 ${className}`}
            htmlFor={id}
          >
            <span>{label}</span>
            {required && !readOnly && <span className="text-red-500">*</span>}
          </label>
        )}

        {helpText && (
          <div
            className="relative flex-shrink-0"
            onMouseEnter={() => setShowHelp(true)}
            onMouseLeave={() => setShowHelp(false)}
          >
            <div className="w-4 h-4 flex items-center justify-center text-xs font-bold text-white bg-primary rounded-full cursor-pointer">
              i
            </div>

            {showHelp && (
              <div className="absolute z-10 left-full top-0 text-xs text-gray-700 bg-white border border-gray-400 p-4 rounded-md shadow-lg min-w-28 max-w-56 mt-1 whitespace-pre-line break-words">
                {helpText}
              </div>
            )}
          </div>
        )}
      </div>
    )
  );
}

Label.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  helpText: PropTypes.string,
  required: PropTypes.bool,
  readOnly: PropTypes.bool,
};

export default memo(Label);
