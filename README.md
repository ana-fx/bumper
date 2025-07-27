# 🎵 Live Concert Queue Management System

A modern web application for managing live concert song queues with real-time display and admin panel. Built with Next.js, React, TypeScript, and Tailwind CSS.

## 🌟 Features

### 🎤 Frontend Display
- **Real-time Song Information**: Dynamic display of currently playing song
- **Beautiful UI**: Modern design with gradient effects and animations
- **Responsive Design**: Optimized for Discord camera display and mobile devices
- **Visual Effects**: 
  - Glitch effect on artist images
  - Rotating CD disc animation
  - Dynamic equalizer bars
  - Gradient text effects

### 🎛️ Admin Panel
- **Authentication**: Secure JWT-based login system
- **Queue Management**: Add, edit, delete, and reorder songs
- **Status Control**: Play, pause, and complete songs
- **Image Upload**: Upload custom song cover images
- **Real-time Statistics**: Live count of total, playing, queued, and completed songs
- **User-friendly Interface**: Intuitive dashboard with modal forms

### 💾 Data Management
- **File-based Storage**: Markdown files for data persistence
- **Caching System**: In-memory cache for performance optimization
- **Data Validation**: Robust error handling and data integrity
- **Backup Support**: Easy data backup and restoration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ana-fx/bumper.git
   cd bumper
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin

### Default Login Credentials
- **Username**: `admin`
- **Password**: `admin123`

## 📁 Project Structure

```
bumper/
├── src/
│   ├── app/
│   │   ├── admin/                 # Admin panel pages
│   │   │   ├── login/page.tsx     # Admin login
│   │   │   └── page.tsx          # Admin dashboard
│   │   ├── api/                   # API routes
│   │   │   ├── admin/            # Admin API endpoints
│   │   │   │   ├── login/        # Authentication
│   │   │   │   ├── songs/        # Song management
│   │   │   │   ├── upload/       # File upload
│   │   │   │   └── verify/       # Token verification
│   │   │   └── songs/            # Public song API
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Main frontend page
│   └── lib/
│       └── songs-data.ts         # Data management utilities
├── data/
│   ├── songs.md                  # Song queue data
│   └── songs-example.md          # Example data format
├── public/
│   ├── origin.jpg               # Default song image
│   └── uploads/                 # Uploaded images directory
└── styles.css                   # Custom CSS styles
```

## 🎯 Core Features

### 1. Frontend Display (`/`)

The main page displays the currently playing song with:
- **Artist Name**: Large gradient text (default: "ANA")
- **Song Title**: Smaller white text (default: "WhereDoWeCameFrom")
- **Song Image**: Artist/album cover with glitch effect
- **Visual Elements**:
  - Rotating CD disc in top-left corner
  - Dynamic equalizer bars
  - Live status indicators
  - Event information (GSP Performance, Closing Ceremony)

### 2. Admin Panel (`/admin`)

Complete queue management system:

#### Authentication
- Secure login with JWT tokens
- Automatic token verification
- Session management

#### Dashboard Features
- **Statistics Overview**:
  - Total songs in queue
  - Currently playing
  - Queued songs
  - Completed songs

- **Song Management**:
  - Add new songs to queue
  - Edit existing song details
  - Delete songs
  - Change song status (play/pause/complete)

- **Image Management**:
  - Upload custom song covers
  - Preview uploaded images
  - Remove uploaded images

#### Song Operations
- **Add Song**: Modal form with artist, title, and image upload
- **Edit Song**: Modify existing song details
- **Play Song**: Set song to playing status (auto-pauses others)
- **Complete Song**: Mark song as completed
- **Delete Song**: Remove from queue permanently

### 3. Data Storage System

#### Markdown-based Storage
Songs are stored in `data/songs.md` with the following format:

```markdown
# Songs Queue

## 1703123456789
- **Title:** WhereDoWeCameFrom
- **Artist:** ANA
- **Status:** playing
- **Image:** /origin.jpg
- **Created:** 2024-12-19T10:30:00.000Z
```

#### Features
- **Automatic Backup**: Data is automatically saved
- **Validation**: Invalid data is filtered out
- **Caching**: 5-second cache for performance
- **Error Recovery**: Graceful handling of file errors

## 🔧 Configuration

### Environment Variables
Create `.env.local` file for custom configuration:

```env
JWT_SECRET=your-secret-key-change-this
```

### Tailwind Configuration
Custom color palette in `tailwind.config.js`:
- **Primary**: Pink colors
- **Secondary**: Dark gray colors  
- **Accent**: Purple colors

### Custom Fonts
- **Nunito**: For general text
- **Montserrat**: For display elements

## 📱 Usage Guide

### For Concert Organizers

1. **Access Admin Panel**
   - Navigate to `/admin`
   - Login with credentials

2. **Add Songs to Queue**
   - Click "Add Song" button
   - Fill in artist name (required)
   - Add song title (optional)
   - Upload image (optional)
   - Click "Add to Queue"

3. **Manage Queue**
   - View all songs in queue
   - Click play button (▶) to start song
   - Click complete button (✓) to finish song
   - Edit or delete songs as needed

4. **Monitor Display**
   - Frontend automatically updates every 5 seconds
   - Currently playing song is displayed prominently
   - Queue status is shown in real-time

### For Audience

- **View Live Display**: Visit the main page to see current song
- **Real-time Updates**: Information updates automatically
- **Mobile Friendly**: Responsive design works on all devices

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### API Endpoints

#### Public API
- `GET /api/songs` - Get currently playing song

#### Admin API (requires authentication)
- `GET /api/admin/songs` - Get all songs
- `POST /api/admin/songs` - Add new song
- `PUT /api/admin/songs` - Update song
- `DELETE /api/admin/songs` - Delete song
- `POST /api/admin/upload` - Upload image
- `POST /api/admin/login` - Admin login
- `GET /api/admin/verify` - Verify token

### Data Models

#### Song Interface
```typescript
interface Song {
  id: string;
  title: string;
  artist: string;
  status: 'playing' | 'queued' | 'completed';
  createdAt: string;
  image?: string;
}
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based admin access
- **Password Hashing**: bcryptjs for password security
- **Input Validation**: Server-side validation for all inputs
- **File Upload Security**: Type and size validation for images
- **Error Handling**: Graceful error responses without data exposure

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` for color changes
- Edit `styles.css` for custom animations
- Update `src/app/layout.tsx` for font changes

### Default Data
- Change default song in `src/app/api/songs/route.ts`
- Modify default image path in multiple files
- Update example data in `data/songs-example.md`

### Features
- Add new API endpoints in `src/app/api/`
- Extend admin panel in `src/app/admin/`
- Modify frontend display in `src/app/page.tsx`

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Deploy automatically on push
3. Set environment variables in Vercel dashboard

### Other Platforms
- **Netlify**: Compatible with Next.js
- **Railway**: Easy deployment with database support
- **DigitalOcean**: App Platform deployment
- **AWS**: Amplify or EC2 deployment

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

For issues and questions:
- Create an issue on GitHub
- Check existing issues for solutions
- Review documentation in this README

## 🎵 Credits

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom animations
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Authentication**: JWT with bcryptjs
- **File Storage**: Node.js fs/promises

---

**Built with ❤️ for live concerts everywhere** 