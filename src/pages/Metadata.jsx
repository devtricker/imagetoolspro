import { useState } from 'react';
import { motion } from 'framer-motion';
import UploadZone from '../components/UploadZone';
import LoadingModal from '../components/LoadingModal';
import LoginRequired from '../components/LoginRequired';
import UpgradePrompt from '../components/UpgradePrompt';
import { extractMetadata, removeMetadata, formatMetadata, getFileInfo } from '../utils/metadata';
import { FileText, Download, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUsage } from '../context/UsageContext';

const Metadata = () => {
  const { user } = useAuth();
  const { canUseFeature, incrementUsage, getRemainingUsage } = useUsage();
  if (!user) return <LoginRequired />;
  const [originalFile, setOriginalFile] = useState(null);
  const [cleanedFile, setCleanedFile] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [activeTab, setActiveTab] = useState('view'); // view or remove

  const handleFileSelect = async (file) => {
    setOriginalFile(file);
    setCleanedFile(null);
    if (!canUseFeature('metadata')) { setShowUpgradePrompt(true); return; }
    setLoading(true);

    try {
      const info = getFileInfo(file);
      setFileInfo(info);

      const exifData = await extractMetadata(file);
      setMetadata(exifData);
      await incrementUsage('metadata');
    } catch (error) {
      console.error('Metadata extraction failed:', error);
      setMetadata({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMetadata = async () => {
    if (!originalFile) return;

    setLoading(true);
    try {
      const result = await removeMetadata(originalFile);
      setCleanedFile(result);
    } catch (error) {
      alert('Metadata removal failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!cleanedFile) return;

    const url = URL.createObjectURL(cleanedFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = cleanedFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <LoadingModal isOpen={loading} message="Processing metadata..." />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 space-y-4"
      >
        <div className="flex items-center justify-center space-x-3">
          <FileText size={40} className="text-red-600 dark:text-red-400" />
          <h1 className="text-4xl md:text-5xl font-bold gradient-text">EXIF Metadata</h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          View, edit, or remove EXIF data and metadata from your images
        </p>
      </motion.div>

      {/* Upload Section */}
      {!originalFile && <UploadZone onFileSelect={handleFileSelect} />}

      {/* Metadata Display */}
      {originalFile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Tabs */}
          <div className="glass-card p-4">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('view')}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === 'view'
                    ? 'bg-red-500 text-white shadow-lg'
                    : 'glass-card hover:scale-105'
                }`}
              >
                View Metadata
              </button>
              <button
                onClick={() => setActiveTab('remove')}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === 'remove'
                    ? 'bg-red-500 text-white shadow-lg'
                    : 'glass-card hover:scale-105'
                }`}
              >
                Remove Metadata
              </button>
            </div>
          </div>

          {activeTab === 'view' && (
            <>
              {/* File Info */}
              {fileInfo && (
                <div className="glass-card p-6">
                  <h3 className="text-xl font-bold mb-4">File Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">File Name</p>
                      <p className="font-semibold">{fileInfo.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">File Size</p>
                      <p className="font-semibold">{(fileInfo.size / 1024).toFixed(2)} KB</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">File Type</p>
                      <p className="font-semibold">{fileInfo.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Last Modified</p>
                      <p className="font-semibold">{fileInfo.lastModified}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* EXIF Data */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold mb-4">EXIF Data</h3>
                {metadata && !metadata.error && !metadata.message ? (
                  <div className="space-y-3">
                    {Object.entries(formatMetadata(metadata)).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700"
                      >
                        <span className="text-gray-600 dark:text-gray-400">{key}</span>
                        <span className="font-semibold">{value}</span>
                      </div>
                    ))}
                    {Object.keys(formatMetadata(metadata)).length === 0 && (
                      <p className="text-gray-600 dark:text-gray-400">
                        No standard EXIF data found in this image.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="glass-card p-4 bg-yellow-50 dark:bg-yellow-900/20">
                    <p className="text-sm">
                      {metadata?.message || metadata?.error || 'No EXIF data available'}
                    </p>
                  </div>
                )}
              </div>

              {/* Raw Metadata */}
              {metadata && !metadata.error && !metadata.message && (
                <div className="glass-card p-6">
                  <h3 className="text-xl font-bold mb-4">Raw Metadata (All Fields)</h3>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-auto">
                    <pre className="text-xs font-mono whitespace-pre-wrap">
                      {JSON.stringify(metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'remove' && !cleanedFile && (
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold mb-4">Remove All Metadata</h3>
              <div className="space-y-4">
                <div className="glass-card p-4 bg-yellow-50 dark:bg-yellow-900/20">
                  <p className="text-sm">
                    <strong>Warning:</strong> This will remove all EXIF data including camera
                    settings, GPS location, timestamps, and other metadata. This action cannot be
                    undone.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold">What will be removed:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>Camera make and model</li>
                    <li>Date and time taken</li>
                    <li>GPS location data</li>
                    <li>Camera settings (ISO, aperture, shutter speed, etc.)</li>
                    <li>Copyright and author information</li>
                    <li>Software and editing history</li>
                  </ul>
                </div>
                <button onClick={handleRemoveMetadata} className="glass-button w-full">
                  <div className="flex items-center justify-center space-x-2">
                    <Trash2 size={20} />
                    <span>Remove All Metadata</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {cleanedFile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="glass-card p-6 bg-green-50 dark:bg-green-900/20">
                <h3 className="text-xl font-bold mb-2">Metadata Removed Successfully!</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  All EXIF data has been removed from your image. The cleaned image is ready to
                  download.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setOriginalFile(null);
                    setCleanedFile(null);
                    setMetadata(null);
                  }}
                  className="flex-1 glass-card p-4 font-semibold hover:scale-105 transition-all"
                >
                  Process Another
                </button>
                <button onClick={handleDownload} className="flex-1 glass-button">
                  <div className="flex items-center justify-center space-x-2">
                    <Download size={20} />
                    <span>Download Clean Image</span>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {/* Image Preview */}
          {!cleanedFile && (
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Image Preview</h3>
                <button
                  onClick={() => {
                    setOriginalFile(null);
                    setMetadata(null);
                  }}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-red-500"
                >
                  Change Image
                </button>
              </div>
              <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  src={URL.createObjectURL(originalFile)}
                  alt="Preview"
                  className="w-full h-auto max-h-96 object-contain"
                />
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-12 glass-card p-6"
      >
        <h3 className="text-xl font-bold mb-4">About EXIF Metadata</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <p className="font-semibold mb-2">What is EXIF?</p>
            <p>
              EXIF (Exchangeable Image File Format) is metadata embedded in image files. It includes
              information about camera settings, date/time, GPS location, and more.
            </p>
          </div>
          <div>
            <p className="font-semibold mb-2">Why remove metadata?</p>
            <p>
              Remove metadata to protect privacy, reduce file size, or prepare images for
              publication where metadata is not desired.
            </p>
          </div>
        </div>
      </motion.div>
      <UpgradePrompt isOpen={showUpgradePrompt} onClose={() => setShowUpgradePrompt(false)} feature="metadata" remaining={getRemainingUsage('metadata')} />
    </div>
  );
};

export default Metadata;

