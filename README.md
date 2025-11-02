# 🖼️ ImageToolsPro

Professional image editing tools, all in your browser. Fast, secure, and completely free.

## ✨ Features

### 🔄 Convert
- Convert between JPG, PNG, WEBP, GIF, BMP formats
- Image to PDF conversion
- Maintains image quality

### 📏 Resize
- Resize by pixels or percentage
- Preset sizes for social media (Instagram, Facebook, Twitter, YouTube)
- Maintain aspect ratio option
- Custom dimensions

### 🗜️ Compress
- Adjustable quality slider (10-100%)
- WebP conversion for better compression
- Before/after preview
- Real-time compression ratio display

### ✏️ Edit
- Rotate (90°, 180°, 45°, custom)
- Flip (horizontal/vertical)
- Adjust brightness, contrast, saturation
- Apply filters (grayscale, sepia, vintage, etc.)
- Add text watermarks

### 🎨 Background
- Make background transparent
- Replace background color
- Blur background
- Adjustable tolerance

### 🤖 AI Tools
- AI upscaling (requires API)
- Object removal (requires API)
- Colorize B&W photos (requires API)

### 📋 Metadata
- View EXIF data
- Display camera settings, GPS, timestamps
- Remove all metadata
- Privacy protection

### 📦 Batch Processing
- Process multiple images at once
- Batch compress, resize, or convert
- Download as ZIP file
- Progress tracking

## 🚀 Tech Stack

- **React 18** - Modern UI library
- **Vite** - Fast build tool
- **TailwindCSS** - Utility-first CSS
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons
- **Firebase** - Authentication & Realtime Database
- **Browser Image Compression** - Client-side compression
- **EXIFR** - Metadata extraction
- **JSZip** - Batch downloads
- **jsPDF** - PDF generation

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/imagetoolspro.git

# Navigate to project directory
cd imagetoolspro

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### 🔥 Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Authentication** (Email/Password and Google)
3. Enable **Realtime Database**
4. Set database rules (see `FIREBASE_RULES.md`)
5. Update `src/firebase/config.js` with your Firebase config

## 📦 Build for Production

```bash
# Build the project
npm run build

# Preview production build
npm run preview
```

## 🌐 Deployment

### Netlify

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy!

### Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Vercel will auto-detect Vite settings
4. Deploy!

### Manual Deployment

After running `npm run build`, upload the contents of the `dist` folder to any static hosting service.

## 🔒 Privacy & Security

- **100% Client-Side**: All image processing happens in your browser
- **No Server Uploads**: Your images never leave your device
- **No Data Collection**: We don't track or store any user data
- **Open Source**: Transparent codebase you can audit

## 📁 Project Structure

```
imagetoolspro/
├── public/
│   └── logo.png
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── UploadZone.jsx
│   │   ├── ToolCard.jsx
│   │   ├── ImagePreview.jsx
│   │   └── LoadingModal.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Convert.jsx
│   │   ├── Resize.jsx
│   │   ├── Compress.jsx
│   │   ├── Edit.jsx
│   │   ├── Background.jsx
│   │   ├── AI.jsx
│   │   ├── Metadata.jsx
│   │   ├── Batch.jsx
│   │   ├── About.jsx
│   │   └── Contact.jsx
│   ├── utils/
│   │   ├── convert.js
│   │   ├── resize.js
│   │   ├── compress.js
│   │   ├── edit.js
│   │   ├── background.js
│   │   └── metadata.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎨 Features Breakdown

### Convert Tool
- Supports JPG, PNG, WEBP, GIF, BMP, PDF
- High-quality conversion
- Preserves image dimensions

### Resize Tool
- Pixel-based resizing
- Percentage-based scaling
- Social media presets
- Aspect ratio lock

### Compress Tool
- Quality slider (10-100%)
- WebP output option
- Size comparison
- Compression ratio display

### Edit Tool
- Rotation (any angle)
- Horizontal/vertical flip
- Color adjustments
- 6+ filters
- Text watermarks with positioning

### Background Tool
- Simple color-based detection
- Transparency support
- Color replacement
- Background blur

### Metadata Tool
- Complete EXIF viewer
- Camera settings display
- GPS location
- One-click metadata removal

### Batch Tool
- Multi-file upload
- Batch operations
- ZIP download
- Progress tracking

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [Browser Image Compression](https://github.com/Donaldcwl/browser-image-compression)
- [EXIFR](https://github.com/MikeKovarik/exifr)
- [JSZip](https://stuk.github.io/jszip/)

## 📧 Contact

- Email: devtronex@gmail.com
- GitHub: [github.com/devtricker](https://github.com/devtricker)

## 🔐 Admin Panel

Admin panel is available at `/admin` route. Only `devtronex@gmail.com` has access to:
- View all user messages
- Reply to messages
- Mark messages as read
- Filter messages by status

## 📬 User Inbox

Users can view their messages and admin replies at `/inbox` route:
- View all sent messages
- See admin replies in real-time
- Filter messages (All / Pending / Replied)
- Track message status
- Beautiful responsive UI

See `INBOX_FEATURE.md` for detailed guide.

---

Made with ❤️ for creators everywhere

