import { motion } from 'framer-motion';
import ToolCard from '../components/ToolCard';
import {
  RefreshCw,
  Maximize2,
  Minimize2,
  Edit3,
  Layers,
  Sparkles,
  FileText,
  FolderOpen,
} from 'lucide-react';
import { BannerAd, NativeBannerAd } from '../components/ads';

const Home = () => {
  const toolCategories = [
    {
      category: 'Convert',
      color: 'primary',
      tools: [
        {
          icon: RefreshCw,
          title: 'Image Converter',
          description: 'Convert between JPG, PNG, WEBP, HEIC, SVG, and PDF formats',
          path: '/convert',
          color: 'primary',
        },
      ],
    },
    {
      category: 'Resize & Crop',
      color: 'purple',
      tools: [
        {
          icon: Maximize2,
          title: 'Resize Image',
          description: 'Resize by pixels or percentage, maintain aspect ratio',
          path: '/resize',
          color: 'purple',
        },
      ],
    },
    {
      category: 'Compress',
      color: 'green',
      tools: [
        {
          icon: Minimize2,
          title: 'Compress Image',
          description: 'Reduce file size with adjustable quality settings',
          path: '/compress',
          color: 'green',
        },
      ],
    },
    {
      category: 'Edit',
      color: 'orange',
      tools: [
        {
          icon: Edit3,
          title: 'Edit Image',
          description: 'Rotate, flip, adjust colors, add filters and watermarks',
          path: '/edit',
          color: 'orange',
        },
      ],
    },
    {
      category: 'Background',
      color: 'pink',
      tools: [
        {
          icon: Layers,
          title: 'Background Tools',
          description: 'Remove, replace, or make backgrounds transparent',
          path: '/background',
          color: 'pink',
        },
      ],
    },
    {
      category: 'AI Tools',
      color: 'indigo',
      tools: [
        {
          icon: Sparkles,
          title: 'AI Enhancement',
          description: 'Upscale, remove objects, and colorize black & white photos',
          path: '/ai',
          color: 'indigo',
        },
      ],
    },
    {
      category: 'Metadata',
      color: 'red',
      tools: [
        {
          icon: FileText,
          title: 'EXIF Data',
          description: 'View, edit, or remove image metadata and EXIF information',
          path: '/metadata',
          color: 'red',
        },
      ],
    },
    {
      category: 'Batch Processing',
      color: 'teal',
      tools: [
        {
          icon: FolderOpen,
          title: 'Batch Tools',
          description: 'Process multiple images at once and download as ZIP',
          path: '/batch',
          color: 'teal',
        },
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 space-y-6"
      >
        <h1 className="text-5xl md:text-6xl font-bold">
          <span className="gradient-text">Professional Image Tools</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          All-in-one image editing suite with powerful tools for conversion, resizing, compression,
          editing, and more. Everything runs in your browser - fast, secure, and private.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <div className="glass-card px-6 py-3 text-gray-900 dark:text-gray-100">
            <span className="font-semibold">✓</span> 100% Client-Side
          </div>
          <div className="glass-card px-6 py-3 text-gray-900 dark:text-gray-100">
            <span className="font-semibold">✓</span> No Upload Required
          </div>
          <div className="glass-card px-6 py-3 text-gray-900 dark:text-gray-100">
            <span className="font-semibold">✓</span>  Free Premium Offer
          </div>
          <div className="glass-card px-6 py-3 text-gray-900 dark:text-gray-100">
            <span className="font-semibold">✓</span> Privacy First
          </div>
        </div>
      </motion.div>

      {/* Banner Ad */}
      <BannerAd />

      {/* Tools Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">All Tools</h2>
        <div className="grid grid-cols-3 gap-6">
          {toolCategories.map((category) =>
            category.tools.map((tool) => (
              <ToolCard key={tool.title} {...tool} />
            ))
          )}
        </div>
      </motion.div>

      {/* Native Banner Ad */}
      <NativeBannerAd />

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-20 glass-card p-8 md:p-12"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">Why Choose ImageToolsPro?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="text-4xl">🔒</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Secure & Private</h3>
            <p className="text-gray-600 dark:text-gray-400">
              All processing happens in your browser. Your images never leave your device.
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="text-4xl">⚡</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Lightning Fast</h3>
            <p className="text-gray-600 dark:text-gray-400">
              No server uploads or downloads. Process images instantly with client-side technology.
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="text-4xl">🎨</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Professional Quality</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Advanced algorithms ensure high-quality results for all your image editing needs.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;

