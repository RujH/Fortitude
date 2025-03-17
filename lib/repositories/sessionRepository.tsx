import { supabase } from '../providers/supabase';
import { Session } from '../../constants/sessionData';

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
  }
};
