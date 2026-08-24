import PropTypes from "prop-types";
import { memo, useState, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Simple fallback components
const BeatLoader = () => (
  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
);

const Search = ({
  id,
  name,
  className,
  placeholder,
  value,
  onChange,
  onCrossClick,
  onSearchClick,
}) => (
  <div className="relative flex items-center">
    <input
      id={id}
      name={name}
      className={`${className} px-3 py-1 outline-none`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
    {value && (
      <button
        onClick={onCrossClick}
        className="absolute right-8 text-gray-400 hover:text-gray-600 cursor-pointer"
      >
        ×
      </button>
    )}
    <button
      onClick={onSearchClick}
      className="absolute right-2 text-gray-400 hover:text-primary cursor-pointer"
    >
      🔍
    </button>
  </div>
);

const Filter = () => null;

const Input = ({ id, type, className, placeholder }) => (
  <input
    id={id}
    type={type}
    className={`${className} px-3 py-1.5 border border-[#E5E9F0] rounded-lg text-sm outline-none`}
    placeholder={placeholder}
  />
);

/* ─── Modern Reusable Table Pagination Component ─── */
const TablePagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems,
  pageSize = 10,
  onPageChange,
  onButtonClick,
  onDecrease,
  onIncrease,
  language = "ur",
}) => {
  const isRTL = language === "ur";

  const handlePage = (p) => {
    if (p < 1 || p > totalPages || p === currentPage) return;
    if (onPageChange) {
      onPageChange(p);
    } else if (onButtonClick) {
      onButtonClick(p);
    }
  };

  const handlePrev = () => {
    if (currentPage <= 1) return;
    if (onDecrease) {
      onDecrease();
    } else {
      handlePage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage >= totalPages) return;
    if (onIncrease) {
      onIncrease();
    } else {
      handlePage(currentPage + 1);
    }
  };

  // Generate numbered pages array with ellipsis (e.g. 1 2 3 ... 10)
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [];
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      );
    } else {
      pages.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages
      );
    }
    return pages;
  };

  const startItem = totalItems
    ? (currentPage - 1) * pageSize + 1
    : null;
  const endItem = totalItems
    ? Math.min(currentPage * pageSize, Number(totalItems))
    : null;

  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-white border-t border-[#E5E9F0] text-xs select-none">
      {/* Total records indicator */}
      <div className="text-slate-600 font-medium">
        {totalItems ? (
          isRTL ? (
            <span>
              مجموعی <span className="font-bold text-primary">{totalItems}</span> میں سے{" "}
              <span className="font-bold text-slate-800">{startItem}</span> تا{" "}
              <span className="font-bold text-slate-800">{endItem}</span> ریکارڈز
            </span>
          ) : (
            <span>
              Showing <span className="font-bold text-slate-800">{startItem}</span> to{" "}
              <span className="font-bold text-slate-800">{endItem}</span> of{" "}
              <span className="font-bold text-primary">{totalItems}</span> items
            </span>
          )
        ) : (
          <span>
            {isRTL
              ? `صفحہ ${currentPage} از ${totalPages}`
              : `Page ${currentPage} of ${totalPages}`}
          </span>
        )}
      </div>

      {/* Page Buttons */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={handlePrev}
          className="px-3 py-1.5 rounded border border-gray-300 bg-white text-slate-700 font-bold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {isRTL ? "پچھلا" : "Previous"}
        </button>

        {getPageNumbers().map((pNum, idx) =>
          pNum === "..." ? (
            <span key={`dots-${idx}`} className="px-2 text-slate-400 font-bold">
              ...
            </span>
          ) : (
            <button
              key={pNum}
              type="button"
              onClick={() => handlePage(pNum)}
              className={`min-w-[32px] h-8 px-2 rounded text-xs font-bold border transition-all ${
                currentPage === pNum
                  ? "bg-primary border-primary text-white shadow-sm"
                  : "bg-white border-gray-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {pNum}
            </button>
          )
        )}

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={handleNext}
          className="px-3 py-1.5 rounded border border-gray-300 bg-white text-slate-700 font-bold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {isRTL ? "اگلا" : "Next"}
        </button>
      </div>
    </div>
  );
};

// Helper: truncate string to 50 chars with ellipsis
function truncateText(value, maxLength = 50) {
  if (typeof value !== "string") return value;
  if (value.length <= maxLength) return value;
  return value.slice(0, maxLength) + "…";
}

const Table = ({
  className = "",
  tableLayout = [],
  data = [],
  tableHeading = "",
  headingClassName = "text-lg font-semibold mb-2",
  tableClassName = "",
  trClassname = "",
  tableHeadClassName = "",
  inputPlaceholders = [],
  searchClassName = "",
  onSearchChange = () => {},
  searchPlaceholder = "",
  openedRow = [],
  Collapse,
  collapseAttribute = "id",
  children,
  noScrollBar = true,
  currentPage,
  page,
  totalPages,
  pages,
  totalItems,
  pageSize = 10,
  limit,
  onPageChange,
  onButtonClick,
  onDecrease,
  onIncrease,
  language = "ur",
  initialFilters = {},
  filterOptions = {},
  onFiltersChange = () => {},
  loadingTableContent = false,
  onRowClick,
  noRecordImage,
  noRecordImageClassName = "",
  noRecordText = "",
  noRecordTextClassName = "",
  additionalFilters = <></>,
  totalDataLabel = "",
  totalDataValue = "",
  isFilterMultiple = false,
  additionalButtons = <></>,
}) => {
  const [searchItem, setSearchItem] = useState("");
  const [internalPage, setInternalPage] = useState(1);

  const isServerPagination = Boolean(pages || totalPages);
  const activePageSize = limit || pageSize || 10;

  const calculatedTotalPages = isServerPagination
    ? (pages || totalPages || 1)
    : Math.ceil((data?.length || 0) / activePageSize);

  const activePage = isServerPagination
    ? (page || currentPage || 1)
    : internalPage;

  const activeTotalItems = totalItems || totalDataValue || data?.length || 0;

  const displayData = isServerPagination
    ? (data || [])
    : (data?.slice((activePage - 1) * activePageSize, activePage * activePageSize) || []);

  const handlePaginationChange = (p) => {
    if (!isServerPagination) {
      setInternalPage(p);
    }
    if (onPageChange) {
      onPageChange(p);
    } else if (onButtonClick) {
      onButtonClick(p);
    }
  };

  const handleDecrease = () => {
    const prev = Math.max(1, activePage - 1);
    if (!isServerPagination) {
      setInternalPage(prev);
    }
    if (onDecrease) onDecrease();
    else handlePaginationChange(prev);
  };

  const handleIncrease = () => {
    const next = Math.min(calculatedTotalPages, activePage + 1);
    if (!isServerPagination) {
      setInternalPage(next);
    }
    if (onIncrease) onIncrease();
    else handlePaginationChange(next);
  };

  function handleSearchChange(e) {
    setSearchItem(e.target.value);
  }

  function onCrossClick() {
    setSearchItem("");
    onSearchChange("");
  }

  function onSearchClick() {
    onSearchChange(searchItem.toLowerCase());
  }

  return (
    <div className={`relative ${className} font-sans antialiased`} dir={language === "ur" ? "rtl" : "ltr"}>
      {tableHeading && <h1 className={headingClassName}>{tableHeading}</h1>}
      {children}

      {/* Toolbar */}
      {(searchPlaceholder ||
        inputPlaceholders?.length > 0 ||
        (Object.keys(filterOptions)?.length > 0 && showfilter) ||
        totalDataLabel ||
        additionalButtons) && (
        <div className="flex flex-wrap items-center justify-between mb-3 gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {searchPlaceholder && (
              <Search
                id={searchPlaceholder.split(" ").join("-").toLowerCase()}
                name={searchPlaceholder.split(" ").join("-").toLowerCase()}
                className={`bg-white border border-[#E5E9F0] rounded-lg h-9 min-w-[240px] text-sm shadow-sm ${searchClassName}`}
                placeholder={searchPlaceholder}
                value={searchItem}
                onChange={handleSearchChange}
                onCrossClick={onCrossClick}
                onSearchClick={onSearchClick}
              />
            )}

            {inputPlaceholders?.map((placeholder, index) => (
              <Input
                id={placeholder?.split(" ")?.join("-")?.toLowerCase()}
                type="text"
                className="min-w-32"
                key={index}
                placeholder={placeholder}
              />
            ))}

            {Object.keys(filterOptions)?.length > 0 && showfilter && (
              <Filter
                filterOptions={filterOptions}
                onFiltersChange={onFiltersChange}
                initialFilters={initialFilters}
                isMultiple={isFilterMultiple}
              />
            )}

            {additionalFilters}
          </div>

          <div className="flex items-center gap-3">
            {totalDataLabel && (
              <div className="rounded-lg border border-[#E5E9F0] bg-[#F8FAFF] px-3 py-1.5 flex items-center gap-1.5 text-sm font-medium">
                <span className="text-[#6B7280]">{totalDataLabel}:</span>
                <span className="font-bold text-[#0064E0]">{totalDataValue}</span>
              </div>
            )}
            {additionalButtons && additionalButtons}
          </div>
        </div>
      )}

      {/* Table wrapper */}
      <div
        className={`overflow-auto scroll-smooth rounded-xl border border-[#E5E9F0] shadow-sm ${
          noScrollBar ? "no-scrollbar" : ""
        } ${tableClassName}`}
      >
        {loadingTableContent ? (
          <div className="flex items-center justify-center min-h-[250px] w-full bg-white">
            <BeatLoader />
          </div>
        ) : (
          <table className="min-w-full text-center">
            <thead
              className={`bg-[#000F52] border-b-2 border-[#3e8b8250] ${tableHeadClassName}`}
            >
              <tr>
                {tableLayout?.filter(Boolean)?.map((layout, index) => (
                  <th
                    key={index}
                    scope="col"
                    className={`px-4 py-3 text-xs font-bold uppercase tracking-widest text-white select-none whitespace-nowrap`}
                  >
                    {layout?.headData}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#F0F4F8]">
              {displayData?.length > 0 &&
                displayData?.map((dataItem, itemIndex) => {
                  const isOpen =
                    openedRow?.includes(dataItem) ||
                    openedRow?.some(
                      (row) =>
                        row?.[collapseAttribute] ===
                        dataItem?.[collapseAttribute]
                    );

                  return (
                    <Fragment key={itemIndex}>
                      <motion.tr
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: itemIndex * 0.025,
                          duration: 0.18,
                        }}
                        onClick={(e) => {
                          if (onRowClick) {
                            onRowClick(dataItem, itemIndex, e);
                          }
                        }}
                        className={`group border-b border-[#F0F4F8] transition-colors duration-150 ease-in-out hover:bg-[#F5F8FF] ${
                          onRowClick ? "cursor-pointer hover:bg-slate-100/80" : "cursor-default"
                        } ${
                          isOpen
                            ? "bg-[#F0F5FF] border-l-2 border-l-[#0064E0]"
                            : ""
                        } ${trClassname}`}
                      >
                        {tableLayout
                          ?.filter(Boolean)
                          ?.map((layout, layoutIndex) => {
                            const cellValue = layout?.bodyData(
                              dataItem,
                              itemIndex
                            );

                            const isPlainString = typeof cellValue === "string";
                            const displayValue = isPlainString
                              ? truncateText(cellValue)
                              : cellValue;
                            const tooltipTitle =
                              isPlainString && cellValue.length > 50
                                ? cellValue
                                : undefined;

                            return (
                              <td
                                key={layoutIndex}
                                className={`px-4 py-3.5 text-sm font-medium text-[#374151] whitespace-nowrap max-w-[260px] ${
                                  layout?.tdClassName ||
                                  "overflow-hidden text-ellipsis"
                                }`}
                                title={tooltipTitle}
                              >
                                {displayValue}
                              </td>
                            );
                          })}
                      </motion.tr>

                      <AnimatePresence>
                        {isOpen && Collapse && (
                          <tr>
                            <td
                              colSpan={tableLayout?.filter(Boolean)?.length}
                              className="p-0 border-l-2 border-l-[#0064E0]"
                            >
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.28, ease: "easeOut" }}
                                className="overflow-hidden"
                              >
                                <div className="p-5 bg-[#F8FAFF] border-t border-[#E5E9F0]">
                                  {Collapse(dataItem)}
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </AnimatePresence>
                    </Fragment>
                  );
                })}
            </tbody>
          </table>
        )}

        {/* Empty State */}
        {(!data || data.length === 0) && !loadingTableContent && (
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-white">
            <div className="w-16 h-16 rounded-2xl bg-[#F0F5FF] flex items-center justify-center mb-4">
              <span className="text-3xl opacity-50">📁</span>
            </div>
            <p
              className={`text-[#1A1F36] font-semibold text-sm ${noRecordTextClassName}`}
            >
              {noRecordText || "کوئی ریکارڈ نہیں ملا"}
            </p>
            <p className="text-[#9CA3AF] text-xs mt-1">
              براہ کرم تلاش یا فلٹر کی شرائط کو تبدیل کریں
            </p>
          </div>
        )}

        {/* Integrated Pagination inside the table wrapper */}
        {calculatedTotalPages > 1 && (
          <TablePagination
            currentPage={activePage}
            totalPages={calculatedTotalPages}
            totalItems={activeTotalItems}
            pageSize={activePageSize}
            onPageChange={handlePaginationChange}
            onButtonClick={handlePaginationChange}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            language={language}
          />
        )}
      </div>
    </div>
  );
};

Table.propTypes = {
  className: PropTypes.string,
  tableLayout: PropTypes.array,
  data: PropTypes.array,
  tableHeading: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  headingClassName: PropTypes.string,
  tableClassName: PropTypes.string,
  trClassname: PropTypes.string,
  border: PropTypes.string,
  tableHeadClassName: PropTypes.string,
  inputPlaceholders: PropTypes.array,
  searchClassName: PropTypes.string,
  searchPlaceholder: PropTypes.string,
  onSearchChange: PropTypes.func,
  openedRow: PropTypes.array,
  Collapse: PropTypes.func,
  collapseAttribute: PropTypes.string,
  noScrollBar: PropTypes.bool,
  children: PropTypes.node,
  currentPage: PropTypes.number,
  page: PropTypes.number,
  totalPages: PropTypes.number,
  pages: PropTypes.number,
  totalItems: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  pageSize: PropTypes.number,
  limit: PropTypes.number,
  onPageChange: PropTypes.func,
  onButtonClick: PropTypes.func,
  onDecrease: PropTypes.func,
  onIncrease: PropTypes.func,
  language: PropTypes.string,
  initialFilters: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  onFiltersChange: PropTypes.func,
  filterOptions: PropTypes.object,
  showfilter: PropTypes.bool,
  additionalFilters: PropTypes.node,
  loadingTableContent: PropTypes.bool,
  noRecordImage: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  noRecordImageClassName: PropTypes.string,
  noRecordText: PropTypes.string,
  noRecordTextClassName: PropTypes.string,
  totalDataLabel: PropTypes.string,
  totalDataValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isFilterMultiple: PropTypes.bool,
  additionalButtons: PropTypes.node,
};

export default memo(Table);
