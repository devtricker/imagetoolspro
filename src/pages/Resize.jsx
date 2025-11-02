import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import UploadZone from '../components/UploadZone';
import ImagePreview from '../components/ImagePreview';
import LoadingModal from '../components/LoadingModal';
import LoginRequired from '../components/LoginRequired';
import UpgradePrompt from '../components/UpgradePrompt';
import { resizeImage, resizeImageByPercentage, getImageDimensions } from '../utils/resize';
import { Maximize2, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUsage } from '../context/UsageContext';

const Resize = () => {
  const { user } = useAuth();
  const { canUseFeature, incrementUsage, getRemainingUsage } = useUsage();
  if (!user) return <LoginRequired />;
  
  const [originalFile, setOriginalFile] = useState(null);
  const [resizedFile, setResizedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [resizeMode, setResizeMode] = useState('pixels'); // 'pixels' or 'percentage'
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [percentage, setPercentage] = useState(100);
  const [maintainAspect, setMaintainAspect] = useState(true);

  useEffect(() => {
    if (originalFile) {
      getImageDimensions(originalFile).then((dims) => {
        setDimensions(dims);
        setWidth(dims.width);
        setHeight(dims.height);
      });
    }
  }, [originalFile]);

  const handleFileSelect = (file) => {
    setOriginalFile(file);
    setResizedFile(null);
  };

  const handleResize = async () => {
    if (!originalFile) return;

    // Check usage limit
    if (!canUseFeature('resize')) {
      setShowUpgradePrompt(true);
      return;
    }

    setLoading(true);
    try {
      let result;
      if (resizeMode === 'pixels') {
        result = await resizeImage(
          originalFile,
          parseInt(width) || dimensions.width,
          parseInt(height) || dimensions.height,
          maintainAspect
        );
      } else {
        result = await resizeImageByPercentage(originalFile, percentage);
      }
      setResizedFile(result);
      
      // Increment usage
      await incrementUsage('resize');
    } catch (error) {
      alert('Resize failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!resizedFile) return;

    const url = URL.createObjectURL(resizedFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = resizedFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const presetSizes = [
    { name: 'Instagram Post', width: 1080, height: 1080 },
    { name: 'Instagram Story', width: 1080, height: 1920 },
    { name: 'Facebook Cover', width: 820, height: 312 },
    { name: 'Twitter Header', width: 1500, height: 500 },
    { name: 'YouTube Thumbnail', width: 1280, height: 720 },
    { name: 'HD', width: 1920, height: 1080 },
  ];

  const applyPreset = (preset) => {
    setWidth(preset.width);
    setHeight(preset.height);
    setMaintainAspect(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <LoadingModal isOpen={loading} message="Resizing image..." />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 space-y-4"
      >
        <div className="flex items-center justify-center space-x-3">
          <Maximize2 size={40} className="text-purple-600 dark:text-purple-400" />
          <h1 className="text-4xl md:text-5xl font-bold gradient-text">Resize Image</h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Resize your images by pixels or percentage, with preset sizes for social media
        </p>
      </motion.div>

      {/* Upload Section */}
      {!originalFile && <UploadZone onFileSelect={handleFileSelect} />}

      {/* Resize Controls */}
      {originalFile && !resizedFile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Mode Selection */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4">Resize Mode</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setResizeMode('pixels')}
                className={`p-4 rounded-xl font-semibold transition-all ${
                  resizeMode === 'pixels'
                    ? 'bg-purple-500 text-white shadow-lg scale-105'
                    : 'glass-card hover:scale-105'
                }`}
              >
                By Pixels
              </button>
              <button
                onClick={() => setResizeMode('percentage')}
                className={`p-4 rounded-xl font-semibold transition-all ${
                  resizeMode === 'percentage'
                    ? 'bg-purple-500 text-white shadow-lg scale-105'
                    : 'glass-card hover:scale-105'
                }`}
              >
                By Percentage
              </button>
            </div>
          </div>

          {/* Preset Sizes */}
          {resizeMode === 'pixels' && (
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold mb-4">Preset Sizes</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {presetSizes.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className="glass-card p-4 hover:scale-105 transition-all text-left"
                  >
                    <p className="font-semibold">{preset.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {preset.width} × {preset.height}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Dimension Controls */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4">
              {resizeMode === 'pixels' ? 'Custom Dimensions' : 'Scale Percentage'}
            </h3>

            {resizeMode === 'pixels' ? (
              <div className="space-y-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Original: {dimensions.width} × {dimensions.height} px
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Width (px)</label>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      className="glass-input w-full"
                      placeholder="Width"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Height (px)</label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="glass-input w-full"
                      placeholder="Height"
                    />
                  </div>
                </div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={maintainAspect}
                    onChange={(e) => setMaintainAspect(e.target.checked)}
                    className="w-5 h-5 text-purple-500 rounded"
                  />
                  <span>Maintain aspect ratio</span>
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  New size: {Math.round(dimensions.width * percentage / 100)} × {Math.round(dimensions.height * percentage / 100)} px
                </div>
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
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>10%</span>
                    <span>100%</span>
                    <span>200%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Original Image Preview */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Original Image</h3>
              <button
                onClick={() => {
                  setOriginalFile(null);
                  setResizedFile(null);
                }}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-500"
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
          </div>

          <button onClick={handleResize} className="glass-button w-full">
            <div className="flex items-center justify-center space-x-2">
              <Maximize2 size={20} />
              <span>Resize Image</span>
            </div>
          </button>
        </motion.div>
      )}

      {/* Result Section */}
      {resizedFile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <ImagePreview
            file={resizedFile}
            originalFile={originalFile}
            onDownload={handleDownload}
            title="Resize Complete!"
          />

          <div className="flex gap-4">
            <button
              onClick={() => {
                setOriginalFile(null);
                setResizedFile(null);
              }}
              className="flex-1 glass-card p-4 font-semibold hover:scale-105 transition-all"
            >
              Resize Another
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
      
      <UpgradePrompt 
        isOpen={showUpgradePrompt}
        onClose={() => setShowUpgradePrompt(false)}
        feature="resize"
        remaining={getRemainingUsage('resize')}
      />
    </div>
  );
};

export default Resize;

