import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, LogOut, BookOpen, FolderOpen, FileText, X } from 'lucide-react';
import { Semester, Subject, Resource } from '../../types';
import { api } from '../../services/api';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Toast } from '../ui/Toast';

interface AdminDashboardProps {
  onLogout: () => void;
}

interface ToastState {
  message: string;
  type: 'success' | 'error';
  show: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>({ message: '', type: 'success', show: false });

  // Modal states
  const [showSemesterModal, setShowSemesterModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [semesterName, setSemesterName] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceLink, setResourceLink] = useState('');

  useEffect(() => {
    loadSemesters();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type, show: true });
  };

  const loadSemesters = async () => {
    try {
      setLoading(true);
      const data = await api.getSemesters();
      setSemesters(data);
    } catch (error) {
      showToast('Error loading semesters', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadSubjects = async (semesterId: string) => {
    try {
      const data = await api.getSubjects(semesterId);
      setSubjects(data);
    } catch (error) {
      showToast('Error loading subjects', 'error');
    }
  };

  const loadResources = async (subjectId: string) => {
    try {
      const data = await api.getResources(subjectId);
      setResources(data);
    } catch (error) {
      showToast('Error loading resources', 'error');
    }
  };

  const handleSemesterSelect = (semesterId: string) => {
    setSelectedSemester(semesterId);
    setSelectedSubject(null);
    setResources([]);
    loadSubjects(semesterId);
  };

  const handleSubjectSelect = (subjectId: string) => {
    setSelectedSubject(subjectId);
    loadResources(subjectId);
  };

  const handleCreateSemester = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createSemester(semesterName);
      setSemesterName('');
      setShowSemesterModal(false);
      loadSemesters();
      showToast('Semester created successfully', 'success');
    } catch (error) {
      showToast('Error creating semester', 'error');
    }
  };

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSemester) return;
    
    try {
      await api.createSubject(subjectName, selectedSemester);
      setSubjectName('');
      setShowSubjectModal(false);
      loadSubjects(selectedSemester);
      showToast('Subject created successfully', 'success');
    } catch (error) {
      showToast('Error creating subject', 'error');
    }
  };

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject) return;
    
    try {
      await api.createResource(resourceTitle, resourceLink, selectedSubject);
      setResourceTitle('');
      setResourceLink('');
      setShowResourceModal(false);
      loadResources(selectedSubject);
      showToast('Resource created successfully', 'success');
    } catch (error) {
      showToast('Error creating resource', 'error');
    }
  };

  const handleDeleteSemester = async (id: string) => {
    if (!confirm('Are you sure you want to delete this semester and all its contents?')) return;
    
    try {
      await api.deleteSemester(id);
      if (selectedSemester === id) {
        setSelectedSemester(null);
        setSelectedSubject(null);
        setSubjects([]);
        setResources([]);
      }
      loadSemesters();
      showToast('Semester deleted successfully', 'success');
    } catch (error) {
      showToast('Error deleting semester', 'error');
    }
  };

  const handleDeleteSubject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subject and all its resources?')) return;
    
    try {
      await api.deleteSubject(id);
      if (selectedSubject === id) {
        setSelectedSubject(null);
        setResources([]);
      }
      loadSubjects(selectedSemester!);
      showToast('Subject deleted successfully', 'success');
    } catch (error) {
      showToast('Error deleting subject', 'error');
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    
    try {
      await api.deleteResource(id);
      loadResources(selectedSubject!);
      showToast('Resource deleted successfully', 'success');
    } catch (error) {
      showToast('Error deleting resource', 'error');
    }
  };

  const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Semesters */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Semesters
              </h2>
              <button
                onClick={() => setShowSemesterModal(true)}
                className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            
            <div className="space-y-2">
              {semesters.map((semester) => (
                <div
                  key={semester.id}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedSemester === semester.id
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                  onClick={() => handleSemesterSelect(semester.id)}
                >
                  <span className="font-medium">Semester {semester.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSemester(semester.id);
                    }}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Subjects */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-green-600" />
                Subjects
              </h2>
              <button
                onClick={() => setShowSubjectModal(true)}
                disabled={!selectedSemester}
                className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            
            {selectedSemester ? (
              <div className="space-y-2">
                {subjects.map((subject) => (
                  <div
                    key={subject.id}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedSubject === subject.id
                        ? 'bg-green-50 border-green-300'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                    onClick={() => handleSubjectSelect(subject.id)}
                  >
                    <span className="font-medium">{subject.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSubject(subject.id);
                      }}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Select a semester to view subjects</p>
            )}
          </div>

          {/* Resources */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Resources
              </h2>
              <button
                onClick={() => setShowResourceModal(true)}
                disabled={!selectedSubject}
                className="flex items-center gap-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            
            {selectedSubject ? (
              <div className="space-y-2">
                {resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-gray-50 border-gray-200"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{resource.title}</p>
                      <a
                        href={resource.drive_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View Link
                      </a>
                    </div>
                    <button
                      onClick={() => handleDeleteResource(resource.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Select a subject to view resources</p>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showSemesterModal}
        onClose={() => setShowSemesterModal(false)}
        title="Add New Semester"
      >
        <form onSubmit={handleCreateSemester} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Semester Name
            </label>
            <input
              type="text"
              value={semesterName}
              onChange={(e) => setSemesterName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 4-2"
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Semester
            </button>
            <button
              type="button"
              onClick={() => setShowSemesterModal(false)}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showSubjectModal}
        onClose={() => setShowSubjectModal(false)}
        title="Add New Subject"
      >
        <form onSubmit={handleCreateSubject} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject Name
            </label>
            <input
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., Mathematics"
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Create Subject
            </button>
            <button
              type="button"
              onClick={() => setShowSubjectModal(false)}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showResourceModal}
        onClose={() => setShowResourceModal(false)}
        title="Add New Resource"
      >
        <form onSubmit={handleCreateResource} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resource Title
            </label>
            <input
              type="text"
              value={resourceTitle}
              onChange={(e) => setResourceTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., Chapter 1 Notes"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Drive Link
            </label>
            <input
              type="url"
              value={resourceLink}
              onChange={(e) => setResourceLink(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="https://drive.google.com/..."
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Create Resource
            </button>
            <button
              type="button"
              onClick={() => setShowResourceModal(false)}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Toast */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
};