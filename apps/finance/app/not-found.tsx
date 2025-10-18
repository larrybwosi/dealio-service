'use client';
import { useState, useEffect } from 'react';
import { AlertCircle, Home, Search, ArrowLeft, Layers } from 'lucide-react';

export default function Custom404Page() {
  const [glitchActive, setGlitchActive] = useState(false);
  const [floatOffset, setFloatOffset] = useState(0);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 3000);

    const floatInterval = setInterval(() => {
      setFloatOffset(prev => (prev + 1) % 360);
    }, 50);

    return () => {
      clearInterval(glitchInterval);
      clearInterval(floatInterval);
    };
  }, []);

  const floatY = Math.sin(floatOffset * 0.05) * 10;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite',
          }}
        />
      </div>

      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div
        className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"
        style={{ animationDelay: '1s' }}
      />

      <div className="relative z-10 max-w-4xl w-full">
        <div className="text-center space-y-8">
          {/* Floating icon container */}
          <div
            className="flex justify-center mb-8"
            style={{ transform: `translateY(${floatY}px)`, transition: 'transform 0.3s ease-out' }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-50 animate-pulse" />
              <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-full">
                <Layers className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>

          {/* 404 Text with glitch effect */}
          <div className="relative inline-block">
            <h1
              className={`text-9xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent ${glitchActive ? 'animate-pulse' : ''}`}
              style={{
                textShadow: glitchActive ? '2px 2px #3b82f6, -2px -2px #8b5cf6' : 'none',
                transition: 'text-shadow 0.1s',
              }}
            >
              404
            </h1>

            {/* Badges */}
            <div className="absolute -top-4 -right-4 flex gap-2">
              <span className="bg-red-500/90 text-white text-xs px-3 py-1 rounded-full font-semibold animate-bounce">
                ERROR
              </span>
            </div>
          </div>

          {/* Error message */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-blue-300">
              <AlertCircle className="w-5 h-5" />
              <h2 className="text-2xl font-semibold">Page Not Found</h2>
            </div>

            <p className="text-slate-400 text-lg max-w-md mx-auto">
              The resource you&#39;re looking for doesn&#39;t exist in our ERP system. It may have been moved, deleted, the URL
              might be incorrect, or this feature might be coming in the next release.
            </p>
          </div>

          {/* Status badges */}
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-slate-300 text-sm font-medium">Status: Not Found</span>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <span className="text-slate-300 text-sm font-medium">Code: 404</span>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-slate-300 text-sm font-medium">System: Online</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <button
              onClick={() => window.history.back()}
              className="group flex items-center justify-center gap-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-slate-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Go Back
            </button>

            <button
              onClick={() => (window.location.href = '/')}
              className="group flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/50"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Back to Dashboard
            </button>

            <button
              onClick={() => (window.location.href = '/search')}
              className="group flex items-center justify-center gap-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-slate-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105"
            >
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Search
            </button>
          </div>

          {/* Help text */}
          <div className="pt-8 text-slate-500 text-sm">
            Need help? Contact your system administrator or visit the{' '}
            <a href="/help" className="text-blue-400 hover:text-blue-300 underline">
              help center
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }
      `}</style>
    </div>
  );
}
