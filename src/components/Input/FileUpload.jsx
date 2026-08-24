import PropTypes from "prop-types";
import { forwardRef, memo, useEffect, useState } from "react";

import { FaEye, FaTimes, FaUpload } from "react-icons/fa";

import { getFile } from "../../services";

import { ScreeningChecklist } from "../../pages/ProposalsBidding/components";

import { fileAttachment02, fileAttachment02Gray } from "../../assets";

import { EodLoader, Modal } from "..";

import { ErrorMessage, Label } from ".";

const FileUpload = forwardRef(
  (
    {
      type = "file",
      accept,
      border = "p-2 border border-slate-300 hover:border-slate-400 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary rounded-md outline-none transition-colors",
      className = "",
      iconClassName = "",
      id = "",
      name = "",
      label,
      helpText = "",
      title = "",
      placeholder = "",
      textClassName = "",
      leftImage = fileAttachment02Gray,
      leftImageClassName = "size-5",
      isUploadButtonShown = false,
      isViewButtonShown = true,
      required = false,
      fileUrl = "",
      fileName = "",
      filePath = "",
      errorMessage = "",
      onChange = () => {},
      onUploadFileClick = () => {},
      onRemoveFileClick = () => {},
      disabled = false,
      readOnly = false,
      viewChecklist,
      bid,
      resourceId,
      showButton = "",
      sizeInMB = 2,
      iconOnly = false,
    },
    ref
  ) => {
    const borderClassname = errorMessage ? `${border} border-red-500` : border;

    const [showPreview, setShowPreview] = useState(false);
    const [url, setUrl] = useState("");
    const [isShowChecklist, setIsShowChecklist] = useState(false);
    const [isFileUploading, setIsFileUploading] = useState(false);
    const [fileError, setFileError] = useState("");
    const [isFileLoading, setIsFileLoading] = useState(false);

    useEffect(() => {
      typeof fileUrl === "object"
        ? fileUrl?.then((url) => setUrl(url))
        : setUrl(fileUrl);
    }, [fileUrl]);

    function onFileChange(e) {
      if (e?.target?.files?.length === 0) return;

      const file = e?.target?.files?.[0];
      const allowedSizeInByte = sizeInMB * 1024 * 1024;

      const acceptedFiles = accept?.includes("image/*")
        ? ".png,.jpg,.jpeg"
        : accept;
      const allowedFileType = acceptedFiles
        ? acceptedFiles?.split(",").map((type) => type.trim())
        : [];
      const isAllowed = allowedFileType?.some((ext) =>
        file?.name?.toLowerCase().endsWith(ext)
      );

      if (acceptedFiles && !isAllowed) {
        onRemoveFileClick();
        return setFileError("Unsupported file type");
      }

      if (file?.size > allowedSizeInByte) {
        onRemoveFileClick();
        return setFileError(`Please upload file within ${sizeInMB} MB size`);
      }

      setFileError("");
      onChange(e);
    }

    function onRemoveClick(e) {
      e.preventDefault();
      setFileError("");
      onRemoveFileClick();
      e.target.value = "";
    }

    function onPreviewClick(e) {
      e.preventDefault();

      if (filePath && url === "") {
        setIsFileLoading(true);
        getFile({ path: filePath })
          .then((url) => setUrl(url))
          .finally(() => setIsFileLoading(false));
      }

      setShowPreview(true);
    }

    async function onUploadClick(e) {
      e.preventDefault();

      if (isFileUploading) return;

      setIsFileUploading(true);
      try {
        await onUploadFileClick();
      } finally {
        setIsFileUploading(false);
      }
    }

    return (
      <>
        {iconOnly && (
          <button
            onClick={onPreviewClick}
            title={fileName || "View"}
            className={`p-2 rounded-full bg-white theme-hover-bg-secondary border border-gray-300 theme-hover-border-accent shadow-sm transition-all duration-200 ${iconClassName}`}
          >
            <img src={fileAttachment02} alt="" className="w-5 h-5 min-w-5" />
          </button>
        )}

        {!iconOnly && (
          <div
            className={`${
              label || errorMessage ? "space-y-1" : ""
            } ${className}`}
            ref={ref}
          >
            <Label
              id={id}
              label={label}
              helpText={helpText}
              required={required}
              readOnly={readOnly}
            />

            <div
              className={`flex items-center gap-2 text-left ${
                readOnly ? "bg-gray-50" : ""
              }`}
            >
              <label
                className={`relative w-full flex items-center justify-between gap-2 ${borderClassname}`}
              >
                <span
                  className={`flex items-center gap-2 truncate ${
                    !isViewButtonShown
                      ? "cursor-pointer theme-hover-text-accent"
                      : ""
                  } ${textClassName}`}
                  title={fileName ? fileName : ""}
                  onClick={!isViewButtonShown ? onPreviewClick : () => {}}
                >
                  {leftImage && (
                    <img
                      src={leftImage}
                      alt=""
                      className={leftImageClassName}
                    />
                  )}
                  {readOnly
                    ? fileName || "Not specified"
                    : fileName || placeholder}
                </span>

                <input
                  type={type}
                  accept={accept}
                  className="hidden"
                  id={id}
                  name={name}
                  title={title}
                  onChange={onFileChange}
                  disabled={disabled}
                  readOnly={readOnly}
                />

                {(fileName || showButton) && (
                  <div className="flex items-center gap-1">
                    {(!disabled || showButton === "remove") && (
                      <FaTimes
                        onClick={onRemoveClick}
                        className="p-0.5 size-5 cursor-pointer text-red-500 hover:scale-110"
                        title="Remove"
                      />
                    )}

                    {(isUploadButtonShown || showButton === "upload") && (
                      <FaUpload
                        onClick={onUploadClick}
                        className={`p-0.5 size-4 cursor-pointer hover:hover:scale-110 ${
                          isFileUploading ? "text-gray-400" : "text-info"
                        }`}
                        title="Upload"
                      />
                    )}

                    {fileName && isViewButtonShown && (
                      <FaEye
                        className="p-0.5 size-5 cursor-pointer text-infoDark hover:scale-110"
                        onClick={onPreviewClick}
                        title="View"
                      />
                    )}
                  </div>
                )}
              </label>
            </div>

            <ErrorMessage error={fileError || errorMessage} />
          </div>
        )}

        {showPreview && (
          <Modal
            childClassName="h-[60vh] w-[70vw] flex"
            zIndex="z-20"
            className="popup-zoom h-full"
            topText="File details"
            onMinimizeClick={() => setShowPreview(false)}
            {...(viewChecklist === true
              ? {
                  rightBtnName: !isShowChecklist
                    ? "Show checklist"
                    : "Hide checklist",
                  rightBtnClassName: "min-w-max",
                  onRightBtnClick: () => setIsShowChecklist(!isShowChecklist),
                }
              : {})}
          >
            {isFileLoading ? (
              <EodLoader loaderText="Fetching file" componentEmbedded />
            ) : fileName?.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? (
              <img
                src={url}
                alt={fileName || "preview"}
                className={`object-contain h-full ${
                  isShowChecklist ? "w-2/3" : "w-full"
                } transition-all duration-200 ease-in-out`}
              />
            ) : (
              <iframe
                src={url}
                className={`h-full ${
                  isShowChecklist ? "w-2/3" : "w-full"
                } transition-all duration-200 ease-in-out}`}
              />
            )}

            {isShowChecklist &&
              bid?.details?.resources?.find((r) => r.resourceId === resourceId)
                ?.resourceStatus === "PENDING" && (
                <ScreeningChecklist
                  className="w-1/3"
                  onClose={() => setIsShowChecklist(false)}
                  bid={bid}
                  resourceId={resourceId}
                />
              )}
          </Modal>
        )}
      </>
    );
  }
);
FileUpload.displayName = "FileUpload";

FileUpload.propTypes = {
  type: PropTypes.string,
  accept: PropTypes.string,
  border: PropTypes.string,
  className: PropTypes.string,
  iconClassName: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  helpText: PropTypes.string,
  title: PropTypes.string,
  placeholder: PropTypes.string,
  textClassName: PropTypes.string,
  leftImage: PropTypes.string,
  leftImageClassName: PropTypes.string,
  isUploadButtonShown: PropTypes.bool,
  isViewButtonShown: PropTypes.bool,
  required: PropTypes.bool,
  fileUrl: PropTypes.any,
  filePath: PropTypes.string,
  fileName: PropTypes.string,
  errorMessage: PropTypes.string,
  onChange: PropTypes.func,
  onRemoveFileClick: PropTypes.func,
  onUploadFileClick: PropTypes.func,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  viewChecklist: PropTypes.bool,
  bid: PropTypes.object,
  resourceId: PropTypes.string,
  showButton: PropTypes.string,
  sizeInMB: PropTypes.number,
  iconOnly: PropTypes.bool,
};

export default memo(FileUpload);
