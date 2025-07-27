# 🔌 API Documentation

Complete API reference for the Live Concert Queue Management System.

## 🔐 Authentication

All admin endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Login
**POST** `/api/admin/login`

Authenticate admin user and receive JWT token.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "admin"
  }
}
```

### Verify Token
**GET** `/api/admin/verify`

Verify if the current JWT token is valid.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "valid": true,
  "user": {
    "username": "admin"
  }
}
```

## 🎵 Songs Management

### Get All Songs (Admin)
**GET** `/api/admin/songs`

Retrieve all songs in the queue with status sorting.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "songs": [
    {
      "id": "1703123456789",
      "title": "WhereDoWeCameFrom",
      "artist": "ANA",
      "status": "playing",
      "image": "/origin.jpg",
      "createdAt": "2024-12-19T10:30:00.000Z"
    }
  ]
}
```

### Add New Song
**POST** `/api/admin/songs`

Add a new song to the queue.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Song Title",     // Optional
  "artist": "Artist Name",   // Required
  "image": "/path/to/image"  // Optional
}
```

**Response:**
```json
{
  "message": "Song added successfully",
  "song": {
    "id": "1703123456790",
    "title": "Song Title",
    "artist": "Artist Name",
    "status": "queued",
    "image": "/path/to/image",
    "createdAt": "2024-12-19T10:35:00.000Z"
  }
}
```

### Update Song
**PUT** `/api/admin/songs`

Update song details or status.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "id": "1703123456789",
  "title": "Updated Title",    // Optional
  "artist": "Updated Artist",  // Optional
  "image": "/new/image.jpg",   // Optional
  "status": "playing"          // Optional: "playing", "queued", "completed"
}
```

**Response:**
```json
{
  "message": "Song updated successfully",
  "song": {
    "id": "1703123456789",
    "title": "Updated Title",
    "artist": "Updated Artist",
    "status": "playing",
    "image": "/new/image.jpg",
    "createdAt": "2024-12-19T10:30:00.000Z"
  }
}
```

### Delete Song
**DELETE** `/api/admin/songs`

Remove a song from the queue.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "id": "1703123456789"
}
```

**Response:**
```json
{
  "message": "Song removed successfully"
}
```

## 🖼️ File Upload

### Upload Image
**POST** `/api/admin/upload`

Upload an image file for song covers.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: multipart/form-data
```

**Form Data:**
- `image`: File (JPEG, PNG, GIF, WebP, max 10MB)

**Response:**
```json
{
  "success": true,
  "url": "/uploads/filename.jpg"
}
```

## 🌐 Public API

### Get Current Song
**GET** `/api/songs`

Get the currently playing song for frontend display.

**Response:**
```json
{
  "success": true,
  "song": {
    "title": "WhereDoWeCameFrom",
    "artist": "ANA",
    "image": "/origin.jpg",
    "status": "playing"
  }
}
```

## 📊 Data Models

### Song Interface
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

### API Response Format
```typescript
interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  error?: string;
  data?: T;
}
```

## 🔒 Error Handling

### Error Response Format
```json
{
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Common HTTP Status Codes

- **200**: Success
- **400**: Bad Request (validation error)
- **401**: Unauthorized (invalid/missing token)
- **404**: Not Found (song not found)
- **500**: Internal Server Error

### Example Error Responses

**401 Unauthorized:**
```json
{
  "message": "Unauthorized"
}
```

**400 Bad Request:**
```json
{
  "message": "Artist name is required"
}
```

**404 Not Found:**
```json
{
  "message": "Song not found"
}
```

**500 Internal Server Error:**
```json
{
  "message": "Internal server error",
  "error": "File system error"
}
```

## 🛠️ Usage Examples

### JavaScript/TypeScript

```typescript
// Login
const loginResponse = await fetch('/api/admin/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'admin',
    password: 'admin123'
  })
});

const { token } = await loginResponse.json();

// Add song
const addSongResponse = await fetch('/api/admin/songs', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'My Song',
    artist: 'My Artist',
    image: '/uploads/song-image.jpg'
  })
});

// Get current song (public)
const currentSongResponse = await fetch('/api/songs');
const { song } = await currentSongResponse.json();
```

### cURL Examples

```bash
# Login
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Add song
curl -X POST http://localhost:3000/api/admin/songs \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Song Title","artist":"Artist Name"}'

# Get current song
curl http://localhost:3000/api/songs
```

## 🔧 Configuration

### Environment Variables

```env
JWT_SECRET=your-secret-key-change-this
```

### File Upload Settings

- **Max File Size**: 10MB
- **Allowed Types**: JPEG, PNG, GIF, WebP
- **Upload Directory**: `public/uploads/`
- **File Naming**: Unique timestamp-based names

### Caching

- **Cache Duration**: 5 seconds
- **Cache Type**: In-memory
- **Auto Refresh**: Automatic cache invalidation on data changes

## 🚀 Rate Limiting

Currently, no rate limiting is implemented. For production deployment, consider adding rate limiting middleware.

## 🔍 Debugging

### Enable Debug Logging

Add to your environment variables:
```env
DEBUG=true
```

### Common Issues

1. **401 Unauthorized**: Check JWT token validity
2. **File Upload Errors**: Verify file type and size
3. **Data Not Saving**: Check file permissions for `data/` directory
4. **Cache Issues**: Restart server to clear cache

## 📝 Testing

### Test Endpoints

```bash
# Test public API
curl http://localhost:3000/api/songs

# Test admin login
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

**API Version**: 1.0  
**Last Updated**: December 2024 