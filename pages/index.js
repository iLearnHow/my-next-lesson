import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Play, Users, Settings, BookOpen, Zap } from 'lucide-react';

export default function Home() {
  return (
    <>
      <Head>
        <title>MyNextLesson - Homegrown Learning Platform</title>
        <meta name="description" content="Experience real-time Ken avatar with our homegrown TTS and lesson systems" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Hero Section */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                MyNextLesson
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Experience the future of personalized learning with our homegrown real-time avatar system. 
                No external APIs, no dependencies - just Ken's authentic teaching experience.
              </p>
              
              {/* Demo CTA */}
              <div className="mb-8">
                <Link href="/demo-ken-lesson">
                  <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors flex items-center mx-auto">
                    <Play className="mr-2" />
                    Try Real-Time Ken Demo
                  </button>
                </Link>
              </div>

              {/* Status Indicators */}
              <div className="flex justify-center space-x-8">
                <div className="flex items-center text-green-600">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium">Cloudflare TTS Active</span>
                </div>
                <div className="flex items-center text-green-600">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium">Real-time Ken Avatar</span>
                </div>
                <div className="flex items-center text-green-600">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium">No External Dependencies</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Real-time Ken Avatar */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Ken Avatar</h3>
                <p className="text-gray-600 text-sm">
                  22 emotional states that respond to lesson content in real-time
                </p>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Dynamic expression changes</li>
                <li>• Professional quality images</li>
                <li>• Responsive to user interactions</li>
                <li>• No external avatar services</li>
              </ul>
            </div>

            {/* Cloudflare TTS */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Cloudflare TTS</h3>
                <p className="text-gray-600 text-sm">
                  Ken's voice synthesis powered by your own infrastructure
                </p>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Real-time voice generation</li>
                <li>• High-quality audio output</li>
                <li>• No ElevenLabs dependency</li>
                <li>• Scalable Cloudflare Workers</li>
              </ul>
            </div>

            {/* Lesson Intelligence */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Lesson Intelligence</h3>
                <p className="text-gray-600 text-sm">
                  3x3x3 lesson structure with adaptive content
                </p>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Interactive questions</li>
                <li>• Progress tracking</li>
                <li>• Age-appropriate content</li>
                <li>• Real-time responses</li>
              </ul>
            </div>

            {/* Advanced Generator */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Advanced Generator</h3>
                <p className="text-gray-600 text-sm">
                  Create custom lessons with your own content
                </p>
              </div>
              <Link href="/advanced-lesson">
                <button className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
                  Open Generator
                </button>
              </Link>
            </div>

            {/* Daily Fortune System */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Daily Fortune</h3>
                <p className="text-gray-600 text-sm">
                  Interactive teacher selection system
                </p>
              </div>
              <Link href="/daily-fortune">
                <button className="w-full bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-700 transition-colors">
                  Try Fortune System
                </button>
              </Link>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">System Status</h3>
                <p className="text-gray-600 text-sm">
                  All systems operational
                </p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Cloudflare TTS:</span>
                  <span className="text-green-600 font-medium">✅ Active</span>
                </div>
                <div className="flex justify-between">
                  <span>Ken Avatar:</span>
                  <span className="text-green-600 font-medium">✅ Ready</span>
                </div>
                <div className="flex justify-between">
                  <span>External APIs:</span>
                  <span className="text-red-600 font-medium">❌ Removed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-white border-t">
          <div className="max-w-7xl mx-auto px-4 py-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Experience the Future?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              See Ken come to life with our homegrown real-time avatar and TTS systems. 
              No external dependencies, just pure learning innovation.
            </p>
            <Link href="/demo-ken-lesson">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors">
                Start Real-Time Demo
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
} 