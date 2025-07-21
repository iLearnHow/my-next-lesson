import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function KenVoiceDemo() {
  const [text, setText] = useState('Hello, this is Ken. Welcome to MyNextLesson where we make learning extraordinary!');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);
  const [systemStatus, setSystemStatus] = useState('checking');

  // Check TTS system status on load
  useEffect(() => {
    checkSystemStatus();
  }, []);

  const checkSystemStatus = async () => {
    try {
      // Try Coqui TTS server first
      const coquiResponse = await fetch('http://146.190.166.163:5003/health', { 
        method: 'GET',
        timeout: 5000 
      });
      
      if (coquiResponse.ok) {
        setSystemStatus('coqui-ready');
        return;
      }
      
      // Fallback to local TTS
      const localResponse = await fetch('/api/tts/health');
      if (localResponse.ok) {
        setSystemStatus('local-ready');
      } else {
        setSystemStatus('offline');
      }
    } catch (error) {
      console.log('TTS system check:', error);
      setSystemStatus('offline');
    }
  };

  const generateKenVoice = async () => {
    if (!text.trim()) return;

    setIsGenerating(true);
    setError(null);
    setAudioUrl(null);

    try {
      // Try Coqui TTS first
      let response = await fetch('http://146.190.166.163:5003/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        body: new FormData([
          ['text', text],
          ['language', 'en'],
          ['speaker_wav', '/root/reference_ken.wav']
        ])
      });

      if (!response.ok) {
        // Fallback to local TTS API
        response = await fetch('/api/generate-ken-voice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            text: text,
            speed: 1.0,
            pitch: 1.0,
            voice_id: 'ken'
          })
        });
      }

      if (!response.ok) {
        throw new Error(`TTS request failed: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.audio_url) {
        setAudioUrl(result.audio_url);
      } else {
        throw new Error(result.message || 'Voice generation failed');
      }

    } catch (error) {
      console.error('Ken voice generation error:', error);
      setError(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const sampleTexts = [
    "Hello, this is Ken. Welcome to MyNextLesson where we make learning extraordinary!",
    "Today we're exploring the fascinating world of astrobiology and the search for life beyond Earth.",
    "Did you know that scientists believe there could be over 40 billion Earth-like planets in our galaxy alone?",
    "Learning is not just about memorizing facts, it's about developing curiosity and critical thinking skills.",
    "Let's embark on this educational journey together and discover something amazing!"
  ];

  return (
    <>
      <Head>
        <title>Ken Voice Demo - MyNextLesson.com</title>
        <meta name="description" content="Experience Ken's AI voice powered by Coqui TTS technology. Test our advanced voice cloning system." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Header */}
      <header className="header">
        <nav className="nav-container">
          <Link href="/" className="logo">
            <span className="logo-icon">🎓</span>
            MyNextLesson
          </Link>
          <div className="nav-links">
            <Link href="/">Home</Link>
            <Link href="/demo-lesson">Today's Lesson</Link>
            <Link href="/voice-test">Voice Test</Link>
            <Link href="/about">About</Link>
          </div>
        </nav>
      </header>

      <main className="main-content">
        {/* Hero Section */}
        <section className="demo-hero">
          <div className="hero-content">
            <h1>Ken's Voice Demo</h1>
            <p>Experience our advanced Coqui TTS voice cloning technology</p>
            
            {/* System Status */}
            <div className="system-status">
              <div className={`status-indicator ${systemStatus}`}>
                <span className="status-dot"></span>
                <span className="status-text">
                  {systemStatus === 'coqui-ready' && 'Coqui TTS Server Ready'}
                  {systemStatus === 'local-ready' && 'Local TTS Ready'}
                  {systemStatus === 'checking' && 'Checking System Status...'}
                  {systemStatus === 'offline' && 'TTS System Offline'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Interface */}
        <section className="demo-interface">
          <div className="interface-container">
            
            {/* Text Input */}
            <div className="input-section">
              <h2>Enter Text for Ken to Speak</h2>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type what you want Ken to say..."
                className="text-input"
                rows={4}
                maxLength={500}
              />
              <div className="char-count">{text.length}/500</div>
            </div>

            {/* Sample Texts */}
            <div className="samples-section">
              <h3>Try These Sample Texts</h3>
              <div className="sample-buttons">
                {sampleTexts.map((sample, index) => (
                  <button
                    key={index}
                    onClick={() => setText(sample)}
                    className="sample-btn"
                  >
                    Sample {index + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <div className="generate-section">
              <button
                onClick={generateKenVoice}
                disabled={!text.trim() || isGenerating || systemStatus === 'offline'}
                className="generate-btn"
              >
                {isGenerating ? (
                  <>
                    <span className="spinner"></span>
                    Generating Ken's Voice...
                  </>
                ) : (
                  <>
                    🎙️ Generate Ken's Voice
                  </>
                )}
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="error-section">
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {error}
                </div>
              </div>
            )}

            {/* Audio Player */}
            {audioUrl && (
              <div className="audio-section">
                <h3>Ken's Voice Generated Successfully!</h3>
                <audio controls className="audio-player" autoPlay>
                  <source src={audioUrl} type="audio/wav" />
                  Your browser does not support the audio element.
                </audio>
                <div className="audio-info">
                  <span>🎯 Powered by Coqui TTS</span>
                  <span>⚡ Generated in real-time</span>
                </div>
              </div>
            )}

            {/* Technology Info */}
            <div className="tech-info">
              <h3>Technology Stack</h3>
              <div className="tech-grid">
                <div className="tech-item">
                  <span className="tech-icon">🎯</span>
                  <div>
                    <h4>Coqui TTS</h4>
                    <p>Open-source multilingual TTS with voice cloning</p>
                  </div>
                </div>
                <div className="tech-item">
                  <span className="tech-icon">🌐</span>
                  <div>
                    <h4>DigitalOcean</h4>
                    <p>High-performance cloud infrastructure</p>
                  </div>
                </div>
                <div className="tech-item">
                  <span className="tech-icon">⚡</span>
                  <div>
                    <h4>Real-time</h4>
                    <p>Fast voice synthesis for seamless experiences</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>MyNextLesson</h4>
            <p>Empowering 8.5 billion learners with AI-powered education</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/demo-lesson">Today's Lesson</Link></li>
              <li><Link href="/voice-test">Voice Test Lab</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 MyNextLesson.com - Powered by Coqui TTS</p>
        </div>
      </footer>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        /* Header Styles */
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 1rem 0;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.5rem;
          font-weight: bold;
          color: white;
          text-decoration: none;
        }

        .logo-icon {
          font-size: 2rem;
        }

        .nav-links {
          display: flex;
          gap: 2rem;
        }

        .nav-links a {
          color: white;
          text-decoration: none;
          font-weight: 500;
          transition: opacity 0.3s;
        }

        .nav-links a:hover {
          opacity: 0.8;
        }

        /* Demo Hero */
        .demo-hero {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 4rem 2rem;
          text-align: center;
        }

        .hero-content h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          color: #333;
        }

        .hero-content p {
          font-size: 1.2rem;
          color: #666;
          margin-bottom: 2rem;
        }

        /* System Status */
        .system-status {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          padding: 1rem 2rem;
          border-radius: 30px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .status-indicator.coqui-ready .status-dot {
          background: #4CAF50;
        }

        .status-indicator.local-ready .status-dot {
          background: #FF9800;
        }

        .status-indicator.checking .status-dot {
          background: #2196F3;
        }

        .status-indicator.offline .status-dot {
          background: #F44336;
        }

        .status-text {
          font-weight: 600;
          color: #333;
        }

        /* Demo Interface */
        .demo-interface {
          padding: 4rem 2rem;
          background: white;
        }

        .interface-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .input-section {
          margin-bottom: 3rem;
        }

        .input-section h2 {
          margin-bottom: 1rem;
          color: #333;
        }

        .text-input {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 1rem;
          resize: vertical;
          transition: border-color 0.3s;
        }

        .text-input:focus {
          outline: none;
          border-color: #667eea;
        }

        .char-count {
          text-align: right;
          color: #666;
          font-size: 0.9rem;
          margin-top: 0.5rem;
        }

        .samples-section {
          margin-bottom: 3rem;
        }

        .samples-section h3 {
          margin-bottom: 1rem;
          color: #333;
        }

        .sample-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .sample-btn {
          background: #f0f4f8;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 0.9rem;
        }

        .sample-btn:hover {
          background: #667eea;
          color: white;
        }

        .generate-section {
          text-align: center;
          margin-bottom: 3rem;
        }

        .generate-btn {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 1.2rem 3rem;
          border-radius: 30px;
          font-size: 1.1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .generate-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .generate-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        .error-section {
          margin-bottom: 2rem;
        }

        .error-message {
          background: #fee;
          color: #c53030;
          padding: 1rem;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .error-icon {
          font-size: 1.2rem;
        }

        .audio-section {
          background: #f0f4f8;
          padding: 2rem;
          border-radius: 15px;
          text-align: center;
          margin-bottom: 3rem;
        }

        .audio-section h3 {
          color: #4CAF50;
          margin-bottom: 1.5rem;
        }

        .audio-player {
          width: 100%;
          max-width: 400px;
          margin-bottom: 1rem;
        }

        .audio-info {
          display: flex;
          justify-content: center;
          gap: 2rem;
          color: #666;
          font-size: 0.9rem;
        }

        .tech-info {
          background: #f8fafc;
          padding: 2rem;
          border-radius: 15px;
        }

        .tech-info h3 {
          text-align: center;
          margin-bottom: 2rem;
          color: #333;
        }

        .tech-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .tech-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: white;
          padding: 1.5rem;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .tech-icon {
          font-size: 2rem;
        }

        .tech-item h4 {
          margin-bottom: 0.5rem;
          color: #667eea;
        }

        .tech-item p {
          color: #666;
          font-size: 0.9rem;
        }

        /* Footer */
        .footer {
          background: #2d3748;
          color: white;
          padding: 3rem 2rem 1rem;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .footer-section h4 {
          margin-bottom: 1rem;
          color: #667eea;
        }

        .footer-section ul {
          list-style: none;
        }

        .footer-section li {
          margin-bottom: 0.5rem;
        }

        .footer-section a {
          color: #cbd5e0;
          text-decoration: none;
          transition: color 0.3s;
        }

        .footer-section a:hover {
          color: white;
        }

        .footer-bottom {
          max-width: 1200px;
          margin: 2rem auto 0;
          padding-top: 2rem;
          border-top: 1px solid #4a5568;
          text-align: center;
          color: #a0aec0;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .hero-content h1 {
            font-size: 2rem;
          }

          .nav-links {
            display: none;
          }

          .audio-info {
            flex-direction: column;
            gap: 0.5rem;
          }

          .sample-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
} 