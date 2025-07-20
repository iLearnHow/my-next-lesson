import React, { useState, useEffect, useRef } from 'react';
import { CloudflareTTSClient } from '../services/cloudflare-tts-client.js';

// Real-time Ken Lesson Player - Showcases Homegrown Solutions
const RealTimeKenLessonPlayer = () => {
  // State Management
  const [currentSection, setCurrentSection] = useState('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [kenEmotion, setKenEmotion] = useState('default state2');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [lessonProgress, setLessonProgress] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [ttsClient, setTtsClient] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Audio ref
  const audioRef = useRef(null);

  // Ken's emotional states mapped to lesson moments
  const kenEmotions = {
    'intro': 'hello mode -perfect elbow and palm position for ASL',
    'question_setup': 'question mode first',
    'correct': 'correct-celebration-mode',
    'incorrect': 'not-quite-try-again mode',
    'thinking': 'not-looking-thinking mode',
    'celebration': 'correct-celebration-mode',
    'fortune': 'bye-bye-with-glasses-hand-raised',
    'default': 'default state2'
  };

  // Demo lesson content (negotiation skills)
  const demoLesson = {
    lesson_id: "negotiation_skills_demo",
    title: "Collaborative Problem Solving",
    universal_concept: "understanding_others_interests_creates_better_solutions",
    learning_essence: "Transform conflicts into collaborations by focusing on underlying needs rather than positions",
    
    sections: [
      {
        type: 'intro',
        text: "Hello! I'm Ken, and today we're going to learn about working together when people want different things. This is called collaborative problem solving, and it's one of the most important skills you can develop.",
        emotion: 'intro',
        duration: 8000
      },
      {
        type: 'question_setup',
        text: "Let's start with a simple scenario. Imagine you and a friend both want to play with the same toy. What would you do?",
        emotion: 'question_setup',
        duration: 5000
      },
      {
        type: 'question',
        question: "When you and a friend want the same thing, do you:",
        options: [
          "Try to get it first and convince them you should have it",
          "Ask what they want to do and figure it out together"
        ],
        correct: 1,
        emotion: 'question_setup'
      },
      {
        type: 'correct',
        text: "Excellent choice! Working together to find a solution is much better than arguing. When we understand what each person really wants, we can often find a way that makes everyone happy.",
        emotion: 'correct',
        duration: 7000
      },
      {
        type: 'question_setup',
        text: "Now let's try another scenario. Someone suggests an idea that you think might not work very well. What do you do?",
        emotion: 'question_setup',
        duration: 5000
      },
      {
        type: 'question',
        question: "When someone suggests an idea you're not sure about, do you:",
        options: [
          "Immediately point out the problems with their idea",
          "Ask questions to understand how they think it would work"
        ],
        correct: 1,
        emotion: 'question_setup'
      },
      {
        type: 'correct',
        text: "Perfect! Asking questions helps us understand each other better. When we listen and ask thoughtful questions, we often discover solutions we never would have thought of alone.",
        emotion: 'correct',
        duration: 7000
      },
      {
        type: 'fortune',
        text: "Congratulations! You've learned the key to collaborative problem solving: understanding others' interests creates better solutions than defending positions. Remember, the goal isn't to win an argument - it's to find a solution that works for everyone.",
        emotion: 'fortune',
        duration: 8000
      }
    ]
  };

  // Initialize TTS client
  useEffect(() => {
    const initTTS = async () => {
      try {
        const client = new CloudflareTTSClient();
        await client.initialize();
        setTtsClient(client);
        console.log('✅ Cloudflare TTS client initialized');
      } catch (error) {
        console.error('❌ TTS initialization failed:', error);
      }
    };
    initTTS();
  }, []);

  // Generate speech for current section
  const generateSpeech = async (text) => {
    if (!ttsClient) return null;
    
    try {
      setIsLoading(true);
      const result = await ttsClient.synthesizeKenVoice(text, {
        speed: 1.0,
        language: 'en-US'
      });
      setAudioUrl(result.url);
      return result;
    } catch (error) {
      console.error('Speech generation failed:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Play current section
  const playCurrentSection = async () => {
    const currentSectionData = demoLesson.sections.find(s => s.type === currentSection);
    if (!currentSectionData) return;

    // Set Ken's emotion
    setKenEmotion(kenEmotions[currentSectionData.emotion] || kenEmotions.default);

    // Generate and play speech
    if (currentSectionData.text) {
      const audioResult = await generateSpeech(currentSectionData.text);
      if (audioResult && audioResult.url) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        
        audioRef.current = new Audio(audioResult.url);
        audioRef.current.onended = () => {
          setIsPlaying(false);
          handleSectionComplete();
        };
        
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Handle section completion
  const handleSectionComplete = () => {
    const currentIndex = demoLesson.sections.findIndex(s => s.type === currentSection);
    const nextSection = demoLesson.sections[currentIndex + 1];
    
    if (nextSection) {
      setCurrentSection(nextSection.type);
      setLessonProgress(((currentIndex + 1) / demoLesson.sections.length) * 100);
    }
  };

  // Handle answer selection
  const handleAnswer = (answerIndex) => {
    const currentSectionData = demoLesson.sections.find(s => s.type === 'question');
    if (!currentSectionData) return;

    const isCorrect = answerIndex === currentSectionData.correct;
    setUserAnswers([...userAnswers, { question: currentQuestion, answer: answerIndex, correct: isCorrect }]);
    
    // Set Ken's reaction
    setKenEmotion(isCorrect ? 'correct-celebration-mode' : 'not-quite-try-again mode');
    
    // Auto-advance after showing reaction
    setTimeout(() => {
      setCurrentQuestion(currentQuestion + 1);
      const nextSection = demoLesson.sections.find(s => s.type === (isCorrect ? 'correct' : 'incorrect'));
      if (nextSection) {
        setCurrentSection(nextSection.type);
      }
    }, 2000);
  };

  // Get current section data
  const getCurrentSectionData = () => {
    return demoLesson.sections.find(s => s.type === currentSection);
  };

  // Start lesson
  const startLesson = () => {
    setCurrentSection('intro');
    setCurrentQuestion(0);
    setLessonProgress(0);
    setUserAnswers([]);
    playCurrentSection();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {demoLesson.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {demoLesson.learning_essence}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Ken's Avatar Display */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Ken's Real-Time Avatar</h2>
              <p className="text-sm text-gray-600">Powered by your homegrown systems</p>
            </div>
            
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={`/kenny/real-time-ken-images/${kenEmotion}.png`}
                alt={`Ken ${kenEmotion}`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = '/kenny/default state2.png';
                }}
              />
              
              {/* Loading overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
                    <p>Generating Ken's voice...</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Current emotion: <span className="font-medium">{kenEmotion.replace(/_/g, ' ')}</span>
              </p>
            </div>
          </div>

          {/* Lesson Content */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm text-gray-500">{Math.round(lessonProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${lessonProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Current Section Content */}
            <div className="mb-6">
              {(() => {
                const sectionData = getCurrentSectionData();
                if (!sectionData) return null;

                if (sectionData.type === 'question') {
                  return (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        {sectionData.question}
                      </h3>
                      <div className="space-y-3">
                        {sectionData.options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleAnswer(index)}
                            className="w-full p-4 text-left bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                          >
                            <span className="font-medium text-blue-800">Option {index + 1}:</span>
                            <span className="ml-2 text-gray-700">{option}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {sectionData.type === 'intro' ? 'Welcome' : 
                       sectionData.type === 'correct' ? 'Great Job!' :
                       sectionData.type === 'fortune' ? 'Daily Fortune' : 'Lesson'}
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {sectionData.text}
                    </p>
                    
                    {!isPlaying && sectionData.text && (
                      <button
                        onClick={playCurrentSection}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        {isLoading ? 'Generating...' : 'Play Ken\'s Voice'}
                      </button>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center">
              <button
                onClick={startLesson}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Start Lesson
              </button>
              
              <div className="text-sm text-gray-600">
                <p>✅ Cloudflare TTS: {ttsClient ? 'Connected' : 'Connecting...'}</p>
                <p>🎭 Real-time Ken: Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Homegrown System Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl mb-2">🎭</div>
              <h4 className="font-medium text-gray-900">Real-time Ken Avatar</h4>
              <p className="text-sm text-gray-600">22 emotional states</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl mb-2">🔊</div>
              <h4 className="font-medium text-gray-900">Cloudflare TTS</h4>
              <p className="text-sm text-gray-600">Ken's voice synthesis</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl mb-2">🧠</div>
              <h4 className="font-medium text-gray-900">Lesson Intelligence</h4>
              <p className="text-sm text-gray-600">3x3x3 structure</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeKenLessonPlayer; 