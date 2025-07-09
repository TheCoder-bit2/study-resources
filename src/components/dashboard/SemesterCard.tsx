import React, { useState } from 'react';
import { ChevronDown, ChevronRight, BookOpen } from 'lucide-react';
import { Semester } from '../../types';
import { SubjectList } from './SubjectList';

interface SemesterCardProps {
  semester: Semester;
  isExpanded: boolean;
  onToggle: () => void;
}

export const SemesterCard: React.FC<SemesterCardProps> = ({ semester, isExpanded, onToggle }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div
        className={`
          relative overflow-hidden rounded-xl shadow-lg transition-all duration-500 cursor-pointer group
          bg-gradient-to-br from-slate-50 to-gray-100 border border-gray-200
          ${isExpanded ? 'shadow-2xl scale-[1.02] bg-gradient-to-br from-white to-slate-50' : 'hover:shadow-2xl hover:scale-[1.01]'}
        `}
        onClick={onToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-8 h-10 bg-gray-400 rounded-sm transform transition-all duration-1000 ${
                  isHovered ? 'translate-y-0 opacity-20' : 'translate-y-4 opacity-10'
                }`}
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${10 + (i % 2) * 20}%`,
                  animationDelay: `${i * 100}ms`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Floating Books Animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`absolute transition-all duration-1000 transform ${
                isHovered 
                  ? 'translate-y-0 opacity-30 rotate-12' 
                  : 'translate-y-8 opacity-0 rotate-0'
              }`}
              style={{
                right: `${10 + i * 25}%`,
                top: `${20 + i * 15}%`,
                animationDelay: `${i * 200}ms`,
              }}
            >
              <BookOpen 
                className="w-6 h-6 text-gray-400 animate-pulse" 
                style={{ animationDelay: `${i * 300}ms` }}
              />
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="relative p-8 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Animated Book Icon */}
              <div className={`
                relative transition-all duration-500 transform
                ${isHovered ? 'scale-110 rotate-12' : 'scale-100 rotate-0'}
              `}>
                <BookOpen className="w-8 h-8 text-gray-600" />
                {/* Book Pages Animation */}
                <div className={`
                  absolute -top-1 -right-1 w-2 h-6 bg-white rounded-r-sm transition-all duration-300
                  ${isHovered ? 'opacity-100 transform rotate-12' : 'opacity-0'}
                `} />
                <div className={`
                  absolute -top-0.5 -right-0.5 w-1.5 h-5 bg-gray-100 rounded-r-sm transition-all duration-500
                  ${isHovered ? 'opacity-100 transform rotate-6' : 'opacity-0'}
                `} />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-800 transition-colors duration-300 group-hover:text-gray-900">
                  Semester {semester.name}
                </h3>
                <p className={`
                  text-gray-600 mt-1 transition-all duration-300
                  ${isHovered ? 'text-gray-700 transform translate-x-1' : ''}
                `}>
                  {isExpanded ? 'Viewing subjects' : 'Click to explore subjects'}
                </p>
              </div>
            </div>
            
            {/* Animated Chevron */}
            <div className={`
              transition-all duration-500 transform
              ${isExpanded ? 'rotate-180 scale-110' : 'rotate-0 scale-100'}
              ${isHovered ? 'text-gray-700' : 'text-gray-500'}
            `}>
              <ChevronDown className="w-6 h-6" />
            </div>
          </div>
        </div>
        
        {/* Shimmer Effect */}
        <div className={`
          absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 transform -skew-x-12 transition-all duration-1000
          ${isHovered ? 'opacity-20 translate-x-full' : 'opacity-0 -translate-x-full'}
        `} />

        {/* Bottom Border Animation */}
        <div className={`
          absolute bottom-0 left-0 h-1 bg-gradient-to-r from-gray-400 to-gray-600 transition-all duration-500
          ${isHovered ? 'w-full' : 'w-0'}
        `} />
      </div>
      
      {/* Expanded Content */}
      <div className={`
        overflow-hidden transition-all duration-700 ease-out transform
        ${isExpanded 
          ? 'max-h-screen opacity-100 mt-6 translate-y-0' 
          : 'max-h-0 opacity-0 -translate-y-4'
        }
      `}>
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className={`
            transition-all duration-500 transform
            ${isExpanded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <SubjectList semesterId={semester.id} />
          </div>
        </div>
      </div>
    </div>
  );
};