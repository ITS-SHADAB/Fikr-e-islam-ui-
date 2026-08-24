import PropTypes from "prop-types";
import { memo, useState } from "react";

import { edit05, uploadCloud01White } from "../../assets";

import { Button } from "..";

const ImageInput = ({
  className = "",
  id = "",
  imageClassName = "",
  name = "",
  type = "file",
  accept = ".jpg,.jpeg,.png",
  multiple = false,
  onChange,
  onImageUploadClick,
  image = "",
  errorMessage,
  disabled = false,
  readOnly = false,
}) => {
  const [isSubmitClicked, setIsSubmitClicked] = useState(true);
  // const [showTextFor, setShowTextFor] = useState("");

  return (
    <div className={`inline-block ${className}`}>
      <div
        className={`relative size-36 rounded-full flex items-center justify-center group ${
          image?.includes("svg") ? "border border-dashed border-primary" : ""
        }`}
      >
        <img
          src={image}
          className={`${imageClassName} ${
            image?.includes("svg")
              ? "size-14"
              : "size-36 rounded-full shadow-lg"
          }`}
        />

        {image?.includes("svg") && !readOnly ? (
          <label
            htmlFor={id}
            className="absolute bottom-[30px] right-3 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer border border-white z-10 translate-x-1/2 translate-y-1/2"
            onClick={() => setIsSubmitClicked(false)}
          >
            +
          </label>
        ) : (
          !readOnly && (
            <div className="flex items-center justify-between">
              <>
                <label
                  htmlFor={id}
                  className="absolute bottom-8 -left-6 size-8 bg-white rounded-full flex items-center justify-center cursor-pointer z-10 border border-white translate-x-1/2 translate-y-1/2"
                  onClick={() => setIsSubmitClicked(false)}
                  // onMouseEnter={() => setShowTextFor("edit")}
                  // onMouseLeave={() => setShowTextFor("")}
                >
                  <img src={edit05} alt="" title="Add new image" />
                </label>
                {/* {showTextFor === "edit" && (
                  <Button
                    className="h-8 w-24 absolute bottom-8 -left-10 size-8 translate-x-1/2 translate-y-1/2"
                    bgColor="bg-white"
                    name="Change "
                    title="Upload image"
                  />
                )} */}
              </>

              {/* {!isSubmitClicked && (
                <>
                  <img
                    src={uploadCloud01White}
                    // htmlFor={id}
                    title="Upload image"
                    className="p-1 absolute bottom-8 right-3 size-8 rounded-full flex items-center justify-center cursor-pointer bg-primary border z-10 translate-x-1/2 translate-y-1/2 transition-all duration-300"
                    onClick={() => {
                      onImageUploadClick();
                      setIsSubmitClicked(true);
                    }}
                    onMouseEnter={() => setShowTextFor("submit")}
                    onMouseLeave={() => setShowTextFor("")}
                  />
                  {showTextFor === "submit" && (
                    <Button
                      className="h-8 w-24 absolute bottom-8 -right-8 translate-x-1/2 translate-y-1/2 transition-all duration-300"
                      name="Upload"
                      title="Upload image"
                      onClick={() => {
                        onImageUploadClick();
                        setIsSubmitClicked(true);
                      }}
                    />
                  )}
                </>
              )} */}

              {!isSubmitClicked && !image.includes("user02Green") && (
                <Button
                  className="h-8 w-24 absolute bottom-6 -right-8 translate-x-1/2 translate-y-1/2"
                  name="Upload"
                  title="Upload image"
                  leftImg={uploadCloud01White}
                  onClick={() => {
                    onImageUploadClick();
                    setIsSubmitClicked(true);
                  }}
                />
              )}
            </div>
          )
        )}
      </div>

      <input
        id={id}
        name={name}
        type={type}
        accept={accept}
        multiple={multiple}
        autoComplete="off"
        className="hidden"
        onChange={onChange}
        disabled={disabled}
        readOnly={readOnly}
      />
      {errorMessage && (
        <span className="text-red-500 mt-1">{errorMessage}</span>
      )}
    </div>
  );
};

ImageInput.propTypes = {
  className: PropTypes.string,
  imageClassName: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  accept: PropTypes.string,
  multiple: PropTypes.bool,
  onChange: PropTypes.func,
  onImageUploadClick: PropTypes.func,
  image: PropTypes.string,
  errorMessage: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
};

export default memo(ImageInput);

// import { useState, useEffect } from "react";
// import PropTypes from "prop-types";
// import { Button } from "../Button";
// import { user02Green } from "../../assets";

// const ImageInput = ({
//   className = "",
//   id = "",
//   name = "",
//   type = "file",
//   accept = "image/*",
//   multiple = false,
//   onChange,
//   errorMessage,
//   disabled = false,
//   readOnly = false,
// }) => {
//   const [image, setImage] = useState("");
//   const [previewImage, setPreviewImage] = useState("");
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
//   const [isNewUpload, setIsNewUpload] = useState(false); // New state

