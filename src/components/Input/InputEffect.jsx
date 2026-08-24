import PropTypes from "prop-types";

const InputEffect = ({
  placeHolder,
  className,
  name,
  BtnName,
  type,
  value,
  onChange,
  onClick,
  required = false,
}) => {
  return (
    <div className="relative bg-white rounded-lg">
      <input
        name={name} // ✅ Ensure this is here
        placeholder={placeHolder}
        className={`peer w-60 bg-transparent placeholder-transparent text-gray-800 text-sm bg-gray-200 rounded-md px-3 py-2 transition box-shadow: rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset;duration-300 ease focus:outline-gray-300 focus:border-none focus:shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)] shadow-sm ${className}`}
        id="defaultInput"
        type={type}
        value={value || ""}
        onChange={onChange}
        onClick={onClick}
      />
      <label
        className={`absolute left-2 top-0 text-gray-500 bg-transparent text-sm transition-all peer-placeholder-shown:top-1.5 peer-placeholder-shown:text-gray-600 peer-placeholder-shown:text-base peer-focus:-top-6 peer-focus:text-gray-600 font-semibold peer-focus:text-sm bg-gray-200 px-1"
        htmlFor="defaultInput`}
      >
        {BtnName}
        <span>{required && <span className="text-error">*</span>}</span>
      </label>
    </div>
  );
};

InputEffect.propTypes = {
  placeHolder: PropTypes.string.isRequired,
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  BtnName: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  required: PropTypes.bool,
};

export default InputEffect;
