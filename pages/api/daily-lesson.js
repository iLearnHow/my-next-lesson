import { loadDailyLessonDNA } from '../../api/index';
import { UniversalAgeEngine } from '../../services/universal-age-engine';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Handle both GET (query params) and POST (body) requests
    const params = req.method === 'GET' ? req.query : req.body;
    const { day, age, tone, language, avatar, mode } = params;
    
    // Validate parameters
    const dayOfYear = parseInt(day) || getDayOfYear(new Date());
    const userAge = parseInt(age) || 25;
    const userTone = tone || 'neutral';
    const userLanguage = language || 'english';
    const userAvatar = avatar || 'kelly';
    const playerMode = mode || 'video';
    
    // Load lesson DNA
    const lessonDNA = await loadDailyLessonDNA(dayOfYear);
    
    // Adapt lesson for user preferences
    const ageEngine = new UniversalAgeEngine();
    const adaptedContent = await ageEngine.adaptLessonContent(lessonDNA, userAge);
    
    // Generate lesson structure based on mode
    const lesson = await generateLessonForMode(lessonDNA, {
      age: userAge,
      tone: userTone,
      language: userLanguage,
      avatar: userAvatar,
      mode: playerMode,
      adaptedContent: adaptedContent
    });
    
    res.status(200).json(lesson);
  } catch (error) {
    console.error('Daily lesson API error:', error);
    res.status(500).json({ 
      error: 'Failed to load lesson',
      details: error.message 
    });
  }
}

async function generateLessonForMode(lessonDNA, options) {
  const { age, tone, language, avatar, mode, adaptedContent } = options;
  
  // Base lesson structure
  const lesson = {
    lesson_id: lessonDNA.lesson_id,
    lesson_metadata: {
      title: lessonDNA.universal_concept?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Daily Learning',
      day: lessonDNA.day,
      date: new Date().toISOString().split('T')[0],
      duration: '5-8 minutes',
      complexity: getComplexityForAge(age),
      topic: lessonDNA.universal_concept,
      principle: lessonDNA.core_principle,
      essence: lessonDNA.learning_essence
    },
    scripts: [],
    audio_url: null,
    video_url: null,
    avatar_url: null,
    text_content: null,
    generated_at: new Date().toISOString()
  };
  
  // Generate content based on mode
  switch (mode) {
    case 'text':
      lesson.text_content = await generateTextContent(adaptedContent || lessonDNA, options);
      break;
      
    case 'audio':
      lesson.audio_url = await generateAudioContent(lessonDNA, options);
      lesson.scripts = await generateAudioScripts(lessonDNA, options);
      break;
      
    case 'video':
      lesson.video_url = await generateVideoContent(lessonDNA, options);
      lesson.scripts = await generateVideoScripts(lessonDNA, options);
      break;
      
    case 'avatar':
      lesson.avatar_url = await generateAvatarContent(lessonDNA, options);
      lesson.scripts = await generateAvatarScripts(lessonDNA, options);
      break;
      
    default:
      // Generate all content for universal player
      lesson.text_content = await generateTextContent(adaptedContent || lessonDNA, options);
      lesson.audio_url = await generateAudioContent(lessonDNA, options);
      lesson.video_url = await generateVideoContent(lessonDNA, options);
      lesson.avatar_url = await generateAvatarContent(lessonDNA, options);
      lesson.scripts = await generateUniversalScripts(lessonDNA, options);
  }
  
  return lesson;
}

async function generateTextContent(lessonDNA, options) {
  const { age, tone, language } = options;
  
  // Use adapted content if available, otherwise fall back to original
  const content = {
    title: lessonDNA.title || lessonDNA.universal_concept?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    introduction: lessonDNA.introduction || lessonDNA.learning_essence,
    mainContent: lessonDNA.mainContent || [
      `Today we're exploring ${lessonDNA.universal_concept?.replace(/_/g, ' ')}.`,
      `This lesson will help you understand ${lessonDNA.core_principle?.replace(/_/g, ' ')}.`,
      `Let's dive into this fascinating topic together.`
    ],
    questions: [
      {
        question: `True or false: ${lessonDNA.universal_concept?.replace(/_/g, ' ') || 'this concept'} is important for learning?`,
        answer: true,
        explanation: `Understanding ${lessonDNA.universal_concept?.replace(/_/g, ' ') || 'this concept'} helps us grow and learn.`
      },
      {
        question: `Which of these best describes ${lessonDNA.core_principle?.replace(/_/g, ' ') || 'this principle'}?`,
        options: ['Option A', 'Option B', 'Option C'],
        correct: 0,
        explanation: 'This is the most accurate description.'
      },
      {
        question: `How can you apply ${lessonDNA.learning_essence?.replace(/_/g, ' ') || 'this learning'} in your daily life?`,
        type: 'open',
        suggestions: ['Think about it', 'Discuss with others', 'Practice regularly']
      }
    ],
    summary: lessonDNA.summary || `Today you learned about ${lessonDNA.universal_concept?.replace(/_/g, ' ')} and how it relates to ${lessonDNA.core_principle?.replace(/_/g, ' ')}.`,
    vocabulary: lessonDNA.vocabulary || ['concept', 'principle', 'learning', 'growth'],
    complexity: lessonDNA.complexity || getComplexityForAge(age)
  };
  
  return content;
}

