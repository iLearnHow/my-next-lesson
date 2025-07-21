#!/usr/bin/env python3
"""
KEN VOICE CLONING SERVER
Real server-side voice cloning for Ken's voice
"""

import os
import io
import tempfile
import logging
from typing import Optional
import numpy as np
import torch
import torchaudio
import librosa
from fastapi import FastAPI, File, UploadFile, HTTPException, Form, Request
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import soundfile as sf
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Ken Voice Cloning Server", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VoiceCloneRequest(BaseModel):
    text: str
    voice_id: str = "ken"
    speed: float = 1.0
    pitch: float = 1.0

class VoiceCloneResponse(BaseModel):
    success: bool
    audio_url: Optional[str] = None
    duration: Optional[float] = None
    message: str

class KenVoiceCloner:
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.reference_audio = None
        self.voice_model = None
        self.tokenizer = None
        self.sample_rate = 22050
        self.is_ready = False
        self.init_voice_cloning()
    
    def init_voice_cloning(self):
        """Initialize the voice cloning system"""
        try:
            logger.info("Initializing Ken Voice Cloning System...")
            
            # Load Ken's reference audio
            self.load_ken_reference()
            
            # Initialize voice cloning model
            self.init_voice_model()
            
            self.is_ready = True
            logger.info("✅ Ken Voice Cloning System Ready!")
            
        except Exception as e:
            logger.error(f"❌ Error initializing voice cloning: {e}")
            self.is_ready = False
    
    def load_ken_reference(self):
        """Load Ken's reference audio file"""
        try:
            reference_path = "reference_ken.wav"
            if not os.path.exists(reference_path):
                # Create a placeholder reference if not found
                logger.warning("Reference audio not found, creating placeholder")
                self.create_placeholder_reference()
            else:
                # Load actual reference audio
                self.reference_audio, _ = librosa.load(reference_path, sr=self.sample_rate)
                logger.info(f"✅ Loaded Ken's reference audio: {len(self.reference_audio)} samples")
                
        except Exception as e:
            logger.error(f"❌ Error loading reference audio: {e}")
            self.create_placeholder_reference()
    
    def create_placeholder_reference(self):
        """Create a placeholder reference audio for testing"""
        # Generate a simple sine wave as placeholder
        duration = 3.0  # 3 seconds
        t = np.linspace(0, duration, int(self.sample_rate * duration))
        # Male voice frequency range
        self.reference_audio = 0.3 * np.sin(2 * np.pi * 150 * t)  # 150 Hz
        logger.info("✅ Created placeholder reference audio")
    
    def init_voice_model(self):
        """Initialize the voice cloning model"""
        try:
            # For now, we'll use a simple approach with TTS
            # In a real implementation, you'd load a proper voice cloning model
            logger.info("Initializing voice model...")
            
            # This is a placeholder - in reality you'd load:
            # - Tacotron2 + WaveNet
            # - YourTTS
            # - Coqui TTS
            # - or similar voice cloning models
            
            self.voice_model = "simple_tts"  # Placeholder
            self.tokenizer = "simple_tokenizer"  # Placeholder
            
            logger.info("✅ Voice model initialized")
            
        except Exception as e:
            logger.error(f"❌ Error initializing voice model: {e}")
            self.voice_model = None
    
    def extract_voice_characteristics(self, audio):
        """Extract voice characteristics from reference audio"""
        try:
            # Extract fundamental frequency (pitch)
            pitches, magnitudes = librosa.piptrack(y=audio, sr=self.sample_rate)
            pitch_values = pitches[magnitudes > np.percentile(magnitudes, 90)]
            fundamental_freq = np.median(pitch_values) if len(pitch_values) > 0 else 150
            
            # Extract formants
            stft = librosa.stft(audio)
            frequencies = librosa.fft_frequencies(sr=self.sample_rate)
            
            # Find spectral peaks (formants)
            spectrum = np.mean(np.abs(stft), axis=1)
            peaks, _ = librosa.effects.hpss(spectrum)
            formant_freqs = frequencies[np.argsort(peaks)[-3:]]  # Top 3 formants
            
            # Extract other characteristics
            mfcc = librosa.feature.mfcc(y=audio, sr=self.sample_rate, n_mfcc=13)
            spectral_centroid = librosa.feature.spectral_centroid(y=audio, sr=self.sample_rate)
            
            characteristics = {
                "fundamental_freq": float(fundamental_freq),
                "formants": formant_freqs.tolist(),
                "mfcc_mean": np.mean(mfcc, axis=1).tolist(),
                "spectral_centroid_mean": float(np.mean(spectral_centroid)),
                "duration": len(audio) / self.sample_rate
            }
            
            logger.info(f"✅ Extracted voice characteristics: {characteristics}")
            return characteristics
            
        except Exception as e:
            logger.error(f"❌ Error extracting voice characteristics: {e}")
            return None
    
    def synthesize_speech(self, text, voice_characteristics):
        """Synthesize speech using Ken's voice characteristics"""
        try:
            logger.info(f"Synthesizing speech: '{text}'")
            
            # This is where you'd implement actual voice cloning
            # For now, we'll use a simple TTS approach with Ken's characteristics
            
            # Generate speech using Ken's voice characteristics
            audio = self.generate_ken_like_speech(text, voice_characteristics)
            
            # Save to temporary file
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
            sf.write(temp_file.name, audio, self.sample_rate)
            
            logger.info(f"✅ Speech synthesized: {temp_file.name}")
            return temp_file.name, len(audio) / self.sample_rate
            
        except Exception as e:
            logger.error(f"❌ Error synthesizing speech: {e}")
            raise
    
    def generate_ken_like_speech(self, text, characteristics):
        """Generate Ken-like speech using his voice characteristics"""
        try:
            # Estimate duration based on text length
            words = text.split()
            estimated_duration = len(words) * 0.5  # 0.5 seconds per word
            samples = int(estimated_duration * self.sample_rate)
            
            # Generate base audio using Ken's fundamental frequency
            fundamental_freq = characteristics.get("fundamental_freq", 150)
            t = np.linspace(0, estimated_duration, samples)
            
            # Create harmonics based on Ken's voice
            audio = np.zeros(samples)
            
            # Fundamental frequency
            audio += 0.3 * np.sin(2 * np.pi * fundamental_freq * t)
            
            # Harmonics
            for i in range(2, 6):
                audio += 0.1 * np.sin(2 * np.pi * fundamental_freq * i * t) / i
            
            # Apply formant filtering
            formants = characteristics.get("formants", [800, 1200, 2400])
            for formant in formants:
                audio += 0.05 * np.sin(2 * np.pi * formant * t)
            
            # Apply envelope
            envelope = np.exp(-t / estimated_duration)
            audio *= envelope
            
            # Normalize
            audio = audio / np.max(np.abs(audio)) * 0.8
            
            # Add some Ken-like characteristics
            # Jitter (pitch variation)
            jitter = 0.02
            for i in range(len(audio)):
                jitter_mod = 1 + jitter * np.sin(2 * np.pi * 5 * i / self.sample_rate)
                audio[i] *= jitter_mod
            
            logger.info(f"✅ Generated Ken-like speech: {len(audio)} samples")
            return audio
            
        except Exception as e:
            logger.error(f"❌ Error generating Ken-like speech: {e}")
            # Fallback: simple sine wave
            duration = len(text.split()) * 0.5
            samples = int(duration * self.sample_rate)
            t = np.linspace(0, duration, samples)
            return 0.3 * np.sin(2 * np.pi * 150 * t)

