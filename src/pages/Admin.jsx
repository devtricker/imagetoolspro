import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ref,
  onValue,
  update,
  serverTimestamp
} from 'firebase/database';
import { database } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { 
  MessageSquare, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle,
  AlertCircle,
  User,
  Calendar
} from 'lucide-react';

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, unread, read

  // Check if user is admin (you can add admin check logic here)
  const isAdmin = user?.email === 'devtronex@gmail.com'; // Replace with your admin email

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!isAdmin) {
      alert('Access denied. Admin only.');
      navigate('/');
      return;
    }

    // Fetch messages from Realtime Database
    const messagesRef = ref(database, 'messages');

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const msgs = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        // Sort by timestamp descending
        msgs.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        setMessages(msgs);
      } else {
        setMessages([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, navigate, isAdmin]);

  const handleReply = async (e) => {
    e.preventDefault();
    
    if (!replyText.trim() || !selectedMessage) return;

    try {
      setLoading(true);
      
      const messageRef = ref(database, `messages/${selectedMessage.id}`);
      const currentReplies = selectedMessage.replies || [];
      
      await update(messageRef, {
        replies: [...currentReplies, {
          text: replyText,
          from: 'Admin',
          timestamp: Date.now()
        }],
        status: 'replied'
      });

      setReplyText('');
      alert('Reply sent successfully!');
    } catch (error) {
      alert('Failed to send reply: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId) => {
    try {
      const messageRef = ref(database, `messages/${messageId}`);
      await update(messageRef, {
        status: 'read'
      });
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === 'unread') return msg.status === 'unread';
    if (filter === 'read') return msg.status === 'read' || msg.status === 'replied';
    return true;
  });

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold gradient-text mb-2">Admin Panel</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage user messages and inquiries</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Messages</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{messages.length}</p>
            </div>
            <MessageSquare size={40} className="text-primary-500" />
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Unread</p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {messages.filter(m => m.status === 'unread').length}
              </p>
            </div>
            <AlertCircle size={40} className="text-orange-500" />
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Replied</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {messages.filter(m => m.status === 'replied').length}
              </p>
            </div>
            <CheckCircle size={40} className="text-green-500" />
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            filter === 'all'
              ? 'bg-primary-500 text-white'
              : 'glass-card hover:scale-105'
          }`}
        >
          All ({messages.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            filter === 'unread'
              ? 'bg-orange-500 text-white'
              : 'glass-card hover:scale-105'
          }`}
        >
          Unread ({messages.filter(m => m.status === 'unread').length})
        </button>
        <button
          onClick={() => setFilter('read')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            filter === 'read'
              ? 'bg-green-500 text-white'
              : 'glass-card hover:scale-105'
          }`}
        >
          Read ({messages.filter(m => m.status === 'read' || m.status === 'replied').length})
        </button>
      </div>

      {/* Messages Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Messages</h2>
          {filteredMessages.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No messages found</p>
            </div>
          ) : (
            filteredMessages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`glass-card p-6 cursor-pointer hover:scale-105 transition-all ${
                  selectedMessage?.id === msg.id ? 'ring-2 ring-primary-500' : ''
                }`}
                onClick={() => {
                  setSelectedMessage(msg);
                  if (msg.status === 'unread') {
                    markAsRead(msg.id);
                  }
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <User size={20} className="text-primary-500" />
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100">{msg.userName}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{msg.userEmail}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    msg.status === 'unread' 
                      ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                      : msg.status === 'replied'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    {msg.status}
                  </span>
                </div>
                <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">{msg.subject}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                  {msg.message}
                </p>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
                  <Calendar size={14} className="mr-1" />
                  {formatDate(msg.timestamp)}
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Message Detail & Reply */}
        <div className="sticky top-4">
          {selectedMessage ? (
            <div className="glass-card p-6 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Message Details</h2>
                
                {/* User Info */}
                <div className="glass-card p-4 mb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <User size={24} className="text-primary-500" />
                    <div>
                      <p className="font-bold text-gray-900 dark:text-gray-100">{selectedMessage.userName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{selectedMessage.userEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-500">
                    <Clock size={14} className="mr-2" />
                    {formatDate(selectedMessage.timestamp)}
                  </div>
                </div>

                {/* Subject */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Subject:</p>
                  <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">{selectedMessage.subject}</p>
                </div>

                {/* Message */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Message:</p>
                  <div className="glass-card p-4 bg-gray-50 dark:bg-gray-800/50">
                    <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>

                {/* Previous Replies */}
                {selectedMessage.replies && selectedMessage.replies.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Previous Replies:</p>
                    <div className="space-y-2">
                      {selectedMessage.replies.map((reply, idx) => (
                        <div key={idx} className="glass-card p-4 bg-green-50 dark:bg-green-900/20">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-semibold text-sm text-green-700 dark:text-green-300">{reply.from}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              {reply.timestamp && formatDate(reply.timestamp)}
                            </p>
                          </div>
                          <p className="text-gray-900 dark:text-gray-100">{reply.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleReply} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                    Your Reply
                  </label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    required
                    rows="4"
                    className="glass-input w-full resize-none"
                    placeholder="Type your reply here..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="glass-button w-full disabled:opacity-50"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Send size={20} />
                    <span>{loading ? 'Sending...' : 'Send Reply'}</span>
                  </div>
                </button>
              </form>
            </div>
          ) : (
            <div className="glass-card p-12 text-center">
              <Mail size={64} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Select a message to view details and reply
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;

