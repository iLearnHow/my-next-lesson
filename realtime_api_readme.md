# DailyLesson.org - Real-Time Descript Avatar Integration

## Overview

This implementation uses Descript's real-time API to deliver Kelly's 3x3x3 Universal Lessons through a single avatar template ("Kelly" with Dolores voice) that speaks lesson content on-demand.

## System Architecture

### Real-Time Flow
```
Student clicks "Play" → API generates Kelly speaking → Streams to student
Student answers Q1 → API generates feedback → Immediate response
Student continues → API generates transitions → Seamless flow
Lesson complete → API generates fortune → Personal delivery
```

### Technical Stack
- **Frontend**: Next.js React components
- **Backend**: Next.js API routes with Descript real-time integration
- **Avatar**: Single Kelly template with Dolores voice
- **Delivery**: Real-time text-to-avatar streaming
- **Storage**: Lesson scripts only (audio generated on-demand)

## Prerequisites

### API Access Requirements
- ✅ Descript account with real-time API access
- ✅ Kelly avatar template uploaded and configured
- ✅ Dolores voice assigned to Kelly template
- ✅ Real-time streaming permissions enabled

### Environment Setup
```env
# .env.local
DESCRIPT_API_TOKEN=your_real_time_api_token
DESCRIPT_AVATAR_ID=kelly_template_id
DESCRIPT_VOICE_ID=dolores_voice_id
DESCRIPT_PROJECT_ID=your_project_id
NEXTAUTH_SECRET=your_nextauth_secret
```

## API Endpoints

### Core Avatar Endpoints
```typescript
// Real-time avatar speaking
POST /api/avatar/speak-realtime
{
  "text": "lesson segment with Kelly's tone markers",
  "sessionId": "unique_session_id",
  "segmentType": "opening|question|feedback|fortune"
}

// Session management
POST /api/avatar/session-realtime
{
  "action": "start|respond|next|complete",
  "lessonTopic": "photosynthesis",
  "studentChoice": "A|B|C"
}

// Real-time streaming
GET /api/avatar/stream/:sessionId
// Server-sent events for continuous audio delivery
```

### Lesson Integration
```typescript
// Generate lesson and start real-time session
POST /api/lesson/start-realtime
{
  "topic": "quantum computing",
  "studentId": "optional_for_personalization"
}

Response:
{
  "sessionId": "session_123",
  "firstAudioStream": "real_time_stream_url",
  "lessonStructure": {
    "totalSegments": 20,
    "estimatedDuration": "8-12 minutes"
  }
}
```

## Implementation Files

### 1. Real-Time Avatar Controller
```typescript
// app/api/avatar/speak-realtime/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface RealTimeRequest {
  text: string;
  sessionId: string;
  segmentType: 'opening' | 'question' | 'feedback' | 'fortune';
  toneMarkers?: string[];
  pauseMarkers?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { text, sessionId, segmentType, toneMarkers, pauseMarkers }: RealTimeRequest = await request.json();
    
    // Process Kelly's speaking style
    const processedText = applyKellyDeliveryStyle(text, segmentType, toneMarkers, pauseMarkers);
    
    // Generate real-time avatar speech
    const audioStream = await generateRealTimeAvatar({
      text: processedText,
      avatarId: process.env.DESCRIPT_AVATAR_ID!,
      voiceId: process.env.DESCRIPT_VOICE_ID!,
      sessionId
    });
    
    return NextResponse.json({
      success: true,
      audioStreamUrl: audioStream.url,
      duration: audioStream.estimatedDuration,
      nextAction: determineNextAction(segmentType)
    });
  } catch (error) {
    console.error('Real-time avatar generation failed:', error);
    return NextResponse.json(
      { error: 'Avatar generation failed', details: error.message },
      { status: 500 }
    );
  }
}

async function generateRealTimeAvatar(params: {
  text: string;
  avatarId: string;
  voiceId: string;
  sessionId: string;
}) {
  const response = await fetch('https://api.descript.com/v1/avatar/speak-realtime', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.DESCRIPT_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      avatar_id: params.avatarId,
      voice_id: params.voiceId,
      text: params.text,
      session_id: params.sessionId,
      stream: true,
      format: 'mp3'
    })
  });
  
  if (!response.ok) {
    throw new Error(`Descript API error: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
}

function applyKellyDeliveryStyle(
  text: string, 
  segmentType: string, 
  toneMarkers?: string[], 
  pauseMarkers?: string[]
): string {
  let processedText = text;
  
  // Apply Kelly's conversational tone markers
  if (toneMarkers?.includes('TONE-EXCITED')) {
    processedText = processedText.replace(/\./g, '!');
  }
  
  if (toneMarkers?.includes('TONE-CURIOUS')) {
    processedText = processedText.replace(/\?/g, '??');
  }
  
  if (toneMarkers?.includes('TONE-GENTLE')) {
    processedText = processedText.replace(/\./g, '...');
  }
  
  // Apply pause markers for natural pacing
  pauseMarkers?.forEach(marker => {
    switch (marker) {
      case 'PAUSE-SHORT':
        processedText += ' <break time="1s"/>';
        break;
      case 'PAUSE-MEDIUM':
        processedText += ' <break time="2s"/>';
        break;
      case 'PAUSE-LONG':
        processedText += ' <break time="4s"/>';
        break;
    }
  });
  
  return processedText;
}