// Generate audio content using Cloudflare TTS
async function generateAudioContent(lessonDNA, options) {
  const { tone, language, avatar } = options;
  try {
    const audioText = generateAudioScript(lessonDNA, options);
    console.log('[DEBUG] generateAudioContent called with:', { lessonDNA, options, audioText });
    
    // Use Cloudflare TTS for both Ken and Kelly
    const CloudflareTTSClient = require('../../services/cloudflare-tts-client.js');
    const ttsClient = new CloudflareTTSClient();
    console.log('[DEBUG] TTS client initialized:', ttsClient.baseUrl);
    
    // Initialize the TTS client
    let initStatus;
    try {
      initStatus = await ttsClient.initialize();
      console.log('[DEBUG] TTS client initialize() status:', initStatus);
    } catch (initError) {
      console.error('[DEBUG] TTS client initialize() failed:', initError);
      throw initError;
    }
    
    if (avatar === 'ken') {
      // Generate Ken's voice using Cloudflare TTS
      let result;
      try {
        result = await ttsClient.synthesizeKenVoice(audioText, {
          speed: 1.0,
          pitch: 0.85, // Ken's voice profile
          style: 'professional'
        });
        console.log('[DEBUG] Ken voice generation result:', result);
      } catch (ttsError) {
        console.error('[DEBUG] TTS client error (Ken):', ttsError, ttsError?.stack);
        throw ttsError;
      }
      return result && (result.url || result.audio) ? (result.url || result.audio) : null;
    } else if (avatar === 'kelly') {
      // Generate Kelly's voice using Cloudflare TTS
      let result;
      try {
        result = await ttsClient.synthesizeKellyVoice(audioText, {
          speed: 1.0,
          pitch: 1.1, // Kelly's voice profile
          style: 'friendly'
        });
        console.log('[DEBUG] Kelly voice generation result:', result);
      } catch (ttsError) {
        console.error('[DEBUG] TTS client error (Kelly):', ttsError, ttsError?.stack);
        throw ttsError;
      }
      return result && (result.url || result.audio) ? (result.url || result.audio) : null;
    } else {
      return null;
    }
  } catch (error) {
    console.error('[DEBUG] Audio generation failed:', error, error?.stack);
    return null;
  }
}

async function generateVideoContent(lessonDNA, options) {
  const { tone, language, avatar } = options;
  
  try {
    // Generate video using HeyGen
    const videoScript = generateVideoScript(lessonDNA, options);
    // Remove HeyGen video generation and replace with a clear error
    // const videoUrl = await generateHeyGenVideo(videoScript, tone, language, avatar);
    throw new Error('Video generation with HeyGen is not supported. Please implement with our own avatar/video system.');
    
    return videoUrl;
  } catch (error) {
    console.error('Video generation failed:', error);
    // Return a placeholder or fallback
    return null;
  }
}

async function generateAvatarContent(lessonDNA, options) {
  const { tone, language, avatar } = options;
  
  try {
    // Generate real-time avatar session
    const avatarScript = generateAvatarScript(lessonDNA, options);
    const avatarUrl = await generateRealtimeAvatar(avatarScript, tone, language, avatar);
    
    return avatarUrl;
  } catch (error) {
    console.error('Avatar generation failed:', error);
    // Return a placeholder or fallback
    return null;
  }
}

