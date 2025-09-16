// Text-to-Speech Demo Application
class TextToSpeechApp {
    constructor() {
        this.synth = window.speechSynthesis;
        this.utterance = null;
        this.voices = [];
        this.isPlaying = false;
        this.isPaused = false;
        
        // DOM elements
        this.textInput = document.getElementById('text-input');
        this.voiceSelect = document.getElementById('voice-select');
        this.rateSlider = document.getElementById('rate-slider');
        this.pitchSlider = document.getElementById('pitch-slider');
        this.volumeSlider = document.getElementById('volume-slider');
        this.rateValue = document.getElementById('rate-value');
        this.pitchValue = document.getElementById('pitch-value');
        this.volumeValue = document.getElementById('volume-value');
        this.statusText = document.getElementById('status-text');
        this.progressFill = document.getElementById('progress-fill');
        this.ttsContainer = document.querySelector('.tts-container');
        
        // Buttons
        this.speakBtn = document.getElementById('speak-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.resumeBtn = document.getElementById('resume-btn');
        this.stopBtn = document.getElementById('stop-btn');
        this.clearBtn = document.getElementById('clear-btn');
        
        // Initialize the app
        this.init();
    }
    
    init() {
        this.loadVoices();
        this.bindEvents();
        this.updateSliderValues();
        
        // Load voices when they become available
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = () => this.loadVoices();
        }
    }
    
    loadVoices() {
        this.voices = this.synth.getVoices();
        this.populateVoiceSelect();
    }
    