function determineNextAction(segmentType: string): string {
  switch (segmentType) {
    case 'opening':
      return 'start_question_1';
    case 'question':
      return 'wait_for_student_response';
    case 'feedback':
      return 'continue_to_next_question';
    case 'fortune':
      return 'lesson_complete';
    default:
      return 'continue';
  }
}
```

### 2. Real-Time Session Manager
```typescript
// app/api/avatar/session-realtime/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface SessionState {
  sessionId: string;
  lessonTopic: string;
  currentSegment: number;
  studentResponses: StudentResponse[];
  startTime: number;
  isActive: boolean;
}

const activeSessions = new Map<string, SessionState>();

export async function POST(request: NextRequest) {
  const { action, sessionId, ...data } = await request.json();
  
  switch (action) {
    case 'start':
      return await startRealTimeLesson(data);
    case 'respond':
      return await handleStudentResponse(sessionId, data);
    case 'next':
      return await advanceToNextSegment(sessionId);
    case 'complete':
      return await completeLessonSession(sessionId);
    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }
}

async function startRealTimeLesson(data: any) {
  const { lessonTopic, studentId } = data;
  const sessionId = generateSessionId();
  
  // Generate Kelly's lesson script
  const lessonScript = await generateKellyLesson(lessonTopic);
  
  // Parse into segments for real-time delivery
  const segments = parseIntoRealTimeSegments(lessonScript);
  
  // Create session state
  const sessionState: SessionState = {
    sessionId,
    lessonTopic,
    currentSegment: 0,
    studentResponses: [],
    startTime: Date.now(),
    isActive: true
  };
  
  activeSessions.set(sessionId, sessionState);
  
  // Start with Kelly's opening
  const openingAudio = await generateRealTimeAvatar({
    text: segments.opening,
    avatarId: process.env.DESCRIPT_AVATAR_ID!,
    voiceId: process.env.DESCRIPT_VOICE_ID!,
    sessionId
  });
  
  return NextResponse.json({
    success: true,
    sessionId,
    audioStreamUrl: openingAudio.url,
    lessonStructure: {
      totalSegments: segments.length,
      estimatedDuration: estimateLessonDuration(segments)
    }
  });
}

async function handleStudentResponse(sessionId: string, data: any) {
  const session = activeSessions.get(sessionId);
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }
  
  const { questionId, choice } = data;
  
  // Record response
  session.studentResponses.push({
    questionId,
    choice,
    timestamp: Date.now()
  });
  
  // Generate Kelly's immediate feedback
  const feedback = generateKellyFeedback(questionId, choice);
  const feedbackAudio = await generateRealTimeAvatar({
    text: feedback.text,
    avatarId: process.env.DESCRIPT_AVATAR_ID!,
    voiceId: process.env.DESCRIPT_VOICE_ID!,
    sessionId
  });
  
  return NextResponse.json({
    success: true,
    feedbackAudio: feedbackAudio.url,
    isCorrect: feedback.isCorrect,
    nextAction: feedback.isCorrect ? 'continue' : 'retry'
  });
}

// Helper functions
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

async function generateKellyLesson(topic: string): Promise<string> {
  // Use existing lesson generation API
  const response = await fetch('/api/generate-lesson', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic })
  });
  
  const lesson = await response.json();
  return lesson.content;
}

function parseIntoRealTimeSegments(script: string) {
  return {
    opening: extractOpeningSegment(script),
    questions: extractQuestionSegments(script),
    fortune: extractFortuneSegment(script),
    length: 20 // Total segments in Kelly's system
  };
}

function estimateLessonDuration(segments: any): string {
  // Estimate based on text length and Kelly's speaking pace
  const totalWords = segments.opening.split(' ').length + 
                     segments.questions.reduce((acc: number, q: any) => acc + q.split(' ').length, 0) +
                     segments.fortune.split(' ').length;
  
  const minutes = Math.ceil(totalWords / 150); // 150 WPM
  return `${minutes}-${minutes + 2} minutes`;
}
```

### 3. Frontend Real-Time Player
```typescript
// app/components/RealTimeAvatarPlayer.tsx
'use client';

import { useState, useEffect, useRef } from 'react';

interface RealTimePlayerProps {
  lessonTopic: string;
  onLessonComplete: (summary: any) => void;
}

