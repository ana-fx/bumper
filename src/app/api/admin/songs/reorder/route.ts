import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getSongs, setSongs } from '@/lib/songs-data';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Middleware to verify admin token
function verifyAdminToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return decoded;
  } catch (error) {
    return null;
  }
}

// PUT - Reorder songs
export async function PUT(request: NextRequest) {
  try {
    const user = verifyAdminToken(request);
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { songIds, updateStatus } = await request.json();

    if (!songIds || !Array.isArray(songIds)) {
      return NextResponse.json(
        { message: 'Song IDs array is required' },
        { status: 400 }
      );
    }

    // Get current songs
    const currentSongs = await getSongs();
    
    // Create a map of current songs by ID for quick lookup
    const songsMap = new Map(currentSongs.map(song => [song.id, song]));
    
    // Reorder songs based on the provided songIds array
    const reorderedSongs = songIds
      .map(id => songsMap.get(id))
      .filter(song => song !== undefined); // Remove any songs that don't exist
    
    // Update status based on position if requested
    const finalSongs = reorderedSongs.map((song, index) => ({
      ...song,
      status: updateStatus 
        ? (index === 0 ? 'playing' : 'queued')
        : song.status
    }));
    
    // Add any songs that weren't in the reorder list (in case some songs were missing)
    const existingIds = new Set(songIds);
    const missingSongs = currentSongs.filter(song => !existingIds.has(song.id));
    const allSongs = [...finalSongs, ...missingSongs];

    // Save the reordered songs
    await setSongs(allSongs);

    return NextResponse.json({
      message: 'Songs reordered successfully',
      songs: allSongs
    });

  } catch (error) {
    console.error('Error reordering songs:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 