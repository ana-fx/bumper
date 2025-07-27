// Anime Performance Bumper JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Make equalizer animate to music beat
    const eqBars = document.querySelectorAll('.eq-bar');
    eqBars.forEach(bar => {
        // Random height for each bar
        const randomHeight = Math.floor(Math.random() * 30) + 5;
        bar.style.height = `${randomHeight}px`;
        
        // Random animation duration
        const randomDuration = (Math.random() * 0.5) + 0.5;
        bar.style.animationDuration = `${randomDuration}s`;
    });
});

// Function to update performer and song details
function updatePerformer(name, song, anime, image) {
    const songElement = document.querySelector('h2.font-display');
    const nameElement = document.querySelector('h3.font-display');
    const imageElement = document.querySelector('.profile-circle img');
    const animeElement = document.querySelector('.grid-cols-2 .font-medium');
    
    if (songElement) songElement.textContent = song;
    if (nameElement) nameElement.textContent = name;
    if (imageElement) imageElement.src = image;
    if (animeElement) animeElement.textContent = anime;
}

// Example usage:
// updatePerformer('Artist Name', 'Song Title', 'Anime Name', 'image-url.jpg'); 