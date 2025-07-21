import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [currentDate, setCurrentDate] = useState('');
  const [todaysLesson, setTodaysLesson] = useState('');

  useEffect(() => {
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    setCurrentDate(dateStr);
    
    // Get today's lesson (day of year)
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = today - start;
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    setTodaysLesson(`Day ${dayOfYear}`);
  }, []);

  return (
    <>
      <Head>
        <title>MyNextLesson.com - Learn with Ken & Kelly's AI Voices</title>
        <meta name="description" content="Experience daily lessons with Ken and Kelly's AI voices powered by Coqui TTS. Interactive learning with real-time avatars and personalized content." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className="header">
        <nav className="nav-container">
          <Link href="/" className="logo">
            <span className="logo-icon">🎓</span>
            MyNextLesson
          </Link>
          <div className="nav-links">
            <Link href="/demo-ken-voice">Ken Voice Demo</Link>
            <Link href="/demo-lesson">Today's Lesson</Link>
            <Link href="/voice-test">Voice Test</Link>
            <Link href="/about">About</Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-title">
              Learn with <span className="highlight">Ken & Kelly</span>'s AI Voices
            </h1>
            <p className="hero-subtitle">
              Experience personalized daily lessons with our advanced Coqui TTS voice cloning system
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">8.5B+</span>
                <span className="stat-label">Learners Worldwide</span>
              </div>
              <div className="stat">
                <span className="stat-number">366</span>
                <span className="stat-label">Daily Topics</span>
              </div>
              <div className="stat">
                <span className="stat-number">2</span>
                <span className="stat-label">AI Instructors</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="avatar-preview">
              <img src="/assets/ken/ken-avatar.jpg" alt="Ken Avatar" className="avatar-image" />
              <div className="voice-indicator">
                <span className="pulse"></span>
                <span>Ken's Voice Active</span>
              </div>
            </div>
          </div>
        </section>

        {/* Today's Lesson */}
        <section className="todays-lesson">
          <div className="lesson-card">
            <div className="lesson-header">
              <h2>Today's Lesson - {currentDate}</h2>
              <span className="lesson-number">{todaysLesson}</span>
            </div>
            <div className="lesson-preview">
              <h3>Astrobiology: Life Beyond Earth</h3>
              <p>Explore the fascinating science of life in the universe with Ken as your guide.</p>
              <div className="lesson-features">
                <span className="feature">🎙️ Ken's Voice</span>
                <span className="feature">👨‍🏫 Interactive Avatar</span>
                <span className="feature">🎯 Personalized</span>
              </div>
              <Link href="/demo-lesson" className="start-lesson-btn">
                Start Today's Lesson
              </Link>
            </div>
          </div>
        </section>

        {/* Voice Technology */}
        <section className="voice-tech">
          <h2>Powered by Advanced Voice Technology</h2>
          <div className="tech-grid">
            <div className="tech-card">
              <div className="tech-icon">🎯</div>
              <h3>Coqui TTS</h3>
              <p>State-of-the-art text-to-speech with multilingual support and voice cloning</p>
            </div>
            <div className="tech-card">
              <div className="tech-icon">🎭</div>
              <h3>Real-time Avatars</h3>
              <p>Ken and Kelly respond with synchronized lip movement and expressions</p>
            </div>
            <div className="tech-card">
              <div className="tech-icon">⚡</div>
              <h3>Instant Generation</h3>
              <p>Fast voice synthesis for seamless learning experiences</p>
            </div>
          </div>
        </section>

        {/* Quick Demo */}
        <section className="quick-demo">
          <div className="demo-container">
            <h2>Try Ken's Voice</h2>
            <p>Experience our voice cloning technology in action</p>
            <div className="demo-buttons">
              <Link href="/demo-ken-voice" className="demo-btn primary">
                Ken Voice Demo
              </Link>
              <Link href="/voice-test" className="demo-btn secondary">
                Voice Test Lab
              </Link>
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
            <h4>Technology</h4>
            <ul>
              <li><Link href="/demo-ken-voice">Ken Voice Demo</Link></li>
              <li><Link href="/voice-test">Voice Testing</Link></li>
              <li><Link href="/api-docs">API Documentation</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Learning</h4>
            <ul>
              <li><Link href="/demo-lesson">Today's Lesson</Link></li>
              <li><Link href="/lessons">All Lessons</Link></li>
              <li><Link href="/about">About Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 MyNextLesson.com - Powered by Coqui TTS & Cloudflare</p>
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

        /* Main Content */
        .main-content {
          min-height: calc(100vh - 200px);
        }

        /* Hero Section */
        .hero {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 4rem 2rem;
          display: flex;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          gap: 4rem;
        }

        .hero-content {
          flex: 1;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: bold;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .highlight {
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: #666;
          margin-bottom: 3rem;
        }

        .hero-stats {
          display: flex;
          gap: 3rem;
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

        .hero-visual {
          flex: 1;
          display: flex;
          justify-content: center;
        }

        .avatar-preview {
          position: relative;
          text-align: center;
        }

        .avatar-image {
          width: 200px;
          height: 200px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid #667eea;
        }

        .voice-indicator {
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          background: #4CAF50;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .pulse {
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        /* Today's Lesson */
        .todays-lesson {
          padding: 4rem 2rem;
          background: white;
        }

        .lesson-card {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .lesson-header {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .lesson-number {
          background: rgba(255,255,255,0.2);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: bold;
        }

        .lesson-preview {
          padding: 2rem;
        }

        .lesson-preview h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #333;
        }

        .lesson-features {
          display: flex;
          gap: 1rem;
          margin: 1.5rem 0;
        }

        .feature {
          background: #f0f4f8;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          color: #667eea;
        }

        .start-lesson-btn {
          display: inline-block;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 1rem 2rem;
          border-radius: 30px;
          text-decoration: none;
          font-weight: bold;
          transition: transform 0.3s;
        }

        .start-lesson-btn:hover {
          transform: translateY(-2px);
        }

        /* Voice Technology */
        .voice-tech {
          padding: 4rem 2rem;
          background: #f8fafc;
          text-align: center;
        }

        .voice-tech h2 {
          font-size: 2.5rem;
          margin-bottom: 3rem;
          color: #333;
        }

        .tech-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .tech-card {
          background: white;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.08);
          transition: transform 0.3s;
        }

        .tech-card:hover {
          transform: translateY(-5px);
        }

        .tech-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .tech-card h3 {
          font-size: 1.3rem;
          margin-bottom: 1rem;
          color: #667eea;
        }

        /* Quick Demo */
        .quick-demo {
          padding: 4rem 2rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          text-align: center;
        }

        .demo-container h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .demo-container p {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          opacity: 0.9;
        }

        .demo-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .demo-btn {
          padding: 1rem 2rem;
          border-radius: 30px;
          text-decoration: none;
          font-weight: bold;
          transition: all 0.3s;
        }

        .demo-btn.primary {
          background: white;
          color: #667eea;
        }

        .demo-btn.secondary {
          background: rgba(255,255,255,0.2);
          color: white;
          border: 2px solid white;
        }

        .demo-btn:hover {
          transform: translateY(-2px);
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
          .hero {
            flex-direction: column;
            text-align: center;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .hero-stats {
            justify-content: center;
          }

          .nav-links {
            display: none;
          }

          .demo-buttons {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </>
  );
} 