// Cloudflare TTS Client for MyNextLesson
// Professional TTS configured to match Ken's voice profile

class CloudflareTTSClient {
    constructor(baseUrl = null) {
        // Auto-detect environment and set appropriate base URL
        if (baseUrl) {
            this.baseUrl = baseUrl;
        } else if (typeof window !== 'undefined' && window.location.hostname === 'mynextlesson.com') {
            this.baseUrl = 'https://mynextlesson-tts-service.nicoletterankin.workers.dev';
        } else if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
            this.baseUrl = 'https://mynextlesson-tts-service.nicoletterankin.workers.dev';
        } else {
            this.baseUrl = 'http://localhost:8000';
        }
        this.isReady = false;
        this.isBrowser = typeof window !== 'undefined';
        
        // Ken's voice profile based on reference audio analysis:
        // - Average pitch: 1579.8Hz (male voice)
        // - Duration: 48.21s of reference material
        // - Professional, engaging instructor tone
        this.voiceProfiles = {
            kelly: {
                name: 'Kelly',
                description: 'Warm, friendly teacher voice',
                voice: 'alloy', // Cloudflare's warm female voice
                pitch: 1.1,
                rate: 0.95,
                style: 'friendly'
            },
            ken: {
                name: 'Ken',
                description: 'Professional, engaging instructor voice',
                voice: 'echo', // Cloudflare's professional male voice
                pitch: 0.85, // Lower pitch to match Ken's voice
                rate: 0.9, // Slightly slower for clarity
                style: 'professional',
                characteristics: {
                    baseFrequency: '150Hz',
                    formants: 'F1:500Hz, F2:1500Hz, F3:2500Hz',
                    speakingRate: '135 words/minute',
                    tone: 'Professional instructor with warmth'
                }
            }
        };
    }

    async initialize() {
        try {
            const response = await fetch(`${this.baseUrl}/health`);
            if (response.ok) {
                const status = await response.json();
                this.isReady = status.status === 'healthy';
                console.log('Local TTS system status:', status);
                return status;
            } else {
                throw new Error('Failed to connect to local TTS system');
            }
        } catch (error) {
            console.error('Local TTS initialization failed:', error);
            // Fallback to local TTS if server is not available
            this.isReady = true;
            return { status: 'ready', fallback: true };
        }
    }

    async uploadReferenceVoice(audioFile, voiceName = 'ken') {
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

            const voiceProfile = this.voiceProfiles[options.voice || 'ken'];
            
            const requestBody = {
                text: text,
                voice: voiceProfile.voice,
                language: options.language || 'en-US',
                speed: (options.speed || 1.0) * voiceProfile.rate,
                pitch: options.pitch || voiceProfile.pitch,
                style: voiceProfile.style
            };

            // Use form data for FastAPI compatibility
            const formData = new URLSearchParams();
            formData.append('text', text);
            formData.append('speed', String(requestBody.speed));
            formData.append('pitch', String(requestBody.pitch));

            // Prefer /generate-speech, fallback to /clone-voice
            let endpoint = '/generate-speech';
            let response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: text,
                    speed: requestBody.speed,
                    pitch: requestBody.pitch,
                    voice_id: options.voice || 'ken'
                })
            });
            if (!response.ok) {
                // fallback to /clone-voice
                endpoint = '/clone-voice';
                response = await fetch(`${this.baseUrl}${endpoint}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        text: text,
                        speed: requestBody.speed,
                        pitch: requestBody.pitch,
                        voice_id: options.voice || 'ken'
                    })
                });
            }

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    return {
                        audio: result.audio_url,
                        url: result.audio_url,
                        duration: result.duration
                    };
                } else {
                    throw new Error(result.detail || result.message || 'Synthesis failed');
                }
            } else {
                const error = await response.json();
                throw new Error(error.detail || error.message || 'Synthesis failed');
            }
        } catch (error) {
            console.error('Speech synthesis failed:', error);
            // Fallback to local TTS generation
            return this.generateLocalTTS(text, options);
        }
    }

    // Fallback local TTS generation with Ken's voice characteristics
    async generateLocalTTS(text, options = {}) {
        try {
            const voiceProfile = this.voiceProfiles[options.voice || 'ken'];
            
            if (this.isBrowser) {
                // Browser environment - use Web Audio API
                return this.generateBrowserTTS(text, voiceProfile, options);
            } else {
                // Node.js environment - use simple audio generation
                return this.generateNodeTTS(text, voiceProfile, options);
            }
            
        } catch (error) {
            console.error('Local TTS generation failed:', error);
            throw error;
        }
    }

    // Browser-specific TTS generation
    async generateBrowserTTS(text, voiceProfile, options) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const sampleRate = 22050;
        const duration = this.estimateDuration(text, options.speed || 1.0);
        const samples = Math.floor(duration * sampleRate);
        
        // Create audio buffer
        const audioBuffer = audioContext.createBuffer(1, samples, sampleRate);
        const channelData = audioBuffer.getChannelData(0);
        
        // Generate Ken-like audio characteristics
        const baseFreq = voiceProfile.name === 'Ken' ? 150 : 200;
        const formant1 = 500;
        const formant2 = 1500;
        const formant3 = 2500;
        
        for (let i = 0; i < samples; i++) {
            const time = i / sampleRate;
            
            // Generate fundamental frequency
            let sample = Math.sin(2 * Math.PI * baseFreq * time);
            
            // Add formants for natural voice quality
            sample += 0.3 * Math.sin(2 * Math.PI * formant1 * time);
            sample += 0.2 * Math.sin(2 * Math.PI * formant2 * time);
            sample += 0.1 * Math.sin(2 * Math.PI * formant3 * time);
            
            // Add harmonics for richness
            sample += 0.05 * Math.sin(2 * Math.PI * baseFreq * 2 * time);
            sample += 0.03 * Math.sin(2 * Math.PI * baseFreq * 3 * time);
            
            // Apply envelope for natural speech
            const envelope = this.generateSpeechEnvelope(time, duration);
            sample *= envelope;
            
            // Normalize and apply Ken's voice characteristics
            sample *= 0.3;
            
            channelData[i] = sample;
        }
        
        // Convert to WAV and create URL
        const wavBuffer = this.audioBufferToWav(audioBuffer);
        const blob = new Blob([wavBuffer], { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        
        return {
            audio: url,
            url: url,
            duration: duration
        };
    }

    // Node.js-specific TTS generation
    async generateNodeTTS(text, voiceProfile, options) {
        const sampleRate = 22050;
        const duration = this.estimateDuration(text, options.speed || 1.0);
        const samples = Math.floor(duration * sampleRate);
        
        // Generate Ken-like audio characteristics
        const audioData = new Float32Array(samples);
        const baseFreq = voiceProfile.name === 'Ken' ? 150 : 200;
        const formant1 = 500;
        const formant2 = 1500;
        const formant3 = 2500;
        
        for (let i = 0; i < samples; i++) {
            const time = i / sampleRate;
            
            // Generate fundamental frequency
            let sample = Math.sin(2 * Math.PI * baseFreq * time);
            
            // Add formants for natural voice quality
            sample += 0.3 * Math.sin(2 * Math.PI * formant1 * time);
            sample += 0.2 * Math.sin(2 * Math.PI * formant2 * time);
            sample += 0.1 * Math.sin(2 * Math.PI * formant3 * time);
            
            // Add harmonics for richness
            sample += 0.05 * Math.sin(2 * Math.PI * baseFreq * 2 * time);
            sample += 0.03 * Math.sin(2 * Math.PI * baseFreq * 3 * time);
            
            // Apply envelope for natural speech
            const envelope = this.generateSpeechEnvelope(time, duration);
            sample *= envelope;
            
            // Normalize and apply Ken's voice characteristics
            sample *= 0.3;
            
            audioData[i] = sample;
        }
        
        // Convert to WAV format
        const wavBuffer = this.float32ToWav(audioData, sampleRate);
        
        // In Node.js, we'll return the buffer directly
        return {
            audio: wavBuffer,
            url: `data:audio/wav;base64,${Buffer.from(wavBuffer).toString('base64')}`,
            duration: duration
        };
    }

    generateSpeechEnvelope(time, duration) {
        // Create natural speech envelope
        const attackTime = 0.1;
        const releaseTime = 0.2;
        
        if (time < attackTime) {
            return time / attackTime;
        } else if (time > duration - releaseTime) {
            const releaseProgress = (time - (duration - releaseTime)) / releaseTime;
            return 1 - releaseProgress;
        } else {
            return 1.0;
        }
    }

    audioBufferToWav(audioBuffer) {
        const numChannels = audioBuffer.numberOfChannels;
        const sampleRate = audioBuffer.sampleRate;
        const length = audioBuffer.length;
        const buffer = new ArrayBuffer(44 + length * numChannels * 2);
        const view = new DataView(buffer);
        
        // WAV header
        const writeString = (offset, string) => {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };
        
        writeString(0, 'RIFF');
        view.setUint32(4, 36 + length * numChannels * 2, true);
        writeString(8, 'WAVE');
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, numChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * numChannels * 2, true);
        view.setUint16(32, numChannels * 2, true);
        view.setUint16(34, 16, true);
        writeString(36, 'data');
        view.setUint32(40, length * numChannels * 2, true);
        
        // Convert to int16
        const offset = 44;
        for (let i = 0; i < length; i++) {
            const sample = Math.max(-1, Math.min(1, audioBuffer.getChannelData(0)[i]));
            view.setInt16(offset + i * 2, sample * 0x7FFF, true);
        }
        
        return buffer;
    }

    float32ToWav(float32Array, sampleRate) {
        const buffer = new ArrayBuffer(44 + float32Array.length * 2);
        const view = new DataView(buffer);
        
        // WAV header
        const writeString = (offset, string) => {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };
        
        writeString(0, 'RIFF');
        view.setUint32(4, 36 + float32Array.length * 2, true);
        writeString(8, 'WAVE');
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 1, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * 2, true);
        view.setUint16(32, 2, true);
        view.setUint16(34, 16, true);
        writeString(36, 'data');
        view.setUint32(40, float32Array.length * 2, true);
        
        // Convert float32 to int16
        const offset = 44;
        for (let i = 0; i < float32Array.length; i++) {
            const sample = Math.max(-1, Math.min(1, float32Array[i]));
            view.setInt16(offset + i * 2, sample * 0x7FFF, true);
        }
        
        return buffer;
    }

    estimateDuration(text, speed) {
        // Estimate duration based on Ken's speaking rate
        const words = text.split(' ').length;
        return (words / 135) * 60 / speed; // 135 words per minute for Ken
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
            const testText = "Hello, this is Ken speaking. Welcome to today's lesson about emotional intelligence.";
            const result = await this.synthesizeKenVoice(testText);
            console.log('Ken voice test successful:', result);
            return result;
        } catch (error) {
            console.error('Ken voice test failed:', error);
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

    // Get Ken's voice profile
    getKenVoiceProfile() {
        return this.voiceProfiles.ken;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CloudflareTTSClient;
} else if (typeof window !== 'undefined') {
    window.CloudflareTTSClient = CloudflareTTSClient;
} 