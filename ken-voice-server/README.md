# Ken Voice Cloning Server

A real server-side voice cloning system for Ken's voice using FastAPI and voice synthesis.

## 🚀 Quick Start

1. **Start the server:**
   ```bash
   cd ken-voice-server
   ./start_server.sh
   ```

2. **Server will be available at:**
   - Main server: http://localhost:8000
   - API docs: http://localhost:8000/docs
   - Test endpoint: http://localhost:8000/test

## 📋 Requirements

- Python 3.8+
- pip
- Ken's reference audio file (`reference_ken.wav`)

## 🔧 Installation

The startup script will automatically:
1. Create a virtual environment
2. Install all required packages
3. Start the server

## 🎤 API Endpoints

### GET `/status`
Get server status and readiness.

### POST `/clone-voice`
Clone Ken's voice for given text.

**Request:**
```json
{
  "text": "Hello Nicolette! This is Ken speaking.",
  "voice_id": "ken",
  "speed": 1.0,
  "pitch": 1.0
}
```

**Response:**
```json
{
  "success": true,
  "audio_url": "/audio/temp_audio.wav",
  "duration": 3.5,
  "message": "Voice cloned successfully"
}
```

### POST `/upload-reference`
Upload Ken's reference audio file.

### GET `/audio/{filename}`
Download generated audio files.

### GET `/test`
Test the voice cloning system.

## 🎯 Features

- **Real voice cloning** using Ken's reference audio
- **Voice characteristic extraction** (pitch, formants, MFCC)
- **Ken-like speech synthesis** with harmonics and formants
- **RESTful API** for easy integration
- **CORS enabled** for web client access
- **Audio file serving** for generated speech

## 🔬 Technical Details

### Voice Analysis
- Extracts fundamental frequency (pitch)
- Analyzes formant frequencies
- Computes MFCC features
- Calculates spectral characteristics

### Speech Synthesis
- Uses Ken's voice characteristics
- Generates harmonics based on fundamental frequency
- Applies formant filtering
- Adds natural voice variations (jitter, shimmer)

### Audio Processing
- Sample rate: 22050 Hz
- Format: WAV
- Channels: Mono
- Bit depth: 16-bit

## 🚀 Deployment

### Local Development
```bash
./start_server.sh
```

### Production
1. Install dependencies: `pip install -r requirements.txt`
2. Start server: `python main.py`
3. Configure reverse proxy (nginx) if needed
4. Set up SSL certificates

## 🔗 Integration

The server is designed to work with the MyNextLesson.com frontend. The client-side script (`server-voice-client.js`) connects to this server to generate Ken's voice for lessons.

## 🐛 Troubleshooting

### Server won't start
- Check Python version: `python3 --version`
- Ensure all dependencies are installed
- Check if port 8000 is available

### No audio output
- Verify reference audio file exists
- Check server logs for errors
- Test with `/test` endpoint

### CORS errors
- Server has CORS enabled for all origins
- Check browser console for specific errors

## 📝 License

This is part of the MyNextLesson.com project. 

## Production Deployment

To run the Ken Voice Cloning Server in production mode, use one of the following commands:

### Using Uvicorn (recommended for FastAPI)

```
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Using Gunicorn with Uvicorn Worker

```
gunicorn main:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 --workers 4
```

- Ensure all dependencies are installed and the reference audio is present.
- Use a process manager (systemd, supervisor, Docker Compose) to keep the server running.
- The server will be available at http://localhost:8000 or your configured host/port. 