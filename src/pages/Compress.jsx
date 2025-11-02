import { useState } from 'react';
import { motion } from 'framer-motion';
import UploadZone from '../components/UploadZone';
import ImagePreview from '../components/ImagePreview';
import LoadingModal from '../components/LoadingModal';
import LoginRequired from '../components/LoginRequired';
import UpgradePrompt from '../components/UpgradePrompt';
import { compressImage, compressToWebP } from '../utils/compress';
import { Minimize2, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUsage } from '../context/UsageContext';

const Compress = () => {
  const { user } = useAuth();
  const { canUseFeature, incrementUsage, getRemainingUsage } = useUsage();
  if (!user) return <LoginRequired />;
  
  const [originalFile, setOriginalFile] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [quality, setQuality] = useState(80);
  const [outputFormat, setOutputFormat] = useState('original'); // 'original' or 'webp'

  const handleFileSelect = (file) => {
    setOriginalFile(file);
    setCompressedFile(null);
  };

  const handleCompress = async () => {
    if (!originalFile) return;

    if (!canUseFeature('compress')) {
      setShowUpgradePrompt(true);
      return;
    }

    setLoading(true);
    try {
      let result;
      if (outputFormat === 'webp') {
        result = await compressToWebP(originalFile, quality / 100);
      } else {
        result = await compressImage(originalFile, quality / 100);
      }
      setCompressedFile(result);
      await incrementUsage('compress');
    } catch (error) {
      alert('Compression failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!compressedFile) return;

    const url = URL.createObjectURL(compressedFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = compressedFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getCompressionRatio = () => {
    if (!originalFile || !compressedFile) return 0;
    return ((1 - compressedFile.size / originalFile.size) * 100).toFixed(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <LoadingModal isOpen={loading} message="Compressing image..." />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 space-y-4"
      >
        <div className="flex items-center justify-center space-x-3">
          <Minimize2 size={40} className="text-green-600 dark:text-green-400" />
          <h1 className="text-4xl md:text-5xl font-bold gradient-text">Compress Image</h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Reduce image file size while maintaining quality with adjustable compression settings
        </p>
      </motion.div>

      {/* Upload Section */}
      {!originalFile && <UploadZone onFileSelect={handleFileSelect} />}

      {/* Compression Controls */}
      {originalFile && !compressedFile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Output Format */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4">Output Format</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setOutputFormat('original')}
                className={`p-4 rounded-xl font-semibold transition-all ${
                  outputFormat === 'original'
                    ? 'bg-green-500 text-white shadow-lg scale-105'
                    : 'glass-card hover:scale-105'
                }`}
              >
                Keep Original Format
              </button>
              <button
                onClick={() => setOutputFormat('webp')}
                className={`p-4 rounded-xl font-semibold transition-all ${
                  outputFormat === 'webp'
                    ? 'bg-green-500 text-white shadow-lg scale-105'
                    : 'glass-card hover:scale-105'
                }`}
              >
                Convert to WebP
              </button>
            </div>
            {outputFormat === 'webp' && (
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                WebP format provides superior compression and quality compared to JPG/PNG
              </p>
            )}
          </div>

          {/* Quality Slider */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4">Compression Quality</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Quality: {quality}%</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {quality < 50 ? 'Low' : quality < 80 ? 'Medium' : 'High'}
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Smaller Size</span>
                <span>Better Quality</span>
              </div>
              <div className="glass-card p-4 bg-blue-50 dark:bg-blue-900/20">
                <p className="text-sm">
                  <strong>Tip:</strong> Quality of 70-85% provides the best balance between file
                  size and visual quality for most images.
                </p>
              </div>
            </div>
          </div>

          {/* Original Image Preview */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Original Image</h3>
              <button
                onClick={() => {
                  setOriginalFile(null);
                  setCompressedFile(null);
                }}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-500"
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

          <button onClick={handleCompress} className="glass-button w-full">
            <div className="flex items-center justify-center space-x-2">
              <Minimize2 size={20} />
              <span>Compress Image</span>
            </div>
          </button>
        </motion.div>
      )}

      {/* Result Section */}
      {compressedFile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <ImagePreview
            file={compressedFile}
            originalFile={originalFile}
            onDownload={handleDownload}
            title="Compression Complete!"
          />

          {/* Compression Stats */}
          <div className="glass-card p-6 bg-green-50 dark:bg-green-900/20">
            <h3 className="text-xl font-bold mb-4">Compression Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Original Size</p>
                <p className="text-2xl font-bold">{(originalFile.size / 1024).toFixed(2)} KB</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Compressed Size</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {(compressedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Size Reduced</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {getCompressionRatio()}%
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                setOriginalFile(null);
                setCompressedFile(null);
              }}
              className="flex-1 glass-card p-4 font-semibold hover:scale-105 transition-all"
            >
              Compress Another
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
        <h3 className="text-xl font-bold mb-4">About Image Compression</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <p className="font-semibold mb-2">When to compress:</p>
            <ul className="space-y-1">
              <li>• Uploading to websites</li>
              <li>• Sending via email</li>
              <li>• Sharing on social media</li>
              <li>• Reducing storage usage</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-2">Quality guidelines:</p>
            <ul className="space-y-1">
              <li>• 90-100%: Professional/Print</li>
              <li>• 80-90%: High quality web</li>
              <li>• 70-80%: Standard web</li>
              <li>• Below 70%: Small previews</li>
            </ul>
          </div>
        </div>
      </motion.div>
      
      <UpgradePrompt 
        isOpen={showUpgradePrompt}
        onClose={() => setShowUpgradePrompt(false)}
        feature="compress"
        remaining={getRemainingUsage('compress')}
      />
    </div>
  );
};

export default Compress;

