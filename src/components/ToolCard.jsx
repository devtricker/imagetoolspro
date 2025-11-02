import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const ToolCard = ({ icon: Icon, title, description, path, color = 'primary' }) => {
  const colorClasses = {
    primary: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    pink: 'from-pink-500 to-pink-600',
    indigo: 'from-indigo-500 to-indigo-600',
    red: 'from-red-500 to-red-600',
    teal: 'from-teal-500 to-teal-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={path} className="block tool-card h-full group">
        <div className="flex flex-col h-full space-y-4">
          <div className={`p-4 bg-gradient-to-br ${colorClasses[color]} rounded-xl w-fit`}>
            <Icon size={32} className="text-white" />
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{description}</p>
          </div>
          <div className="flex items-center text-primary-600 dark:text-primary-400 font-medium group-hover:translate-x-2 transition-transform">
            <span>Try it now</span>
            <ArrowRight size={20} className="ml-2" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ToolCard;

