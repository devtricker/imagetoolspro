import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UsageProvider } from './context/UsageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Convert from './pages/Convert';
import Resize from './pages/Resize';
import Compress from './pages/Compress';
import Edit from './pages/Edit';
import Background from './pages/Background';
import AI from './pages/AI';
import Metadata from './pages/Metadata';
import Batch from './pages/Batch';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Admin from './pages/Admin';
import Inbox from './pages/Inbox';
import Pricing from './pages/Pricing';
import VerifyEmail from './pages/VerifyEmail';
import { PopunderAd, SocialBarAd } from './components/ads';

function App() {
  return (
    <Router>
      <AuthProvider>
        <UsageProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/convert" element={<ProtectedRoute><Convert /></ProtectedRoute>} />
                <Route path="/resize" element={<ProtectedRoute><Resize /></ProtectedRoute>} />
                <Route path="/compress" element={<ProtectedRoute><Compress /></ProtectedRoute>} />
                <Route path="/edit" element={<ProtectedRoute><Edit /></ProtectedRoute>} />
                <Route path="/background" element={<ProtectedRoute><Background /></ProtectedRoute>} />
                <Route path="/ai" element={<ProtectedRoute><AI /></ProtectedRoute>} />
                <Route path="/metadata" element={<ProtectedRoute><Metadata /></ProtectedRoute>} />
                <Route path="/batch" element={<ProtectedRoute><Batch /></ProtectedRoute>} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
              </Routes>
            </main>
            <Footer />
            
            {/* Global Ads */}
            <PopunderAd />
            <SocialBarAd />
          </div>
        </UsageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