    populateVoiceSelect() {
        this.voiceSelect.innerHTML = '';
        
        if (this.voices.length === 0) {
            const option = document.createElement('option');
            option.textContent = 'No voices available';
            this.voiceSelect.appendChild(option);
            return;
        }
        
        // Group voices by language
        const voicesByLang = {};
        this.voices.forEach((voice, index) => {
            const lang = voice.lang.split('-')[0];
            if (!voicesByLang[lang]) {
                voicesByLang[lang] = [];
            }
            voicesByLang[lang].push({ voice, index });
        });
        
        // Create options grouped by language
        Object.keys(voicesByLang).sort().forEach(lang => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = this.getLanguageName(lang);
            
            voicesByLang[lang].forEach(({ voice, index }) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = `${voice.name} ${voice.gender ? `(${voice.gender})` : ''}`;
                
                // Mark default voice
                if (voice.default) {
                    option.textContent += ' - Default';
                    option.selected = true;
                }
                
                optgroup.appendChild(option);
            });
            
            this.voiceSelect.appendChild(optgroup);
        });
    }
    
    getLanguageName(code) {
        const languageNames = {
            'en': 'English',
            'es': 'Spanish',
            'fr': 'French',
            'de': 'German',
            'it': 'Italian',
            'pt': 'Portuguese',
            'ru': 'Russian',
            'ja': 'Japanese',
            'ko': 'Korean',
            'zh': 'Chinese',
            'ar': 'Arabic',
            'hi': 'Hindi'
        };
        return languageNames[code] || code.toUpperCase();
    }
    
    bindEvents() {
        // Button events
        this.speakBtn.addEventListener('click', () => this.speak());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resumeBtn.addEventListener('click', () => this.resume());
        this.stopBtn.addEventListener('click', () => this.stop());
        this.clearBtn.addEventListener('click', () => this.clearText());
        
        // Slider events
        this.rateSlider.addEventListener('input', () => this.updateSliderValues());
        this.pitchSlider.addEventListener('input', () => this.updateSliderValues());
        this.volumeSlider.addEventListener('input', () => this.updateSliderValues());
        
        // Preset button events
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const text = e.currentTarget.getAttribute('data-text');
                this.textInput.value = text;
                this.textInput.focus();
            });
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'Enter':
                        e.preventDefault();
                        this.speak();
                        break;
                    case ' ':
                        e.preventDefault();
                        if (this.isPlaying) {
                            if (this.isPaused) {
                                this.resume();
                            } else {
                                this.pause();
                            }
                        }
                        break;
                    case 'Escape':
                        e.preventDefault();
                        this.stop();
                        break;
                }
            }
        });
    }
    
    updateSliderValues() {
        this.rateValue.textContent = this.rateSlider.value;
        this.pitchValue.textContent = this.pitchSlider.value;
        this.volumeValue.textContent = this.volumeSlider.value;
    }
    
    speak() {
        const text = this.textInput.value.trim();
        
        if (!text) {
            this.showStatus('Please enter some text to speak', 'error');
            this.textInput.focus();
            return;
        }
        
        if (this.isPlaying) {
            this.stop();
        }
        
        this.utterance = new SpeechSynthesisUtterance(text);
        
        // Set voice
        const selectedVoiceIndex = this.voiceSelect.value;
        if (selectedVoiceIndex && this.voices[selectedVoiceIndex]) {
            this.utterance.voice = this.voices[selectedVoiceIndex];
        }
        
        // Set parameters
        this.utterance.rate = parseFloat(this.rateSlider.value);
        this.utterance.pitch = parseFloat(this.pitchSlider.value);
        this.utterance.volume = parseFloat(this.volumeSlider.value);
        
        // Event handlers
        this.utterance.onstart = () => {
            this.isPlaying = true;
            this.isPaused = false;
            this.updateButtonStates();
            this.showStatus('Speaking...', 'speaking');
            this.ttsContainer.classList.add('speaking');
            this.startProgress();
        };
        
        this.utterance.onend = () => {
            this.isPlaying = false;
            this.isPaused = false;
            this.updateButtonStates();
            this.showStatus('Finished speaking', 'success');
            this.ttsContainer.classList.remove('speaking');
            this.progressFill.style.width = '100%';
            setTimeout(() => {
                this.progressFill.style.width = '0%';
                this.showStatus('Ready to speak');
            }, 1000);
        };
        
        this.utterance.onerror = (event) => {
            this.isPlaying = false;
            this.isPaused = false;
            this.updateButtonStates();
            this.showStatus(`Error: ${event.error}`, 'error');
            this.ttsContainer.classList.remove('speaking');
            this.progressFill.style.width = '0%';
        };
        
        this.utterance.onpause = () => {
            this.isPaused = true;
            this.updateButtonStates();
            this.showStatus('Paused', 'paused');
            this.ttsContainer.classList.remove('speaking');
        };
        
        this.utterance.onresume = () => {
            this.isPaused = false;
            this.updateButtonStates();
            this.showStatus('Speaking...', 'speaking');
            this.ttsContainer.classList.add('speaking');
        };
        
        // Start speaking
        this.synth.speak(this.utterance);
    }
    
    pause() {
        if (this.isPlaying && !this.isPaused) {
            this.synth.pause();
        }
    }
    
    resume() {
        if (this.isPlaying && this.isPaused) {
            this.synth.resume();
        }
    }
    
    stop() {
        if (this.isPlaying) {
            this.synth.cancel();
            this.isPlaying = false;
            this.isPaused = false;
            this.updateButtonStates();
            this.showStatus('Stopped', 'stopped');
            this.ttsContainer.classList.remove('speaking');
            this.progressFill.style.width = '0%';
        }
    }
    
    clearText() {
        this.textInput.value = '';
        this.textInput.focus();
        this.showStatus('Text cleared');
    }
    
    updateButtonStates() {
        this.speakBtn.disabled = this.isPlaying && !this.isPaused;
        this.pauseBtn.disabled = !this.isPlaying || this.isPaused;
        this.resumeBtn.disabled = !this.isPaused;
        this.stopBtn.disabled = !this.isPlaying;
        
        // Update button text and icons
        if (this.isPlaying && !this.isPaused) {
            this.speakBtn.innerHTML = '<i class="fas fa-play"></i> Speaking...';
        } else {
            this.speakBtn.innerHTML = '<i class="fas fa-play"></i> Speak';
        }
    }
    
    showStatus(message, type = 'default') {
        this.statusText.textContent = message;
        this.statusText.className = `status-${type}`;
        
        // Add status-specific styling
        switch(type) {
            case 'error':
                this.statusText.style.color = '#dc3545';
                break;
            case 'success':
                this.statusText.style.color = '#28a745';
                break;
            case 'speaking':
                this.statusText.style.color = '#667eea';
                break;
            case 'paused':
                this.statusText.style.color = '#ffc107';
                break;
            case 'stopped':
                this.statusText.style.color = '#6c757d';
                break;
            default:
                this.statusText.style.color = '#555';
        }
    }
    
    startProgress() {
        const text = this.textInput.value;
        const wordsPerMinute = 150; // Average speaking speed
        const words = text.split(' ').length;
        const estimatedDuration = (words / wordsPerMinute) * 60 * 1000; // in milliseconds
        
        let startTime = Date.now();
        
        const updateProgress = () => {
            if (!this.isPlaying || this.isPaused) return;
            
            const elapsed = Date.now() - startTime;
            const progress = Math.min((elapsed / estimatedDuration) * 100, 95);
            this.progressFill.style.width = `${progress}%`;
            
            if (this.isPlaying && !this.isPaused) {
                requestAnimationFrame(updateProgress);
            }
        };
        
        updateProgress();
    }
    
    // Utility method to get speech synthesis info
    getSynthesisInfo() {
        return {
            voicesCount: this.voices.length,
            isSupported: 'speechSynthesis' in window,
            currentVoice: this.voices[this.voiceSelect.value]?.name || 'Default',
            currentSettings: {
                rate: this.rateSlider.value,
                pitch: this.pitchSlider.value,
                volume: this.volumeSlider.value
            }
        };
    }
}

