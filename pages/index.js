import Head from 'next/head'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Head>
        <title>DailyLesson Avatar Foundry</title>
        <meta name="description" content="Self-hosted pipeline for generating avatar videos for DailyLesson.org" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-8">
            🎬 DailyLesson Avatar Foundry
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Self-hosted, open-source pipeline for generating high-quality avatar videos 
            for DailyLesson.org. Powered by SadTalker, Piper TTS, and Rhubarb Lip Sync.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-semibold mb-4">🎭 Avatar Generation</h3>
              <p className="text-gray-600">
                Create talking avatars from source images and audio using advanced AI models.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-semibold mb-4">🔊 Text-to-Speech</h3>
              <p className="text-gray-600">
                High-quality voice synthesis with Piper TTS and ElevenLabs integration.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-semibold mb-4">👄 Lip Sync</h3>
              <p className="text-gray-600">
                Automatic viseme generation with Rhubarb Lip Sync for realistic mouth movements.
              </p>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Project Status</h2>
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">✅ Completed</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Docker containerization</li>
                    <li>• SadTalker integration</li>
                    <li>• Audio processing pipeline</li>
                    <li>• Quality presets configuration</li>
                    <li>• Automated testing framework</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">🚧 In Progress</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Network optimization</li>
                    <li>• Reference video integration</li>
                    <li>• Enhanced movement quality</li>
                    <li>• Production deployment</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Technology Stack</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full">Next.js</span>
              <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full">SadTalker</span>
              <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full">Piper TTS</span>
              <span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full">Rhubarb Lip Sync</span>
              <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full">Docker</span>
              <span className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full">Python</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 DailyLesson.org Avatar Foundry. Open source project.</p>
        </div>
      </footer>
    </div>
  )
} 