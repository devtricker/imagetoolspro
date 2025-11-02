import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, X, FileImage, HardDrive } from 'lucide-react';
import { formatFileSize } from '../utils/compress';

const ImagePreview = ({ file, originalFile, onDownload, onClose, title = 'Preview' }) => {
  const [previewUrl, setPreviewUrl] = useState('');
  const [originalUrl, setOriginalUrl] = useState('');

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  useEffect(() => {
    if (originalFile) {
      const url = URL.createObjectURL(originalFile);
      setOriginalUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [originalFile]);

  if (!file) return null;

  const showComparison = originalFile && originalUrl;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="glass-card p-6 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">{title}</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition-all"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Image Comparison */}
      <div className={`grid ${showComparison ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-4`}>
        {showComparison && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Original</p>
            <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img
                src={originalUrl}
                alt="Original"
                className="w-full h-auto max-h-96 object-contain"
              />
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <FileImage size={16} />
                <span>{originalFile.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <HardDrive size={16} />
                <span>{formatFileSize(originalFile.size)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {showComparison && (
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Processed</p>
          )}
          <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-auto max-h-96 object-contain"
            />
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <FileImage size={16} />
              <span>{file.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <HardDrive size={16} />
              <span>{formatFileSize(file.size)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Size Comparison */}
      {showComparison && (
        <div className="glass-card p-4 bg-primary-50 dark:bg-primary-900/20">
          <div className="flex items-center justify-between">
            <span className="font-medium">Size Reduction:</span>
            <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
              {((1 - file.size / originalFile.size) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      )}

      {/* Download Button */}
      {onDownload && (
        <button onClick={onDownload} className="glass-button w-full">
          <div className="flex items-center justify-center space-x-2">
            <Download size={20} />
            <span>Download Image</span>
          </div>
        </button>
      )}
    </motion.div>
  );
};

export default ImagePreview;

