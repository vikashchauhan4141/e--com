import React, { useState, useRef, useEffect } from 'react';
import { 
  IoCloudUploadOutline, 
  IoTrashOutline, 
  IoLinkOutline 
} from 'react-icons/io5';
import toast from 'react-hot-toast';

export const ImageUploadDropzone = ({ value, onChange, label = 'Collection Image' }) => {
  const [dragging, setDragging] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [preview, setPreview] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!value) {
      setPreview('');
      return;
    }
    if (typeof value === 'string') {
      setPreview(value);
      return;
    }
    if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [value]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = async (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files (PNG, JPG, WEBP, GIF) are allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be smaller than 5MB');
      return;
    }

    onChange(file);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2 text-left animate-fadeIn">
      <div className="flex items-center justify-between">
        <label className="text-[9px] font-bold tracking-widest text-secondary uppercase block">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setManualMode(!manualMode)}
          className="text-[8px] font-bold tracking-widest text-primary uppercase hover:underline flex items-center gap-1 focus:outline-none"
        >
          <IoLinkOutline size={12} />
          {manualMode ? 'Switch to Dropzone' : 'Direct URL Override'}
        </button>
      </div>

      {manualMode ? (
        <input
          type="text"
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-xs bg-surface-container px-3.5 py-2 rounded border border-outline focus:border-ink focus:outline-none transition-colors"
          placeholder="https://images.unsplash.com/... or Cloudinary URL"
        />
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border border-dashed rounded min-h-[140px] flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300 ${
            value ? 'border-outline-variant bg-surface-container-low/30' : 'hover:border-ink'
          } ${dragging ? 'border-primary bg-primary/5' : 'border-outline bg-surface-container-lowest/50'}`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*"
          />

          {value ? (
            <div className="relative group w-full flex flex-col items-center gap-3 animate-fadeIn">
              {/* Image thumbnail preview */}
              <div className="relative w-20 h-24 rounded border border-outline-variant bg-surface-container overflow-hidden shadow-sm">
                <img 
                  src={preview} 
                  alt="Thumbnail" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                
                {/* Trash overlay on hover */}
                <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="p-1.5 bg-error text-white rounded hover:bg-error-dark shadow transition-colors"
                  >
                    <IoTrashOutline size={14} />
                  </button>
                </div>
              </div>
              <div className="text-[8px] font-mono text-secondary truncate max-w-[280px]" title={typeof value === 'string' ? value : value.name}>
                {typeof value === 'string' ? value : value.name}
              </div>
              <span className="text-[8px] font-bold tracking-widest text-secondary uppercase group-hover:text-ink transition-colors">
                Drag a new file or click to replace
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 text-secondary hover:text-ink transition-colors duration-200">
              <div className="p-3 bg-surface-container-low rounded-full border border-outline-variant shadow-inner">
                <IoCloudUploadOutline size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-wider uppercase text-ink">
                  Drag & Drop Image Here
                </p>
                <p className="text-[9px] mt-1">
                  Supports PNG, JPG, WEBP, or GIF (max. 5MB)
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
