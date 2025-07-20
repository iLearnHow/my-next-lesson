import React from 'react';
import Head from 'next/head';
import RealTimeKenLessonPlayer from '../components/RealTimeKenLessonPlayer';

export default function DemoKenLesson() {
  return (
    <>
      <Head>
        <title>Real-Time Ken Lesson Demo - MyNextLesson</title>
        <meta name="description" content="Experience Ken's real-time avatar with our homegrown TTS and lesson systems" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Demo Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">MyNextLesson Demo</h1>
                <p className="text-sm text-gray-600">Homegrown TTS + Real-time Ken Avatar</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">✅ No External APIs</p>
                  <p className="text-xs text-gray-500">100% Your Systems</p>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Content */}
        <RealTimeKenLessonPlayer />

        {/* Demo Footer */}
        <div className="bg-white border-t mt-8">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🎭 Real-time Ken Avatar</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 22 emotional states</li>
                  <li>• Dynamic expression changes</li>
                  <li>• Responsive to lesson content</li>
                  <li>• Professional quality images</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🔊 Cloudflare TTS</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Ken's voice synthesis</li>
                  <li>• Real-time generation</li>
                  <li>• No external dependencies</li>
                  <li>• High-quality audio</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🧠 Lesson Intelligence</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 3x3x3 lesson structure</li>
                  <li>• Interactive questions</li>
                  <li>• Progress tracking</li>
                  <li>• Adaptive responses</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">🚀 Ready for Production</h3>
                <p className="text-sm text-gray-600 max-w-2xl mx-auto">
                  This demo showcases your complete homegrown lesson system. No ElevenLabs, no HeyGen, 
                  no external dependencies. Everything runs on your infrastructure with Ken's real-time 
                  avatar and voice synthesis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 