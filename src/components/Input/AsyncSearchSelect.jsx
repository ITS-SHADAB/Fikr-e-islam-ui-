import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import { FiSearch, FiX } from "react-icons/fi";

const AsyncSearchSelect = ({
  value,
  onChange,
  fetchOptions,
  placeholder = "Search...",
  pageSize = 10,
  className = "",
}) => {
  const [searchText, setSearchText] = useState("");
  const [options, setOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (page = 0, query = searchText) => {
    if (!fetchOptions || typeof fetchOptions !== "function") return;

    setLoading(true);
    try {
      const result = await fetchOptions(page, pageSize, query);

      if (page === 0) {
        setOptions(result);
        setCurrentPage(0);

        if (query && result.length > 0) {
          const first = result[0];
          if (first.label.toLowerCase().includes(query.toLowerCase())) {
            onChange(first); // ✅ Auto-select first match
          }
        }
      } else {
        setOptions((prev) => [...prev, ...result]);
        setCurrentPage(page);
      }

      setHasMore(result.length === pageSize);
      setDropdownOpen(true);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full relative ${className}`} ref={containerRef}>
      <div
        className="py-3 px-4 h-[52px] flex gap-1 items-center border border-slate-300 hover:border-slate-400 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary rounded-md outline-none transition-colors w-full"
        onClick={() => setDropdownOpen(true)}
      >
        <FiSearch className="text-gray-500" />

        <input
          type="text"
          value={searchText}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-slate-700 placeholder-slate-400 text-[16px] leading-relaxed"
          onChange={(e) => setSearchText(e.target.value)}
        />

        {searchText.length > 0 && (
          <>
            <FiX
              className="text-gray-500 cursor-pointer hover:scale-110"
              onClick={() => {
                setSearchText("");
                setOptions([]);
                onChange(null);
                setCurrentPage(0);
                setHasMore(true);
                setDropdownOpen(false);
              }}
            />
            <FiSearch
              className="text-gray-500 cursor-pointer hover:scale-110"
              onClick={() => handleSearch(0, searchText)}
            />
          </>
        )}
      </div>

      {dropdownOpen && options.length > 0 && (
        <div
          className="absolute z-10 mt-1 w-full border border-gray-200 bg-white rounded shadow-md max-h-60 overflow-y-auto"
          onScroll={(e) => {
            const bottom =
              e.target.scrollHeight - e.target.scrollTop <=
              e.target.clientHeight + 5;

            if (bottom && hasMore && !loading) {
              handleSearch(currentPage + 1, searchText);
            }
          }}
        >
          {options.map((item) => (
            <div
              key={item.value}
              className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${
                value?.value === item.value ? "bg-gray-100" : ""
              }`}
              onClick={() => {
                onChange(item);
                setDropdownOpen(false);
              }}
            >
              {item.label}
            </div>
          ))}

          {loading && (
            <div className="text-center py-2 text-sm text-gray-400">
              Loading...
            </div>
          )}
        </div>
      )}
    </div>
  );
};
AsyncSearchSelect.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func,
  fetchOptions: PropTypes.func,
  placeholder: PropTypes.string,
  pageSize: PropTypes.number,
  className: PropTypes.string,
};

export default AsyncSearchSelect;
