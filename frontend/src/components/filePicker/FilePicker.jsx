import React from "react";
import { PickerOverlay } from "filestack-react";
import toast from "react-hot-toast";
import PropTypes from "prop-types";
const API_KEY = "A3XexdOlySo6jI2Az7dUwz";
export default function FilePicker({ setShowPicker, setMyFiles }) {
  return (
    <PickerOverlay
      apikey={API_KEY}
      onUploadDone={(res) => {
        setShowPicker(false);
        let myFiles = JSON.parse(localStorage.getItem("myFiles"));
        myFiles = [...res.filesUploaded, myFiles];
        localStorage.setItem("myFiles", JSON.stringify(myFiles));
        setMyFiles(myFiles);
        toast.success("File uploaded successfully");
      }}
      onError={() => {
        toast.error("Error uploading file");
      }}
      pickerOptions={{
        accept: ["image/*", ".pdf"],
        onClose: () => {
          setShowPicker(false);
        },
      }}
    ></PickerOverlay>
  );
}

FilePicker.propTypes = {
  setShowPicker: PropTypes.func.isRequired,
  setMyFiles: PropTypes.func.isRequired,
};
