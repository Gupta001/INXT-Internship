# Text-to-Speech Demo

A comprehensive web-based text-to-speech application built with HTML, CSS, and JavaScript using the Web Speech API.

## Features

### 🎯 Core Functionality
- **Natural Speech Synthesis**: Convert any text to speech using browser's built-in voices
- **Voice Selection**: Choose from available system voices with language grouping
- **Speed Control**: Adjust speech rate from 0.1x to 3x speed
- **Pitch Control**: Modify voice pitch from 0 to 2
- **Volume Control**: Control speech volume from 0 to 100%

### 🎛️ Advanced Controls
- **Play/Pause/Resume/Stop**: Full playback control
- **Progress Tracking**: Visual progress bar with estimated completion
- **Real-time Status**: Live status updates during speech
- **Preset Examples**: Quick-load sample texts for testing

### 🎨 User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Glass-morphism design with smooth animations
- **Accessibility**: Full keyboard support and screen reader friendly
- **Visual Feedback**: Dynamic styling during speech playback

### ⌨️ Keyboard Shortcuts
- `Ctrl/Cmd + Enter`: Start speaking
- `Ctrl/Cmd + Space`: Pause/Resume
- `Ctrl/Cmd + Escape`: Stop speaking

## Browser Support

This application uses the Web Speech API, which is supported in:
- ✅ Chrome/Chromium (recommended)
- ✅ Safari
- ✅ Firefox
- ✅ Edge
- ❌ Internet Explorer

## How to Use

1. **Open the Application**: Open `index.html` in a modern web browser
2. **Enter Text**: Type or paste text in the input area
3. **Select Voice**: Choose your preferred voice from the dropdown
4. **Adjust Settings**: Modify speed, pitch, and volume as desired
5. **Start Speaking**: Click the "Speak" button or use Ctrl+Enter
6. **Control Playback**: Use pause, resume, or stop as needed

## File Structure

```
text-to-speech-demo/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and responsive design
├── script.js           # JavaScript functionality
└── README.md           # Project documentation
```

## Technical Implementation

### HTML Structure
- Semantic HTML5 elements for accessibility
- Form controls for voice settings
- Button controls for playback management
- Progress indicators for user feedback

### CSS Features
- CSS Grid and Flexbox for responsive layouts
- CSS Custom Properties for theme consistency
- CSS Animations for visual feedback
- Media queries for mobile responsiveness
- Glass-morphism effects with backdrop-filter

### JavaScript Functionality
- ES6+ modern JavaScript features
- Web Speech API integration
- Event-driven architecture
- Error handling and browser compatibility checks
- Real-time progress tracking
- Keyboard shortcut support

## Customization

### Adding New Preset Texts
```javascript
// Add to the preset buttons in HTML
<button class="preset-btn" data-text="Your custom text here">
    <i class="fas fa-your-icon"></i> Custom Label
</button>
```

### Modifying Voice Settings
```javascript
// Adjust default values in script.js
this.utterance.rate = 1.0;    // Speed (0.1 - 3.0)
this.utterance.pitch = 1.0;   // Pitch (0 - 2.0)
this.utterance.volume = 1.0;  // Volume (0 - 1.0)
```

### Styling Customization
```css
/* Modify the color scheme in styles.css */
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --accent-color: #your-color;
}
```

## Browser API Information

The application uses the following Web APIs:
- **SpeechSynthesis**: For text-to-speech conversion
- **SpeechSynthesisUtterance**: For speech configuration
- **SpeechSynthesisVoice**: For voice selection

## Troubleshooting

### No Voices Available
- Refresh the page (voices load asynchronously)
- Check browser compatibility
- Ensure system has TTS voices installed

### Speech Not Working
- Check if microphone permissions are blocked
- Ensure volume is not muted
- Try a different browser
- Check browser console for errors

### Performance Issues
- Limit text length for better performance
- Close other tabs using audio/microphone
- Update browser to latest version

## Future Enhancements

- [ ] SSML (Speech Synthesis Markup Language) support
- [ ] Voice recording and playback
- [ ] Text highlighting during speech
- [ ] Multiple language support
- [ ] Voice cloning capabilities
- [ ] Export speech to audio files
- [ ] Real-time speech recognition
- [ ] Custom voice training

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

---

**Enjoy using the Text-to-Speech Demo! 🎤✨**
