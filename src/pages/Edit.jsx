import { useState } from 'react';
import { motion } from 'framer-motion';
import UploadZone from '../components/UploadZone';
import ImagePreview from '../components/ImagePreview';
import LoadingModal from '../components/LoadingModal';
import LoginRequired from '../components/LoginRequired';
import UpgradePrompt from '../components/UpgradePrompt';
import { rotateImage, flipImage, adjustImage, applyFilter, addTextWatermark } from '../utils/edit';
import { Edit3, Download, RotateCw, FlipHorizontal, FlipVertical, Type } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUsage } from '../context/UsageContext';

const Edit = () => {
  const { user } = useAuth();
  const { canUseFeature, incrementUsage, getRemainingUsage } = useUsage();
  if (!user) return <LoginRequired />;
  const [originalFile, setOriginalFile] = useState(null);
  const [editedFile, setEditedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [activeTab, setActiveTab] = useState('rotate'); // rotate, flip, adjust, filter, watermark

  // Adjustment states
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);

  // Watermark states
  const [watermarkText, setWatermarkText] = useState('');
  const [watermarkPosition, setWatermarkPosition] = useState('bottom-right');

  const handleFileSelect = (file) => {
    setOriginalFile(file);
    setEditedFile(null);
  };

  const handleRotate = async (degrees) => {
    if (!originalFile) return;
    if (!canUseFeature('edit')) { setShowUpgradePrompt(true); return; }
    setLoading(true);
    try {
      const result = await rotateImage(originalFile, degrees);
      setEditedFile(result);
      await incrementUsage('edit');
    } catch (error) {
      alert('Rotation failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFlip = async (direction) => {
    if (!originalFile) return;
    setLoading(true);
    try {
      const result = await flipImage(originalFile, direction);
      setEditedFile(result);
    } catch (error) {
      alert('Flip failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdjust = async () => {
    if (!originalFile) return;
    setLoading(true);
    try {
      const result = await adjustImage(originalFile, { brightness, contrast, saturation });
      setEditedFile(result);
    } catch (error) {
      alert('Adjustment failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async (filterName) => {
    if (!originalFile) return;
    setLoading(true);
    try {
      const result = await applyFilter(originalFile, filterName);
      setEditedFile(result);
    } catch (error) {
      alert('Filter failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWatermark = async () => {
    if (!originalFile || !watermarkText) return;
    setLoading(true);
    try {
      const result = await addTextWatermark(originalFile, watermarkText, {
        position: watermarkPosition,
      });
      setEditedFile(result);
    } catch (error) {
      alert('Watermark failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!editedFile) return;
    const url = URL.createObjectURL(editedFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = editedFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'rotate', name: 'Rotate', icon: RotateCw },
    { id: 'flip', name: 'Flip', icon: FlipHorizontal },
    { id: 'adjust', name: 'Adjust', icon: Edit3 },
    { id: 'filter', name: 'Filters', icon: Edit3 },
    { id: 'watermark', name: 'Watermark', icon: Type },
  ];

  const filters = [
    { name: 'grayscale', label: 'Grayscale' },
    { name: 'sepia', label: 'Sepia' },
    { name: 'invert', label: 'Invert' },
    { name: 'vintage', label: 'Vintage' },
    { name: 'cold', label: 'Cold' },
    { name: 'warm', label: 'Warm' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <LoadingModal isOpen={loading} message="Processing image..." />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 space-y-4"
      >
        <div className="flex items-center justify-center space-x-3">
          <Edit3 size={40} className="text-orange-600 dark:text-orange-400" />
          <h1 className="text-4xl md:text-5xl font-bold gradient-text">Edit Image</h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Transform your images with rotation, flipping, color adjustments, filters, and watermarks
        </p>
      </motion.div>

      {/* Upload Section */}
      {!originalFile && <UploadZone onFileSelect={handleFileSelect} />}

      {/* Edit Controls */}
      {originalFile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Tabs */}
          <div className="glass-card p-4">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                      activeTab === tab.id
                        ? 'bg-orange-500 text-white shadow-lg'
                        : 'glass-card hover:scale-105'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tool Controls */}
          <div className="glass-card p-6">
            {activeTab === 'rotate' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Rotate Image</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    onClick={() => handleRotate(90)}
                    className="glass-card p-4 hover:scale-105 transition-all"
                  >
                    <RotateCw size={24} className="mx-auto mb-2" />
                    <p className="font-semibold">90° Right</p>
                  </button>
                  <button
                    onClick={() => handleRotate(-90)}
                    className="glass-card p-4 hover:scale-105 transition-all"
                  >
                    <RotateCw size={24} className="mx-auto mb-2 transform scale-x-[-1]" />
                    <p className="font-semibold">90° Left</p>
                  </button>
                  <button
                    onClick={() => handleRotate(180)}
                    className="glass-card p-4 hover:scale-105 transition-all"
                  >
                    <RotateCw size={24} className="mx-auto mb-2" />
                    <p className="font-semibold">180°</p>
                  </button>
                  <button
                    onClick={() => handleRotate(45)}
                    className="glass-card p-4 hover:scale-105 transition-all"
                  >
                    <RotateCw size={24} className="mx-auto mb-2" />
                    <p className="font-semibold">45°</p>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'flip' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Flip Image</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleFlip('horizontal')}
                    className="glass-card p-6 hover:scale-105 transition-all"
                  >
                    <FlipHorizontal size={32} className="mx-auto mb-2" />
                    <p className="font-semibold">Flip Horizontal</p>
                  </button>
                  <button
                    onClick={() => handleFlip('vertical')}
                    className="glass-card p-6 hover:scale-105 transition-all"
                  >
                    <FlipVertical size={32} className="mx-auto mb-2" />
                    <p className="font-semibold">Flip Vertical</p>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'adjust' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Adjust Colors</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Brightness: {brightness}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={brightness}
                      onChange={(e) => setBrightness(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Contrast: {contrast}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={contrast}
                      onChange={(e) => setContrast(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Saturation: {saturation}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={saturation}
                      onChange={(e) => setSaturation(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <button onClick={handleAdjust} className="glass-button w-full">
                    Apply Adjustments
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'filter' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Apply Filter</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {filters.map((filter) => (
                    <button
                      key={filter.name}
                      onClick={() => handleFilter(filter.name)}
                      className="glass-card p-4 hover:scale-105 transition-all"
                    >
                      <p className="font-semibold">{filter.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'watermark' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Add Watermark</h3>
                <div>
                  <label className="block text-sm font-medium mb-2">Watermark Text</label>
                  <input
                    type="text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    className="glass-input w-full"
                    placeholder="Enter watermark text"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Position</label>
                  <select
                    value={watermarkPosition}
                    onChange={(e) => setWatermarkPosition(e.target.value)}
                    className="glass-input w-full"
                  >
                    <option value="top-left">Top Left</option>
                    <option value="top-right">Top Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="bottom-right">Bottom Right</option>
                    <option value="center">Center</option>
                  </select>
                </div>
                <button onClick={handleWatermark} className="glass-button w-full">
                  Add Watermark
                </button>
              </div>
            )}
          </div>

          {/* Preview */}
          {!editedFile && (
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Original Image</h3>
                <button
                  onClick={() => setOriginalFile(null)}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500"
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
          )}
        </motion.div>
      )}

      {/* Result Section */}
      {editedFile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <ImagePreview
            file={editedFile}
            originalFile={originalFile}
            onDownload={handleDownload}
            title="Edit Complete!"
          />

          <div className="flex gap-4">
            <button
              onClick={() => {
                setOriginalFile(editedFile);
                setEditedFile(null);
              }}
              className="flex-1 glass-card p-4 font-semibold hover:scale-105 transition-all"
            >
              Continue Editing
            </button>
            <button
              onClick={() => {
                setOriginalFile(null);
                setEditedFile(null);
              }}
              className="flex-1 glass-card p-4 font-semibold hover:scale-105 transition-all"
            >
              Edit Another
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
      <UpgradePrompt isOpen={showUpgradePrompt} onClose={() => setShowUpgradePrompt(false)} feature="edit" remaining={getRemainingUsage('edit')} />
    </div>
  );
};

export default Edit;

