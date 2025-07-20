// Cloudflare TTS Client for MyNextLesson
// Works with the Cloudflare Worker TTS service

class CloudflareTTSClient {
    constructor(baseUrl = 'https://tts.mynextlesson.com') {
        this.baseUrl = baseUrl;
        this.isReady = false;
        this.voiceProfiles = {
            kelly: {
                name: 'Kelly',
                description: 'Warm, friendly teacher voice',
                pitch: 1.1,
                rate: 1.0
            },
            ken: {
                name: 'Ken',
                description: 'Professional, engaging instructor voice',
                pitch: 0.9,
                rate: 1.0
            }
        };
    }

    async initialize() {
        try {
            const response = await fetch(`${this.baseUrl}/status`);
            if (response.ok) {
                const status = await response.json();
                this.isReady = status.status === 'ready';
                console.log('Cloudflare TTS system status:', status);
                return status;
            } else {
                throw new Error('Failed to connect to Cloudflare TTS system');
            }
        } catch (error) {
            console.error('Cloudflare TTS initialization failed:', error);
            throw error;
        }
    }

    async uploadReferenceVoice(audioFile, voiceName = 'kelly') {
        try {
            const formData = new FormData();
            formData.append('file', audioFile);
            formData.append('voice', voiceName);

            const response = await fetch(`${this.baseUrl}/upload-reference-voice`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Reference voice uploaded:', result);
                return result;
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Upload failed');
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
                voice: options.voice || 'kelly',
                language: options.language || 'en-US',
                speed: options.speed || 1.0
            };

            const response = await fetch(`${this.baseUrl}/synthesize`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    return {
                        audio: result.audioUrl,
                        url: result.audioUrl,
                        duration: result.duration
                    };
                } else {
                    throw new Error(result.error || 'Synthesis failed');
                }
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Synthesis failed');
            }
        } catch (error) {
            console.error('Speech synthesis failed:', error);
            throw error;
        }
    }

    // Generate speech for Kelly voice
    async synthesizeKellyVoice(text, options = {}) {
        return this.synthesizeSpeech(text, {
            ...options,
            voice: 'kelly',
            language: 'en-US'
        });
    }

    // Generate speech for Ken voice
    async synthesizeKenVoice(text, options = {}) {
        return this.synthesizeSpeech(text, {
            ...options,
            voice: 'ken',
            language: 'en-US'
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
            const testText = "Hello, this is a test of the Cloudflare TTS system for MyNextLesson.";
            const result = await this.synthesizeSpeech(testText);
            console.log('Cloudflare TTS test successful:', result);
            return result;
        } catch (error) {
            console.error('Cloudflare TTS test failed:', error);
            throw error;
        }
    }

    // Get available voices
    async getVoices() {
        try {
            const response = await fetch(`${this.baseUrl}/voices`);
            if (response.ok) {
                return await response.json();
            } else {
                throw new Error('Failed to fetch voices');
            }
        } catch (error) {
            console.error('Failed to get voices:', error);
            return this.voiceProfiles;
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CloudflareTTSClient;
} else if (typeof window !== 'undefined') {
    window.CloudflareTTSClient = CloudflareTTSClient;
} 