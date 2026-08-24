import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { FaWindowClose } from "react-icons/fa";

import { InfoCard } from "..";

import { ErrorMessage, Label } from ".";

const PaginatedSelectInput = ({
  className = "",
  pageSize = 5,
  options = [],
  value = [],
  onChange,
  disabled,
  placeholder = "Search options...",
  inputClassName = "",
  dropdownClassName = "",
  optionClassName = "",
  selectedOptionClassName = "",
  multiSelect = true,
  label = "",
  errorMessage = "",
  showSelectedOptions = true,
  onNextClick,
  onPreviousCLick,
  max,
}) => {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState(value);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (typeof value === "object") {
      setSelectedOptions(Array.isArray(value) ? value : [value]);
    }
  }, [value]);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1); // Reset to the first page when searching
    setIsDropdownOpen(true); // Reopen dropdown when typing
  };

  const handleOptionClick = (option) => {
    const alreadySelected = selectedOptions?.find((o) => o.id === option.id);

    if (multiSelect) {
      if (!alreadySelected && max && selectedOptions.length >= max) {
        return;
      }

      let updatedSelection;
      if (alreadySelected) {
        updatedSelection = selectedOptions.filter((o) => o.id !== option.id);
      } else {
        updatedSelection = [...selectedOptions, option];
      }

      setSelectedOptions(updatedSelection);
      if (onChange) {
        onChange(updatedSelection);
      }

      // Clear search after selection
      setSearchText("");
    } else {
      setSelectedOptions([option]); // Single selection
      if (onChange) {
        onChange([option]);
      }
      setIsDropdownOpen(false); // Close dropdown after selection
      setSearchText(""); // Clear search text after selection
    }
  };

  const handleInputClick = () => {
    setIsDropdownOpen(true);
  };

  const closeDropdown = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", closeDropdown);
    return () => {
      document.removeEventListener("click", closeDropdown);
    };
  }, []);

  const filteredOptions = options.filter((option) =>
    option?.label?.toLowerCase()?.includes(searchText?.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOptions.length / pageSize);
  const paginatedOptions = filteredOptions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div
      className={`space-y-1 paginated-select-input relative ${className}`}
      ref={dropdownRef}
    >
      {/* {label && (
        <label className="mb-0.5 text-sm text-[#272828B2] font-medium">
          {label}
          <span className="text-error">*</span>
        </label>
      )} */}
      <Label
        // className={labelClassName}
        // id={id}
        // icon={icon}
        label={label}
        required={true}
        // readOnly={readOnly}
      />
      <div className="space-y-2">
        {/* Selected Options */}

        {/* Input Field with inline selected options (single line scrollable) */}
        <div
          className={`flex items-center gap-1 py-2.5 px-3 border border-slate-300 hover:border-slate-400 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary rounded-md outline-none transition-colors cursor-text overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 ${inputClassName}`}
          onClick={!disabled && handleInputClick}
          style={{ whiteSpace: "nowrap" }}
        >
          {multiSelect &&
            selectedOptions.length > 0 &&
            showSelectedOptions === true &&
            selectedOptions.map((option) => (
              <span
                key={option.id}
                className="inline-flex items-center px-2 py-1 bg-secondary/40 text-primary text-xs rounded mr-1 shrink-0"
              >
                {option.label}
                {!disabled && (
                  <FaWindowClose
                    className="ml-1 cursor-pointer text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOptionClick(option);
                    }}
                  />
                )}
              </span>
            ))}

          {/* Input for typing */}
          <input
            type="text"
            value={multiSelect ? searchText : selectedOptions[0]?.label || ""}
            onChange={handleSearchChange}
            placeholder={selectedOptions.length === 0 ? placeholder : ""}
            className="flex-grow min-w-[120px] outline-none border-none text-sm bg-transparent"
            disabled={disabled}
          />
        </div>
      </div>
      {/* Dropdown */}
      {isDropdownOpen && (
        <div
          className={`absolute left-0 w-full bg-white border border-gray-300 rounded mt-1 shadow-lg z-10 my-2 popup-zoom ${dropdownClassName}`}
        >
          {filteredOptions.length > 0 ? (
            <>
              {/* Options */}
              {paginatedOptions.map((option) => {
                const isSelected = selectedOptions?.find(
                  (o) => o.id === option.id
                );
                const isDisabled =
                  !isSelected && max && selectedOptions.length >= max;

                return (
                  <div
                    key={option.id}
                    className={`relative flex items-center p-2 rounded-lg my-1 mx-1 ${
                      isSelected
                        ? `bg-secondary/40 text-primary ${selectedOptionClassName}`
                        : ""
                    } ${
                      isDisabled
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer hover:bg-secondary/40 hover:text-primary"
                    } ${optionClassName}`}
                    onClick={() => !isDisabled && handleOptionClick(option)}
                  >
                    {isSelected && (
                      <div
                        className="absolute -top-2 -left-2 p-1 rounded-full text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          !isDisabled && handleOptionClick(option);
                        }}
                      >
                        <FaWindowClose />
                      </div>
                    )}
                    <InfoCard
                      topText={option.label}
                      image={
                        option?.profilePictureFileEntryRef?.imageUrl ||
                        option?.profilePictureFileEntryRef?.fileUrl
                      }
                      imgClassName="size-6"
                    />
                  </div>
                );
              })}

              {/* Pagination Controls */}
              <div className="flex justify-between items-center p-2 border-t">
                <button
                  onClick={
                    onPreviousCLick ? onPreviousCLick : handlePreviousPage
                  }
                  className={`px-3 py-1 text-sm text-gray-600 rounded ${
                    currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  ← Previous
                </button>
                <button
                  onClick={onNextClick ? onNextClick : handleNextPage}
                  className={`px-3 py-1 text-sm text-gray-600 rounded ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  Next →
                </button>
              </div>
            </>
          ) : (
            <div className="p-2 text-sm text-gray-600 text-center">
              No matches found
            </div>
          )}
        </div>
      )}
      {/* {errorMessage && (
        <span className="text-error mt-1">{errorMessage}</span>
      )} */}
      <ErrorMessage error={errorMessage} />
    </div>
  );
};

PaginatedSelectInput.propTypes = {
  className: PropTypes.string,
  pageSize: PropTypes.number,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
      image: PropTypes.string,
    })
  ).isRequired,
  value: PropTypes.array,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  inputClassName: PropTypes.string,
  dropdownClassName: PropTypes.string,
  optionClassName: PropTypes.string,
  selectedOptionClassName: PropTypes.string,
  disabled: PropTypes.bool,
  multiSelect: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  errorMessage: PropTypes.string,
  showSelectedOptions: PropTypes.bool,
  onNextClick: PropTypes.func,
  onPreviousCLick: PropTypes.func,
  max: PropTypes.number,
};

export default PaginatedSelectInput;
