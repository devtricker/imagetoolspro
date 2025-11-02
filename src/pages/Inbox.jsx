import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ref,
  query,
  orderByChild,
  equalTo,
  onValue
} from 'firebase/database';
import { database } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { 
  Inbox as InboxIcon,
  Mail, 
  Clock, 
  CheckCircle,
  AlertCircle,
  MessageSquare,
  ArrowLeft
} from 'lucide-react';

const Inbox = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState('all'); // all, unread, replied

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Fetch user's messages from Realtime Database
    const messagesRef = ref(database, 'messages');

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Filter messages for current user
        const userMessages = Object.keys(data)
          .filter(key => data[key].userId === user.uid)
          .map(key => ({
            id: key,
            ...data[key]
          }));
        
        // Sort by timestamp descending
        userMessages.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        setMessages(userMessages);
      } else {
        setMessages([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, navigate]);

  const filteredMessages = messages.filter(msg => {
    if (filter === 'unread') return msg.status === 'unread';
    if (filter === 'replied') return msg.status === 'replied';
    return true;
  });

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const unreadCount = messages.filter(m => m.status === 'unread').length;
  const repliedCount = messages.filter(m => m.status === 'replied').length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold gradient-text flex items-center gap-3">
              <InboxIcon size={40} />
              My Inbox
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              View your messages and admin replies
            </p>
          </div>
          <button
            onClick={() => navigate('/contact')}
            className="glass-button flex items-center gap-2"
          >
            <MessageSquare size={20} />
            New Message
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="glass-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Messages</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{messages.length}</p>
              </div>
              <Mail className="text-primary-500" size={32} />
            </div>
          </div>

          <div className="glass-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-3xl font-bold text-orange-500">{unreadCount}</p>
              </div>
              <Clock className="text-orange-500" size={32} />
            </div>
          </div>

          <div className="glass-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Replied</p>
                <p className="text-3xl font-bold text-green-500">{repliedCount}</p>
              </div>
              <CheckCircle className="text-green-500" size={32} />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'all'
                ? 'bg-primary-500 text-white'
                : 'glass-card hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            All ({messages.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'unread'
                ? 'bg-orange-500 text-white'
                : 'glass-card hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Pending ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('replied')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'replied'
                ? 'bg-green-500 text-white'
                : 'glass-card hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Replied ({repliedCount})
          </button>
        </div>
      </motion.div>

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-12 text-center"
        >
          <Mail size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            No Messages Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {filter === 'all' 
              ? "You haven't sent any messages yet."
              : `No ${filter} messages found.`
            }
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="glass-button inline-flex items-center gap-2"
          >
            <MessageSquare size={20} />
            Send Your First Message
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Messages List */}
          <div className="space-y-4">
            {filteredMessages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedMessage(msg)}
                className={`glass-card p-4 cursor-pointer transition-all hover:shadow-lg ${
                  selectedMessage?.id === msg.id ? 'ring-2 ring-primary-500' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                    {msg.subject}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    msg.status === 'unread' 
                      ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                      : msg.status === 'replied'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {msg.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                  {msg.message}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {formatDate(msg.timestamp)}
                  </span>
                  {msg.replies && msg.replies.length > 0 && (
                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <MessageSquare size={12} />
                      {msg.replies.length} {msg.replies.length === 1 ? 'reply' : 'replies'}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Message Detail */}
          <div className="lg:sticky lg:top-4 h-fit">
            {selectedMessage ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {selectedMessage.subject}
                  </h2>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="lg:hidden glass-button p-2"
                  >
                    <ArrowLeft size={20} />
                  </button>
                </div>

                <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <strong>From:</strong> {selectedMessage.userName} ({selectedMessage.userEmail})
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Sent:</strong> {formatDate(selectedMessage.timestamp)}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Message:</h3>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>

                {/* Replies Section */}
                {selectedMessage.replies && selectedMessage.replies.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <MessageSquare size={20} />
                      Admin Replies ({selectedMessage.replies.length})
                    </h3>
                    {selectedMessage.replies.map((reply, idx) => (
                      <div
                        key={idx}
                        className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-green-800 dark:text-green-300">
                            {reply.from || 'Admin'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(reply.timestamp)}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {reply.text}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <Clock size={48} className="mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Waiting for admin reply...
                    </p>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="glass-card p-12 text-center">
                <Mail size={64} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Select a message to view details
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Inbox;

