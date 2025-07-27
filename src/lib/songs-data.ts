import fs from 'fs/promises';
import path from 'path';

// Shared file-based storage for songs using Markdown
// In production, you'd use a database, but this provides good persistence
export interface Song {
  id: string;
  title: string;
  artist: string;
  status: 'playing' | 'queued' | 'completed';
  createdAt: string;
  image?: string;
}

const SONGS_FILE_PATH = path.join(process.cwd(), 'data', 'songs.md');

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.dirname(SONGS_FILE_PATH);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Parse songs from Markdown file
function parseSongsFromMarkdown(content: string): Song[] {
  const songs: Song[] = [];
  const lines = content.split('\n');
  
  let currentSong: Partial<Song> = {};
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (trimmedLine.startsWith('## ')) {
      // New song entry
      if (currentSong.id && currentSong.title && currentSong.artist && currentSong.status) {
        songs.push(currentSong as Song);
      }
      currentSong = { id: trimmedLine.substring(3) };
    } else if (trimmedLine.startsWith('- **Title:**')) {
      // Clean up any asterisks or extra characters
      const title = trimmedLine.substring(12).trim().replace(/\*+/g, '').trim();
      currentSong.title = title;
    } else if (trimmedLine.startsWith('- **Artist:**')) {
      // Clean up any asterisks or extra characters
      const artist = trimmedLine.substring(12).trim().replace(/\*+/g, '').trim();
      currentSong.artist = artist;
    } else if (trimmedLine.startsWith('- **Status:**')) {
      // Clean up any asterisks or extra characters
      const status = trimmedLine.substring(12).trim().replace(/\*+/g, '').trim() as 'playing' | 'queued' | 'completed';
      currentSong.status = status;
    } else if (trimmedLine.startsWith('- **Image:**')) {
      // Clean up any asterisks or extra characters
      const image = trimmedLine.substring(12).trim().replace(/\*+/g, '').trim();
      currentSong.image = image;
    } else if (trimmedLine.startsWith('- **Created:**')) {
      // Clean up any asterisks or extra characters
      const createdAt = trimmedLine.substring(13).trim().replace(/\*+/g, '').trim();
      currentSong.createdAt = createdAt;
    }
  }
  
  // Add the last song if it has all required fields
  if (currentSong.id && currentSong.title && currentSong.artist && currentSong.status) {
    songs.push(currentSong as Song);
  }
  
  return songs;
}

// Convert songs to Markdown format
function songsToMarkdown(songs: Song[]): string {
  let markdown = '# Songs Queue\n\n';
  
  if (songs.length === 0) {
    markdown += '*No songs in queue*\n';
    return markdown;
  }
  
  for (const song of songs) {
    markdown += `## ${song.id}\n`;
    markdown += `- **Title:** ${song.title}\n`;
    markdown += `- **Artist:** ${song.artist}\n`;
    markdown += `- **Status:** ${song.status}\n`;
    markdown += `- **Image:** ${song.image || '/origin.jpg'}\n`;
    markdown += `- **Created:** ${song.createdAt}\n\n`;
  }
  
  return markdown;
}

// Load songs from file
async function loadSongs(): Promise<Song[]> {
  try {
    await ensureDataDir();
    const content = await fs.readFile(SONGS_FILE_PATH, 'utf-8');
    const songs = parseSongsFromMarkdown(content);
    
    // Validate songs and filter out invalid ones
    const validSongs = songs.filter(song => 
      song.id && 
      song.title && 
      song.artist && 
      song.status && 
      ['playing', 'queued', 'completed'].includes(song.status)
    );
    
    if (validSongs.length !== songs.length) {
      console.warn(`Filtered out ${songs.length - validSongs.length} invalid songs`);
    }
    
    return validSongs;
  } catch (error) {
    // File doesn't exist or can't be read, return empty array
    console.log('No existing songs file found or error reading file, starting with empty queue:', error);
    return [];
  }
}

// Save songs to file
async function saveSongs(songs: Song[]): Promise<void> {
  await ensureDataDir();
  const markdown = songsToMarkdown(songs);
  await fs.writeFile(SONGS_FILE_PATH, markdown, 'utf-8');
}

// In-memory cache for performance
let songsCache: Song[] | null = null;
let lastLoadTime = 0;
const CACHE_DURATION = 5000; // 5 seconds

// Get songs with caching
export const getSongs = async (): Promise<Song[]> => {
  const now = Date.now();
  
  // Return cache if it's still valid
  if (songsCache && (now - lastLoadTime) < CACHE_DURATION) {
    return songsCache;
  }
  
  // Load from file and update cache
  try {
    songsCache = await loadSongs();
    lastLoadTime = now;
    console.log('Loaded songs from file:', songsCache.length);
    return songsCache;
  } catch (error) {
    console.error('Error in getSongs:', error);
    // Reset cache on error
    songsCache = null;
    lastLoadTime = 0;
    return [];
  }
};

// Set songs (for testing/initialization)
export const setSongs = async (newSongs: Song[]): Promise<void> => {
  await saveSongs(newSongs);
  songsCache = newSongs;
  lastLoadTime = Date.now();
};

// Add new song
export const addSong = async (song: Omit<Song, 'id' | 'createdAt'>): Promise<Song> => {
  const songs = await getSongs();
  const newSong: Song = {
    ...song,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  
  songs.push(newSong);
  await saveSongs(songs);
  songsCache = songs;
  lastLoadTime = Date.now();
  
  return newSong;
};

// Update song
export const updateSong = async (id: string, updates: Partial<Song>): Promise<Song | null> => {
  const songs = await getSongs();
  const index = songs.findIndex(song => song.id === id);
  
  if (index !== -1) {
    songs[index] = { ...songs[index], ...updates };
    await saveSongs(songs);
    songsCache = songs;
    lastLoadTime = Date.now();
    return songs[index];
  }
  
  return null;
};

// Delete song
export const deleteSong = async (id: string): Promise<boolean> => {
  const songs = await getSongs();
  const index = songs.findIndex(song => song.id === id);
  
  if (index !== -1) {
    songs.splice(index, 1);
    await saveSongs(songs);
    songsCache = songs;
    lastLoadTime = Date.now();
    return true;
  }
  
  return false;
};

// Get current playing song
export const getCurrentSong = async (): Promise<Song | null> => {
  const songs = await getSongs();
  return songs.find(song => song.status === 'playing') || null;
}; 