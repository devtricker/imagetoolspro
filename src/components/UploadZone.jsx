import { useCallback } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const UploadZone = ({ onFileSelect, accept = 'image/*', multiple = false }) => {
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      if (multiple) {
        onFileSelect(files);
      } else {
        onFileSelect(files[0]);
      }
    },
    [onFileSelect, multiple]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    if (multiple) {
      onFileSelect(files);
    } else {
      onFileSelect(files[0]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8"
    >
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-primary-300 dark:border-primary-700 rounded-xl p-12 text-center hover:border-primary-500 transition-all cursor-pointer group"
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-primary-100 dark:bg-primary-900/30 rounded-full group-hover:scale-110 transition-transform">
              <Upload size={48} className="text-primary-600 dark:text-primary-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">
                Drop your {multiple ? 'images' : 'image'} here
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                or click to browse from your device
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-500">
              <ImageIcon size={16} />
              <span>Supports: JPG, PNG, WEBP, GIF, BMP</span>
            </div>
          </div>
        </label>
      </div>
    </motion.div>
  );
};

export default UploadZone;

