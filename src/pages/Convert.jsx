import { useState } from 'react';
import { motion } from 'framer-motion';
import UploadZone from '../components/UploadZone';
import ImagePreview from '../components/ImagePreview';
import LoadingModal from '../components/LoadingModal';
import LoginRequired from '../components/LoginRequired';
import UpgradePrompt from '../components/UpgradePrompt';
import { convertImage, imageToPDF } from '../utils/convert';
import { RefreshCw, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUsage } from '../context/UsageContext';
import { NativeBannerAd } from '../components/ads';

const Convert = () => {
  const { user } = useAuth();
  const { canUseFeature, incrementUsage, getRemainingUsage } = useUsage();
  
  // If not logged in, show login required screen
  if (!user) {
    return <LoginRequired />;
  }
  
  const [originalFile, setOriginalFile] = useState(null);
  const [convertedFile, setConvertedFile] = useState(null);
  const [targetFormat, setTargetFormat] = useState('png');
  const [loading, setLoading] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  const formats = [
    { value: 'jpg', label: 'JPG' },
    { value: 'png', label: 'PNG' },
    { value: 'webp', label: 'WEBP' },
    { value: 'gif', label: 'GIF' },
    { value: 'bmp', label: 'BMP' },
    { value: 'pdf', label: 'PDF' },
  ];

  const handleFileSelect = (file) => {
    setOriginalFile(file);
    setConvertedFile(null);
  };

  const handleConvert = async () => {
    if (!originalFile) return;

    // Check if user can use this feature
    if (!canUseFeature('convert')) {
      const remaining = getRemainingUsage('convert');
      setShowUpgradePrompt(true);
      return;
    }

    setLoading(true);
    try {
      let result;
      if (targetFormat === 'pdf') {
        result = await imageToPDF(originalFile);
      } else {
        result = await convertImage(originalFile, targetFormat);
      }
      setConvertedFile(result);
      
      // Increment usage after successful conversion
      await incrementUsage('convert');
    } catch (error) {
      alert('Conversion failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!convertedFile) return;

    const url = URL.createObjectURL(convertedFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = convertedFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <LoadingModal isOpen={loading} message="Converting image..." />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 space-y-4"
      >
        <div className="flex items-center justify-center space-x-3">
          <RefreshCw size={40} className="text-primary-600 dark:text-primary-400" />
          <h1 className="text-4xl md:text-5xl font-bold gradient-text">Image Converter</h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Convert your images between different formats: JPG, PNG, WEBP, GIF, BMP, and PDF
        </p>
      </motion.div>

      {/* Upload Section */}
      {!originalFile && <UploadZone onFileSelect={handleFileSelect} />}

      {/* Native Banner Ad */}
      <NativeBannerAd />

      {/* Conversion Controls */}
      {originalFile && !convertedFile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4">Select Target Format</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {formats.map((format) => (
                <button
                  key={format.value}
                  onClick={() => setTargetFormat(format.value)}
                  className={`p-4 rounded-xl font-semibold transition-all ${
                    targetFormat === format.value
                      ? 'bg-primary-500 text-white shadow-lg scale-105'
                      : 'glass-card hover:scale-105'
                  }`}
                >
                  {format.label}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Original Image</h3>
              <button
                onClick={() => {
                  setOriginalFile(null);
                  setConvertedFile(null);
                }}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500"
              >
                Change Image
              </button>
            </div>
            <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img
                src={URL.createObjectURL(originalFile)}
                alt="Original"
                className="w-full h-auto max-h-96 object-contain"
              />
            </div>
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              <p>File: {originalFile.name}</p>
              <p>Type: {originalFile.type}</p>
              <p>Size: {(originalFile.size / 1024).toFixed(2)} KB</p>
            </div>
          </div>

          <button onClick={handleConvert} className="glass-button w-full">
            <div className="flex items-center justify-center space-x-2">
              <RefreshCw size={20} />
              <span>Convert to {targetFormat.toUpperCase()}</span>
            </div>
          </button>
        </motion.div>
      )}

      {/* Result Section */}
      {convertedFile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <ImagePreview
            file={convertedFile}
            originalFile={originalFile}
            onDownload={handleDownload}
            title="Conversion Complete!"
          />

          <div className="flex gap-4">
            <button
              onClick={() => {
                setOriginalFile(null);
                setConvertedFile(null);
              }}
              className="flex-1 glass-card p-4 font-semibold hover:scale-105 transition-all"
            >
              Convert Another
            </button>
            <button onClick={handleDownload} className="flex-1 glass-button">
              <div className="flex items-center justify-center space-x-2">
                <Download size={20} />
                <span>Download</span>
              </div>
            </button>
          </div>
        </motion.div>
      )}

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-12 glass-card p-6"
      >
        <h3 className="text-xl font-bold mb-4">Supported Conversions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <p className="font-semibold mb-2">Image Formats:</p>
            <ul className="space-y-1">
              <li>• JPG ↔ PNG</li>
              <li>• WEBP ↔ JPG/PNG</li>
              <li>• GIF ↔ JPG/PNG</li>
              <li>• BMP ↔ JPG/PNG</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-2">Document Formats:</p>
            <ul className="space-y-1">
              <li>• Image → PDF</li>
              <li>• Maintains image quality</li>
              <li>• Automatic page sizing</li>
            </ul>
          </div>
        </div>
      </motion.div>
      
      {/* Upgrade Prompt */}
      <UpgradePrompt 
        isOpen={showUpgradePrompt}
        onClose={() => setShowUpgradePrompt(false)}
        feature="convert"
        remaining={getRemainingUsage('convert')}
      />
    </div>
  );
};

export default Convert;

