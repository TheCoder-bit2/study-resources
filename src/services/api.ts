import { supabase } from '../lib/supabase';
import { Semester, Subject, Resource } from '../types';

export const api = {
  // Semesters
  async getSemesters(): Promise<Semester[]> {
    const { data, error } = await supabase
      .from('semesters')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async createSemester(name: string): Promise<Semester> {
    const { data, error } = await supabase
      .from('semesters')
      .insert([{ name }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteSemester(id: string): Promise<void> {
    const { error } = await supabase
      .from('semesters')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Subjects
  async getSubjects(semesterId: string): Promise<Subject[]> {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('semester_id', semesterId)
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async createSubject(name: string, semesterId: string): Promise<Subject> {
    const { data, error } = await supabase
      .from('subjects')
      .insert([{ name, semester_id: semesterId }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteSubject(id: string): Promise<void> {
    const { error } = await supabase
      .from('subjects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Resources
  async getResources(subjectId: string): Promise<Resource[]> {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('subject_id', subjectId)
      .order('title');
    
    if (error) throw error;
    return data || [];
  },

  async createResource(title: string, driveLink: string, subjectId: string): Promise<Resource> {
    const { data, error } = await supabase
      .from('resources')
      .insert([{ title, drive_link: driveLink, subject_id: subjectId }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteResource(id: string): Promise<void> {
    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};