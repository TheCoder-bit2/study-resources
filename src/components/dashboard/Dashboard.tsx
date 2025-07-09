import React, { useState, useEffect } from 'react';
import { GraduationCap } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <GraduationCap className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">Study Resources</h1>
          </div>
          <p className="text-xl text-gray-600">Access your study materials by semester</p>
        </div>

        <div className="space-y-6">
          {semesters.map((semester) => (
            <SemesterCard
              key={semester.id}
              semester={semester}
              isExpanded={expandedSemester === semester.id}
              onToggle={() => toggleSemester(semester.id)}
            />
          ))}
        </div>

        {semesters.length === 0 && (
          <div className="text-center py-12">
            <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-xl text-gray-500">No semesters available</p>
            <p className="text-gray-400 mt-2">Contact your administrator to add content</p>
          </div>
        )}
      </div>
    </div>
  );
};