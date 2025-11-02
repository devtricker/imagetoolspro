import { motion } from 'framer-motion';
import { Shield, Zap, Heart, Code, Users, Globe } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'All image processing happens in your browser. Your files never leave your device.',
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'No server uploads or downloads. Process images instantly with client-side technology.',
      color: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      icon: Heart,
      title: 'Premium Free',
      description: 'All tools are free to use with no limitations, watermarks, or hidden fees.',
      color: 'text-red-600 dark:text-red-400',
    },
    {
      icon: Code,
      title: 'Open Source',
      description: 'Built with modern web technologies: React, TailwindCSS, and powerful image libraries.',
      color: 'text-green-600 dark:text-green-400',
    },
    {
      icon: Users,
      title: 'User Friendly',
      description: 'Intuitive interface designed for both beginners and professionals.',
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      icon: Globe,
      title: 'Works Everywhere',
      description: 'Access from any device with a modern web browser. No installation required.',
      color: 'text-indigo-600 dark:text-indigo-400',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 space-y-4"
      >
        <h1 className="text-5xl md:text-6xl font-bold gradient-text">About ImageToolsPro</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Professional image editing tools, all in your browser. Fast, secure, and completely free.
        </p>
      </motion.div>

      {/* Mission */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-8 mb-12"
      >
        <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
          ImageToolsPro was created to provide powerful image editing capabilities without
          compromising your privacy or requiring expensive software. We believe that everyone should
          have access to professional-grade image tools that are fast, secure, and easy to use.
          By processing everything in your browser, we ensure your images stay private while
          delivering instant results.
        </p>
      </motion.div>

      {/* Features Grid */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="glass-card p-6 hover:scale-105 transition-all"
              >
                <Icon size={40} className={`${feature.color} mb-4`} />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Technology Stack */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-8 mb-12"
      >
        <h2 className="text-3xl font-bold mb-6">Built With Modern Technology</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Frontend</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>• React 18 - Modern UI library</li>
              <li>• TailwindCSS - Utility-first styling</li>
              <li>• Framer Motion - Smooth animations</li>
              <li>• Lucide React - Beautiful icons</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3">Image Processing</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>• Browser Image Compression</li>
              <li>• Canvas API - Image manipulation</li>
              <li>• EXIFR - Metadata extraction</li>
              <li>• JSZip - Batch downloads</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold gradient-text mb-2">8+</div>
            <p className="text-gray-600 dark:text-gray-400">Powerful Tools</p>
          </div>
          <div>
            <div className="text-4xl font-bold gradient-text mb-2">100%</div>
            <p className="text-gray-600 dark:text-gray-400">Client-Side</p>
          </div>
          <div>
            <div className="text-4xl font-bold gradient-text mb-2">0</div>
            <p className="text-gray-600 dark:text-gray-400">Data Collected</p>
          </div>
          <div>
            <div className="text-4xl font-bold gradient-text mb-2">Free</div>
            <p className="text-gray-600 dark:text-gray-400">Premium</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;