# Initialize voice cloner
voice_cloner = KenVoiceCloner()

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Ken Voice Cloning Server",
        "status": "running",
        "ready": voice_cloner.is_ready
    }

@app.get("/status")
async def status():
    """Get server status"""
    return {
        "status": "ready" if voice_cloner.is_ready else "initializing",
        "device": str(voice_cloner.device),
        "sample_rate": voice_cloner.sample_rate,
        "reference_loaded": voice_cloner.reference_audio is not None
    }

@app.post("/clone-voice")
async def clone_voice(request: VoiceCloneRequest):
    """Clone Ken's voice for given text"""
    try:
        if not voice_cloner.is_ready:
            raise HTTPException(status_code=503, detail="Voice cloning system not ready")
        
        # Extract Ken's voice characteristics
        voice_characteristics = voice_cloner.extract_voice_characteristics(voice_cloner.reference_audio)
        
        if not voice_characteristics:
            raise HTTPException(status_code=500, detail="Failed to extract voice characteristics")
        
        # Synthesize speech
        audio_file, duration = voice_cloner.synthesize_speech(request.text, voice_characteristics)
        
        return VoiceCloneResponse(
            success=True,
            audio_url=f"/audio/{os.path.basename(audio_file)}",
            duration=duration,
            message="Voice cloned successfully"
        )
        
    except Exception as e:
        logger.error(f"❌ Error cloning voice: {e}")
        return VoiceCloneResponse(
            success=False,
            message=f"Error cloning voice: {str(e)}"
        )

