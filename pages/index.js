import Head from 'next/head'
import { useState, useEffect } from 'react'
import { UniversalLessonPlayer } from '../components/UniversalLessonPlayer'

export default function Home() {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load the negotiation skills DNA lesson
    const loadLesson = async () => {
      try {
        setLoading(true);
        console.log('🔍 Loading negotiation skills DNA lesson...');
        
        // Import the DNA file directly
        const response = await fetch('/negotiation_skills_dna.json');
        console.log('📡 Fetch response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`Failed to load lesson DNA: ${response.status} ${response.statusText}`);
        }
        
        const lessonDNA = await response.json();
        console.log('✅ Lesson DNA loaded successfully:', lessonDNA.lesson_id);
        setLesson(lessonDNA);
        
      } catch (err) {
        console.error('❌ Error loading lesson:', err);
        setError(`Failed to load lesson: ${err.message}. Please try refreshing the page.`);
      } finally {
        setLoading(false);
      }
    };

    loadLesson();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Daily Lesson</h2>
          <p className="text-gray-600">Preparing your negotiation skills lesson...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-md">
            <strong>Error:</strong> {error}
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>DailyLesson - Negotiation Skills</title>
        <meta name="description" content="Learn negotiation skills through interactive daily lessons" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <UniversalLessonPlayer lesson={lesson} />
    </div>
  )
} 