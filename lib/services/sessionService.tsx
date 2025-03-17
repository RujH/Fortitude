import { SessionRepository } from '../repositories/sessionRepository';
import { Session } from '../../constants/sessionData';
export const SessionService = {
  async fetchAllSessions() {
    return await SessionRepository.getAllSessions();
  },

  async fetchActiveWorkouts() {
    return await SessionRepository.getActiveWorkouts();
  },

  async fetchPastWorkouts() {
    return await SessionRepository.getPastWorkouts();
  },

  async addSession(sessionData: Partial<Session>) {
    return await SessionRepository.createSession(sessionData);
  },

  // Helper functions for UI display
  formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString();
  },

  getRelativeTimeSubtitle(completedDate: string) {
    const completed = new Date(completedDate);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - completed.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Completed today";
    if (diffDays === 1) return "Completed yesterday";
    if (diffDays < 7) return `Completed ${diffDays} days ago`;
    return "Completed last week";
  }
};
