# 🎵 GSP Performance - Live Concert Admin Panel

Sistem manajemen queue untuk live konser dengan admin panel yang mudah digunakan.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Admin Panel (Otomatis)
```bash
npm run setup-admin
```
Script ini akan:
- Generate JWT secret key
- Buat file `.env.local`
- Set username dan password admin
- Hash password secara otomatis

### 3. Jalankan Server
```bash
npm run dev
```

### 4. Akses Admin Panel
- **Login:** http://localhost:3000/admin/login
- **Dashboard:** http://localhost:3000/admin
- **Main Page:** http://localhost:3000

## 🔐 Login Credentials

Setelah menjalankan `npm run setup-admin`, gunakan credentials yang ditampilkan.

**Default (jika tidak diubah):**
- Username: `admin`
- Password: `admin123`

## 🎯 Fitur Utama

### Live Concert Queue Management
- ✅ Tambah lagu ke queue
- ✅ Play/Pause/Complete lagu
- ✅ Upload gambar untuk setiap lagu
- ✅ Real-time status updates
- ✅ Dashboard dengan statistik

### Admin Panel Features
- 🔐 JWT Authentication
- 📊 Real-time Dashboard
- 🎵 Song Queue Management
- 🖼️ Image Management
- 📱 Responsive Design

## 📁 Struktur Project

```
bumper/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── login/page.tsx      # Admin login page
│   │   │   └── page.tsx            # Admin dashboard
│   │   ├── api/admin/
│   │   │   ├── login/route.ts      # Login API
│   │   │   ├── verify/route.ts     # Token verification
│   │   │   └── songs/route.ts      # Songs management API
│   │   ├── layout.tsx              # Root layout
│   │   └── page.tsx                # Main page
│   └── ...
├── public/
│   ├── origin.jpeg                 # Default song image
│   └── ...
├── setup-admin.js                  # Admin setup script
├── ADMIN_GUIDE.md                  # Detailed admin guide
├── env.example                     # Environment template
└── package.json
```

## ⚙️ Manual Setup (Jika diperlukan)

### 1. Buat file .env.local
```env
JWT_SECRET=your-secret-key-here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=$2a$10$btuYOHaeDMra.cF9xj3X9ePue8lT0R9G7wqNKDJQ3U8IELF9zOgPe
```

### 2. Generate Password Hash
```bash
node -e "console.log(require('bcryptjs').hashSync('password-anda', 10))"
```

## 🔌 API Endpoints

### Authentication
- `POST /api/admin/login` - Login admin
- `GET /api/admin/verify` - Verify token

### Songs Management
- `GET /api/admin/songs` - Get all songs
- `POST /api/admin/songs` - Add new song
- `PUT /api/admin/songs` - Update song status
- `DELETE /api/admin/songs?id={id}` - Delete song

## 🛠️ Development

### Tech Stack
- **Frontend:** Next.js 15, React 19, TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Authentication:** JWT, bcryptjs
- **Animations:** Framer Motion

### Scripts
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm run setup-admin  # Setup admin panel
```

## 📖 Dokumentasi Lengkap

Untuk dokumentasi detail, lihat:
- [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) - Panduan lengkap admin panel
- [env.example](./env.example) - Template environment variables

## 🔒 Security

- JWT token dengan expiry 24 jam
- Password di-hash menggunakan bcrypt
- API protection dengan token validation
- CORS protection
- Input validation

## 🐛 Troubleshooting

### Login Gagal
1. Pastikan file `.env.local` ada
2. Restart server: `npm run dev`
3. Clear browser cache
4. Cek console untuk error

### API Error 401
- Token expired atau tidak valid
- Login ulang untuk mendapatkan token baru

### Songs Tidak Muncul
- Cek koneksi API
- Restart server
- Cek console browser

## 📞 Support

Jika ada masalah:
1. Cek [ADMIN_GUIDE.md](./ADMIN_GUIDE.md)
2. Restart server
3. Clear browser cache
4. Cek console untuk error messages

---

**GSP Performance Admin Panel v1.0** - Live Concert Queue Management System 