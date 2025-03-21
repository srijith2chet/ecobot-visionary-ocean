
import React, { useState, useRef } from 'react';
import { Upload, X, Image, FileVideo, AlertCircle } from 'lucide-react';
import { detectPlastics } from '@/services/detectionService';

interface UploadComponentProps {
  onDetectionComplete: (results: DetectionResult[], imageUrl: string) => void;
  onError: (error: string) => void;
}

const UploadComponent: React.FC<UploadComponentProps> = ({ onDetectionComplete, onError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      onError('Please upload an image file (JPEG, PNG, etc.)');
      return;
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      onError('File size exceeds 10MB limit');
      return;
    }

    setFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setFile(null);
    setImagePreview(null);
  };

  const handleDetect = async () => {
    if (!file) return;
    
    try {
      setIsUploading(true);
      
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);
      
      const results = await detectPlastics(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        onDetectionComplete(results, imagePreview as string);
      }, 500);
      
    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
      onError('Failed to process image. Please try again.');
      console.error('Detection error:', error);
    }
  };

  return (
    <div className="glass-panel p-6 w-full">
      <h2 className="text-xl font-semibold text-white mb-4">Upload Image for Analysis</h2>
      
      {!file ? (
        <div
          className={`border-2 border-dashed rounded-lg ${
            isDragging ? 'border-aqua bg-ocean-light/50' : 'border-white/20 hover:border-white/40'
          } transition-colors cursor-pointer p-8 text-center`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleUploadClick}
        >
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
            ref={fileInputRef}
          />
          <Upload className="w-12 h-12 text-aqua mx-auto mb-4" />
          <p className="text-white/90 mb-2">Drag and drop your image here</p>
          <p className="text-white/60 text-sm mb-4">or click to browse</p>
          <p className="text-white/40 text-xs">
            Supports JPG, PNG, WEBP • Max file size: 10MB
          </p>
        </div>
      ) : (
        <div className="relative">
          <div className="relative rounded-lg overflow-hidden bg-ocean-light/30 w-full aspect-video flex items-center justify-center">
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Upload preview"
                className="max-h-full max-w-full object-contain"
              />
            )}
            <button
              onClick={handleRemoveFile}
              className="absolute top-2 right-2 bg-ocean-dark/80 p-1.5 rounded-full text-white/80 hover:text-white hover:bg-ocean-dark transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center text-white/80">
                {file.type.includes('image') ? <Image className="w-4 h-4 mr-2" /> : <FileVideo className="w-4 h-4 mr-2" />}
                <span className="text-sm truncate max-w-[200px]">{file.name}</span>
              </div>
              <span className="text-white/60 text-xs">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>
            
            {isUploading ? (
              <div className="w-full bg-ocean-light/30 rounded-full h-2 mb-4">
                <div 
                  className="bg-aqua h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            ) : (
              <button
                onClick={handleDetect}
                className="button-primary w-full mt-2"
                disabled={isUploading}
              >
                Detect Plastics
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadComponent;
