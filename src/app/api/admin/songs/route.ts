import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getSongs, setSongs, addSong, updateSong, deleteSong } from '@/lib/songs-data';

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

// GET - Get all songs
export async function GET(request: NextRequest) {
  try {
    const user = verifyAdminToken(request);
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const songs = await getSongs();
    return NextResponse.json({
      songs: songs.sort((a, b) => {
        // Sort by status: playing first, then queued, then completed
        const statusOrder = { playing: 0, queued: 1, completed: 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      })
    });

  } catch (error) {
    console.error('Error fetching songs:', error);
    return NextResponse.json(
      { 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST - Add new song to queue
export async function POST(request: NextRequest) {
  try {
    const user = verifyAdminToken(request);
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title, artist, image } = await request.json();

    // Validate required fields
    if (!artist) {
      return NextResponse.json(
        { message: 'Artist name is required' },
        { status: 400 }
      );
    }

    const newSong = await addSong({
      title: title || 'Untitled Song',
      artist,
      status: 'queued',
      image: image || '/origin.jpg'
    });

    return NextResponse.json({
      message: 'Song added successfully',
      song: newSong
    });

  } catch (error) {
    console.error('Error adding song:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update song status
export async function PUT(request: NextRequest) {
  try {
    const user = verifyAdminToken(request);
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id, status, title, artist, image } = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: 'Song ID is required' },
        { status: 400 }
      );
    }

    const updates: any = {};
    
    // If updating song details (title, artist, image)
    if (title !== undefined) updates.title = title;
    if (artist !== undefined) updates.artist = artist;
    if (image !== undefined) updates.image = image;

    // If updating status
    if (status) {
      // If setting to playing, pause all other playing songs
      if (status === 'playing') {
        const songs = await getSongs();
        for (const song of songs) {
          if (song.status === 'playing') {
            await updateSong(song.id, { status: 'queued' });
          }
        }
      }
      
      updates.status = status;
    }

    const updatedSong = await updateSong(id, updates);
    
    if (!updatedSong) {
      return NextResponse.json(
        { message: 'Song not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Song updated successfully',
      song: updatedSong
    });

  } catch (error) {
    console.error('Error updating song:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove song from queue
export async function DELETE(request: NextRequest) {
  try {
    const user = verifyAdminToken(request);
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: 'Song ID is required' },
        { status: 400 }
      );
    }

    const success = await deleteSong(id);
    
    if (!success) {
      return NextResponse.json(
        { message: 'Song not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Song removed successfully'
    });

  } catch (error) {
    console.error('Error deleting song:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 