export default function RealTimeAvatarPlayer({ lessonTopic, onLessonComplete }: RealTimePlayerProps) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const startLesson = async () => {
    try {
      const response = await fetch('/api/avatar/session-realtime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start',
          lessonTopic
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSessionId(result.sessionId);
        setCurrentAudio(result.audioStreamUrl);
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Failed to start lesson:', error);
    }
  };
  
  const handleStudentChoice = async (choice: string) => {
    if (!sessionId) return;
    
    setWaitingForResponse(false);
    
    try {
      const response = await fetch('/api/avatar/session-realtime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'respond',
          sessionId,
          questionId: currentQuestion?.id,
          choice
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Play Kelly's immediate feedback
        setCurrentAudio(result.feedbackAudio);
        setIsPlaying(true);
        
        // Set up next action based on correctness
        setTimeout(() => {
          if (result.isCorrect) {
            advanceToNextSegment();
          } else {
            // Allow retry
            setWaitingForResponse(true);
          }
        }, 3000); // Wait for feedback to play
      }
    } catch (error) {
      console.error('Failed to process response:', error);
    }
  };
  
  const advanceToNextSegment = async () => {
    if (!sessionId) return;
    
    try {
      const response = await fetch('/api/avatar/session-realtime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'next',
          sessionId
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        if (result.completed) {
          onLessonComplete(result.summary);
        } else {
          setCurrentAudio(result.audioStreamUrl);
          setCurrentQuestion(result.question);
          setWaitingForResponse(result.waitForInput);
        }
      }
    } catch (error) {
      console.error('Failed to advance segment:', error);
    }
  };
  
  return (
    <div className="realtime-avatar-player">
      {/* Avatar Video Display */}
      <div className="avatar-container">
        {currentAudio && (
          <audio
            ref={audioRef}
            src={currentAudio}
            autoPlay
            onEnded={() => setIsPlaying(false)}
          />
        )}
        
        {/* Kelly Avatar Visual (static image with speaking indicator) */}
        <div className={`avatar-display ${isPlaying ? 'speaking' : ''}`}>
          <img src="/kelly-avatar.png" alt="Kelly" />
          {isPlaying && <div className="speaking-indicator">Speaking...</div>}
        </div>
      </div>
      
      {/* Student Interaction */}
      {waitingForResponse && currentQuestion && (
        <div className="question-choices">
          <h3>{currentQuestion.text}</h3>
          <div className="choices">
            {currentQuestion.choices.map((choice: string, index: number) => (
              <button
                key={index}
                onClick={() => handleStudentChoice(['A', 'B', 'C'][index])}
                className="choice-button"
              >
                {choice}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Start Button */}
      {!sessionId && (
        <button onClick={startLesson} className="start-lesson-btn">
          Start Lesson with Kelly
        </button>
      )}
    </div>
  );
}
```

## Deployment Configuration

### Environment Variables (Production)
```env
# Production .env
DESCRIPT_API_TOKEN=prod_real_time_token
DESCRIPT_AVATAR_ID=kelly_avatar_prod_id
DESCRIPT_VOICE_ID=dolores_voice_prod_id
DESCRIPT_PROJECT_ID=prod_project_id

# CDN Configuration
CDN_URL=https://your-cdn.com
AUDIO_CACHE_DURATION=300 # 5 minutes for real-time content

# Rate Limiting
DESCRIPT_RATE_LIMIT=100 # Requests per minute
MAX_CONCURRENT_SESSIONS=50
```

### Monitoring & Analytics
```typescript
// app/lib/analytics.ts
export function trackRealTimeUsage(event: string, data: any) {
  // Track API usage, latency, student engagement
  console.log(`Real-time event: ${event}`, data);
  
  // Send to analytics service
  fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify({ event, data, timestamp: Date.now() })
  });
}
```

## Testing

### Real-Time API Testing
```bash
# Test real-time avatar generation
curl -X POST http://localhost:3000/api/avatar/speak-realtime \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Welcome back! Today we are exploring photosynthesis.",
    "sessionId": "test_session_123",
    "segmentType": "opening",
    "toneMarkers": ["TONE-EXCITED"],
    "pauseMarkers": ["PAUSE-MEDIUM"]
  }'

# Test lesson session
curl -X POST http://localhost:3000/api/avatar/session-realtime \
  -H "Content-Type: application/json" \
  -d '{
    "action": "start",
    "lessonTopic": "photosynthesis"
  }'
```

## Performance Optimization

### Real-Time Optimizations
- **Streaming Audio**: Progressive download during generation
- **Session Pooling**: Reuse avatar sessions for efficiency  
- **Predictive Generation**: Pre-generate likely next segments
- **Fallback System**: Backup to pre-generated content if API fails

### Scaling Considerations
- **Load Balancing**: Distribute real-time requests across servers
- **Rate Limiting**: Prevent API abuse and manage costs
- **Caching Strategy**: Cache common segments while maintaining real-time feel
- **Error Recovery**: Graceful degradation to backup systems

This implementation provides true real-time avatar interaction while maintaining Kelly's authentic teaching style and the student-first experience principles.