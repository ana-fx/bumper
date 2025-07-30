'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Music, 
  LogOut, 
  Plus,
  Play,
  Pause,
  Check,
  Trash2,
  Edit,
  GripVertical
} from 'lucide-react';
import { Song } from '@/lib/songs-data';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Song Item Component
function SortableSongItem({ song, onStatusChange, onEdit, onDelete, isFirst }: {
  song: Song;
  onStatusChange: (songId: string, status: 'playing' | 'queued' | 'completed') => void;
  onEdit: (song: Song) => void;
  onDelete: (songId: string) => void;
  isFirst: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: song.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`flex items-center justify-between p-4 rounded-lg transition-all duration-200 ${
        isFirst 
          ? 'bg-gradient-to-r from-green-600 to-green-700 border-2 border-green-500' 
          : 'bg-gray-700 hover:bg-gray-600'
      } ${
        isDragging 
          ? 'shadow-2xl scale-105 border-2 border-blue-500 bg-gray-600' 
          : 'hover:shadow-lg'
      }`}
    >
      <div className="flex items-center space-x-4">
        <div
          {...attributes}
          {...listeners}
          className={`cursor-grab active:cursor-grabbing p-2 rounded transition-colors ${
            isDragging 
              ? 'bg-blue-500 text-white' 
              : 'hover:bg-gray-600 text-gray-400 hover:text-white'
          }`}
        >
          <GripVertical className="h-5 w-5" />
        </div>
        <img 
          src={song.image || '/origin.jpeg'} 
          alt={song.title}
          className="w-12 h-12 rounded object-cover"
        />
        <div>
          <h3 className="font-medium text-white">{song.title}</h3>
          <p className="text-gray-400 text-sm">{song.artist}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          isFirst 
            ? 'bg-green-500 text-white' 
            : 'bg-yellow-500 text-white'
        }`}>
          {isFirst ? 'playing' : 'queued'}
        </span>
        
        {/* Complete button for playing songs (first song) */}
        {isFirst && (
          <button
            onClick={() => onStatusChange(song.id, 'completed')}
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            title="Complete"
          >
            <Check className="h-4 w-4" />
          </button>
        )}
        
        {/* Edit button for all songs */}
        <button
          onClick={() => onEdit(song)}
          className="p-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded transition-colors"
          title="Edit"
        >
          <Edit className="h-4 w-4" />
        </button>
        
        <button
          onClick={() => onDelete(song.id)}
          className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [songs, setSongs] = useState<Song[]>([]);
  const [showAddSong, setShowAddSong] = useState(false);
  const [showEditSong, setShowEditSong] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [stats, setStats] = useState({
    totalSongs: 0,
    playing: 0,
    queued: 0,
    completed: 0
  });

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    checkAuth();
    loadSongs();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/admin/login');
        return;
      }
      
      const response = await fetch('/api/admin/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        router.push('/admin/login');
      }
    } catch (error) {
      router.push('/admin/login');
    } finally {
      setIsLoading(false);
    }
  };

  // Load songs from API
  const loadSongs = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/songs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const songsData = data.songs || [];
        
        // Ensure proper status assignment (first song = playing, others = queued)
        const processedSongs = songsData.map((song: any, index: number) => ({
          ...song,
          status: index === 0 ? 'playing' : 'queued'
        }));
        
        setSongs(processedSongs);
        
        // Update stats
        setStats({
          totalSongs: processedSongs.length,
          playing: processedSongs.filter((s: any) => s.status === 'playing').length,
          queued: processedSongs.filter((s: any) => s.status === 'queued').length,
          completed: processedSongs.filter((s: any) => s.status === 'completed').length
        });
      } else {
        const errorData = await response.json();
        console.error('Failed to load songs:', errorData);
        // Set empty songs array to prevent further errors
        setSongs([]);
        setStats({
          totalSongs: 0,
          playing: 0,
          queued: 0,
          completed: 0
        });
      }
    } catch (error) {
      console.error('Error loading songs:', error);
      // Set empty songs array to prevent further errors
      setSongs([]);
      setStats({
        totalSongs: 0,
        playing: 0,
        queued: 0,
        completed: 0
      });
    }
  };

  // Handle drag end
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = songs.findIndex(song => song.id === active.id);
      const newIndex = songs.findIndex(song => song.id === over?.id);

      const newSongs = arrayMove(songs, oldIndex, newIndex);
      
      // Update status based on position
      const updatedSongs = newSongs.map((song, index) => ({
        ...song,
        status: index === 0 ? 'playing' as const : 'queued' as const
      }));
      
      setSongs(updatedSongs);
      setIsReordering(true);

      // Update order and status in backend
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch('/api/admin/songs/reorder', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            songIds: updatedSongs.map(song => song.id),
            updateStatus: true
          })
        });

        if (response.ok) {
          // Show success feedback
          const successMessage = document.createElement('div');
          successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
          successMessage.textContent = 'Queue order updated successfully!';
          document.body.appendChild(successMessage);
          
          setTimeout(() => {
            document.body.removeChild(successMessage);
          }, 2000);
        } else {
          console.error('Failed to update song order');
          // Reload songs to revert changes
          await loadSongs();
          
          // Show error feedback
          const errorMessage = document.createElement('div');
          errorMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
          errorMessage.textContent = 'Failed to update queue order';
          document.body.appendChild(errorMessage);
          
          setTimeout(() => {
            document.body.removeChild(errorMessage);
          }, 3000);
        }
      } catch (error) {
        console.error('Error updating song order:', error);
        // Reload songs to revert changes
        await loadSongs();
        
        // Show error feedback
        const errorMessage = document.createElement('div');
        errorMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        errorMessage.textContent = 'Network error while updating queue';
        document.body.appendChild(errorMessage);
        
        setTimeout(() => {
          document.body.removeChild(errorMessage);
        }, 3000);
      } finally {
        setIsReordering(false);
      }
    }
  };

  // Handle status change (play/pause/complete)
  const handleStatusChange = async (songId: string, newStatus: 'playing' | 'queued' | 'completed') => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/songs', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: songId, status: newStatus })
      });

      if (response.ok) {
        await loadSongs(); // Reload songs after status change
      } else {
        console.error('Failed to update song status');
      }
    } catch (error) {
      console.error('Error updating song status:', error);
    }
  };

  // Handle edit song
  const handleEditSong = (song: Song) => {
    setEditingSong(song);
    setShowEditSong(true);
  };

  // Handle delete song
  const handleDeleteSong = async (songId: string) => {
    if (!confirm('Are you sure you want to delete this song?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/songs', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: songId })
      });

      if (response.ok) {
        await loadSongs(); // Reload songs after deletion
      } else {
        console.error('Failed to delete song');
      }
    } catch (error) {
      console.error('Error deleting song:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const currentSong = songs.length > 0 ? songs[0] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Music className="h-8 w-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-white">Live Concert Queue</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Music className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Songs</p>
                <p className="text-2xl font-bold text-white">{stats.totalSongs}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-green-500 rounded-lg">
                <Play className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Now Playing</p>
                <p className="text-2xl font-bold text-white">{stats.playing}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-500 rounded-lg">
                <Pause className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Queued</p>
                <p className="text-2xl font-bold text-white">{stats.queued}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-gray-500 rounded-lg">
                <Check className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-white">{stats.completed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Song */}
        {currentSong ? (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">Now Playing</h2>
            <div className="flex items-center space-x-4">
              <img 
                src={currentSong.image || '/origin.jpeg'} 
                alt={currentSong.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h3 className="text-xl font-bold text-white">{currentSong.title}</h3>
                <p className="text-blue-100">{currentSong.artist}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">Now Playing</h2>
            <div className="text-center py-8">
              <Music className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No songs in queue</p>
              <p className="text-gray-500 text-sm mt-2">Add songs to start playing</p>
            </div>
          </div>
        )}

        {/* Queue Management */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="flex justify-between items-center p-6 border-b border-gray-700">
            <div>
              <h2 className="text-xl font-bold text-white">Song Queue</h2>
              <p className="text-gray-400 text-sm mt-1">
                Drag and drop to reorder. The top song will automatically play.
              </p>
            </div>
            <button
              onClick={() => setShowAddSong(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Song</span>
            </button>
          </div>
          
          <div className="p-6">
            {songs.length === 0 ? (
              <div className="text-center py-12">
                <Music className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No songs in queue</p>
                <p className="text-gray-500 text-sm mt-2">Add your first song to get started</p>
              </div>
            ) : (
              <div className="space-y-2">
                {/* Drag Instructions */}
                <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <GripVertical className="h-4 w-4 text-blue-400" />
                    <p className="text-blue-300 text-sm">
                      <span className="font-medium">Tip:</span> Drag the grip handle to reorder. The first song will automatically play.
                    </p>
                  </div>
                </div>
                
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={songs.map(song => song.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {isReordering && (
                        <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-3 mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                            <p className="text-blue-300 text-sm">Updating queue order...</p>
                          </div>
                        </div>
                      )}
                      
                      {songs.map((song, index) => (
                        <div key={song.id} className="relative">
                          {/* Position indicator for queued songs */}
                          {song.status === 'queued' && (
                            <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-yellow-500 rounded-full"></div>
                          )}
                          <SortableSongItem
                            song={song}
                            onStatusChange={handleStatusChange}
                            onEdit={handleEditSong}
                            onDelete={handleDeleteSong}
                            isFirst={index === 0}
                          />
                        </div>
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Song Modal */}
      {showAddSong && (
        <>
          {console.log('Modal should be visible, showAddSong:', showAddSong)}
          <AddSongModal 
            onClose={() => {
              console.log('Closing modal...');
              setShowAddSong(false);
            }}
            onSuccess={() => {
              console.log('Modal success, closing...');
              setShowAddSong(false);
              loadSongs();
            }}
          />
        </>
      )}

      {/* Edit Song Modal */}
      {showEditSong && editingSong && (
        <EditSongModal 
          song={editingSong}
          onClose={() => {
            setShowEditSong(false);
            setEditingSong(null);
          }}
          onSuccess={() => {
            setShowEditSong(false);
            setEditingSong(null);
            loadSongs();
          }}
        />
      )}
    </div>
  );
}

function AddSongModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    image: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData({...formData, image: ''});
  };

  const handleClose = () => {
    // Reset form
    setFormData({
      title: '',
      artist: '',
      image: ''
    });
    setImageFile(null);
    setImagePreview('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('adminToken');
      
      // If there's an image file, upload it first
      let imageUrl = formData.image;
      if (imageFile) {
        const formDataImage = new FormData();
        formDataImage.append('image', imageFile);
        
        const uploadResponse = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formDataImage
        });
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          imageUrl = uploadData.imageUrl;
        } else {
          throw new Error('Failed to upload image');
        }
      }

      // Add song with image URL
      const response = await fetch('/api/admin/songs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          image: imageUrl
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to add song');
      }
    } catch (error) {
      console.error('Error adding song:', error);
      alert('Failed to add song');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-white mb-6">Add Song to Queue</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Song Title (Optional)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              placeholder="Enter song title (optional)"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Artist Name
            </label>
            <input
              type="text"
              value={formData.artist}
              onChange={(e) => setFormData({...formData, artist: e.target.value})}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              placeholder="Enter artist name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Song Image
            </label>
            <div className="space-y-4">
              {/* File Upload */}
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {imagePreview ? (
                      <div className="relative">
                        <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleRemoveImage();
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <>
                        <svg className="w-8 h-8 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m13 13 4 4L7 7l4 4m-4-4v9a4 4 0 0 0 8 0V5a4 4 0 0 0-8 0Z"/>
                        </svg>
                        <p className="mb-2 text-sm text-gray-400">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </>
                    )}
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              
              {/* Image URL Input (Alternative) */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Or enter image URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="https://example.com/image.jpg (optional)"
                />
                <p className="text-xs text-gray-400 mt-2">Leave empty to use default image</p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4 pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-medium"
            >
              {isLoading ? 'Adding...' : 'Add Song'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 

function EditSongModal({ song, onClose, onSuccess }: { song: Song, onClose: () => void, onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    title: song.title,
    artist: song.artist,
    image: song.image || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(song.image || '');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData({...formData, image: ''});
  };

  const handleClose = () => {
    // Reset form
    setFormData({
      title: song.title,
      artist: song.artist,
      image: song.image || ''
    });
    setImageFile(null);
    setImagePreview(song.image || '');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('adminToken');
      
      // If there's an image file, upload it first
      let imageUrl = formData.image;
      if (imageFile) {
        const formDataImage = new FormData();
        formDataImage.append('image', imageFile);
        
        const uploadResponse = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formDataImage
        });
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          imageUrl = uploadData.imageUrl;
        } else {
          throw new Error('Failed to upload image');
        }
      }

      // Update song
      const response = await fetch('/api/admin/songs', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: song.id,
          title: formData.title,
          artist: formData.artist,
          image: imageUrl
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to update song');
      }
    } catch (error) {
      console.error('Error updating song:', error);
      alert('Failed to update song');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-white mb-6">Edit Song</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Song Title (Optional)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              placeholder="Enter song title (optional)"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Artist Name
            </label>
            <input
              type="text"
              value={formData.artist}
              onChange={(e) => setFormData({...formData, artist: e.target.value})}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              placeholder="Enter artist name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Song Image
            </label>
            <div className="space-y-4">
              {/* File Upload */}
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {imagePreview ? (
                      <div className="relative">
                        <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleRemoveImage();
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <>
                        <svg className="w-8 h-8 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m13 13 4 4L7 7l4 4m-4-4v9a4 4 0 0 0 8 0V5a4 4 0 0 0-8 0Z"/>
                        </svg>
                        <p className="mb-2 text-sm text-gray-400">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </>
                    )}
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              
              {/* Image URL Input (Alternative) */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Or enter image URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="https://example.com/image.jpg (optional)"
                />
                <p className="text-xs text-gray-400 mt-2">Leave empty to use default image</p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4 pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-medium"
            >
              {isLoading ? 'Updating...' : 'Update Song'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 