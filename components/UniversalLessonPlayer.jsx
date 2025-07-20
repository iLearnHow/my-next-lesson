import React, { useState } from 'react';

export function UniversalLessonPlayer({ lesson, accessibilityOptions = {} }) {
  const [currentSection, setCurrentSection] = useState('opening');
  const [userResponses, setUserResponses] = useState([]);

  if (!lesson) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  const handleAnswer = (answer) => {
    setUserResponses([...userResponses, answer]);
    
    // Auto-advance to next section
    if (currentSection === 'opening') {
      setCurrentSection('question1');
    } else if (currentSection === 'question1') {
      setCurrentSection('question2');
    } else if (currentSection === 'question2') {
      setCurrentSection('question3');
    } else if (currentSection === 'question3') {
      setCurrentSection('fortune');
    }
  };

  const getQuestionData = (questionNumber) => {
    const questionKey = `question_${questionNumber}`;
    return lesson.core_lesson_structure?.[questionKey];
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 ${accessibilityOptions.contrast || 'normal'}`}>
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {lesson.lesson_id?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Daily Lesson'}
          </h1>
          <p className="text-lg text-gray-600">
            {lesson.universal_concept?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </p>
        </div>

        {/* Lesson Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          
          {/* Opening Section */}
          {currentSection === 'opening' && (
            <section className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Welcome to Today's Lesson</h2>
              <div className="text-lg text-gray-700 leading-relaxed mb-8">
                <p className="mb-4">
                  Today we're exploring <strong>{lesson.universal_concept?.replace(/_/g, ' ')}</strong>.
                </p>
                <p className="mb-4">
                  {lesson.learning_essence}
                </p>
                <p>
                  This lesson will help you understand how {lesson.core_principle?.replace(/_/g, ' ')}.
                </p>
              </div>
              <button 
                onClick={() => setCurrentSection('question1')}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Start Lesson
              </button>
            </section>
          )}

          {/* Question Sections */}
          {currentSection.startsWith('question') && (
            <section className="text-center">
              <div className="mb-6">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Question {currentSection.slice(-1)} of 3
                </span>
              </div>
              
              {(() => {
                const questionNum = currentSection.slice(-1);
                const questionData = getQuestionData(questionNum);
                
                if (!questionData) return <p>Question not found</p>;
                
                return (
                  <>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                      {questionData.concept_focus?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </h2>
                    
                    <div className="text-lg text-gray-700 mb-8">
                      <p className="mb-4">
                        <strong>Principle:</strong> {questionData.universal_principle?.replace(/_/g, ' ')}
                      </p>
                      <p>
                        <strong>Focus:</strong> {questionData.cognitive_target?.replace(/_/g, ' ')}
                      </p>
                    </div>

                    <div className="space-y-4 mb-8">
                      <button
                        onClick={() => handleAnswer('A')}
                        className="w-full bg-green-100 hover:bg-green-200 text-green-800 p-4 rounded-lg text-left transition-colors"
                      >
                        <strong>Option A:</strong> {questionData.choice_architecture?.option_a?.replace(/_/g, ' ')}
                      </button>
                      
                      <button
                        onClick={() => handleAnswer('B')}
                        className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 p-4 rounded-lg text-left transition-colors"
                      >
                        <strong>Option B:</strong> {questionData.choice_architecture?.option_b?.replace(/_/g, ' ')}
                      </button>
                    </div>

                    <div className="text-sm text-gray-500">
                      Choose the approach that feels most natural to you.
                    </div>
                  </>
                );
              })()}
            </section>
          )}

          {/* Fortune Section */}
          {currentSection === 'fortune' && (
            <section className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Daily Fortune</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Congratulations! You've completed today's lesson on {lesson.universal_concept?.replace(/_/g, ' ')}.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mt-4">
                  Remember: {lesson.core_principle?.replace(/_/g, ' ')}
                </p>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={() => {
                    setCurrentSection('opening');
                    setUserResponses([]);
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors mr-4"
                >
                  Restart Lesson
                </button>
                <button
                  onClick={() => {
                    // Could navigate to another lesson here
                    alert('More lessons coming soon!');
                  }}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Next Lesson
                </button>
              </div>
            </section>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-2">
            {['opening', 'question1', 'question2', 'question3', 'fortune'].map((section, index) => (
              <div
                key={section}
                className={`w-3 h-3 rounded-full ${
                  currentSection === section 
                    ? 'bg-blue-600' 
                    : ['opening', 'question1', 'question2', 'question3', 'fortune'].indexOf(currentSection) > index
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 