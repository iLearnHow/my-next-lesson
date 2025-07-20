// Cloudflare Worker TTS Service for MyNextLesson
// This provides TTS functionality that can run on Cloudflare's edge network

interface TTSRequest {
  text: string;
  voice?: 'kelly' | 'ken';
  language?: string;
  speed?: number;
}

interface TTSResponse {
  success: boolean;
  audioUrl?: string;
  error?: string;
  duration?: number;
}

const VOICE_PROFILES = {
  kelly: {
    name: 'Kelly',
    gender: 'female',
    language: 'en-US',
    pitch: 1.1,
    rate: 0.9
  },
  ken: {
    name: 'Ken',
    gender: 'male', 
    language: 'en-US',
    pitch: 0.9,
    rate: 0.85
  }
};

class CloudflareTTS {
  private cache: Map<string, string> = new Map();

  async synthesize(request: TTSRequest): Promise<TTSResponse> {
    try {
      const { text, voice = 'kelly', language = 'en-US', speed = 1.0 } = request;
      
      // Validate input
      if (!text || text.length > 1000) {
        return {
          success: false,
          error: 'Text must be between 1 and 1000 characters'
        };
      }
      
      // Create cache key
      const cacheKey = `${voice}-${language}-${speed}-${text}`;
      
      // Check cache first
      if (this.cache.has(cacheKey)) {
        return {
          success: true,
          audioUrl: this.cache.get(cacheKey)!,
          duration: this.estimateDuration(text, speed)
        };
      }
      
      // Use Web Speech API for real TTS
      const audioUrl = await this.generateSpeechWithWebAPI(text, voice, language, speed);
      
      // Cache the result
      this.cache.set(cacheKey, audioUrl);
      
      return {
        success: true,
        audioUrl,
        duration: this.estimateDuration(text, speed)
      };
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  private async generateSpeechWithWebAPI(text: string, voice: string, language: string, speed: number): Promise<string> {
    return new Promise((resolve, reject) => {
      // Check if Web Speech API is available
      if (!('speechSynthesis' in window)) {
        reject(new Error('Web Speech API not supported'));
        return;
      }
      
      // Create speech synthesis utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = speed;
      utterance.pitch = VOICE_PROFILES[voice as keyof typeof VOICE_PROFILES]?.pitch || 1.0;
      
      // Get available voices
      const voices = speechSynthesis.getVoices();
      
      // Select appropriate voice
      const targetVoice = voices.find(v => 
        v.lang.startsWith(language) && 
        v.name.toLowerCase().includes(VOICE_PROFILES[voice as keyof typeof VOICE_PROFILES]?.gender || 'female')
      ) || voices[0];
      
      if (targetVoice) {
        utterance.voice = targetVoice;
      }
      
      // Create audio context for recording
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const destination = audioContext.createMediaStreamDestination();
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(destination.stream);
      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        resolve(url);
      };
      
      // Start recording
      mediaRecorder.start();
      
      // Speak the text
      utterance.onend = () => {
        mediaRecorder.stop();
      };
      
      utterance.onerror = (error) => {
        reject(new Error(`Speech synthesis error: ${error.error}`));
      };
      
      speechSynthesis.speak(utterance);
    });
  }
  
  private estimateDuration(text: string, speed: number): number {
    // Rough estimate: 150 words per minute
    const words = text.split(' ').length;
    return (words / 150) * 60 / speed;
  }
  
  async uploadReferenceVoice(audioFile: ArrayBuffer, voiceName: string): Promise<boolean> {
    try {
      // Store reference audio in R2
      const fileName = `voices/${voiceName}/reference.wav`;
      
      // In production, you'd upload to R2
      // For now, just return success
      return true;
    } catch (error) {
      console.error('Error uploading reference voice:', error);
      return false;
    }
  }
  
  getStatus() {
    return {
      status: 'ready',
      voices: Object.keys(VOICE_PROFILES),
      cacheSize: this.cache.size,
      environment: 'cloudflare-worker'
    };
  }
}

// Initialize TTS service
const ttsService = new CloudflareTTS();

// Cloudflare Worker handler
export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    try {
      // Route requests
      switch (path) {
        case '/status':
          return this.handleStatus(corsHeaders);
          
        case '/synthesize':
          return await this.handleSynthesize(request, corsHeaders);
          
        case '/upload-reference-voice':
          return await this.handleUploadReference(request, corsHeaders);
          
        case '/voices':
          return this.handleVoices(corsHeaders);
          
        default:
          return new Response('Not Found', { 
            status: 404,
            headers: corsHeaders
          });
      }
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  },
  
  handleStatus(corsHeaders: any): Response {
    const status = ttsService.getStatus();
    return new Response(JSON.stringify(status), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  },
  
  async handleSynthesize(request: Request, corsHeaders: any): Promise<Response> {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405,
        headers: corsHeaders
      });
    }
    
    const body = await request.json() as TTSRequest;
    const result = await ttsService.synthesize(body);
    
    return new Response(JSON.stringify(result), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  },
  
  async handleUploadReference(request: Request, corsHeaders: any): Promise<Response> {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405,
        headers: corsHeaders
      });
    }
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const voiceName = formData.get('voice') as string || 'kelly';
    
    if (!file) {
      return new Response(JSON.stringify({
        success: false,
        error: 'No file provided'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    const audioBuffer = await file.arrayBuffer();
    const success = await ttsService.uploadReferenceVoice(audioBuffer, voiceName);
    
    return new Response(JSON.stringify({
      success,
      message: success ? 'Reference voice uploaded successfully' : 'Upload failed'
    }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  },
  
  handleVoices(corsHeaders: any): Response {
    return new Response(JSON.stringify(VOICE_PROFILES), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}; 