import { supabase } from '../providers/supabase';
import { Session } from '../../constants/constants';

export const SessionRepository = {
  async getAllSessions() {
    const { data, error } = await supabase.from('session').select('*');
    if (error) throw error;
    return data;
  },

  async getActiveWorkouts() {
    const { data, error } = await supabase
      .from('session')
      .select('*')
      .is('completed_date', null)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getPastWorkouts() {
    const { data, error } = await supabase
      .from('session')
      .select('*')
      .not('completed_date', 'is', null)
      .order('completed_date', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createSession(sessionData: Partial<Session>) {
    const { data, error } = await supabase.from('session').insert([sessionData]);
    if (error) throw error;
    return data;
  },

  async getSessionById(sessionId: string) {
    const { data, error } = await supabase
      .from('session')
      .select('*')
      .eq('session_id', sessionId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateSession(sessionId: string, sessionData: Partial<Session>) {
    const { data, error } = await supabase
      .from('session')
      .update(sessionData)
      .eq('session_id', sessionId);
    
    if (error) throw error;
    return data;
  },

  async completeSession(sessionId: string) {
    const { data, error } = await supabase
      .from('session')
      .update({ completed_date: new Date().toISOString() })
      .eq('session_id', sessionId);
    
    if (error) throw error;
    return data;
  }
};
