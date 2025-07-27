# Data Storage System

## Overview
Sistem penyimpanan data queue lagu menggunakan file Markdown (`data/songs.md`) untuk memberikan persistensi data yang baik tanpa memerlukan database.

## Struktur File

### Lokasi File
- **File Data**: `data/songs.md`
- **File Contoh**: `data/songs-example.md`
- **Direktori**: `data/`

### Format Markdown
```markdown
# Songs Queue

## [Song ID]
- **Title:** [Judul Lagu] - Ditampilkan dengan font putih yang lebih kecil
- **Artist:** [Nama Performer] - Ditampilkan dengan font besar yang berwarna gradient
- **Status:** [playing|queued|completed]
- **Image:** [URL Gambar]
- **Created:** [Timestamp ISO]
```

## Fitur Sistem

### 1. **Persistensi Data**
- Data tersimpan permanen di file Markdown
- Tidak hilang saat server restart
- Mudah dibaca dan diedit manual

### 2. **Caching System**
- In-memory cache untuk performa
- Cache expired setiap 5 detik
- Otomatis reload dari file

### 3. **Error Handling**
- Fallback ke default data jika file tidak ada
- Auto-create direktori jika belum ada
- Graceful error handling

### 4. **Data Validation**
- Validasi format Markdown
- Parsing yang robust
- Fallback untuk data yang rusak

## Operasi CRUD

### Create (Add Song)
```typescript
const newSong = await addSong({
  title: "Judul Lagu",      // Ditampilkan dengan font putih yang lebih kecil
  artist: "Nama Performer", // Ditampilkan dengan font besar yang berwarna gradient
  status: "queued",
  image: "/path/to/image.jpg"
});
```

### Read (Get Songs)
```typescript
const songs = await getSongs();
const currentSong = await getCurrentSong();
```

### Update (Edit Song)
```typescript
const updated = await updateSong(songId, {
  title: "Judul Baru",
  status: "playing"
});
```

### Delete (Remove Song)
```typescript
const deleted = await deleteSong(songId);
```

## Keuntungan

### ✅ **Sederhana**
- Tidak perlu database setup
- File Markdown mudah dibaca
- Format yang familiar

### ✅ **Portable**
- Data bisa dipindah dengan mudah
- Backup sederhana (copy file)
- Version control friendly

### ✅ **Flexible**
- Bisa diedit manual jika perlu
- Format yang human-readable
- Mudah di-debug

### ✅ **Performance**
- Caching untuk kecepatan
- File I/O yang efisien
- Minimal memory usage

## Backup & Recovery

### Backup Manual
```bash
# Copy file data
cp data/songs.md backup/songs-backup-$(date +%Y%m%d).md
```

### Restore Data
```bash
# Restore dari backup
cp backup/songs-backup-20241219.md data/songs.md
```

## Monitoring

### Log Files
- File operations di-log ke console
- Error handling yang informatif
- Debug information tersedia

### File Structure
```
data/
├── .gitkeep          # Ensure directory tracked
├── songs.md          # Active data (gitignored)
└── songs-example.md  # Example format
```

## Migration ke Database

Jika di masa depan ingin migrasi ke database:

1. **Export Data**: Parse `songs.md` dan export ke database
2. **Update Code**: Ganti file operations dengan database queries
3. **Maintain Compatibility**: Keep file format untuk backup

## Troubleshooting

### File Tidak Terbaca
- Check file permissions
- Verify file format
- Check disk space

### Data Corrupt
- Restore dari backup
- Check Markdown syntax
- Validate JSON data

### Performance Issues
- Check cache duration
- Monitor file size
- Consider database migration 