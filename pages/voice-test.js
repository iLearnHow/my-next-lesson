import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function VoiceTestLab() {
  const [testResults, setTestResults] = useState({});
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [customText, setCustomText] = useState('Testing Ken\'s voice with Coqui TTS system.');

  const testEndpoints = [
    {
      id: 'coqui-production',
      name: 'Coqui TTS (Production)',
      url: 'http://146.190.166.163:5003/tts',
      method: 'POST',
      type: 'multipart',
      description: 'Production Coqui XTTS server on DigitalOcean'
    },
    {
      id: 'ken-api-production',
      name: 'Ken API (Production)',
      url: 'http://146.190.166.163:8000/generate-speech',
      method: 'POST',
      type: 'json',
      description: 'Production Ken voice API with FastAPI'
    },
    {
      id: 'cloudflare-tts',
      name: 'Cloudflare TTS Worker',
      url: 'https://tts.mynextlesson.com/generate-speech',
      method: 'POST',
      type: 'json',
      description: 'Cloudflare Workers TTS endpoint'
    },
    {
      id: 'local-api',
      name: 'Local TTS API',
      url: '/api/generate-ken-voice',
      method: 'POST',
      type: 'json',
      description: 'Local Next.js API endpoint'
    }
  ];

  const runSingleTest = async (endpoint) => {
    setTestResults(prev => ({
      ...prev,
      [endpoint.id]: { status: 'testing', startTime: Date.now() }
    }));

    try {
      let response;
      const startTime = Date.now();

      if (endpoint.type === 'multipart') {
        const formData = new FormData();
        formData.append('text', customText);
        formData.append('language', 'en');
        formData.append('speaker_wav', '/root/reference_ken.wav');

        response = await fetch(endpoint.url, {
          method: endpoint.method,
          body: formData,
        });
      } else {
        response = await fetch(endpoint.url, {
          method: endpoint.method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: customText,
            speed: 1.0,
            pitch: 1.0,
            voice_id: 'ken'
          }),
        });
      }

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      if (response.ok) {
        const result = await response.json();
        setTestResults(prev => ({
          ...prev,
          [endpoint.id]: {
            status: 'success',
            responseTime,
            result,
            timestamp: new Date().toISOString()
          }
        }));
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

    } catch (error) {
      const endTime = Date.now();
      const responseTime = endTime - (testResults[endpoint.id]?.startTime || Date.now());

      setTestResults(prev => ({
        ...prev,
        [endpoint.id]: {
          status: 'error',
          error: error.message,
          responseTime,
          timestamp: new Date().toISOString()
        }
      }));
    }
  };

  const runAllTests = async () => {
    setIsRunningTests(true);
    setTestResults({});

    for (const endpoint of testEndpoints) {
      await runSingleTest(endpoint);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setIsRunningTests(false);
  };

  const playTestAudio = (result) => {
    if (result.result?.audio_url) {
      const audio = new Audio(result.result.audio_url);
      audio.play().catch(console.error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return '#4CAF50';
      case 'error': return '#F44336';
      case 'testing': return '#2196F3';
      default: return '#9E9E9E';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'testing': return '🔄';
      default: return '⏸️';
    }
  };

  return (
    <>
      <Head>
        <title>Voice Test Lab - MyNextLesson.com</title>
        <meta name="description" content="Comprehensive testing suite for Ken's voice system and TTS endpoints" />
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
            <Link href="/demo-ken-voice">Ken Demo</Link>
            <Link href="/demo-lesson">Today's Lesson</Link>
            <Link href="/about">About</Link>
          </div>
        </nav>
      </header>

      <main className="main-content">
        {/* Hero Section */}
        <section className="test-hero">
          <div className="hero-content">
            <h1>Voice Test Lab</h1>
            <p>Comprehensive testing suite for Ken's voice system</p>
          </div>
        </section>

        {/* Test Controls */}
        <section className="test-controls">
          <div className="controls-container">
            <div className="test-input">
              <h3>Test Text</h3>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Enter text to test with all endpoints..."
                rows={3}
                maxLength={200}
              />
              <div className="char-count">{customText.length}/200</div>
            </div>

            <div className="test-actions">
              <button 
                onClick={runAllTests}
                disabled={isRunningTests || !customText.trim()}
                className="run-all-btn"
              >
                {isRunningTests ? (
                  <>
                    <span className="spinner"></span>
                    Running Tests...
                  </>
                ) : (
                  <>
                    🧪 Run All Tests
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Test Results */}
        <section className="test-results">
          <div className="results-container">
            <h2>Test Results</h2>
            
            <div className="endpoints-grid">
              {testEndpoints.map((endpoint) => {
                const result = testResults[endpoint.id];
                const status = result?.status || 'pending';
                
                return (
                  <div key={endpoint.id} className="endpoint-card">
                    <div className="endpoint-header">
                      <div className="endpoint-info">
                        <h3>{endpoint.name}</h3>
                        <p>{endpoint.description}</p>
                        <code className="endpoint-url">{endpoint.url}</code>
                      </div>
                      <div className="endpoint-status">
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(status) }}
                        >
                          {getStatusIcon(status)} {status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="endpoint-actions">
                      <button
                        onClick={() => runSingleTest(endpoint)}
                        disabled={result?.status === 'testing'}
                        className="test-btn"
                      >
                        {result?.status === 'testing' ? 'Testing...' : 'Test Endpoint'}
                      </button>
                    </div>

                    {result && (
                      <div className="test-result">
                        {result.status === 'success' && (
                          <div className="success-result">
                            <div className="result-metrics">
                              <span>Response Time: {result.responseTime}ms</span>
                              {result.result?.duration && (
                                <span>Audio Duration: {result.result.duration}s</span>
                              )}
                            </div>
                            {result.result?.audio_url && (
                              <button 
                                onClick={() => playTestAudio(result)}
                                className="play-btn"
                              >
                                🔊 Play Audio
                              </button>
                            )}
                            <details className="result-details">
                              <summary>View Response</summary>
                              <pre>{JSON.stringify(result.result, null, 2)}</pre>
                            </details>
                          </div>
                        )}

                        {result.status === 'error' && (
                          <div className="error-result">
                            <div className="error-message">
                              <strong>Error:</strong> {result.error}
                            </div>
                            <div className="error-time">
                              Response Time: {result.responseTime}ms
                            </div>
                          </div>
                        )}

                        <div className="result-timestamp">
                          Tested: {new Date(result.timestamp).toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            {Object.keys(testResults).length > 0 && (
              <div className="test-summary">
                <h3>Test Summary</h3>
                <div className="summary-stats">
                  <div className="stat">
                    <span className="stat-number">
                      {Object.values(testResults).filter(r => r.status === 'success').length}
                    </span>
                    <span className="stat-label">Successful</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">
                      {Object.values(testResults).filter(r => r.status === 'error').length}
                    </span>
                    <span className="stat-label">Failed</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">
                      {Math.round(Object.values(testResults)
                        .filter(r => r.responseTime)
                        .reduce((acc, r) => acc + r.responseTime, 0) / 
                        Object.values(testResults).filter(r => r.responseTime).length) || 0}ms
                    </span>
                    <span className="stat-label">Avg Response</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* System Info */}
        <section className="system-info">
          <div className="info-container">
            <h2>System Information</h2>
            <div className="info-grid">
              <div className="info-card">
                <h4>Production TTS Server</h4>
                <p>DigitalOcean Droplet</p>
                <code>146.190.166.163:5003</code>
              </div>
              <div className="info-card">
                <h4>Voice Technology</h4>
                <p>Coqui XTTS v2</p>
                <code>Multilingual Voice Cloning</code>
              </div>
              <div className="info-card">
                <h4>Reference Audio</h4>
                <p>Ken's Voice Sample</p>
                <code>/root/reference_ken.wav</code>
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
              <li><Link href="/demo-ken-voice">Ken Demo</Link></li>
              <li><Link href="/demo-lesson">Today's Lesson</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 MyNextLesson.com - Voice Test Lab</p>
        </div>
      </footer>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          background: #f8fafc;
        }

        /* Header */
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

        /* Test Hero */
        .test-hero {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 3rem 2rem;
          text-align: center;
        }

        .hero-content h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: #333;
        }

        .hero-content p {
          font-size: 1.1rem;
          color: #666;
        }

        /* Test Controls */
        .test-controls {
          padding: 2rem;
          background: white;
          border-bottom: 1px solid #e2e8f0;
        }

        .controls-container {
          max-width: 800px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
          align-items: end;
        }

        .test-input h3 {
          margin-bottom: 0.5rem;
          color: #333;
        }

        .test-input textarea {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 1rem;
          resize: vertical;
        }

        .test-input textarea:focus {
          outline: none;
          border-color: #667eea;
        }

        .char-count {
          text-align: right;
          color: #666;
          font-size: 0.9rem;
          margin-top: 0.5rem;
        }

        .run-all-btn {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          justify-content: center;
          width: 100%;
        }

        .run-all-btn:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .run-all-btn:disabled {
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

        /* Test Results */
        .test-results {
          padding: 3rem 2rem;
        }

        .results-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .results-container h2 {
          text-align: center;
          margin-bottom: 3rem;
          color: #333;
        }

        .endpoints-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .endpoint-card {
          background: white;
          border-radius: 15px;
          padding: 1.5rem;
          box-shadow: 0 5px 15px rgba(0,0,0,0.08);
          border: 1px solid #e2e8f0;
        }

        .endpoint-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .endpoint-info h3 {
          margin-bottom: 0.5rem;
          color: #333;
        }

        .endpoint-info p {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .endpoint-url {
          background: #f1f5f9;
          padding: 0.25rem 0.5rem;
          border-radius: 5px;
          font-size: 0.8rem;
          color: #475569;
        }

        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          color: white;
          font-size: 0.8rem;
          font-weight: bold;
          white-space: nowrap;
        }

        .endpoint-actions {
          margin-bottom: 1rem;
        }

        .test-btn {
          background: #667eea;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.3s;
        }

        .test-btn:hover:not(:disabled) {
          background: #5a67d8;
        }

        .test-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .test-result {
          border-top: 1px solid #e2e8f0;
          padding-top: 1rem;
        }

        .success-result {
          color: #059669;
        }

        .result-metrics {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }

        .play-btn {
          background: #10b981;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          cursor: pointer;
          margin-right: 1rem;
          margin-bottom: 1rem;
        }

        .result-details {
          margin-top: 1rem;
        }

        .result-details pre {
          background: #f8fafc;
          padding: 1rem;
          border-radius: 5px;
          overflow-x: auto;
          font-size: 0.8rem;
          max-height: 200px;
        }

        .error-result {
          color: #dc2626;
        }

        .error-message {
          margin-bottom: 0.5rem;
        }

        .error-time {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .result-timestamp {
          font-size: 0.8rem;
          color: #6b7280;
          margin-top: 1rem;
        }

        .test-summary {
          background: white;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.08);
          text-align: center;
        }

        .summary-stats {
          display: flex;
          justify-content: center;
          gap: 3rem;
          margin-top: 1.5rem;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 2rem;
          font-weight: bold;
          color: #667eea;
        }

        .stat-label {
          color: #666;
          font-size: 0.9rem;
        }

        /* System Info */
        .system-info {
          padding: 3rem 2rem;
          background: #f1f5f9;
        }

        .info-container {
          max-width: 1000px;
          margin: 0 auto;
          text-align: center;
        }

        .info-container h2 {
          margin-bottom: 2rem;
          color: #333;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .info-card {
          background: white;
          padding: 1.5rem;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .info-card h4 {
          margin-bottom: 0.5rem;
          color: #667eea;
        }

        .info-card p {
          color: #666;
          margin-bottom: 0.5rem;
        }

        .info-card code {
          background: #f1f5f9;
          padding: 0.25rem 0.5rem;
          border-radius: 3px;
          font-size: 0.8rem;
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
          .nav-links {
            display: none;
          }

          .controls-container {
            grid-template-columns: 1fr;
          }

          .endpoints-grid {
            grid-template-columns: 1fr;
          }

          .summary-stats {
            flex-direction: column;
            gap: 1rem;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
} 