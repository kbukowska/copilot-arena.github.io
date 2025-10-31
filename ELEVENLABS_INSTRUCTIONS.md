# ElevenLabs Scary Laugh Sound - Instructions

## How to Generate the Perfect Scary Laugh

### Option 1: Using ElevenLabs Website (Easiest)

1. Go to [https://elevenlabs.io/](https://elevenlabs.io/)
2. Sign up for a free account
3. Go to "Text to Speech" section
4. Choose a voice:
   - **Recommended voices for scary laugh:**
     - "Adam" - deep male voice
     - "Antoni" - well-rounded male voice
     - "Arnold" - crisp deep voice
   
5. In the text box, type one of these:
   - `Ha ha ha ha ha...` (evil laugh)
   - `Heh heh heh heh...` (creepy chuckle)
   - `Mwahahaha...` (villain laugh)

6. Adjust voice settings:
   - **Stability**: 0.3-0.5 (lower = more variation)
   - **Similarity Boost**: 0.5-0.7
   - **Style Exaggeration**: 0.8-1.0 (if available)

7. Click "Generate"
8. Download the audio file
9. Rename it to `scary-laugh.mp3`
10. Place it in your project folder

---

## How to Generate Spooky Background Music with Rain

### Using ElevenLabs Sound Effects (NEW!)

ElevenLabs now offers sound effect generation! Here's how to create spooky ambient music with rain:

#### Method 1: Sound Effects Generator

1. Go to [https://elevenlabs.io/sound-effects](https://elevenlabs.io/sound-effects)
2. In the prompt box, type:
   ```
   Slow spooky ambient Halloween music with heavy rain sounds, 
   dark atmospheric tones, eerie whispers, distant thunder, 
   continuous rainfall, ominous background music
   ```
3. Click "Generate"
4. Listen to the preview
5. If you like it, download as `spooky-rain-music.mp3`
6. Place it in your project folder

#### Method 2: Text-to-Speech with Sound Descriptions

1. Use the regular Text-to-Speech with a deep voice
2. Type atmospheric descriptions:
   ```
   [Background: Heavy rain falling continuously]
   [Wind howling through trees]
   [Distant thunder rumbling]
   [Eerie music playing softly]
   ```
3. This creates ambient narration with spooky atmosphere

#### Method 3: Combine Multiple Audio Files

Generate separately and layer them:

**Rain Sound:**
- Prompt: "Heavy rain falling continuously on a dark Halloween night with occasional thunder"

**Spooky Music:**
- Prompt: "Slow eerie Halloween music with dark atmospheric tones and ominous melody"

Then use audio editing software (like Audacity - free) to combine them.

### Recommended Settings for Spooky Music:

- **Duration**: 2-5 minutes (for looping)
- **Volume**: 30% (so it doesn't overwhelm visitors)
- **Format**: MP3 or WAV
- **Loop**: Yes (music plays continuously)

---

## File Placement

Once you generate your audio files:

```
copilot-arena.github.io/
├── index.html
├── style.css
├── script.js
├── scary-laugh.mp3          ← Hover sound
├── spooky-rain-music.mp3    ← Background music (NEW!)
└── photo/
    └── 2h-media-ZD2-jOORY40-unsplash.jpg
```

---

If you want to generate the sound programmatically:

1. Get your API key from ElevenLabs dashboard
2. Update the `script.js` file:
   - Uncomment the ElevenLabs API section
   - Add your API key to `ELEVENLABS_API_KEY`
   - Choose a voice ID from ElevenLabs voice library

3. The sound will be generated automatically when the page loads

### Option 3: Using Downloaded Audio (Current Implementation)

Once you download the audio from ElevenLabs:

1. Save the file as `scary-laugh.mp3` in your project root
2. Update `script.js` to use the local file:

```javascript
const scaryLaugh = new Audio('scary-laugh.mp3');
scaryLaugh.volume = 0.5; // Adjust volume (0.0 to 1.0)

// Add to buttons
document.querySelectorAll('.social-btn, .highlight-item, .detail-card, a').forEach(element => {
    element.addEventListener('mouseenter', () => {
        scaryLaugh.currentTime = 0; // Reset to start
        scaryLaugh.play();
    });
});
```

## Current Setup

Right now, the website uses a **Web Audio API fallback** that creates a synthesized creepy sound.
This works without any external files, but for the best scary laugh effect:

1. Generate the sound on ElevenLabs.io
2. Download it
3. Add it to your project
4. Update the script to use the real audio file

## Recommended Text for Scary Laugh

Try these in ElevenLabs for different effects:

- **Evil Villain**: "Mwahahaha... mwahahaha..."
- **Creepy Whisper**: "Heh heh heh... heh heh..."
- **Deep Chuckle**: "Ho ho ho... how delightful..."
- **Sinister**: "Ah ha ha ha... ah ha ha..."
- **Quick Creepy**: "Hee hee hee"

Experiment with different voices and settings to find your perfect scary laugh! 🎃👻
