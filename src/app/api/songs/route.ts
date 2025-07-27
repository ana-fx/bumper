import { NextResponse } from 'next/server';
import { getCurrentSong } from '@/lib/songs-data';

// GET - Get currently playing song for frontend
export async function GET() {
  try {
    const currentSong = await getCurrentSong();
    
    if (currentSong) {
      return NextResponse.json({
        success: true,
        song: {
          title: currentSong.title,
          artist: currentSong.artist,
          image: currentSong.image || '/origin.jpg',
          status: currentSong.status
        }
      });
    } else {
      // Return default data if no song is playing
      return NextResponse.json({
        success: true,
        song: {
          title: 'WhereDoWeCameFrom',
          artist: 'ANA',
          image: '/origin.jpg',
          status: 'playing'
        }
      });
    }
    
  } catch (error) {
    console.error('Error fetching current song:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch current song',
        song: {
          title: 'WhereDoWeCameFrom',
          artist: 'ANA',
          image: '/origin.jpg',
          status: 'playing'
        }
      },
      { status: 500 }
    );
  }
} 