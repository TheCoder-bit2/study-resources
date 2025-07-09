import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

export const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col justify-center items-center p-12 min-h-[200px]">
    {/* Animated Book Stack */}
    <div className="relative mb-4">
      {/* Main Book */}
      <div className="animate-pulse">
        <BookOpen className="w-12 h-12 text-gray-600" />
      </div>
      
      {/* Stacked Books */}
      <div className="absolute -bottom-1 -right-1 animate-pulse" style={{ animationDelay: '0.2s' }}>
        <div className="w-10 h-8 bg-gray-300 rounded-sm opacity-60"></div>
      </div>
      <div className="absolute -bottom-2 -right-2 animate-pulse" style={{ animationDelay: '0.4s' }}>
        <div className="w-8 h-6 bg-gray-400 rounded-sm opacity-40"></div>
      </div>
      
      {/* Floating Sparkles */}
      <div className="absolute -top-2 -right-2 animate-bounce">
        <Sparkles className="w-4 h-4 text-yellow-400" />
      </div>
      <div className="absolute -top-1 -left-2 animate-pulse" style={{ animationDelay: '0.6s' }}>
        <Sparkles className="w-3 h-3 text-blue-400" />
      </div>
    </div>
    
    {/* Loading Text */}
    <div className="text-center">
      <p className="text-gray-600 font-medium animate-pulse">Loading resources...</p>
      <div className="mt-2 flex justify-center space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  </div>
);