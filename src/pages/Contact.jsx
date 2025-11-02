import { motion } from 'framer-motion';
import { Mail, MessageSquare, Github, Send, AlertCircle, CheckCircle, LogIn } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ref, push, serverTimestamp } from 'firebase/database';
import { database } from '../firebase/config';

const Contact = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please login to send a message');
      return;
    }

    try {
      setError('');
      setLoading(true);
      
      // Save message to Realtime Database
      const messagesRef = ref(database, 'messages');
      await push(messagesRef, {
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userEmail: user.email,
        subject: formData.subject,
        message: formData.message,
        timestamp: serverTimestamp(),
        status: 'unread',
        replies: []
      });
      
      setSuccess(true);
      setFormData({ subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      setError('Failed to send message: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      description: 'Send us an email anytime',
      value: 'devtronex@gmail.com',
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      icon: MessageSquare,
      title: 'Send Message',
      description: 'Login and send us a message',
      value: 'Quick Response',
      color: 'text-green-600 dark:text-green-400',
    },
    {
      icon: Github,
      title: 'GitHub',
      description: 'Report issues or contribute',
      value: 'github.com/devtricker',
      color: 'text-gray-600 dark:text-gray-400',
    },
  ];

  const socialLinks = [
    { icon: Github, href: 'https://github.com/devtricker', label: 'GitHub' },
    { icon: Mail, href: 'mailto:devtronex@gmail.com', label: 'Email' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 space-y-4"
      >
        <h1 className="text-5xl md:text-6xl font-bold gradient-text">Get In Touch</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Have questions, feedback, or suggestions? We'd love to hear from you!
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Contact Methods */}
        {contactMethods.map((method, idx) => {
          const Icon = method.icon;
          return (
            <motion.div
              key={method.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="glass-card p-6 text-center hover:scale-105 transition-all"
            >
              <Icon size={40} className={`${method.color} mx-auto mb-4`} />
              <h3 className="text-xl font-bold mb-2">{method.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                {method.description}
              </p>
              <p className="font-semibold">{method.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Contact Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-8 max-w-3xl mx-auto mb-12"
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Send Us a Message</h2>
        
        {/* Login Required Message */}
        {!user && (
          <div className="mb-6 p-6 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <LogIn size={24} className="text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                Login Required
              </h3>
            </div>
            <p className="text-blue-800 dark:text-blue-200 mb-4">
              Please login or create an account to send us a message. This helps us respond to you directly!
            </p>
            <div className="flex gap-4">
              <Link to="/login" className="glass-button flex-1">
                Login
              </Link>
              <Link to="/signup" className="glass-card-button flex-1 text-center">
                Sign Up
              </Link>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg flex items-center space-x-2">
            <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
            <p className="text-sm text-green-600 dark:text-green-400">
              Message sent successfully! We'll respond soon.
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg flex items-center space-x-2">
            <AlertCircle size={20} className="text-red-600 dark:text-red-400" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* User Info Display */}
        {user && (
          <div className="mb-6 p-4 glass-card">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sending as: <strong className="text-gray-900 dark:text-gray-100">{user.displayName || user.email}</strong>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              disabled={!user}
              className="glass-input w-full disabled:opacity-50"
              placeholder="How can we help?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              disabled={!user}
              rows="6"
              className="glass-input w-full resize-none disabled:opacity-50"
              placeholder="Tell us more about your inquiry..."
            />
          </div>
          <button 
            type="submit" 
            disabled={!user || loading}
            className="glass-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center space-x-2">
              <Send size={20} />
              <span>{loading ? 'Sending...' : 'Send Message'}</span>
            </div>
          </button>
        </form>
      </motion.div>

      {/* Social Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-8 text-center"
      >
        <h2 className="text-2xl font-bold mb-6">Follow Us</h2>
        <div className="flex justify-center space-x-6">
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 glass-card hover:scale-110 transition-all"
                aria-label={social.label}
              >
                <Icon size={32} />
              </a>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;

