import React, { useState, useEffect } from 'react';
import { ExternalLink, FileText } from 'lucide-react';
import { Resource } from '../../types';
import { api } from '../../services/api';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface ResourceListProps {
  subjectId: string;
}

export const ResourceList: React.FC<ResourceListProps> = ({ subjectId }) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

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
      <div className="p-6 text-center text-gray-500">
        <FileText className="w-8 h-8 mx-auto mb-3 text-gray-300" />
        <p>No resources available for this subject</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-3">
      {resources.map((resource) => (
        <div
          key={resource.id}
          className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors duration-200"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-800">{resource.title}</span>
          </div>
          <a
            href={resource.drive_link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open</span>
          </a>
        </div>
      ))}
    </div>
  );
};