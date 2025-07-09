import React, { useState, useEffect } from 'react';
import { GraduationCap, BookOpen, Sparkles } from 'lucide-react';
import { Semester } from '../../types';
import { api } from '../../services/api';
import { SemesterCard } from './SemesterCard';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export const Dashboard: React.FC = () => {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSemester, setExpandedSemester] = useState<string | null>(null);

  useEffect(() => {
    loadSemesters();
  }, []);

  const loadSemesters = async () => {
    try {
      setLoading(true);
      const data = await api.getSemesters();
      setSemesters(data);
    } catch (error) {
      console.error('Error loading semesters:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSemester = (semesterId: string) => {
    setExpandedSemester(expandedSemester === semesterId ? null : semesterId);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating Books */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-5"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          >
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
        ))}
        
        {/* Floating Sparkles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="absolute animate-pulse opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="relative inline-block">
            {/* Main Icon with Animation */}
            <div className="flex justify-center items-center gap-4 mb-6">
              <div className="relative">
                <GraduationCap className="w-16 h-16 text-gray-700 animate-pulse" />
                {/* Floating Elements around Icon */}
                <div className="absolute -top-2 -right-2 animate-bounce">
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="absolute -bottom-1 -left-1 animate-pulse">
                  <BookOpen className="w-4 h-4 text-gray-500" />
                </div>
              </div>
              <div>
                <h1 className="text-5xl font-bold text-gray-800 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text">
                  Study Resources
                </h1>
              </div>
            </div>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover your academic journey through beautifully organized study materials
            </p>
            
            {/* Decorative Line */}
            <div className="mt-8 flex justify-center">
              <div className="w-24 h-1 bg-gradient-to-r from-gray-300 via-gray-500 to-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Semesters Grid */}
        <div className="space-y-8">
          {semesters.map((semester, index) => (
            <div
              key={semester.id}
              className="animate-fade-in-up"
              style={{ 
                animationDelay: `${index * 150}ms`,
                animationFillMode: 'both'
              }}
            >
              <SemesterCard
                semester={semester}
                isExpanded={expandedSemester === semester.id}
                onToggle={() => toggleSemester(semester.id)}
              />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {semesters.length === 0 && (
          <div className="text-center py-20">
            <div className="relative inline-block mb-8">
              <GraduationCap className="w-24 h-24 mx-auto text-gray-300 animate-pulse" />
              <div className="absolute -top-2 -right-2 animate-bounce">
                <Sparkles className="w-8 h-8 text-yellow-400 opacity-50" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-500 mb-4">No Semesters Available</h2>
            <p className="text-gray-400 text-lg">
              Your academic journey awaits! Contact your administrator to add content.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};