'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Music } from 'lucide-react'; // Added import for Music icon

interface Song {
  title: string;
  artist: string;
  image: string;
  status: string;
}

export default function Home() {
  const [currentSong, setCurrentSong] = useState<Song>({
    title: 'WhereDoWeCameFrom',
    artist: 'ANA',
    image: '/origin.jpg',
    status: 'playing'
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current song data
  const fetchCurrentSong = async () => {
    try {
      const response = await fetch('/api/songs');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.song) {
          setCurrentSong(data.song);
        }
      }
    } catch (error) {
      console.error('Error fetching current song:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentSong();
    
    // Refresh song data every 5 seconds
    const interval = setInterval(fetchCurrentSong, 5000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Generate equalizer bars dynamically
    const equalizer = document.getElementById('equalizer');
    if (equalizer) {
      // Clear existing bars
      equalizer.innerHTML = '';
      
      // Generate 120 bars with random animation delays
      for (let i = 0; i < 120; i++) {
        const bar = document.createElement('div');
        bar.className = 'eq-bar';
        
        // Generate random delay between 0 and 0.5 seconds
        const randomDelay = (Math.random() * 0.5).toFixed(2);
        bar.style.animationDelay = `${randomDelay}s`;
        
        equalizer.appendChild(bar);
      }
    }
  }, []);

  // Function to update performer and song details
  const updatePerformer = (name: string, song: string, anime: string, image: string) => {
    const songElement = document.querySelector('h2.font-display') as HTMLElement;
    const nameElement = document.querySelector('h3.font-display') as HTMLElement;
    const imageElement = document.querySelector('.profile-circle img') as HTMLImageElement;
    const animeElement = document.querySelector('.grid-cols-2 .font-medium') as HTMLElement;
    
    if (songElement) songElement.textContent = song;
    if (nameElement) nameElement.textContent = name;
    if (imageElement) imageElement.src = image;
    if (animeElement) animeElement.textContent = anime;
  };

  return (
    <div className="text-white font-sans antialiased overflow-hidden h-screen w-screen m-0 p-0">
      <style jsx global>{`
        body {
          background-color: #16151F;
          font-family: 'Nunito', sans-serif;
        }
        
        .anime-gradient {
          background: linear-gradient(135deg, #4D7FE3 0%, #8468CE 100%);
        }
        
        .anime-gradient-alt {
          background: linear-gradient(135deg, #E05C7F 0%, #8468CE 100%);
        }
        
        .soft-shadow {
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        
        .profile-circle {
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          background: linear-gradient(135deg, #4D7FE3 0%, #8468CE 100%);
        }
        
        .subtle-glow {
          box-shadow: 0 0 15px rgba(77, 127, 227, 0.3);
        }
        
        .subtle-glow-pink {
          background: linear-gradient(45deg, #E05C7F, #8468CE, #4D7FE3, #E05C7F);
          background-size: 300% 300%;
          animation: gradientShift 3s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 0 20px rgba(224, 92, 127, 0.5);
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .equalizer {
          display: flex;
          gap: 2px;
          height: 40px;
        }
        
        .eq-bar {
          width: 3px;
          background-color: #4D7FE3;
          border-radius: 2px;
          animation: equalize 0.8s ease-in-out infinite alternate;
        }
        
        @keyframes equalize {
          0% { height: 5px; }
          100% { height: 35px; }
        }
        
        .animated-gradient {
          background-size: 200% 200%;
          animation: gradientMove 15s ease infinite;
        }
        
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animated-border {
          position: relative;
          padding: 2px;
        }
        
        .animated-border::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(120deg, #4D7FE3, #8468CE, #E05C7F, #4D7FE3);
          background-size: 300% 300%;
          animation: borderMove 8s ease infinite;
          z-index: -1;
          border-radius: inherit;
          opacity: 0.7;
        }
        
        @keyframes borderMove {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
        
        .soft-pattern {
          /* Removed dot pattern background */
          background: none;
        }
        
        @keyframes floating {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        
        .floating {
          animation: floating 4s ease-in-out infinite;
        }
        
        .cat-icon-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 70%;
          height: 70%;
          z-index: 10;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(77, 127, 227, 0.85);
          border-radius: 50%;
          padding: 5px;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);
        }
        
        /* Small CD for top left corner */
        .cd-small {
          width: 60px;
          height: 60px;
        }
        
        .cd-small .cd-disc {
          width: 100%;
          height: 100%;
        }
        
        .cd-small .cd-inner {
          width: 60%;
          height: 60%;
        }
        
        .cd-small .cd-hole {
          width: 12%;
          height: 12%;
        }
        
        .cd-small .cd-reflection {
          width: 15%;
          height: 8%;
          top: 8%;
          left: 12%;
        }
        
        .cd-overlay {
          /* Remove spin animation, handled by Framer Motion */
          animation: cdPulse 5s ease-in-out infinite alternate;
        }
        
        .cd-disc {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: linear-gradient(145deg, #1a1a1a, #2d2d2d);
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          box-shadow: 
            0 5px 15px rgba(0, 0, 0, 0.5),
            inset 0 0 20px rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.1);
        }
        
        .cd-inner {
          position: absolute;
          width: 70%;
          height: 70%;
          border-radius: 50%;
          background: linear-gradient(135deg, #E05C7F, #8468CE, #4D7FE3);
          background-size: 200% 200%;
          animation: gradientShift 4s ease infinite;
          z-index: 1;
          box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
        }
        
        .cd-hole {
          position: absolute;
          width: 15%;
          height: 15%;
          border-radius: 50%;
          background: linear-gradient(145deg, #000, #333);
          z-index: 2;
          box-shadow: 
            inset 0 0 5px rgba(255, 255, 255, 0.3),
            0 0 10px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .cd-reflection {
          position: absolute;
          top: 5%;
          left: 10%;
          width: 20%;
          height: 10%;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          border-radius: 50%;
          transform: rotate(-30deg);
          filter: blur(1px);
          z-index: 3;
        }
        
        /* Enhanced CD grooves */
        .cd-disc::before {
          content: '';
          position: absolute;
          top: 15%;
          left: 15%;
          right: 15%;
          bottom: 15%;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.15);
          z-index: 1;
          animation: spin 12s linear infinite reverse;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
        }
        
        .cd-disc::after {
          content: '';
          position: absolute;
          top: 25%;
          left: 25%;
          right: 25%;
          bottom: 25%;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.1);
          z-index: 1;
          animation: spin 10s linear infinite;
        }
        
        /* Multiple detailed grooves */
        .cd-grooves {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          z-index: 0;
          overflow: hidden;
          opacity: 0.6;
        }
        
        .cd-groove {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 90%;
          height: 90%;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.08);
          transform: translate(-50%, -50%);
          box-shadow: 0 0 5px rgba(255, 255, 255, 0.05);
        }
        
        .cd-groove:nth-child(2) {
          width: 85%;
          height: 85%;
          border-color: rgba(255, 255, 255, 0.06);
        }
        
        .cd-groove:nth-child(3) {
          width: 80%;
          height: 80%;
          border-color: rgba(255, 255, 255, 0.04);
        }
        
        .cd-groove:nth-child(4) {
          width: 75%;
          height: 75%;
          border-color: rgba(255, 255, 255, 0.03);
        }
        
        .cd-groove:nth-child(5) {
          width: 70%;
          height: 70%;
          border-color: rgba(255, 255, 255, 0.02);
        }
        
        .cd-groove:nth-child(6) {
          width: 65%;
          height: 65%;
          border-color: rgba(255, 255, 255, 0.01);
        }
        
        .cd-groove:nth-child(7) {
          width: 60%;
          height: 60%;
          border-color: rgba(255, 255, 255, 0.005);
        }
        
        /* Additional creative elements */
        .cd-sparkle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          animation: sparkle 3s ease-in-out infinite;
        }
        
        .cd-sparkle:nth-child(1) {
          top: 20%;
          left: 30%;
          animation-delay: 0s;
        }
        
        .cd-sparkle:nth-child(2) {
          top: 60%;
          right: 25%;
          animation-delay: 1s;
        }
        
        .cd-sparkle:nth-child(3) {
          bottom: 30%;
          left: 40%;
          animation-delay: 2s;
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        
        @keyframes spin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        @keyframes cdPulse {
          0% { box-shadow: 0 0 15px rgba(77, 127, 227, 0.4); }
          100% { box-shadow: 0 0 25px rgba(132, 104, 206, 0.7); }
        }
        
        .profile-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, transparent 30%, rgba(0, 0, 0, 0.5));
          z-index: 2;
          pointer-events: none;
        }
        
        /* Glitch effect for image */
        .glitch-container {
          position: relative;
          overflow: hidden;
        }
        
        .glitch-image {
          position: relative;
          z-index: 1;
        }
        
        .glitch-image::before,
        .glitch-image::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url('/origin.jpg');
          background-size: cover;
          background-position: center;
          z-index: -1;
        }
        
        .glitch-image::before {
          animation: glitch-1 0.8s infinite linear alternate-reverse;
          background: linear-gradient(45deg, transparent 20%, rgba(255, 0, 0, 0.5) 40%, transparent 60%);
          mix-blend-mode: screen;
          opacity: 0.8;
        }
        
        .glitch-image::after {
          animation: glitch-2 1.2s infinite linear alternate-reverse;
          background: linear-gradient(-45deg, transparent 20%, rgba(0, 255, 255, 0.5) 40%, transparent 60%);
          mix-blend-mode: screen;
          opacity: 0.8;
        }
        
        @keyframes glitch-1 {
          0% { transform: translate(0); filter: hue-rotate(0deg); }
          10% { transform: translate(-5px, 3px); filter: hue-rotate(90deg); }
          20% { transform: translate(3px, -5px); filter: hue-rotate(180deg); }
          30% { transform: translate(-3px, 5px); filter: hue-rotate(270deg); }
          40% { transform: translate(5px, -3px); filter: hue-rotate(360deg); }
          50% { transform: translate(-5px, -3px); filter: hue-rotate(90deg); }
          60% { transform: translate(3px, 5px); filter: hue-rotate(180deg); }
          70% { transform: translate(-3px, -5px); filter: hue-rotate(270deg); }
          80% { transform: translate(5px, 3px); filter: hue-rotate(360deg); }
          90% { transform: translate(-3px, 5px); filter: hue-rotate(90deg); }
          100% { transform: translate(0); filter: hue-rotate(0deg); }
        }
        
        @keyframes glitch-2 {
          0% { transform: translate(0); filter: hue-rotate(0deg); }
          10% { transform: translate(5px, -3px); filter: hue-rotate(270deg); }
          20% { transform: translate(-3px, 5px); filter: hue-rotate(180deg); }
          30% { transform: translate(3px, -5px); filter: hue-rotate(90deg); }
          40% { transform: translate(-5px, 3px); filter: hue-rotate(360deg); }
          50% { transform: translate(5px, 3px); filter: hue-rotate(270deg); }
          60% { transform: translate(-3px, -5px); filter: hue-rotate(180deg); }
          70% { transform: translate(3px, 5px); filter: hue-rotate(90deg); }
          80% { transform: translate(-5px, -3px); filter: hue-rotate(360deg); }
          90% { transform: translate(3px, -5px); filter: hue-rotate(270deg); }
          100% { transform: translate(0); filter: hue-rotate(0deg); }
        }
        
        .glitch-container:hover .glitch-image::before,
        .glitch-container:hover .glitch-image::after {
          animation-duration: 0.3s;
          opacity: 1;
        }
      `}</style>

      {/* Background elements */}
      <div className="fixed inset-0 bg-gradient-to-br from-secondary-dark via-secondary to-secondary-light opacity-90 z-0 w-full h-full"></div>
      <div className="fixed inset-0 soft-pattern z-0 w-full h-full"></div>
      
      {/* Decorative elements */}
      <div className="fixed w-full h-full overflow-hidden z-0 pointer-events-none">
        {/* Wave lines */}
        <div className="absolute bottom-[5%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
        <div className="absolute bottom-[7%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
      </div>
      
      {/* Main content */}
      <div className="relative w-screen h-screen flex flex-col items-center justify-center z-20">
        <div className="absolute top-8 left-0 right-0 text-center">
          <div className="inline-flex items-center px-8 py-4 bg-black/40 backdrop-blur-md rounded-full border border-white/10 soft-shadow">
            <div className="w-4 h-4 bg-pink-500 rounded-full animate-pulse mr-4 shadow-lg border border-white/20"></div>
            <span className="text-white font-bold uppercase tracking-widest text-lg md:text-xl">GSP PRESENT</span>
          </div>
        </div>
        
        {/* Center content */}
        <div className="flex flex-col md:flex-row items-center justify-center w-full h-full flex-1 px-8">
          {/* Left side - Image */}
          <div className="flex flex-col items-center justify-center w-full md:w-1/2 h-full">
            <div className="relative w-[70vw] h-[70vw] max-w-[500px] max-h-[500px] min-w-[250px] min-h-[250px] flex items-center justify-center">
              <div className="glitch-container">
                <img 
                  src={currentSong.image} 
                  alt={`${currentSong.title} Cover`}
                  className="w-full h-full object-cover shadow-2xl glitch-image" 
                  draggable="false"
                  onError={(e) => {
                    // Fallback to default image if loading fails
                    (e.target as HTMLImageElement).src = '/origin.jpg';
                  }}
                />
              </div>
            </div>
            <div className="mt-10 px-8 py-4 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 soft-shadow">
              <p className="text-white text-xl md:text-2xl font-medium tracking-wide">
                <span className="text-primary">#</span>SATURYAYLIVECONCERT
              </p>
            </div>
          </div>
          
          {/* Right side - Song details */}
          <div className="flex flex-col items-center md:items-start justify-center w-full md:w-1/2 h-full">
            <div className="w-full max-w-2xl">
              <div className="inline-flex items-center mb-6 bg-black/40 backdrop-blur-md rounded-full border border-white/10 soft-shadow px-6 py-3">
                <div className="w-3 h-3 rounded-full bg-pink-500 mr-3 animate-pulse"></div>
                <span className="text-sm md:text-base uppercase tracking-widest text-white font-semibold">
                  {isLoading ? 'Loading...' : 'Now playing'}
                </span>
              </div>
              
              <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6 text-white relative subtle-glow-pink">
                {isLoading ? 'Loading...' : currentSong.artist}
              </h2>
              
              <div className="flex items-center gap-6 mb-8">
                <div className="w-12 h-1.5 bg-pink-500"></div>
                <h3 className="font-display text-3xl md:text-5xl text-white font-bold">
                  {isLoading ? 'Loading...' : currentSong.title}
                </h3>
              </div>
              
              <div className="w-full mt-8">
                <div className="equalizer mb-3 w-full" id="equalizer">
                  {/* Equalizer bars will be generated by JavaScript */}
                </div>
                <div className="flex justify-between text-sm md:text-base text-gray-400 uppercase tracking-widest">
                  <span>01:24</span>
                  <span>04:02</span>
                </div>
              </div>
              
              <div className="mt-10 grid grid-cols-2 gap-6">
                <div className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-white/10">
                  <div className="flex items-center">
                    <i className="fas fa-music text-primary mr-4 text-xl"></i>
                    <div>
                      <p className="text-sm text-gray-400 uppercase">Genre</p>
                      <p className="font-medium text-lg">FREE</p>
                    </div>
                  </div>
                </div>
                <div className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-white/10">
                  <div className="flex items-center">
                    <i className="fas fa-microphone-alt text-accent mr-4 text-xl"></i>
                    <div>
                      <p className="text-sm text-gray-400 uppercase">Type</p>
                      <p className="font-medium text-lg">Live Concert</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Top left - CD Disc */}
        <div className="absolute top-12 left-12 z-30">
          <div className="cat-icon-overlay cd-overlay cd-small">
            <motion.div
              className="cd-disc"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
              style={{ originX: 0.5, originY: 0.5 }}
            >
              <div className="cd-grooves">
                <div className="cd-groove"></div>
                <div className="cd-groove"></div>
                <div className="cd-groove"></div>
                <div className="cd-groove"></div>
                <div className="cd-groove"></div>
                <div className="cd-groove"></div>
                <div className="cd-groove"></div>
              </div>
              <div className="cd-inner">
                <div className="cd-sparkle"></div>
                <div className="cd-sparkle"></div>
                <div className="cd-sparkle"></div>
              </div>
              <div className="cd-hole"></div>
              <div className="cd-reflection"></div>
            </motion.div>
          </div>
        </div>
        
        {/* Top right - Event info */}
        <div className="absolute top-8 right-8 flex flex-col items-end">
          <div className="flex items-center mb-3">
            <div className="w-3 h-3 rounded-full bg-primary mr-3 animate-pulse"></div>
            <p className="text-accent text-lg md:text-xl font-medium">LIVE</p>
          </div>
          <p className="text-white/80 text-sm md:text-base">7/26/2025 • 19:00 WIB</p>
        </div>
        
        {/* Host info */}
        <div className="absolute bottom-12 right-8 bg-black/40 backdrop-blur-md p-4 rounded-lg border border-white/10 soft-shadow">
          <p className="text-gray-400 text-sm">Host:</p>
          <p className="text-white font-bold text-lg">Ana</p>
        </div>
        
        {/* Admin Panel Button */}
        <div className="absolute bottom-12 left-8">
          <a 
            href="/admin" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            <Music className="h-4 w-4 mr-2" />
            Admin Panel
          </a>
        </div>
      </div>
    </div>
  );
}
