import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Semester } from '../../types';
import { SubjectList } from './SubjectList';

interface SemesterCardProps {
  semester: Semester;
  isExpanded: boolean;
  onToggle: () => void;
}

export const SemesterCard: React.FC<SemesterCardProps> = ({ semester, isExpanded, onToggle }) => {
  const getSemesterColor = (name: string) => {
    const colors = {
      '1-1': 'from-blue-400 to-blue-600',
      '1-2': 'from-green-400 to-green-600',
      '2-1': 'from-purple-400 to-purple-600',
      '2-2': 'from-pink-400 to-pink-600',
      '3-1': 'from-orange-400 to-orange-600',
      '3-2': 'from-red-400 to-red-600',
      '4-1': 'from-indigo-400 to-indigo-600',
      '4-2': 'from-teal-400 to-teal-600',
    };
    return colors[name as keyof typeof colors] || 'from-gray-400 to-gray-600';
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div
        className={`
          relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 cursor-pointer
          ${isExpanded ? 'shadow-xl scale-[1.02]' : 'hover:shadow-xl hover:scale-[1.01]'}
        `}
        onClick={onToggle}
      >
        <div className={`bg-gradient-to-r ${getSemesterColor(semester.name)} p-6`}>
          <div className="flex items-center justify-between text-white">
            <div>
              <h3 className="text-2xl font-bold">Semester {semester.name}</h3>
              <p className="text-white/90 mt-1">Click to view subjects</p>
            </div>
            <div className="transition-transform duration-300">
              {isExpanded ? (
                <ChevronDown className="w-6 h-6" />
              ) : (
                <ChevronRight className="w-6 h-6" />
              )}
            </div>
          </div>
        </div>
        
        {/* Decorative pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 opacity-10">
          <div className="w-full h-full bg-white rounded-full"></div>
        </div>
      </div>
      
      <div className={`
        overflow-hidden transition-all duration-500 ease-in-out
        ${isExpanded ? 'max-h-screen opacity-100 mt-4' : 'max-h-0 opacity-0'}
      `}>
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <SubjectList semesterId={semester.id} />
        </div>
      </div>
    </div>
  );
};