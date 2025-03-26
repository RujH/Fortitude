import { ExerciseRepository } from '../repositories/exerciseRepository';

export const ExerciseService = {
  async fetchAllExercises() {
    return await ExerciseRepository.getAllExercises();
  },
  
  async fetchExercisesBySession(sessionId: string) {
    return await ExerciseRepository.getExercisesBySession(sessionId);
  },
  
  async addExerciseToSession(sessionId: string, exerciseId: string, sets: number, reps: number, orderIndex: number) {
    return await ExerciseRepository.addExerciseToSession(sessionId, exerciseId, sets, reps, orderIndex);
  },
  
  async updateSessionExercises(sessionExercises: any[]) {
    return await ExerciseRepository.updateSessionExercises(sessionExercises);
  },
  
  async deleteSessionExercise(sessionExerciseId: string) {
    return await ExerciseRepository.deleteSessionExercise(sessionExerciseId);
  },
  
  // Helper function to format exercise data for display
  formatExerciseList(sessionExercises: any[]) {
    return sessionExercises.map(item => ({
      id: item.id,
      name: item.exercise.name,
      sets: item.sets,
      reps: item.reps,
      orderIndex: item.orderIndex,
      exerciseId: item.exercise_id
    }));
  }
}; 