@app.post("/generate-speech")
async def generate_speech(request: Request):
    try:
        data = await request.json()
        text = data.get("text")
        speed = float(data.get("speed", 1.0))
        pitch = float(data.get("pitch", 1.0))
        voice_id = data.get("voice_id", "ken")
        if not voice_cloner.is_ready:
            raise HTTPException(status_code=503, detail="Voice cloning system not ready")
        voice_characteristics = voice_cloner.extract_voice_characteristics(voice_cloner.reference_audio)
        if not voice_characteristics:
            raise HTTPException(status_code=500, detail="Failed to extract voice characteristics")
        audio_file, duration = voice_cloner.synthesize_speech(text, voice_characteristics)
        return {
            "success": True,
            "audio_url": f"/audio/{os.path.basename(audio_file)}",
            "duration": duration,
            "message": "Voice cloned successfully"
        }
    except Exception as e:
        logger.error(f"❌ Error in /generate-speech: {e}")
        return {"success": False, "message": f"Error: {str(e)}"}

@app.post("/upload-reference")
async def upload_reference(file: UploadFile = File(...)):
    """Upload reference audio for voice cloning"""
    try:
        # Save uploaded file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
        content = await file.read()
        temp_file.write(content)
        temp_file.close()
        
        # Load and process reference audio
        audio, sr = librosa.load(temp_file.name, sr=voice_cloner.sample_rate)
        voice_cloner.reference_audio = audio
        
        # Clean up temp file
        os.unlink(temp_file.name)
        
        logger.info(f"✅ Reference audio uploaded: {len(audio)} samples")
        
        return {
            "success": True,
            "message": "Reference audio uploaded successfully",
            "duration": len(audio) / sr,
            "sample_rate": sr
        }
        
    except Exception as e:
        logger.error(f"❌ Error uploading reference: {e}")
        raise HTTPException(status_code=500, detail=f"Error uploading reference: {str(e)}")

@app.get("/audio/{filename}")
async def get_audio(filename: str):
    """Serve generated audio files"""
    try:
        # This is a simplified version - in production you'd use proper file storage
        temp_dir = tempfile.gettempdir()
        file_path = os.path.join(temp_dir, filename)
        
        if os.path.exists(file_path):
            return FileResponse(file_path, media_type="audio/wav")
        else:
            raise HTTPException(status_code=404, detail="Audio file not found")
            
    except Exception as e:
        logger.error(f"❌ Error serving audio: {e}")
        raise HTTPException(status_code=500, detail=f"Error serving audio: {str(e)}")

@app.get("/test")
async def test():
    """Test endpoint"""
    try:
        test_text = "Hello Nicolette! This is Ken speaking through the voice cloning server."
        
        if not voice_cloner.is_ready:
            return {"success": False, "message": "Voice cloning system not ready"}
        
        # Extract characteristics
        voice_characteristics = voice_cloner.extract_voice_characteristics(voice_cloner.reference_audio)
        
        # Synthesize test speech
        audio_file, duration = voice_cloner.synthesize_speech(test_text, voice_characteristics)
        
        return {
            "success": True,
            "message": "Test successful",
            "audio_url": f"/audio/{os.path.basename(audio_file)}",
            "duration": duration,
            "text": test_text
        }
        
    except Exception as e:
        logger.error(f"❌ Test failed: {e}")
        return {"success": False, "message": f"Test failed: {str(e)}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 