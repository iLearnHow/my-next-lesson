// Local TTS Client Service
// Replaces ElevenLabs integration with local voice cloning system

class LocalTTSClient {
    constructor(baseUrl = 'http://localhost:8000') {
        this.baseUrl = baseUrl;
        this.referenceAudioPath = null;
        this.isReady = false;
        this.voiceProfiles = {
            kelly: {
                name: 'Kelly',
                description: 'Warm, friendly teacher voice',
                referenceFile: 'kelly_reference.wav',
                language: 'en'
            },
            ken: {
                name: 'Ken',
                description: 'Professional, engaging instructor voice',
                referenceFile: 'ken_reference.wav',
                language: 'en'
            }
        };
    }

    async initialize() {
        try {
            const response = await fetch(`${this.baseUrl}/status`);
            if (response.ok) {
                const status = await response.json();
                this.isReady = status.status === 'ready';
                console.log('Local TTS system status:', status);
                return status;
            } else {
                throw new Error('Failed to connect to local TTS system');
            }
        } catch (error) {
            console.error('Local TTS initialization failed:', error);
            throw error;
        }
    }

    async uploadReferenceVoice(audioFile) {
        try {
            const formData = new FormData();
            formData.append('file', audioFile);

            const response = await fetch(`${this.baseUrl}/upload-reference-voice`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                this.referenceAudioPath = result.reference_path;
                console.log('Reference voice uploaded:', result);
                return result;
            } else {
                const error = await response.json();
                throw new Error(error.detail || 'Upload failed');
            }
        } catch (error) {
            console.error('Reference voice upload failed:', error);
            throw error;
        }
    }

    async synthesizeSpeech(text, options = {}) {
        try {
            if (!this.isReady) {
                throw new Error('TTS system not ready');
            }

            const requestBody = {
                text: text,
                language: options.language || 'en',
                speed: options.speed || 1.0
            };

            if (options.speaker_wav_path) {
                requestBody.speaker_wav_path = options.speaker_wav_path;
            }

            const response = await fetch(`${this.baseUrl}/synthesize`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                const audioBlob = await response.blob();
                return {
                    audio: audioBlob,
                    url: URL.createObjectURL(audioBlob),
                    duration: await this.getAudioDuration(audioBlob)
                };
            } else {
                const error = await response.json();
                throw new Error(error.detail || 'Synthesis failed');
            }
        } catch (error) {
            console.error('Speech synthesis failed:', error);
            throw error;
        }
    }

    async getAudioDuration(audioBlob) {
        return new Promise((resolve) => {
            const audio = new Audio();
            audio.onloadedmetadata = () => {
                resolve(audio.duration);
            };
            audio.src = URL.createObjectURL(audioBlob);
        });
    }

    // Voice profiles for Kelly and Ken (replaces ElevenLabs voice IDs)
    async setupVoiceProfiles() {
        console.log('Setting up voice profiles for Kelly and Ken...');
        
        // Load reference audio files for each voice
        for (const [key, profile] of Object.entries(this.voiceProfiles)) {
            try {
                const response = await fetch(`/assets/audio/${profile.referenceFile}`);
                if (response.ok) {
                    const audioBlob = await response.blob();
                    const file = new File([audioBlob], profile.referenceFile, { type: 'audio/wav' });
                    await this.uploadReferenceVoice(file);
                    console.log(`Voice profile ${profile.name} loaded successfully`);
                } else {
                    console.warn(`Could not load voice profile ${profile.name}: File not found`);
                }
            } catch (error) {
                console.warn(`Could not load voice profile ${profile.name}:`, error);
            }
        }
    }

    // Generate speech for Kelly voice
    async synthesizeKellyVoice(text, options = {}) {
        return this.synthesizeSpeech(text, {
            ...options,
            language: 'en',
            voice: 'kelly'
        });
    }

    // Generate speech for Ken voice
    async synthesizeKenVoice(text, options = {}) {
        return this.synthesizeSpeech(text, {
            ...options,
            language: 'en',
            voice: 'ken'
        });
    }

    // Health check
    async healthCheck() {
        try {
            const response = await fetch(`${this.baseUrl}/status`);
            if (response.ok) {
                const status = await response.json();
                return {
                    healthy: status.status === 'ready',
                    status: status,
                    timestamp: new Date().toISOString()
                };
            } else {
                return {
                    healthy: false,
                    error: 'Status endpoint unavailable',
                    timestamp: new Date().toISOString()
                };
            }
        } catch (error) {
            return {
                healthy: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    // Test the system
    async testSystem() {
        try {
            const testText = "Hello, this is a test of the local TTS system.";
            const result = await this.synthesizeSpeech(testText);
            console.log('TTS test successful:', result);
            return result;
        } catch (error) {
            console.error('TTS test failed:', error);
            throw error;
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LocalTTSClient;
} else if (typeof window !== 'undefined') {
    window.LocalTTSClient = LocalTTSClient;
} 