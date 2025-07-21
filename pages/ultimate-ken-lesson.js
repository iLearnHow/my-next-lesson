import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { CloudflareTTSClient } from '../services/cloudflare-tts-client.js';

// Ultimate Ken Lesson Experience - Full Screen 3x2x1 Methodology
const UltimateKenLesson = () => {
  // State Management
  const [currentPhase, setCurrentPhase] = useState('welcome');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [kenEmotion, setKenEmotion] = useState('hello mode -perfect elbow and palm position for ASL');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [lessonProgress, setLessonProgress] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [ttsClient, setTtsClient] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showText, setShowText] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Audio ref
  const audioRef = useRef(null);

  // Ken's emotional states for 3x2x1 methodology
  const kenEmotions = {
    'welcome': 'hello mode -perfect elbow and palm position for ASL',
    'question_setup': 'question mode first',
    'question_delivery': 'question mode first',
    'thinking': 'not-looking-thinking mode',
    'correct': 'correct-celebration-mode',
    'incorrect': 'not-quite-try-again mode',
    'explanation': 'default state2',
    'celebration': 'correct-celebration-mode',
    'fortune': 'bye-bye-with-glasses-hand-raised',
    'transition': 'blinking mode',
    'error': 'error-oh-no',
    'joke': 'joke-mode',
    'laugh': 'laugh1',
    'default': 'default state2'
  };

  // 3x2x1 Lesson Structure: 3 Questions, 2 Responses Each, 1 Fortune
  const lessonStructure = {
    lesson_id: "ultimate_3x2x1_demo",
    title: "Astrobiology: The Search for Life Beyond Earth",
    date: "July 20, 2025",
    universal_concept: "scientific_discovery_through_curiosity",
    core_principle: "Every day offers opportunity for growth and understanding",
    learning_essence: "Develop knowledge and wisdom through structured learning",
    
    phases: [
      // PHASE 1: Welcome & Introduction
      {
        id: 'welcome',
        type: 'welcome',
        emotion: 'welcome',
        text: "Hello Nicolette! Welcome to today's lesson on astrobiology. I'm Ken, and I'm excited to explore the search for life beyond Earth with you. This is one of the most fascinating fields in science - we're literally looking for life in the universe!",
        duration: 8000,
        showText: true,
        textContent: "Welcome to Astrobiology"
      },
      
      // PHASE 2: Question 1 Setup
      {
        id: 'q1_setup',
        type: 'question_setup',
        emotion: 'question_setup',
        text: "Let's start with something fundamental. Scientists have discovered thousands of planets orbiting other stars. But what makes a planet capable of supporting life?",
        duration: 6000,
        showText: true,
        textContent: "What makes a planet habitable?"
      },
      
      // PHASE 3: Question 1
      {
        id: 'q1',
        type: 'question',
        emotion: 'question_delivery',
        question: "True or false: A planet needs to be exactly the same size as Earth to support life?",
        correct: false,
        explanation: "Actually, that's false! Planets can be much larger or smaller than Earth and still potentially support life. What matters more is the planet's distance from its star, the presence of liquid water, and a stable atmosphere.",
        duration: 7000
      },
      
      // PHASE 4: Question 2 Setup
      {
        id: 'q2_setup',
        type: 'question_setup',
        emotion: 'question_setup',
        text: "Now let's think about how we actually search for life. Scientists use incredibly sensitive instruments to detect signs of life from millions of miles away.",
        duration: 6000,
        showText: true,
        textContent: "How do we search for life?"
      },
      
      // PHASE 5: Question 2
      {
        id: 'q2',
        type: 'question',
        emotion: 'question_delivery',
        question: "True or false: We can only search for life on planets that are exactly like Earth?",
        correct: false,
        explanation: "That's false! Scientists are looking for all kinds of life, not just Earth-like life. Some organisms on Earth live in extreme conditions - hot springs, deep ocean vents, even inside rocks. Life might exist in forms we haven't even imagined yet.",
        duration: 8000
      },
      
      // PHASE 6: Question 3 Setup
      {
        id: 'q3_setup',
        type: 'question_setup',
        emotion: 'question_setup',
        text: "Here's the most exciting part - what if we actually find life? This would be one of the most profound discoveries in human history.",
        duration: 6000,
        showText: true,
        textContent: "What if we find life?"
      },
      
      // PHASE 7: Question 3
      {
        id: 'q3',
        type: 'question',
        emotion: 'question_delivery',
        question: "True or false: Finding life on another planet would change how we understand our place in the universe?",
        correct: true,
        explanation: "True! Absolutely true. Discovering life beyond Earth would revolutionize our understanding of biology, evolution, and our place in the cosmos. It would answer one of humanity's oldest questions: are we alone?",
        duration: 7000
      },
      
      // PHASE 8: Fortune
      {
        id: 'fortune',
        type: 'fortune',
        emotion: 'fortune',
        text: "Congratulations! You've earned your daily fortune. You are a cosmic explorer who understands that curiosity and scientific thinking can unlock the universe's greatest mysteries. Remember, every discovery starts with a question - and you're asking the right ones!",
        duration: 8000,
        showText: true,
        textContent: "Your Daily Fortune"
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

  // Generate speech for current phase
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

  // Play current phase
  const playCurrentPhase = async () => {
    const currentPhaseData = lessonStructure.phases.find(p => p.id === currentPhase);
    if (!currentPhaseData) return;

    // Set Ken's emotion
    setKenEmotion(kenEmotions[currentPhaseData.emotion] || kenEmotions.default);

    // Show text if specified
    if (currentPhaseData.showText) {
      setShowText(true);
      setCurrentText(currentPhaseData.textContent);
    } else {
      setShowText(false);
    }

    // Generate and play speech
    if (currentPhaseData.text) {
      const audioResult = await generateSpeech(currentPhaseData.text);
      if (audioResult && audioResult.url) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        
        audioRef.current = new Audio(audioResult.url);
        audioRef.current.onended = () => {
          setIsPlaying(false);
          handlePhaseComplete();
        };
        
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Handle phase completion
  const handlePhaseComplete = () => {
    const currentIndex = lessonStructure.phases.findIndex(p => p.id === currentPhase);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < lessonStructure.phases.length) {
      const nextPhase = lessonStructure.phases[nextIndex];
      setCurrentPhase(nextPhase.id);
      setLessonProgress((nextIndex / (lessonStructure.phases.length - 1)) * 100);
      
      // Auto-play next phase after a short delay
      setTimeout(() => {
        playCurrentPhase();
      }, 1000);
    }
  };

  // Handle answer selection
  const handleAnswer = (isCorrect) => {
    const currentPhaseData = lessonStructure.phases.find(p => p.id === currentPhase);
    if (!currentPhaseData) return;

    setUserAnswers([...userAnswers, { question: currentPhase, answer: isCorrect }]);
    
    // Set emotion based on answer
    if (isCorrect) {
      setKenEmotion(kenEmotions.correct);
    } else {
      setKenEmotion(kenEmotions.incorrect);
    }

    // Play explanation
    setTimeout(() => {
      if (currentPhaseData.explanation) {
        generateSpeech(currentPhaseData.explanation).then(result => {
          if (result && result.url) {
            if (audioRef.current) {
              audioRef.current.pause();
            }
            
            audioRef.current = new Audio(result.url);
            audioRef.current.onended = () => {
              setIsPlaying(false);
              handlePhaseComplete();
            };
            
            audioRef.current.play();
            setIsPlaying(true);
          }
        });
      }
    }, 1000);
  };

  // Get current phase data
  const getCurrentPhaseData = () => {
    return lessonStructure.phases.find(p => p.id === currentPhase);
  };

  // Start lesson
  const startLesson = () => {
    setCurrentPhase('welcome');
    setLessonProgress(0);
    setUserAnswers([]);
    setShowText(false);
    playCurrentPhase();
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <>
      <Head>
        <title>Ultimate Ken Lesson - 3x2x1 Experience | MyNextLesson</title>
        <meta name="description" content="Experience the ultimate full-screen Ken lesson with 3x2x1 methodology and brilliant image sequencing" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={`min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 ${isFullscreen ? 'p-0' : 'p-4'}`}>
        <div className={`${isFullscreen ? 'h-screen' : 'max-w-7xl mx-auto'}`}>
          
          {/* Header */}
          {!isFullscreen && (
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold text-white mb-4">
                Ultimate Ken Lesson Experience
              </h1>
              <p className="text-xl text-purple-200 max-w-3xl mx-auto">
                3x2x1 Methodology • Full-Screen Immersion • Real-Time Ken Avatar
              </p>
            </div>
          )}

          <div className={`grid ${isFullscreen ? 'h-full' : ''} grid-cols-1 lg:grid-cols-3 gap-8`}>
            
            {/* Ken's Full-Screen Avatar */}
            <div className={`${isFullscreen ? 'col-span-2' : 'lg:col-span-2'} bg-black rounded-2xl shadow-2xl overflow-hidden relative`}>
              
              {/* Ken's Image */}
              <div className="relative w-full h-full min-h-[600px] flex items-center justify-center">
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
                  <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-400 mx-auto mb-4"></div>
                      <p className="text-lg font-semibold">Generating Ken's Voice...</p>
                      <p className="text-sm text-purple-200">Cloudflare TTS Processing</p>
                    </div>
                  </div>
                )}

                {/* On-screen text overlay */}
                {showText && currentText && (
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="bg-black bg-opacity-80 backdrop-blur-sm rounded-xl p-6 border border-purple-400">
                      <h2 className="text-2xl font-bold text-white mb-2">{currentText}</h2>
                      <div className="w-full bg-purple-600 h-1 rounded-full">
                        <div className="bg-white h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Progress indicator */}
                <div className="absolute top-8 left-8 right-8">
                  <div className="bg-black bg-opacity-60 backdrop-blur-sm rounded-full p-2">
                    <div className="w-full bg-purple-900 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-purple-400 to-blue-400 h-3 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${lessonProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Status indicators */}
                <div className="absolute top-8 right-8 flex space-x-3">
                  <div className="bg-green-500 bg-opacity-80 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-white text-sm font-medium">🎭 Real Ken</span>
                  </div>
                  <div className="bg-blue-500 bg-opacity-80 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-white text-sm font-medium">🔊 TTS Active</span>
                  </div>
                  <div className="bg-purple-500 bg-opacity-80 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-white text-sm font-medium">3x2x1</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lesson Control Panel */}
            <div className="bg-black bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-purple-400">
              
              {/* Lesson Info */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {lessonStructure.title}
                </h2>
                <p className="text-purple-200 text-sm mb-4">
                  {lessonStructure.date} • {lessonStructure.learning_essence}
                </p>
                <div className="text-xs text-purple-300">
                  <p>🎯 3 Questions • 2 Responses • 1 Fortune</p>
                  <p>🧠 Universal Learning Methodology</p>
                </div>
              </div>

              {/* Current Phase Content */}
              <div className="mb-6">
                {(() => {
                  const phaseData = getCurrentPhaseData();
                  if (!phaseData) return null;

                  if (phaseData.type === 'question') {
                    return (
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                          {phaseData.question}
                        </h3>
                        <div className="space-y-3">
                          <button
                            onClick={() => handleAnswer(true)}
                            className="w-full p-4 text-left bg-green-600 hover:bg-green-700 border border-green-400 rounded-lg transition-colors text-white font-medium"
                          >
                            TRUE
                          </button>
                          <button
                            onClick={() => handleAnswer(false)}
                            className="w-full p-4 text-left bg-red-600 hover:bg-red-700 border border-red-400 rounded-lg transition-colors text-white font-medium"
                          >
                            FALSE
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">
                        {phaseData.type === 'welcome' ? 'Welcome' : 
                         phaseData.type === 'question_setup' ? 'Setting Up' :
                         phaseData.type === 'fortune' ? 'Daily Fortune' : 'Lesson'}
                      </h3>
                      <p className="text-purple-200 leading-relaxed mb-4">
                        {phaseData.text}
                      </p>
                      
                      {!isPlaying && phaseData.text && (
                        <button
                          onClick={playCurrentPhase}
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center"
                        >
                          {isLoading ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                              Generating...
                            </>
                          ) : (
                            <>
                              🎯 Ken Says: "{phaseData.text.substring(0, 30)}..."
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Controls */}
              <div className="space-y-4">
                <button
                  onClick={startLesson}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
                >
                  🚀 Start Ultimate Lesson
                </button>
                
                <button
                  onClick={toggleFullscreen}
                  className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-2 rounded-lg font-medium hover:from-gray-700 hover:to-gray-800 transition-all duration-300"
                >
                  {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                </button>
              </div>

              {/* System Status */}
              <div className="mt-6 pt-6 border-t border-purple-600">
                <h4 className="text-sm font-semibold text-purple-200 mb-3">System Status</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-purple-300">Cloudflare TTS:</span>
                    <span className="text-green-400">{ttsClient ? 'Connected' : 'Connecting...'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-300">Real-time Ken:</span>
                    <span className="text-green-400">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-300">Lesson Progress:</span>
                    <span className="text-blue-400">{Math.round(lessonProgress)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-300">Current Phase:</span>
                    <span className="text-purple-400">{currentPhase.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3x2x1 Methodology Explanation */}
          {!isFullscreen && (
            <div className="mt-8 bg-black bg-opacity-60 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-purple-400">
              <h3 className="text-2xl font-bold text-white mb-4 text-center">3x2x1 Universal Learning Methodology</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl mb-2">🎯</div>
                  <h4 className="text-lg font-semibold text-purple-200 mb-2">3 Questions</h4>
                  <p className="text-purple-300 text-sm">
                    Progressive complexity building from recognition to application to synthesis
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🔄</div>
                  <h4 className="text-lg font-semibold text-purple-200 mb-2">2 Responses</h4>
                  <p className="text-purple-300 text-sm">
                    True/False format with immediate feedback and educational explanations
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">⭐</div>
                  <h4 className="text-lg font-semibold text-purple-200 mb-2">1 Fortune</h4>
                  <p className="text-purple-300 text-sm">
                    Daily wisdom that reinforces learning and empowers the learner's identity
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UltimateKenLesson; 