// Feature detection and initialization
document.addEventListener('DOMContentLoaded', function() {
    // Check for Speech Synthesis API support
    if (!('speechSynthesis' in window)) {
        document.body.innerHTML = `
            <div class="container">
                <div class="error-message">
                    <h1>🚫 Speech Synthesis Not Supported</h1>
                    <p>Your browser doesn't support the Web Speech API.</p>
                    <p>Please try using a modern browser like Chrome, Firefox, or Safari.</p>
                </div>
            </div>
        `;
        return;
    }
    
    // Initialize the app
    const app = new TextToSpeechApp();
    
    // Make app globally available for debugging
    window.ttsApp = app;
    
    // Add some helpful keyboard shortcuts info
    const helpText = document.createElement('div');
    helpText.innerHTML = `
        <div style="position: fixed; bottom: 10px; right: 10px; background: rgba(0,0,0,0.8); color: white; padding: 10px; border-radius: 8px; font-size: 12px; max-width: 250px; display: none;" id="help-tooltip">
            <strong>Keyboard Shortcuts:</strong><br>
            Ctrl/Cmd + Enter: Speak<br>
            Ctrl/Cmd + Space: Pause/Resume<br>
            Ctrl/Cmd + Escape: Stop<br>
        </div>
    `;
    document.body.appendChild(helpText);
    
    // Show help on hover over controls
    document.querySelector('.controls-section').addEventListener('mouseenter', () => {
        document.getElementById('help-tooltip').style.display = 'block';
    });
    
    document.querySelector('.controls-section').addEventListener('mouseleave', () => {
        document.getElementById('help-tooltip').style.display = 'none';
    });
    
    // Add some sample texts for different languages if voices are available
    setTimeout(() => {
        const voicesAvailable = app.voices.length > 0;
        console.log(`Text-to-Speech Demo loaded with ${app.voices.length} voices available`);
        
        if (voicesAvailable) {
            console.log('Available voices:', app.voices.map(v => `${v.name} (${v.lang})`));
        }
    }, 1000);
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TextToSpeechApp;
}