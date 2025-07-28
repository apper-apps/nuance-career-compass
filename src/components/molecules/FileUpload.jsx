import { useState, useRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const FileUpload = ({ onFileSelect, accept = ".pdf,.doc,.docx", maxSize = 5 * 1024 * 1024 }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.size > maxSize) {
      alert("File size too large. Please select a file smaller than 5MB.");
      return;
    }
    
    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer",
          isDragOver ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary hover:bg-gray-50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-full p-4 mb-4">
            <ApperIcon name="Upload" className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Drop your resume here
          </h3>
          <p className="text-gray-500 mb-4">
            or click to browse files
          </p>
          <Button variant="outline" size="sm">
            Choose File
          </Button>
          <p className="text-xs text-gray-400 mt-2">
            PDF, DOC, DOCX up to 5MB
          </p>
        </div>
      </div>

      {selectedFile && (
        <div className="bg-gradient-to-r from-accent/5 to-accent/10 border border-accent/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ApperIcon name="FileText" className="w-5 h-5 text-accent mr-3" />
              <div>
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedFile(null);
                onFileSelect(null);
              }}
              icon="X"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;