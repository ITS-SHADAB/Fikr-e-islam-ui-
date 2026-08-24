import { COLORS } from '@/utils/themeColors';
import { useState, useRef, useEffect, forwardRef } from "react";
import PropTypes from "prop-types";

import { chevronDownGrey } from "../../assets";

import { ErrorMessage, Input, Label } from ".";

import "./multiSelect.scss";

const MultiSelect = forwardRef(
  (
    {
      className = "w-full",
      labelClassName = "",
      selectedOptionClassName = "bg-gray-200 rounded",
      border = "border border-slate-300 hover:border-slate-400 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary rounded-md outline-none transition-colors",
      id = "",
      // name = "",
      helpText = "",
      title = "",
      label = "",
      placeholder = "Select options...",
      value = [],
      options = [],
      onSelectClick = () => {},
      errorMessage = "",
      required = false,
      disabled = false,
      readOnly = false,
      icon,
      dropdownOnTop = false,
    },
    ref
  ) => {
    let borderClassname = errorMessage ? `${border} border-red-500` : border;
    const dropdownRef = useRef(null);
    const [isOptionsShown, setIsOptionsShown] = useState(false);

    const isOptionsIncludeLabelValue = options?.some(
      (option) =>
        typeof option === "object" && Object?.keys(option)?.includes("value")
    );
    const isOptionsIncludeIDName = (
      options?.length > 0 ? options : value
    )?.some(
      (option) =>
        typeof option === "object" && Object?.keys(option)?.includes("name")
    );

    const selectedOptions = isOptionsIncludeLabelValue
      ? value?.map((val) => options?.find((opt) => opt.value === val))
      : value;

    const [searchQuery, setSearchQuery] = useState("");

    const filteredOptions = options?.filter((option) =>
      (isOptionsIncludeIDName
        ? option.name
        : isOptionsIncludeLabelValue
        ? option.label
        : option
      )
        ?.toString()
        ?.toLowerCase()
        ?.includes(searchQuery.toLowerCase())
    );

    const handleShowDropdown = () => {
      if (!disabled) {
        setIsOptionsShown((prev) => !prev);
      }
    };

    const handleOptionSelect = (option) => {
      const isOptionExist = selectedOptions?.find((selectedOpt) =>
        isOptionsIncludeIDName
          ? selectedOpt.id === option.id
          : isOptionsIncludeLabelValue
          ? selectedOpt.value === option.value
          : selectedOpt === option
      );

      if (isOptionExist) return;

      const updatedOptions = [...selectedOptions, option];
      onSelectClick(
        updatedOptions?.map((opt) =>
          isOptionsIncludeLabelValue ? opt.value : opt
        )
      );
      setSearchQuery("");
    };

    const handleOptionRemove = (e, option) => {
      e.stopPropagation();
      const updatedOptions = selectedOptions?.filter((selectedOpt) =>
        isOptionsIncludeIDName
          ? selectedOpt.id !== option.id
          : isOptionsIncludeLabelValue
          ? selectedOpt.value !== option.value
          : selectedOpt !== option
      );

      onSelectClick(
        updatedOptions?.map((opt) =>
          isOptionsIncludeLabelValue ? opt.value : opt
        )
      );
    };

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          dropdownRef?.current &&
          !dropdownRef?.current?.contains(event.target)
        ) {
          setIsOptionsShown(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    return (
      <div
        className={`${
          label || errorMessage ? "space-y-1" : ""
        } multiselect-dropdown ${className}`}
        ref={dropdownRef}
      >
        <Label
          className={labelClassName}
          id={id}
          icon={icon}
          label={label}
          helpText={helpText}
          required={required}
          readOnly={readOnly}
        />

        {readOnly ? (
          <div className={`p-2 bg-gray-50 border border-gray-200 rounded`}>
            <div className="flex flex-wrap gap-2">
              {selectedOptions?.length > 0 ? (
                selectedOptions?.map((selectedOption, idx) => (
                  <div
                    key={idx}
                    className={`p-1 px-2 text-xs flex items-center gap-1 ${selectedOptionClassName}`}
                  >
                    {isOptionsIncludeLabelValue
                      ? selectedOption.label
                      : isOptionsIncludeIDName
                      ? selectedOption.name
                      : selectedOption}
                  </div>
                ))
              ) : (
                <div className="text-sm">Not specified</div>
              )}
            </div>
          </div>
        ) : (
          <div
            className={`p-2 min-w-full flex justify-between items-center dropdown-input outline-none ${borderClassname}`}
            title={title}
            onClick={handleShowDropdown}
          >
            <div className="flex flex-wrap gap-1 w-full items-center">
              {selectedOptions?.length > 0 ? (
                selectedOptions?.map((selectedOption, index) => (
                  <div
                    key={index}
                    className={`px-2 text-xs flex items-center gap-1 ${selectedOptionClassName}`}
                  >
                    <span>
                      {isOptionsIncludeIDName
                        ? selectedOption?.name
                        : isOptionsIncludeLabelValue
                        ? selectedOption?.label
                        : selectedOption}
                    </span>
                    <span
                      className="text-red-600 cursor-pointer p-1"
                      onClick={(e) => handleOptionRemove(e, selectedOption)}
                    >
                      X
                    </span>
                  </div>
                ))
              ) : (
                <span className="w-full text-gray-500">{placeholder}</span>
              )}
            </div>

            <img
              src={chevronDownGrey}
              alt=""
              className={`size-5 transition-all duration-300 ${
                isOptionsShown ? "rotate-180" : ""
              }`}
            />
          </div>
        )}

        <ErrorMessage error={errorMessage} />

        {isOptionsShown && (
          <div
            className="dropdown-options"
            style={dropdownOnTop ? { bottom: "70%", top: "auto" } : {}}
          >
            {/* <div className="dropdown-search-bar px-2 pb-1"> */}
            {!dropdownOnTop && (
              <Input
                ref={ref}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for options..."
                // className="w-full px-2 py-1 border-2 border-gray-200 rounded text-sm outline-none"
                border="border-b"
                onClick={(e) => e.stopPropagation()}
                autoFocus={isOptionsShown}
              />
            )}

            {/* </div> */}
            <ul className="dropdown-scrollable-options">
              {filteredOptions?.map((option, index) => (
                <li
                  key={index}
                  className={`dropdown-option ${
                    selectedOptions?.find((selectedOpt) =>
                      isOptionsIncludeIDName
                        ? selectedOpt.id === option.id
                        : isOptionsIncludeLabelValue
                        ? selectedOpt.label === option.label
                        : selectedOpt === option
                    )
                      ? "disabled"
                      : ""
                  }`}
                  onClick={() => handleOptionSelect(option)}
                >
                  {isOptionsIncludeIDName
                    ? option?.name
                    : isOptionsIncludeLabelValue
                    ? option.label
                    : option}
                </li>
              ))}
              {filteredOptions?.length === 0 && (
                <li className="dropdown-option">No data found</li>
              )}
            </ul>
            {dropdownOnTop && (
              <Input
                ref={ref}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for options..."
                // className="w-full px-2 py-1 border-2 border-gray-200 rounded text-sm outline-none"
                border="border-t"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>
        )}
      </div>
    );
  }
);

MultiSelect.displayName = "MultiSelect";

MultiSelect.propTypes = {
  className: PropTypes.string,
  labelClassName: PropTypes.string,
  selectedOptionClassName: PropTypes.string,
  border: PropTypes.string,
  id: PropTypes.string,
  helpText: PropTypes.string,
  name: PropTypes.string,
  title: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  placeholder: PropTypes.string,
  value: PropTypes.array,
  options: PropTypes.array,
  onSelectClick: PropTypes.func,
  errorMessage: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  dropdownOnTop: PropTypes.bool,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

export default MultiSelect;

// import PropTypes from "prop-types";
// import { memo, useMemo } from "react";
// import Select from "react-select";

// const customStyles = {
//   control: (base, state) => ({
//     ...base,
//     borderColor: "none",
//     "&:hover": { borderColor: COLORS.primary },
//     "&:active": { outline: "none" },
//     boxShadow: state.isFocused ? "none" : "none",
//   }),
//   option: (base, { isFocused, isSelected }) => ({
//     ...base,
//     backgroundColor: isSelected ? "#3E8B821A" : isFocused ? "white" : "white",
//     color: isSelected ? COLORS.primary : isFocused ? COLORS.primary : "black",
//     fontWeight: isFocused ? 900 : "normal",
//     transition: "transform 0.2s ease-in-out, font-weight 0.2s ease-in-out",
//     "&:active": { backgroundColor: "#3E8B821A" },
//   }),
//   singleValue: (base) => ({
//     ...base,
//     color: "black",
//   }),
//   placeholder: (base) => ({
//     ...base,
//     color: "#27282888",
//   }),
// };

// const SearchSelect = ({
//   className = "",
//   id = "",
//   name = "",
//   label = "",
//   placeholder = "Select...",
//   value = "",
//   options = [],
//   onChange = () => {},
//   onSelectClick = () => {},
//   disabled = false,
//   readOnly = false,
//   icon,
//   errorMessage = "",
// }) => {
//   const normalizedOptions = useMemo(() => {
//     return options?.map((opt) =>
//       typeof opt === "object" ? opt : { label: opt, value: opt }
//     );
//   }, [options]);

//   const selectedOption = useMemo(() => {
//     return normalizedOptions.find((opt) => opt.value === value) || null;
//   }, [normalizedOptions, value]);

//   const handleChange = (selected) => {
//     onChange({ target: { name, value: selected?.value ?? "" } });
//     onSelectClick(selected?.value ?? "");
//   };

//   return (
//     <div className={`relative ${className}`}>
//       {label && (
//         <label
//           htmlFor={id}
//           className="block mb-1 text-sm font-medium text-gray-700"
//         >
//           {label}
//         </label>
//       )}
//       <Select
//         inputId={id}
//         name={name}
//         placeholder={placeholder}
//         options={normalizedOptions}
//         value={selectedOption}
//         onChange={handleChange}
//         isDisabled={disabled || readOnly}
//         styles={customStyles}
//         classNamePrefix="react-select"
//       />
//       {errorMessage && (
//         <span className="text-sm text-error mt-1 block">
//           {errorMessage}
//         </span>
//       )}
//     </div>
//   );
// };

// SearchSelect.propTypes = {
//   className: PropTypes.string,
//   id: PropTypes.string,
//   name: PropTypes.string,
//   label: PropTypes.string,
//   placeholder: PropTypes.string,
//   value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//   options: PropTypes.array,
//   onChange: PropTypes.func,
//   onSelectClick: PropTypes.func,
//   disabled: PropTypes.bool,
//   readOnly: PropTypes.bool,
//   icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
//   errorMessage: PropTypes.string,
// };

// export default memo(SearchSelect);
