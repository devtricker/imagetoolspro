import { useState } from 'react';
import { motion } from 'framer-motion';
import JSZip from 'jszip';
import UploadZone from '../components/UploadZone';
import LoadingModal from '../components/LoadingModal';
import LoginRequired from '../components/LoginRequired';
import UpgradePrompt from '../components/UpgradePrompt';
import { convertImage } from '../utils/convert';
import { resizeImageByPercentage } from '../utils/resize';
import { compressImage } from '../utils/compress';
import { FolderOpen, Download, Trash2 } from 'lucide-react';
import { formatFileSize } from '../utils/compress';
import { useAuth } from '../context/AuthContext';
import { useUsage } from '../context/UsageContext';

const Batch = () => {
  const { user } = useAuth();
  const { canUseFeature, incrementUsage, getRemainingUsage } = useUsage();
  if (!user) return <LoginRequired />;
  const [files, setFiles] = useState([]);
  const [processedFiles, setProcessedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [operation, setOperation] = useState('compress'); // compress, resize, convert
  const [progress, setProgress] = useState(0);

  // Settings
  const [quality, setQuality] = useState(80);
  const [percentage, setPercentage] = useState(100);
  const [targetFormat, setTargetFormat] = useState('jpg');

  const handleFileSelect = (selectedFiles) => {
    setFiles(Array.isArray(selectedFiles) ? selectedFiles : [selectedFiles]);
    setProcessedFiles([]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    if (!canUseFeature('batch')) { setShowUpgradePrompt(true); return; }

    setLoading(true);
    setProgress(0);
    const processed = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        let result;

        switch (operation) {
          case 'compress':
            result = await compressImage(file, quality / 100);
            break;
          case 'resize':
            result = await resizeImageByPercentage(file, percentage);
            break;
          case 'convert':
            result = await convertImage(file, targetFormat);
            break;
          default:
            result = file;
        }

        processed.push(result);
        setProgress(((i + 1) / files.length) * 100);
      }

      setProcessedFiles(processed);
      await incrementUsage('batch');
    } catch (error) {
      alert('Batch processing failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadZip = async () => {
    if (processedFiles.length === 0) return;

    const zip = new JSZip();
    
    processedFiles.forEach((file, index) => {
      zip.file(file.name, file);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `processed-images-${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadSingle = (file) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const operations = [
    { value: 'compress', label: 'Compress' },
    { value: 'resize', label: 'Resize' },
    { value: 'convert', label: 'Convert' },
  ];

  const formats = ['jpg', 'png', 'webp', 'gif'];

  return (
    <div className="container mx-auto px-4 py-8">
      <LoadingModal 
        isOpen={loading} 
        message={`Processing images... ${Math.round(progress)}%`} 
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 space-y-4"
      >
        <div className="flex items-center justify-center space-x-3">
          <FolderOpen size={40} className="text-teal-600 dark:text-teal-400" />
          <h1 className="text-4xl md:text-5xl font-bold gradient-text">Batch Processing</h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Process multiple images at once and download them as a ZIP file
        </p>
      </motion.div>

      {/* Upload Section */}
      {files.length === 0 && <UploadZone onFileSelect={handleFileSelect} multiple={true} />}

      {/* File List and Controls */}
      {files.length > 0 && processedFiles.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Operation Selection */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4">Select Operation</h3>
            <div className="grid grid-cols-3 gap-4">
              {operations.map((op) => (
                <button
                  key={op.value}
                  onClick={() => setOperation(op.value)}
                  className={`p-4 rounded-xl font-semibold transition-all ${
                    operation === op.value
                      ? 'bg-teal-500 text-white shadow-lg scale-105'
                      : 'glass-card hover:scale-105'
                  }`}
                >
                  {op.label}
                </button>
              ))}
            </div>
          </div>

          {/* Operation Settings */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4">Settings</h3>
            
            {operation === 'compress' && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Quality: {quality}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            )}

            {operation === 'resize' && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Scale: {percentage}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="200"
                  value={percentage}
                  onChange={(e) => setPercentage(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            )}

            {operation === 'convert' && (
              <div>
                <label className="block text-sm font-medium mb-2">Target Format</label>
                <div className="grid grid-cols-4 gap-4">
                  {formats.map((format) => (
                    <button
                      key={format}
                      onClick={() => setTargetFormat(format)}
                      className={`p-3 rounded-lg font-semibold transition-all ${
                        targetFormat === format
                          ? 'bg-teal-500 text-white'
                          : 'glass-card hover:scale-105'
                      }`}
                    >
                      {format.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* File List */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Selected Files ({files.length})</h3>
              <button
                onClick={() => setFiles([])}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-teal-500"
              >
                Clear All
              </button>
            </div>
            <div className="space-y-2 max-h-96 overflow-auto">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between glass-card p-4"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-semibold truncate">{file.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-all"
                  >
                    <Trash2 size={20} className="text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button onClick={handleProcess} className="glass-button w-full">
            <div className="flex items-center justify-center space-x-2">
              <FolderOpen size={20} />
              <span>Process {files.length} Images</span>
            </div>
          </button>
        </motion.div>
      )}

      {/* Results */}
      {processedFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="glass-card p-6 bg-green-50 dark:bg-green-900/20">
            <h3 className="text-xl font-bold mb-2">Processing Complete!</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Successfully processed {processedFiles.length} images. Download them individually or
              as a ZIP file.
            </p>
          </div>

          {/* Processed Files List */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4">Processed Files</h3>
            <div className="space-y-2 max-h-96 overflow-auto">
              {processedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between glass-card p-4"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-semibold truncate">{file.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatFileSize(file.size)}
                        {files[index] && (
                          <span className="ml-2 text-green-600 dark:text-green-400">
                            ({((1 - file.size / files[index].size) * 100).toFixed(1)}% reduced)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadSingle(file)}
                    className="p-2 hover:bg-teal-100 dark:hover:bg-teal-900/20 rounded-lg transition-all"
                  >
                    <Download size={20} className="text-teal-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                setFiles([]);
                setProcessedFiles([]);
              }}
              className="flex-1 glass-card p-4 font-semibold hover:scale-105 transition-all"
            >
              Process More Images
            </button>
            <button onClick={handleDownloadZip} className="flex-1 glass-button">
              <div className="flex items-center justify-center space-x-2">
                <Download size={20} />
                <span>Download All as ZIP</span>
              </div>
            </button>
          </div>
        </motion.div>
      )}
      <UpgradePrompt isOpen={showUpgradePrompt} onClose={() => setShowUpgradePrompt(false)} feature="batch" remaining={getRemainingUsage('batch')} />
    </div>
  );
};

export default Batch;

