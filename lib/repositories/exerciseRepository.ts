import { supabase } from '../providers/supabase';

export const ExerciseRepository = {
  async getAllExercises() {
    const { data, error } = await supabase
      .from('exercise')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data;
  },
  
  async getExercisesBySession(sessionId: string) {
    const { data, error } = await supabase
      .from('session_exercise')
      .select(`
        *,
        exercise:exercise_id(*)
      `)
      .eq('session_id', sessionId)
      .order('order_index', { ascending: true });
    
    if (error) throw error;
    return data;
  },
  
  async addExerciseToSession(sessionId: string, exerciseId: string, sets: number, reps: number, orderIndex: number) {
    const { data, error } = await supabase
      .from('session_exercise')
      .insert([{
        session_id: sessionId,
        exercise_id: exerciseId,
        sets,
        reps,
        position: orderIndex
      }]);
    
    if (error) throw error;
    return data;
  },
  
  async updateSessionExercises(sessionExercises: any[]) {
    const formattedExercises = sessionExercises.map(exercise => {
      const formatted = {...exercise};
      if (exercise.order_index !== undefined) {
        formatted.position = exercise.order_index;
        delete formatted.order_index;
      }
      return formatted;
    });
    
    const { data, error } = await supabase
      .from('session_exercise')
      .upsert(formattedExercises);
    
    if (error) throw error;
    return data;
  },
  
  async deleteSessionExercise(sessionExerciseId: string) {
    const { data, error } = await supabase
      .from('session_exercise')
      .delete()
      .eq('id', sessionExerciseId);
    
    if (error) throw error;
    return data;
  }
}; 