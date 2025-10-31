// Add floating particles effect
function createParticles() {
    const container = document.querySelector('.container');
    const particleCount = 20; // Reduced since we'll have leaves and rain

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: fixed;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            background: ${['#ff8c00', '#ff6347', '#8b00ff', '#ffa500'][Math.floor(Math.random() * 4)]};
            border-radius: 50%;
            pointer-events: none;
            opacity: ${Math.random() * 0.5 + 0.2};
            left: ${Math.random() * 100}vw;
            top: ${Math.random() * 100}vh;
            animation: float ${Math.random() * 10 + 5}s infinite ease-in-out;
            z-index: 1;
        `;
        document.body.appendChild(particle);
    }
}

// Add falling leaves
function createFallingLeaves() {
    const leafEmojis = ['🍂', '🍁', '🍃', '🌿'];
    const leafCount = 30;

    for (let i = 0; i < leafCount; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'leaf';
        leaf.textContent = leafEmojis[Math.floor(Math.random() * leafEmojis.length)];
        leaf.style.left = Math.random() * 100 + 'vw';
        leaf.style.animationDuration = (Math.random() * 10 + 10) + 's';
        leaf.style.animationDelay = Math.random() * 5 + 's';
        leaf.style.opacity = Math.random() * 0.4 + 0.4;
        document.body.appendChild(leaf);
    }
}

// Add rain effect
function createRain() {
    const rainCanvas = document.createElement('canvas');
    rainCanvas.className = 'rain-canvas';
    document.body.appendChild(rainCanvas);
    
    const ctx = rainCanvas.getContext('2d');
    rainCanvas.width = window.innerWidth;
    rainCanvas.height = window.innerHeight;
    
    const raindrops = [];
    const raindropCount = 150;
    
    // Create raindrop objects
    for (let i = 0; i < raindropCount; i++) {
        raindrops.push({
            x: Math.random() * rainCanvas.width,
            y: Math.random() * rainCanvas.height,
            length: Math.random() * 20 + 10,
            speed: Math.random() * 5 + 5,
            opacity: Math.random() * 0.3 + 0.2
        });
    }
    
    function animateRain() {
        ctx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
        
        raindrops.forEach(drop => {
            ctx.beginPath();
            ctx.moveTo(drop.x, drop.y);
            ctx.lineTo(drop.x, drop.y + drop.length);
            ctx.strokeStyle = `rgba(174, 194, 224, ${drop.opacity})`;
            ctx.lineWidth = 2;
            ctx.stroke();
            
            drop.y += drop.speed;
            
            // Reset raindrop when it goes off screen
            if (drop.y > rainCanvas.height) {
                drop.y = -drop.length;
                drop.x = Math.random() * rainCanvas.width;
            }
        });
        
        requestAnimationFrame(animateRain);
    }
    
    animateRain();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        rainCanvas.width = window.innerWidth;
        rainCanvas.height = window.innerHeight;
    });
}

// Background Music with Rain Sounds
let backgroundMusic;
let isMusicPlaying = false;

function createBackgroundMusic() {
    // Create audio element
    backgroundMusic = new Audio();
    
    // Option 1: Use ElevenLabs generated spooky music with rain
    // Instructions: Generate on elevenlabs.io and save as 'spooky-rain-music.mp3'
    // For now, we'll use a placeholder that users can replace
    
    // Check if user has uploaded their own music file
    backgroundMusic.src = 'spooky-rain-music.mp3';
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;
    
    // Fallback: Create ambient sound with Web Audio API
    backgroundMusic.addEventListener('error', () => {
        console.log('Custom music file not found. Using Web Audio API ambient sound.');
        createAmbientSound();
    });
    
    return backgroundMusic;
}

// Create ambient spooky sound with Web Audio API
function createAmbientSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create multiple oscillators for layered ambient sound
    function playAmbientLayer() {
        const duration = 8;
        const oscillators = [];
        const gainNodes = [];
        
        // Base drone
        const osc1 = audioContext.createOscillator();
        const gain1 = audioContext.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(55, audioContext.currentTime); // Low A
        gain1.gain.setValueAtTime(0.05, audioContext.currentTime);
        osc1.connect(gain1);
        gain1.connect(audioContext.destination);
        
        // Eerie high tone
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(880, audioContext.currentTime);
        gain2.gain.setValueAtTime(0, audioContext.currentTime);
        gain2.gain.linearRampToValueAtTime(0.02, audioContext.currentTime + 2);
        gain2.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);
        
        // Wind-like noise
        const bufferSize = audioContext.sampleRate * duration;
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.02;
        }
        
        const noise = audioContext.createBufferSource();
        noise.buffer = buffer;
        const noiseGain = audioContext.createGain();
        noiseGain.gain.setValueAtTime(0.03, audioContext.currentTime);
        
        // Low-pass filter for wind effect
        const filter = audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, audioContext.currentTime);
        
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(audioContext.destination);
        
        // Start all
        osc1.start(audioContext.currentTime);
        osc2.start(audioContext.currentTime);
        noise.start(audioContext.currentTime);
        
        osc1.stop(audioContext.currentTime + duration);
        osc2.stop(audioContext.currentTime + duration);
        
        // Loop the ambient sound
        setTimeout(() => {
            if (isMusicPlaying) {
                playAmbientLayer();
            }
        }, duration * 1000);
    }
    
    if (isMusicPlaying) {
        playAmbientLayer();
    }
    
    return { play: playAmbientLayer, stop: () => { isMusicPlaying = false; } };
}

// Music control button
function createMusicControl() {
    const button = document.createElement('button');
    button.className = 'music-control';
    button.innerHTML = '🔇';
    button.title = 'Click to play spooky music';
    
    button.addEventListener('click', () => {
        if (!isMusicPlaying) {
            if (backgroundMusic && backgroundMusic.src) {
                backgroundMusic.play().catch(() => {
                    createAmbientSound();
                });
            } else {
                createAmbientSound();
            }
            isMusicPlaying = true;
            button.innerHTML = '🔊';
            button.classList.add('playing');
            button.title = 'Click to stop music';
        } else {
            if (backgroundMusic) {
                backgroundMusic.pause();
            }
            isMusicPlaying = false;
            button.innerHTML = '🔇';
            button.classList.remove('playing');
            button.title = 'Click to play spooky music';
        }
    });
    
    document.body.appendChild(button);
}


// Add CSS for particle animation
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0) translateX(0) rotate(0deg);
        }
        25% {
            transform: translateY(-30px) translateX(20px) rotate(90deg);
        }
        50% {
            transform: translateY(-60px) translateX(-20px) rotate(180deg);
        }
        75% {
            transform: translateY(-30px) translateX(20px) rotate(270deg);
        }
    }
`;
document.head.appendChild(style);

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scary laugh sound effect using ElevenLabs
// Note: For production, you should generate the audio file once and host it locally
// This example uses a pre-generated scary laugh audio

// Create audio element for scary laugh
const scaryLaugh = new Audio();

// Function to generate scary laugh using ElevenLabs API
// For this demo, we'll use a fallback approach with Web Audio API
async function createScaryLaugh() {
    // Option 1: Use ElevenLabs API (requires API key)
    // Uncomment and add your API key to use ElevenLabs
    /*
    const ELEVENLABS_API_KEY = 'your_api_key_here';
    const VOICE_ID = 'pNInz6obpgDQGcFmaJgB'; // Adam voice or another creepy voice
    
    try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
            method: 'POST',
            headers: {
                'Accept': 'audio/mpeg',
                'xi-api-key': ELEVENLABS_API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: "Ha ha ha ha ha...",
                model_id: "eleven_monolingual_v1",
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.5,
                    pitch: -10
                }
            })
        });
        
        const audioBlob = await response.blob();
        scaryLaugh.src = URL.createObjectURL(audioBlob);
    } catch (error) {
        console.error('Error generating scary laugh:', error);
        useFallbackSound();
    }
    */
    
    // Option 2: Use a direct link to a hosted scary laugh sound
    // You can generate this on elevenlabs.io and download it
    // For now, we'll use a Web Speech API synthesis as a fallback
    useFallbackSound();
}

function useFallbackSound() {
    // Create a creepy laugh using Web Audio API as fallback
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    function playScaryLaughSound() {
        const duration = 0.8;
        const oscillator1 = audioContext.createOscillator();
        const oscillator2 = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator1.type = 'sawtooth';
        oscillator2.type = 'triangle';
        oscillator1.frequency.setValueAtTime(150, audioContext.currentTime);
        oscillator2.frequency.setValueAtTime(100, audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator1.start(audioContext.currentTime);
        oscillator2.start(audioContext.currentTime);
        oscillator1.stop(audioContext.currentTime + duration);
        oscillator2.stop(audioContext.currentTime + duration);
        
        // Add a creepy "ha ha" rhythm
        setTimeout(() => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(180, audioContext.currentTime);
            gain.gain.setValueAtTime(0.2, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.start();
            osc.stop(audioContext.currentTime + 0.3);
        }, 300);
    }
    
    return playScaryLaughSound;
}

// Initialize sound
let playScaryLaugh = useFallbackSound();

// Add hover sound effect to buttons and interactive elements
let soundTimeout;
document.addEventListener('DOMContentLoaded', () => {
    const interactiveElements = document.querySelectorAll('.social-btn, .highlight-item, .detail-card, a');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            // Debounce to avoid too many sounds at once
            if (!soundTimeout) {
                playScaryLaugh();
                soundTimeout = setTimeout(() => {
                    soundTimeout = null;
                }, 400);
            }
        });
    });
});