//   // Freeze background when any popup is open
//   useEffect(() => {
//     if (isPopupOpen || isConfirmationOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "";
//     }
//   }, [isPopupOpen, isConfirmationOpen]);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         setPreviewImage(reader.result);
//         setIsPopupOpen(true);
//         setIsNewUpload(true); // Mark as new upload
//         onChange && onChange(e);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleEditImage = () => {
//     setIsPopupOpen(true);
//     setIsNewUpload(false); // Mark as editing existing image
//   };

//   const handleUploadImage = () => {
//     setImage(previewImage);
//     setPreviewImage("");
//     setIsPopupOpen(false);
//     setIsNewUpload(false); // Reset to default
//   };

//   const handleClosePopup = () => {
//     setPreviewImage("");
//     setIsPopupOpen(false);
//     setIsNewUpload(false); // Reset to default
//   };

//   const handleDeleteImage = () => {
//     setIsConfirmationOpen(true);
//   };

//   const confirmDiscard = () => {
//     setPreviewImage("");
//     setImage("");
//     setIsPopupOpen(false); // Close the main popup
//     setIsConfirmationOpen(false); // Close the confirmation popup
//   };

//   const cancelDiscard = () => {
//     setIsConfirmationOpen(false); // Only close the confirmation popup
//   };

//   return (
//     <div className={`inline-block ${className}`}>
//       <div
//         className={`relative w-32 h-32 rounded-full flex items-center justify-center group ${
//           image
//             ? "border border-gray-300 cursor-pointer" // Solid border when image is displayed
//             : "border-2 border-dashed border-gray-300" // Dashed border when no image
//         }`}
//         onClick={() => image && handleEditImage()}
//       >
//         {image ? (
//           <>
//             <img
//               className="w-full h-full object-cover rounded-full group-hover:opacity-50 transition-opacity"
//               src={image}
//               alt="Uploaded image"
//             />
//             <div className="absolute inset-0 flex items-center justify-center text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
//               Edit
//             </div>
//           </>
//         ) : (
//           <img src={user02Green} alt="Upload" className="size-14" />
//         )}

//         {!image && !isPopupOpen && (
//           <label
//             htmlFor={id}
//             className="absolute bottom-[30px] right-[5px] w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer border border-white z-10 translate-x-1/2 translate-y-1/2"
//           >
//             +
//           </label>
//         )}
//       </div>

//       {/* <label htmlFor={id} className="inline-block">
//         {image && (
//           <img
//             className="w-32 h-32 cursor-pointer rounded-full"
//             title={title}
//             src={image}
//             alt=""
//           />
//         )}
//       </label> */}
//       <input
//         id={id}
//         name={name}
//         type={type}
//         accept={accept}
//         multiple={multiple}
//         autoComplete="off"
//         className="hidden"
//         onChange={handleImageChange}
//         disabled={disabled}
//         readOnly={readOnly}
//       />

//       {errorMessage && (
//         <span className="text-red-500 mt-1">{errorMessage}</span>
//       )}

//       {isPopupOpen && (
//         <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-auto popup-zoom">
//           <div className="bg-white p-4 rounded shadow-lg w-1/3 relative">
//             {previewImage && (
//               <img
//                 className="w-full h-auto mb-4"
//                 src={previewImage}
//                 alt="Preview"
//               />
//             )}
//             {image && !previewImage && (
//               <img
//                 className="w-full h-auto mb-4 rounded-lg"
//                 src={image}
//                 alt="Full View"
//               />
//             )}
//             <div className="flex justify-between">
//               {previewImage ? (
//                 <Button name="Upload" onClick={handleUploadImage} />
//               ) : (
//                 <Button
//                   name="Change image"
//                   onClick={() => document.getElementById(id).click()}
//                 />
//               )}
//               <button
//                 className="flex items-center justify-center text-sm text-primary rounded-lg p-2 border border-primary hover:bg-gray-50"
//                 onClick={isNewUpload ? handleClosePopup : handleDeleteImage} // Conditional behavior
//               >
//                 {isNewUpload ? "Close" : "Delete image"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {isConfirmationOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-60">
//           <div className="bg-white p-4 rounded shadow-lg w-1/3">
//             <p className="text-center text-lg mb-4">
//               Are you sure you want to delete the image?
//             </p>
//             <div className="flex justify-around">
//               <Button name="Keep" onClick={cancelDiscard} />
//               <button
//                 className="flex items-center justify-center text-sm text-primary rounded-lg p-2 border border-primary hover:bg-gray-50"
//                 onClick={confirmDiscard}
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// ImageInput.propTypes = {
//   className: PropTypes.string,
//   id: PropTypes.string,
//   name: PropTypes.string,
//   type: PropTypes.string,
//   title: PropTypes.string,
//   accept: PropTypes.string,
//   multiple: PropTypes.bool,
//   onChange: PropTypes.func,
//   errorMessage: PropTypes.string,
//   disabled: PropTypes.bool,
//   readOnly: PropTypes.bool,
// };

// export default ImageInput;
