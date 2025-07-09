import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, BookOpen } from 'lucide-react';
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
      <div className="p-8 text-center text-gray-500">
        <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No subjects found for this semester</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      {subjects.map((subject) => (
        <div key={subject.id} className="border border-gray-200 rounded-lg overflow-hidden">
          <div
            className="p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
            onClick={() => toggleSubject(subject.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-gray-800">{subject.name}</h4>
              </div>
              <div className="transition-transform duration-300">
                {expandedSubjects.has(subject.id) ? (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                )}
              </div>
            </div>
          </div>
          
          <div className={`
            overflow-hidden transition-all duration-500 ease-in-out
            ${expandedSubjects.has(subject.id) ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}
          `}>
            <div className="bg-white border-t border-gray-200">
              <ResourceList subjectId={subject.id} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};