async function generateAudioScripts(lessonDNA, options) {
  const { age, tone, language } = options;
  
  return [
    {
      type: 'introduction',
      script_number: 1,
      voice_text: `Welcome to today's lesson! We're going to explore ${lessonDNA.universal_concept?.replace(/_/g, ' ')}.`,
      on_screen_text: `Welcome to today's lesson!`,
      timing_notes: '0-5 seconds',
      emotion: 'excited'
    },
    {
      type: 'question_1',
      script_number: 2,
      voice_text: `Here's your first question: True or false, ${lessonDNA.universal_concept?.replace(/_/g, ' ')} is important for learning?`,
      on_screen_text: `TRUE or FALSE: ${lessonDNA.universal_concept?.replace(/_/g, ' ')} is important for learning?`,
      timing_notes: '5-15 seconds',
      emotion: 'curious'
    },
    {
      type: 'feedback_1',
      script_number: 3,
      voice_text: `Great thinking! Understanding ${lessonDNA.universal_concept?.replace(/_/g, ' ')} helps us grow and learn.`,
      on_screen_text: `Understanding ${lessonDNA.universal_concept?.replace(/_/g, ' ')} helps us grow and learn.`,
      timing_notes: '15-25 seconds',
      emotion: 'encouraging'
    },
    {
      type: 'question_2',
      script_number: 4,
      voice_text: `Now, which of these best describes ${lessonDNA.core_principle?.replace(/_/g, ' ')}?`,
      on_screen_text: `Which best describes ${lessonDNA.core_principle?.replace(/_/g, ' ')}?`,
      timing_notes: '25-35 seconds',
      emotion: 'thoughtful'
    },
    {
      type: 'feedback_2',
      script_number: 5,
      voice_text: `Excellent! This is the most accurate description.`,
      on_screen_text: `Excellent! This is the most accurate description.`,
      timing_notes: '35-45 seconds',
      emotion: 'proud'
    },
    {
      type: 'question_3',
      script_number: 6,
      voice_text: `Finally, how can you apply ${lessonDNA.learning_essence?.replace(/_/g, ' ')} in your daily life?`,
      on_screen_text: `How can you apply this in your daily life?`,
      timing_notes: '45-55 seconds',
      emotion: 'inspiring'
    },
    {
      type: 'fortune',
      script_number: 7,
      voice_text: `Today, you've earned your daily fortune! You are a learner who understands ${lessonDNA.universal_concept?.replace(/_/g, ' ')}.`,
      on_screen_text: `Your Daily Fortune: You are a learner who understands ${lessonDNA.universal_concept?.replace(/_/g, ' ')}.`,
      timing_notes: '55-65 seconds',
      emotion: 'celebratory'
    }
  ];
}

async function generateVideoScripts(lessonDNA, options) {
  // Similar to audio scripts but with visual cues
  const audioScripts = await generateAudioScripts(lessonDNA, options);
  
  return audioScripts.map(script => ({
    ...script,
    visual_cues: generateVisualCues(script.type, script.emotion),
    background: 'educational_environment',
    avatar_expressions: generateAvatarExpressions(script.emotion)
  }));
}

async function generateAvatarScripts(lessonDNA, options) {
  // Real-time avatar interaction scripts
  const audioScripts = await generateAudioScripts(lessonDNA, options);
  
  return audioScripts.map(script => ({
    ...script,
    interaction_points: generateInteractionPoints(script.type),
    wait_for_input: script.type.includes('question'),
    response_handling: generateResponseHandling(script.type)
  }));
}

async function generateUniversalScripts(lessonDNA, options) {
  // Combined scripts for universal player
  const audioScripts = await generateAudioScripts(lessonDNA, options);
  
  return audioScripts.map(script => ({
    ...script,
    text_version: generateTextVersion(script),
    audio_version: generateAudioVersion(script),
    video_version: generateVideoVersion(script),
    avatar_version: generateAvatarVersion(script)
  }));
}

// Helper functions
function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getComplexityForAge(age) {
  if (age <= 12) return 'Foundation';
  if (age <= 25) return 'Application';
  if (age <= 50) return 'Advanced';
  return 'Wisdom';
}

function generateAudioScript(lessonDNA, options) {
  const { tone, language } = options;
  
  return `
    Welcome to today's lesson! We're going to explore ${lessonDNA.universal_concept?.replace(/_/g, ' ')}.
    
    This lesson will help you understand ${lessonDNA.core_principle?.replace(/_/g, ' ')}.
    
    Let's start with a question: True or false, ${lessonDNA.universal_concept?.replace(/_/g, ' ')} is important for learning?
    
    Great thinking! Understanding ${lessonDNA.universal_concept?.replace(/_/g, ' ')} helps us grow and learn.
    
    Now, which of these best describes ${lessonDNA.core_principle?.replace(/_/g, ' ')}?
    
    Excellent! This is the most accurate description.
    
    Finally, how can you apply ${lessonDNA.learning_essence?.replace(/_/g, ' ')} in your daily life?
    
    Today, you've earned your daily fortune! You are a learner who understands ${lessonDNA.universal_concept?.replace(/_/g, ' ')}.
  `.trim();
}

