import { useState } from 'react';
import { motion } from 'framer-motion';
import UploadZone from '../components/UploadZone';
import LoginRequired from '../components/LoginRequired';
import UpgradePrompt from '../components/UpgradePrompt';
import { Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUsage } from '../context/UsageContext';

const AI = () => {
  const { user } = useAuth();
  const { canUseFeature, incrementUsage, getRemainingUsage } = useUsage();
  if (!user) return <LoginRequired />;
  const [originalFile, setOriginalFile] = useState(null);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  const handleFileSelect = (file) => {
    setOriginalFile(file);
  };

  const aiTools = [
    {
      name: 'AI Upscale',
      description: 'Enhance image resolution using AI',
      status: 'Requires API',
    },
    {
      name: 'Remove Object',
      description: 'Intelligently remove unwanted objects',
      status: 'Requires API',
    },
    {
      name: 'Colorize B&W',
      description: 'Add realistic colors to black & white photos',
      status: 'Requires API',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 space-y-4"
      >
        <div className="flex items-center justify-center space-x-3">
          <Sparkles size={40} className="text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-4xl md:text-5xl font-bold gradient-text">AI Enhancement Tools</h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Advanced AI-powered image enhancement features
        </p>
      </motion.div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 mb-8"
      >
        <div className="flex items-start space-x-4">
          <AlertCircle size={24} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-1" />
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">AI Tools Setup Required</h2>
            <p className="text-gray-600 dark:text-gray-400">
              AI-powered features require integration with external APIs for processing. These tools
              use advanced machine learning models that cannot run entirely in the browser.
            </p>
            <div className="space-y-2">
              <p className="font-semibold">Available AI Services:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                <li>Remove.bg API - Background removal</li>
                <li>DeepAI - Image upscaling and enhancement</li>
                <li>Replicate - Object removal and colorization</li>
                <li>Cloudinary AI - Various AI transformations</li>
              </ul>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              To enable these features, you'll need to obtain API keys from the respective services
              and configure them in your environment.
            </p>
          </div>
        </div>
      </motion.div>

      {/* AI Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {aiTools.map((tool, idx) => (
          <motion.div
            key={tool.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-6 opacity-60"
          >
            <div className="space-y-4">
              <Sparkles size={32} className="text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-xl font-bold">{tool.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">{tool.description}</p>
              <div className="glass-card p-3 bg-yellow-50 dark:bg-yellow-900/20">
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  {tool.status}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Upload Section (Disabled) */}
      <div className="opacity-50 pointer-events-none">
        <UploadZone onFileSelect={handleFileSelect} />
      </div>

      {/* Implementation Guide */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-12 glass-card p-6"
      >
        <h3 className="text-xl font-bold mb-4">Implementation Guide</h3>
        <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <p className="font-semibold mb-2">To enable AI features:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Sign up for API access at your chosen AI service provider</li>
              <li>Obtain your API key</li>
              <li>Add the API key to your environment variables</li>
              <li>Implement the API calls in the respective utility functions</li>
              <li>Handle API responses and errors appropriately</li>
            </ol>
          </div>
          <div className="glass-card p-4 bg-gray-50 dark:bg-gray-800">
            <p className="font-mono text-xs">
              // Example: Remove.bg API integration<br />
              const removeBackground = async (imageFile) =&gt; &#123;<br />
              &nbsp;&nbsp;const formData = new FormData();<br />
              &nbsp;&nbsp;formData.append('image_file', imageFile);<br />
              &nbsp;&nbsp;const response = await fetch('https://api.remove.bg/v1.0/removebg', &#123;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;method: 'POST',<br />
              &nbsp;&nbsp;&nbsp;&nbsp;headers: &#123; 'X-Api-Key': YOUR_API_KEY &#125;,<br />
              &nbsp;&nbsp;&nbsp;&nbsp;body: formData<br />
              &nbsp;&nbsp;&#125;);<br />
              &nbsp;&nbsp;return await response.blob();<br />
              &#125;;
            </p>
          </div>
        </div>
      </motion.div>
      <UpgradePrompt isOpen={showUpgradePrompt} onClose={() => setShowUpgradePrompt(false)} feature="ai" remaining={getRemainingUsage('ai')} />
    </div>
  );
};

export default AI;

