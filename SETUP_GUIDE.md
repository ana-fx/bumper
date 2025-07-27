# 🛠️ Setup Guide

Complete setup instructions for the Live Concert Queue Management System.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher (comes with Node.js)
- **Git** for version control

### Check Your Installation
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Git version
git --version
```

## 🚀 Installation Steps

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/ana-fx/bumper.git

# Navigate to project directory
cd bumper
```

### Step 2: Install Dependencies

```bash
# Install all required packages
npm install
```

This will install the following dependencies:
- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Step 3: Environment Configuration

Create a `.env.local` file in the root directory:

```bash
# Create environment file
touch .env.local
```

Add the following content:

```env
# JWT Secret Key (change this in production!)
JWT_SECRET=your-super-secret-key-change-this-in-production

# Optional: Enable debug mode
DEBUG=false
```

### Step 4: Verify File Structure

Ensure your project structure looks like this:

```
bumper/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── login/page.tsx
│   │   │   └── page.tsx
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   │   ├── login/route.ts
│   │   │   │   ├── songs/route.ts
│   │   │   │   ├── upload/route.ts
│   │   │   │   └── verify/route.ts
│   │   │   └── songs/route.ts
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── lib/
│       └── songs-data.ts
├── data/
│   ├── .gitkeep
│   ├── songs.md
│   └── songs-example.md
├── public/
│   ├── origin.jpg
│   └── uploads/
│       └── .gitkeep
├── .env.local
├── package.json
└── tailwind.config.js
```

### Step 5: Start Development Server

```bash
# Start the development server
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin

## 🔐 Initial Setup

### Default Admin Credentials

The system comes with default admin credentials:

- **Username**: `admin`
- **Password**: `admin123`

### First Login

1. Navigate to http://localhost:3000/admin
2. Enter the credentials above
3. Click "Login"
4. You'll be redirected to the admin dashboard

### Change Default Password (Recommended)

For security, change the default password:

1. **Option 1: Edit Source Code**
   ```typescript
   // In src/app/api/admin/login/route.ts
   const hashedPassword = '$2a$10$...'; // Generate new hash
   ```

2. **Option 2: Use Environment Variables**
   ```env
   ADMIN_PASSWORD_HASH=your-new-hashed-password
   ```

## 📁 Data Management

### Initial Data

The system starts with default data:

```markdown
# Songs Queue

## 1703123456789
- **Title:** WhereDoWeCameFrom
- **Artist:** ANA
- **Status:** playing
- **Image:** /origin.jpg
- **Created:** 2024-12-19T10:30:00.000Z
```

### Data File Location

- **Main Data**: `data/songs.md`
- **Example Data**: `data/songs-example.md`
- **Backup**: Create manual backups of `data/songs.md`

### Data Format

Each song entry follows this format:

```markdown
## [timestamp-id]
- **Title:** [song title]
- **Artist:** [artist name]
- **Status:** [playing|queued|completed]
- **Image:** [image path]
- **Created:** [ISO timestamp]
```

## 🎨 Customization

### Change Default Song

Edit `src/app/api/songs/route.ts`:

```typescript
// Default song when none is playing
return NextResponse.json({
  success: true,
  song: {
    title: "Your Default Song",
    artist: "Your Default Artist",
    image: "/your-default-image.jpg",
    status: "playing"
  }
});
```

### Modify Colors

Edit `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          // Your custom colors
        }
      }
    }
  }
}
```

### Change Fonts

Edit `src/app/layout.tsx`:

```typescript
import { Nunito, Montserrat } from 'next/font/google';

// Change font imports
const customFont = Nunito({ subsets: ['latin'] });
```

## 🔧 Configuration Options

### Development vs Production

#### Development Settings
```env
NODE_ENV=development
DEBUG=true
JWT_SECRET=dev-secret-key
```

#### Production Settings
```env
NODE_ENV=production
DEBUG=false
JWT_SECRET=your-super-secure-production-key
```

### File Upload Settings

Configure in `src/app/api/admin/upload/route.ts`:

```typescript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
```

### Cache Settings

Configure in `src/lib/songs-data.ts`:

```typescript
const CACHE_DURATION = 5000; // 5 seconds
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

2. **Environment Variables**
   - Add `JWT_SECRET` in Vercel dashboard
   - Set `NODE_ENV=production`

3. **Deploy**
   - Push to main branch
   - Vercel auto-deploys

### Other Platforms

#### Netlify
```bash
# Build command
npm run build

# Publish directory
.next
```

#### Railway
```bash
# Add to package.json
{
  "scripts": {
    "start": "next start -p $PORT"
  }
}
```

#### DigitalOcean App Platform
- Select Node.js environment
- Build command: `npm run build`
- Run command: `npm start`

## 🐛 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

#### 2. Permission Denied
```bash
# Fix file permissions
chmod 755 data/
chmod 755 public/uploads/
```

#### 3. Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 4. JWT Token Issues
```bash
# Clear browser storage
# Or restart development server
npm run dev
```

### Debug Mode

Enable debug logging:

```env
DEBUG=true
```

Check console for detailed error messages.

### Data Recovery

If data gets corrupted:

1. **Restore from backup**
   ```bash
   cp data/songs.md.backup data/songs.md
   ```

2. **Reset to default**
   ```bash
   cp data/songs-example.md data/songs.md
   ```

3. **Start fresh**
   ```bash
   echo "# Songs Queue" > data/songs.md
   ```

## 📊 Performance Optimization

### Production Build

```bash
# Create optimized build
npm run build

# Start production server
npm start
```

### Caching Strategy

- **File System**: 5-second cache for song data
- **Browser**: Static assets cached
- **API**: No additional caching (implement if needed)

### Monitoring

Add monitoring for production:

```typescript
// Add to API routes
console.log(`[${new Date().toISOString()}] ${method} ${url}`);
```

## 🔒 Security Checklist

- [ ] Change default JWT secret
- [ ] Change default admin password
- [ ] Set up HTTPS in production
- [ ] Configure CORS if needed
- [ ] Add rate limiting
- [ ] Set up file upload restrictions
- [ ] Regular security updates

## 📞 Support

### Getting Help

1. **Check Documentation**: Review README.md and API_DOCUMENTATION.md
2. **GitHub Issues**: Create issue on repository
3. **Console Logs**: Check browser and server console
4. **Network Tab**: Monitor API requests

### Useful Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Check code quality

# Debugging
npm run dev -- --inspect  # Debug mode
npx next info            # System information
```

---

**Setup completed successfully!** 🎉

Your Live Concert Queue Management System is now ready to use. 