import PropTypes from "prop-types";
import { memo } from "react";

// import { alertTriangle } from "../../assets/figmaIcons";
// import { Icon } from "..";

function ErrorMessage({ error, className = "" }) {
  return (
    <>
      {error && (
        <p
          className={`text-xs text-red-500 flex items-center gap-1 ${className}`}
        >
          {/* <Icon svg={alertTriangle} size="3" /> */}
          {error}
        </p>
      )}
    </>
  );
}

ErrorMessage.propTypes = {
  error: PropTypes.string,
  className: PropTypes.string,
};
export default memo(ErrorMessage);
