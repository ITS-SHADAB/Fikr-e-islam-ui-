import PropTypes from "prop-types";
import { forwardRef, memo, useEffect, useRef, useState } from "react";

import { chevronDownGrey } from "../../assets";
import { x } from "../../assets/figmaIcons";

import { Icon, Input } from "..";

const SearchSelect = forwardRef(
  (
    {
      autoComplete = "off",
      className = "",
      labelClassName = "",
      inputClassName = "shadow-none",
      dropdownClassName = "",
      id = "",
      name = "",
      title = "",
      label = "",
      placeholder = "",
      value = "",
      helpText = "",
      options = [],
      // onChange = () => {},
      onSelectClick = () => {},
      errorMessage = "",
      required = false,
      isNoDataShown = true,
      disabled = false,
      readOnly = false,
      icon,
      isClearable = true,
      dropdownOnTop = false,
      extraLabel = <></>,
    },
    ref
  ) => {
    const dropdownRef = useRef(null);
    const [isOptionsShown, setIsOptionsShown] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const isOptionsIncludeLabelValue = options?.some(
      (option) =>
        typeof option === "object" && Object?.keys(option)?.includes("value")
    );
    const isOptionsIncludeIDName = options?.some(
      (option) =>
        typeof option === "object" && Object?.keys(option)?.includes("name")
    );

    //querySelector to check if Input is focused
    useEffect(() => {
      const globalKeyListener = (e) => {
        const inputNode = dropdownRef.current?.querySelector("input");
        if (
          e.key === "Enter" &&
          document.activeElement === inputNode &&
          !isOptionsShown &&
          !disabled
        ) {
          e.preventDefault();
          setIsOptionsShown(true);
        }
      };
      document.addEventListener("keydown", globalKeyListener);
      return () => document.removeEventListener("keydown", globalKeyListener);
    }, [isOptionsShown, disabled]);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          dropdownRef?.current &&
          !dropdownRef?.current?.contains(event?.target)
        ) {
          setSearchText("");
          setIsOptionsShown(false);
          setHighlightedIndex(-1);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const filteredOption = options?.filter((option) =>
      (isOptionsIncludeIDName
        ? option.name
        : isOptionsIncludeLabelValue
          ? option.label
          : option
      )
        ?.toString()
        ?.toLowerCase()
        ?.includes(
          typeof searchText === "string"
            ? searchText?.toLowerCase()
            : searchText
        )
    );

    function onSearchChange(e) {
      // onChange(e);
      setIsOptionsShown(true);
      setSearchText(e.target.value);
      setHighlightedIndex(-1);
    }

    const handleShowDropdown = (e) => {
      e.stopPropagation();
      if (!disabled) {
        setIsOptionsShown((prev) => !prev);
      }
    };

    const handleOptionSelect = (e, option) => {
      if (disabled) return;
      e.stopPropagation();
      setSearchText("");
      onSelectClick(isOptionsIncludeLabelValue ? option.value : option);
      setIsOptionsShown(false);
      setHighlightedIndex(-1);
    };

    //keyboard navigation
    const handleKeyDown = (e) => {
      if (!isOptionsShown || !filteredOption?.length) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev >= filteredOption.length - 1 ? 0 : prev + 1
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev <= 0 ? filteredOption.length - 1 : prev - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (
            highlightedIndex >= 0 &&
            highlightedIndex < filteredOption.length
          ) {
            const option = filteredOption[highlightedIndex];
            handleOptionSelect(e, option);
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOptionsShown(false);
          setHighlightedIndex(-1);
          break;
        default:
          break;
      }
    };

    const optionRef = useRef([]);
    useEffect(() => {
      if (highlightedIndex >= 0 && optionRef.current[highlightedIndex]) {
        optionRef.current[highlightedIndex].scrollIntoView({
          block: "nearest",
        });
      }
    }, [highlightedIndex]);

    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <Input
          ref={ref}
          icon={icon}
          className={inputClassName}
          id={id}
          name={name}
          title={title}
          label={label}
          extraLabel={extraLabel}
          helpText={helpText}
          labelClassName={labelClassName}
          placeholder={
            (isOptionsIncludeIDName
              ? value?.name
              : isOptionsIncludeLabelValue
                ? options?.find((o) => o.value === value)?.label
                : value) || placeholder
          }
          placeholderClassName={
            (isOptionsIncludeIDName ? value?.name : value)
              ? "placeholder-black"
              : "placeholder-gray-500"
          }
          value={
            disabled || readOnly
              ? isOptionsIncludeIDName
                ? value?.name
                : isOptionsIncludeLabelValue
                  ? options?.find((o) => o.value === value)?.label
                  : value
              : searchText
          }
          errorMessage={errorMessage}
          onChange={onSearchChange}
          onClick={() => setIsOptionsShown(true)}
          onKeyDown={handleKeyDown}
          autoComplete={autoComplete}
          required={required}
          readOnly={readOnly}
          disabled={disabled}
        />

        {!disabled && (value || !searchText || isOptionsShown) && (
          <div
            className={`absolute right-2 flex items-center bg-white rounded-md transition-all duration-300 ${
              label ? "top-7" : "top-3"
            }`}
          >
            {(isOptionsIncludeIDName ? value?.name : value) &&
              !searchText &&
              isClearable && (
                <Icon
                  svg={x}
                  className="cursor-pointer mr-0.5 text-gray-500"
                  size="4"
                  onClick={() =>
                    onSelectClick(isOptionsIncludeIDName ? {} : "")
                  }
                />
              )}

            <img
              src={chevronDownGrey}
              alt=""
              className={`size-5 cursor-pointer transition-all duration-300 ${
                isOptionsShown ? "rotate-180" : ""
              }`}
              onClick={handleShowDropdown}
            />
          </div>
        )}

        {isOptionsShown && !disabled && (
          <ul
            className={`absolute ${
              dropdownOnTop ? "bottom-12" : ""
            } right-0 mt-2 w-full bg-white border border-gray-300 rounded-lg z-10 max-h-48 overflow-y-auto ${dropdownClassName}`}
          >
            {filteredOption?.length > 0
              ? filteredOption?.map((option, index) => (
                  <li
                    key={index}
                    ref={(el) => (optionRef.current[index] = el)}
                    className={`px-4 py-2 flex items-center justify-between hover:bg-gray-100 text-black cursor-pointer ${
                      option?.value === value ||
                      option?.name === value ||
                      option === value
                        ? "bg-gray-300 font-semibold"
                        : ""
                    } ${index === highlightedIndex ? "bg-gray-200" : ""}`}
                    onClick={(e) => handleOptionSelect(e, option)}
                  >
                    <span>
                      {isOptionsIncludeIDName
                        ? option.name
                        : isOptionsIncludeLabelValue
                          ? option.label
                          : option}
                    </span>
                  </li>
                ))
              : isNoDataShown && (
                  <h1 className="px-4 py-2 h-10">No Data found</h1>
                )}
          </ul>
        )}
      </div>
    );
  }
);

SearchSelect.displayName = "SearchSelect";

SearchSelect.propTypes = {
  autoComplete: PropTypes.string,
  className: PropTypes.string,
  labelClassName: PropTypes.string,
  inputClassName: PropTypes.string,
  dropdownClassName: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  title: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  helpText: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
  ]),
  options: PropTypes.array,
  // onChange: PropTypes.func,
  onSelectClick: PropTypes.func,
  errorMessage: PropTypes.string,
  required: PropTypes.bool,
  isNoDataShown: PropTypes.bool,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  isClearable: PropTypes.bool,
  dropdownOnTop: PropTypes.bool,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  extraLabel: PropTypes.node,
};

export default memo(SearchSelect);
