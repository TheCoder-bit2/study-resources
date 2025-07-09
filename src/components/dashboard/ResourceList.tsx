import React, { useState, useEffect } from 'react';
import { ExternalLink, FileText, BookOpen, Sparkles, Download } from 'lucide-react';
import { Resource } from '../../types';
import { api } from '../../services/api';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface ResourceListProps {
  subjectId: string;
}

export const ResourceList: React.FC<ResourceListProps> = ({ subjectId }) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredResource, setHoveredResource] = useState<string | null>(null);

  useEffect(() => {
    loadResources();
  }, [subjectId]);

  const loadResources = async () => {
    try {
      setLoading(true);
      const data = await api.getResources(subjectId);
      setResources(data);
    } catch (error) {
      console.error('Error loading resources:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (resources.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="relative inline-block">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300 animate-pulse" />
          <div className="absolute -top-1 -right-1 animate-bounce">
            <Sparkles className="w-4 h-4 text-gray-400" />
          </div>
        </div>
        <p className="text-gray-500">No resources available for this subject</p>
        <p className="text-gray-400 text-sm mt-1">Contact admin to add resources</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      {resources.map((resource, index) => (
        <div
          key={resource.id}
          className="group relative"
          style={{ animationDelay: `${index * 100}ms` }}
          onMouseEnter={() => setHoveredResource(resource.id)}
          onMouseLeave={() => setHoveredResource(null)}
        >
          {/* Resource Card */}
          <div className="relative overflow-hidden bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-500">
            {/* Floating Elements Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* Floating Books */}
              {[...Array(3)].map((_, i) => (
                <div
                  key={`book-${i}`}
                  className={`absolute transition-all duration-1000 transform ${
                    hoveredResource === resource.id
                      ? 'translate-y-0 opacity-15 rotate-12' 
                      : 'translate-y-4 opacity-0 rotate-0'
                  }`}
                  style={{
                    right: `${10 + i * 25}%`,
                    top: `${15 + (i % 2) * 20}%`,
                    animationDelay: `${i * 200}ms`,
                  }}
                >
                  <BookOpen className="w-4 h-4 text-gray-400" />
                </div>
              ))}
              
              {/* Floating Papers */}
              {[...Array(2)].map((_, i) => (
                <div
                  key={`paper-${i}`}
                  className={`absolute transition-all duration-1200 transform ${
                    hoveredResource === resource.id
                      ? 'translate-y-0 opacity-10 rotate-6' 
                      : 'translate-y-3 opacity-0 rotate-0'
                  }`}
                  style={{
                    left: `${15 + i * 30}%`,
                    top: `${20 + i * 15}%`,
                    animationDelay: `${i * 300}ms`,
                  }}
                >
                  <FileText className="w-3 h-3 text-gray-400" />
                </div>
              ))}
            </div>

            {/* Main Content */}
            <div className="relative p-4 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  {/* Animated Document Stack */}
                  <div className="relative flex-shrink-0">
                    <div className={`
                      transition-all duration-500 transform
                      ${hoveredResource === resource.id ? 'scale-110 rotate-3' : 'scale-100 rotate-0'}
                    `}>
                      <FileText className="w-5 h-5 text-gray-600" />
                    </div>
                    
                    {/* Stacked Papers Effect */}
                    <div className={`
                      absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-gray-200 rounded-sm transition-all duration-300
                      ${hoveredResource === resource.id ? 'opacity-100 transform rotate-2' : 'opacity-0'}
                    `} />
                    <div className={`
                      absolute -bottom-1 -right-1 w-3 h-3 bg-gray-300 rounded-sm transition-all duration-500
                      ${hoveredResource === resource.id ? 'opacity-100 transform rotate-1' : 'opacity-0'}
                    `} />
                    
                    {/* Download Icon Animation */}
                    <div className={`
                      absolute -top-1 -right-1 transition-all duration-300
                      ${hoveredResource === resource.id ? 'opacity-100 animate-bounce' : 'opacity-0'}
                    `}>
                      <Download className="w-3 h-3 text-blue-500" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h5 className={`
                      font-medium text-gray-800 transition-all duration-300 truncate
                      ${hoveredResource === resource.id ? 'text-gray-900 transform translate-x-1' : ''}
                    `}>
                      {resource.title}
                    </h5>
                    <p className={`
                      text-gray-500 text-sm mt-1 transition-all duration-300
                      ${hoveredResource === resource.id ? 'text-blue-600' : ''}
                    `}>
                      {hoveredResource === resource.id ? 'Click to open resource' : 'Study material'}
                    </p>
                  </div>
                </div>
                
                {/* Action Button */}
                <a
                  href={resource.drive_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform
                    ${hoveredResource === resource.id 
                      ? 'bg-blue-600 text-white shadow-lg scale-105 hover:bg-blue-700' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className={`
                    w-4 h-4 transition-all duration-300
                    ${hoveredResource === resource.id ? 'animate-pulse' : ''}
                  `} />
                  <span className="hidden sm:inline">Open</span>
                </a>
              </div>
            </div>

            {/* Shimmer Effect */}
            <div className={`
              absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 transform -skew-x-12 transition-all duration-1000
              ${hoveredResource === resource.id ? 'opacity-40 translate-x-full' : 'opacity-0 -translate-x-full'}
            `} />

            {/* Bottom Accent Line */}
            <div className={`
              absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500
              ${hoveredResource === resource.id ? 'w-full opacity-100' : 'w-0 opacity-0'}
            `} />

            {/* Corner Sparkle */}
            <div className={`
              absolute top-2 right-2 transition-all duration-300
              ${hoveredResource === resource.id ? 'opacity-100 animate-pulse' : 'opacity-0'}
            `}>
              <Sparkles className="w-3 h-3 text-yellow-400" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};