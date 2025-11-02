import { useState } from 'react';
import { motion } from 'framer-motion';
import UploadZone from '../components/UploadZone';
import ImagePreview from '../components/ImagePreview';
import LoadingModal from '../components/LoadingModal';
import LoginRequired from '../components/LoginRequired';
import UpgradePrompt from '../components/UpgradePrompt';
import { makeBackgroundTransparent, replaceBackground, blurBackground } from '../utils/background';
import { Layers, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUsage } from '../context/UsageContext';

const Background = () => {
  const { user } = useAuth();
  const { canUseFeature, incrementUsage, getRemainingUsage } = useUsage();
  if (!user) return <LoginRequired />;
  const [originalFile, setOriginalFile] = useState(null);
  const [processedFile, setProcessedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [mode, setMode] = useState('transparent'); // transparent, replace, blur
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [tolerance, setTolerance] = useState(30);
  const [blurAmount, setBlurAmount] = useState(10);

  const handleFileSelect = (file) => {
    setOriginalFile(file);
    setProcessedFile(null);
  };

  const handleProcess = async () => {
    if (!originalFile) return;
    if (!canUseFeature('background')) { setShowUpgradePrompt(true); return; }

    setLoading(true);
    try {
      let result;
      switch (mode) {
        case 'transparent':
          result = await makeBackgroundTransparent(originalFile, tolerance);
          break;
        case 'replace':
          result = await replaceBackground(originalFile, backgroundColor, tolerance);
          break;
        case 'blur':
          result = await blurBackground(originalFile, blurAmount);
          break;
        default:
          throw new Error('Invalid mode');
      }
      setProcessedFile(result);
      await incrementUsage('background');
    } catch (error) {
      alert('Processing failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!processedFile) return;
    const url = URL.createObjectURL(processedFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = processedFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <LoadingModal isOpen={loading} message="Processing background..." />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 space-y-4"
      >
        <div className="flex items-center justify-center space-x-3">
          <Layers size={40} className="text-pink-600 dark:text-pink-400" />
          <h1 className="text-4xl md:text-5xl font-bold gradient-text">Background Tools</h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Remove, replace, or blur image backgrounds with simple color-based detection
        </p>
      </motion.div>

      {/* Upload Section */}
      {!originalFile && <UploadZone onFileSelect={handleFileSelect} />}

      {/* Controls */}
      {originalFile && !processedFile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Mode Selection */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4">Select Mode</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setMode('transparent')}
                className={`p-4 rounded-xl font-semibold transition-all ${
                  mode === 'transparent'
                    ? 'bg-pink-500 text-white shadow-lg scale-105'
                    : 'glass-card hover:scale-105'
                }`}
              >
                Make Transparent
              </button>
              <button
                onClick={() => setMode('replace')}
                className={`p-4 rounded-xl font-semibold transition-all ${
                  mode === 'replace'
                    ? 'bg-pink-500 text-white shadow-lg scale-105'
                    : 'glass-card hover:scale-105'
                }`}
              >
                Replace Color
              </button>
              <button
                onClick={() => setMode('blur')}
                className={`p-4 rounded-xl font-semibold transition-all ${
                  mode === 'blur'
                    ? 'bg-pink-500 text-white shadow-lg scale-105'
                    : 'glass-card hover:scale-105'
                }`}
              >
                Blur Background
              </button>
            </div>
          </div>

          {/* Mode-specific Controls */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4">Settings</h3>
            
            {(mode === 'transparent' || mode === 'replace') && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tolerance: {tolerance}
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={tolerance}
                    onChange={(e) => setTolerance(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    Higher values remove more similar colors
                  </p>
                </div>
              </div>
            )}

            {mode === 'replace' && (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">
                  New Background Color
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-20 h-12 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="glass-input flex-1"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            )}

            {mode === 'blur' && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Blur Amount: {blurAmount}px
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={blurAmount}
                  onChange={(e) => setBlurAmount(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Original Image</h3>
              <button
                onClick={() => setOriginalFile(null)}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-pink-500"
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

          <button onClick={handleProcess} className="glass-button w-full">
            Process Background
          </button>

          {/* Info */}
          <div className="glass-card p-4 bg-blue-50 dark:bg-blue-900/20">
            <p className="text-sm">
              <strong>Note:</strong> This tool uses simple color-based detection. For best results,
              use images with solid, uniform backgrounds. For advanced AI-powered background removal,
              try the AI Tools section.
            </p>
          </div>
        </motion.div>
      )}

      {/* Result Section */}
      {processedFile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <ImagePreview
            file={processedFile}
            originalFile={originalFile}
            onDownload={handleDownload}
            title="Processing Complete!"
          />

          <div className="flex gap-4">
            <button
              onClick={() => {
                setOriginalFile(null);
                setProcessedFile(null);
              }}
              className="flex-1 glass-card p-4 font-semibold hover:scale-105 transition-all"
            >
              Process Another
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
      <UpgradePrompt isOpen={showUpgradePrompt} onClose={() => setShowUpgradePrompt(false)} feature="background" remaining={getRemainingUsage('background')} />
    </div>
  );
};

export default Background;

