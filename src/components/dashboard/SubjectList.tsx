import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, BookOpen, Sparkles } from 'lucide-react';
import { Subject } from '../../types';
import { api } from '../../services/api';
import { ResourceList } from './ResourceList';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface SubjectListProps {
  semesterId: string;
}

export const SubjectList: React.FC<SubjectListProps> = ({ semesterId }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set());
  const [hoveredSubject, setHoveredSubject] = useState<string | null>(null);

  useEffect(() => {
    loadSubjects();
  }, [semesterId]);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const data = await api.getSubjects(semesterId);
      setSubjects(data);
    } catch (error) {
      console.error('Error loading subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSubject = (subjectId: string) => {
    const newExpanded = new Set(expandedSubjects);
    if (newExpanded.has(subjectId)) {
      newExpanded.delete(subjectId);
    } else {
      newExpanded.add(subjectId);
    }
    setExpandedSubjects(newExpanded);
  };

  if (loading) return <LoadingSpinner />;

  if (subjects.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="relative">
          <BookOpen className="w-16 h-16 mx-auto mb-6 text-gray-300 animate-pulse" />
          <div className="absolute -top-2 -right-2 animate-bounce">
            <Sparkles className="w-6 h-6 text-gray-400" />
          </div>
        </div>
        <p className="text-gray-500 text-lg">No subjects found for this semester</p>
        <p className="text-gray-400 text-sm mt-2">Contact admin to add subjects</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {subjects.map((subject, index) => (
        <div 
          key={subject.id} 
          className="group relative"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Subject Card */}
          <div className="relative overflow-hidden border border-gray-200 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-lg transition-all duration-500">
            {/* Floating Books Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute transition-all duration-1000 transform ${
                    hoveredSubject === subject.id
                      ? 'translate-y-0 opacity-20 rotate-12' 
                      : 'translate-y-6 opacity-0 rotate-0'
                  }`}
                  style={{
                    right: `${5 + i * 20}%`,
                    top: `${10 + (i % 2) * 30}%`,
                    animationDelay: `${i * 150}ms`,
                  }}
                >
                  <BookOpen className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>

            {/* Main Subject Button */}
            <div
              className="relative p-6 cursor-pointer z-10"
              onClick={() => toggleSubject(subject.id)}
              onMouseEnter={() => setHoveredSubject(subject.id)}
              onMouseLeave={() => setHoveredSubject(null)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Animated Book Stack */}
                  <div className="relative">
                    <div className={`
                      transition-all duration-500 transform
                      ${hoveredSubject === subject.id ? 'scale-110 rotate-6' : 'scale-100 rotate-0'}
                    `}>
                      <BookOpen className="w-6 h-6 text-gray-600" />
                    </div>
                    
                    {/* Stacked Books Effect */}
                    <div className={`
                      absolute -bottom-1 -right-1 w-5 h-4 bg-gray-300 rounded-sm transition-all duration-300
                      ${hoveredSubject === subject.id ? 'opacity-100 transform rotate-3' : 'opacity-0'}
                    `} />
                    <div className={`
                      absolute -bottom-0.5 -right-0.5 w-4 h-3 bg-gray-400 rounded-sm transition-all duration-500
                      ${hoveredSubject === subject.id ? 'opacity-100 transform rotate-1' : 'opacity-0'}
                    `} />
                    
                    {/* Sparkle Effect */}
                    <div className={`
                      absolute -top-2 -right-2 transition-all duration-300
                      ${hoveredSubject === subject.id ? 'opacity-100 animate-pulse' : 'opacity-0'}
                    `}>
                      <Sparkles className="w-3 h-3 text-yellow-400" />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className={`
                      font-semibold text-gray-800 text-lg transition-all duration-300
                      ${hoveredSubject === subject.id ? 'text-gray-900 transform translate-x-1' : ''}
                    `}>
                      {subject.name}
                    </h4>
                    <p className={`
                      text-gray-500 text-sm mt-1 transition-all duration-300
                      ${hoveredSubject === subject.id ? 'text-gray-600' : ''}
                    `}>
                      {expandedSubjects.has(subject.id) ? 'Viewing resources' : 'Click to view resources'}
                    </p>
                  </div>
                </div>
                
                {/* Animated Chevron */}
                <div className={`
                  transition-all duration-500 transform
                  ${expandedSubjects.has(subject.id) ? 'rotate-180 scale-110' : 'rotate-0 scale-100'}
                  ${hoveredSubject === subject.id ? 'text-gray-700' : 'text-gray-500'}
                `}>
                  <ChevronDown className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Hover Shimmer Effect */}
            <div className={`
              absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 transform -skew-x-12 transition-all duration-1000
              ${hoveredSubject === subject.id ? 'opacity-30 translate-x-full' : 'opacity-0 -translate-x-full'}
            `} />

            {/* Bottom Glow */}
            <div className={`
              absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-gray-400 to-gray-600 transition-all duration-500
              ${hoveredSubject === subject.id ? 'w-full opacity-100' : 'w-0 opacity-0'}
            `} />
          </div>
          
          {/* Expanded Resources */}
          <div className={`
            overflow-hidden transition-all duration-700 ease-out transform
            ${expandedSubjects.has(subject.id) 
              ? 'max-h-screen opacity-100 mt-4 translate-y-0' 
              : 'max-h-0 opacity-0 -translate-y-2'
            }
          `}>
            <div className="bg-white border border-gray-200 rounded-lg shadow-inner">
              <div className={`
                transition-all duration-500 transform
                ${expandedSubjects.has(subject.id) ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}
              `}>
                <ResourceList subjectId={subject.id} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};