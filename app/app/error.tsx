'use client';

export default function Error() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">Error</h1>
        <p className="text-xl text-gray-600 mb-8">Something went wrong</p>
        <a href="/" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
          Go Home
        </a>
      </div>
    </div>
  );
}