function generateVideoScript(lessonDNA, options) {
  // Similar to audio script but with visual direction
  return generateAudioScript(lessonDNA, options);
}

function generateAvatarScript(lessonDNA, options) {
  // Real-time interaction script
  return generateAudioScript(lessonDNA, options);
}

function generateVisualCues(type, emotion) {
  const cues = {
    introduction: { background: 'warm', lighting: 'bright', camera: 'medium' },
    question_1: { background: 'focused', lighting: 'dramatic', camera: 'close' },
    feedback_1: { background: 'positive', lighting: 'warm', camera: 'medium' },
    question_2: { background: 'thoughtful', lighting: 'balanced', camera: 'medium' },
    feedback_2: { background: 'celebratory', lighting: 'bright', camera: 'close' },
    question_3: { background: 'inspiring', lighting: 'golden', camera: 'wide' },
    fortune: { background: 'magical', lighting: 'ethereal', camera: 'dramatic' }
  };
  
  return cues[type] || cues.introduction;
}

function generateAvatarExpressions(emotion) {
  const expressions = {
    excited: { smile: 80, eyes: 'bright', eyebrows: 'raised', head_tilt: 5 },
    curious: { smile: 40, eyes: 'focused', eyebrows: 'curious', head_tilt: 10 },
    encouraging: { smile: 70, eyes: 'warm', eyebrows: 'gentle', head_tilt: 0 },
    thoughtful: { smile: 30, eyes: 'contemplative', eyebrows: 'furrowed', head_tilt: -5 },
    proud: { smile: 90, eyes: 'proud', eyebrows: 'raised', head_tilt: 5 },
    inspiring: { smile: 60, eyes: 'determined', eyebrows: 'strong', head_tilt: 0 },
    celebratory: { smile: 100, eyes: 'joyful', eyebrows: 'high', head_tilt: 10 }
  };
  
  return expressions[emotion] || expressions.excited;
}

function generateInteractionPoints(type) {
  if (type.includes('question')) {
    return {
      wait_for_response: true,
      response_timeout: 10000,
      allow_multiple_choices: type === 'question_2'
    };
  }
  return { wait_for_response: false };
}

function generateResponseHandling(type) {
  if (type.includes('feedback')) {
    return {
      positive_reinforcement: true,
      gentle_correction: true,
      encourage_retry: false
    };
  }
  return {};
}

function generateTextVersion(script) {
  return {
    display_text: script.on_screen_text,
    reading_time: script.voice_text.length / 200, // Rough estimate
    emphasis_words: extractEmphasisWords(script.voice_text)
  };
}

function generateAudioVersion(script) {
  return {
    audio_duration: script.voice_text.length / 150, // Rough estimate
    voice_settings: getVoiceSettings(script.emotion),
    pause_markers: extractPauseMarkers(script.voice_text)
  };
}

function generateVideoVersion(script) {
  return {
    ...generateAudioVersion(script),
    visual_cues: generateVisualCues(script.type, script.emotion),
    avatar_expressions: generateAvatarExpressions(script.emotion)
  };
}

function generateAvatarVersion(script) {
  return {
    ...generateVideoVersion(script),
    interaction_points: generateInteractionPoints(script.type),
    response_handling: generateResponseHandling(script.type)
  };
}

function extractEmphasisWords(text) {
  // Simple emphasis extraction - in production, use NLP
  const words = text.split(' ');
  return words.filter(word => word.length > 6 || word.match(/[A-Z]/));
}

function extractPauseMarkers(text) {
  // Simple pause extraction - in production, use NLP
  const sentences = text.split(/[.!?]/);
  return sentences.map(sentence => sentence.length / 200); // Rough timing
}

function getVoiceSettings(emotion) {
  const settings = {
    excited: { stability: 0.7, similarity_boost: 0.8, style: 0.8 },
    curious: { stability: 0.6, similarity_boost: 0.7, style: 0.6 },
    encouraging: { stability: 0.8, similarity_boost: 0.9, style: 0.7 },
    thoughtful: { stability: 0.9, similarity_boost: 0.8, style: 0.5 },
    proud: { stability: 0.8, similarity_boost: 0.9, style: 0.8 },
    inspiring: { stability: 0.7, similarity_boost: 0.8, style: 0.9 },
    celebratory: { stability: 0.6, similarity_boost: 0.7, style: 1.0 }
  };
  
  return settings[emotion] || settings.excited;
} 