// Add parallax effect to background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('body');
    if (parallax) {
        parallax.style.backgroundPositionY = -(scrolled * 0.5) + 'px';
    }
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add fadeInUp animation
const fadeInStyle = document.createElement('style');
fadeInStyle.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    section {
        opacity: 0;
    }
`;
document.head.appendChild(fadeInStyle);

// Observe all sections for animation
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    createFallingLeaves();
    createRain();
    backgroundMusic = createBackgroundMusic();
    createMusicControl();
    
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Add click event to RSVP button
    const rsvpBtn = document.querySelector('.rsvp');
    if (rsvpBtn) {
        rsvpBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('🎃 Thank you for your interest! Please contact us via email or phone to complete your RSVP. 🍷');
        });
    }
});

// Add a spooky cursor effect
document.addEventListener('mousemove', (e) => {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-trail';
    cursor.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: radial-gradient(circle, rgba(255,140,0,0.8) 0%, rgba(255,140,0,0) 70%);
        border-radius: 50%;
        pointer-events: none;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        transform: translate(-50%, -50%);
        z-index: 9999;
        animation: cursorFade 1s ease-out forwards;
    `;
    document.body.appendChild(cursor);
    
    setTimeout(() => cursor.remove(), 1000);
});

// Add cursor fade animation
const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
    @keyframes cursorFade {
        to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(2);
        }
    }
`;
document.head.appendChild(cursorStyle);
