export interface Exercise {
  exercise_id: string;
  name: string;
  category?: string;
  description?: string;
}

export interface SessionExercise {
  session_exercise_id: string;
  session_id: string;
  exercise_id: string;
  set: number;
  rep: number;
} 

export interface Session  {         
    session_id: string;
    name: string;
    user_id: string;
    created_at: string;
    created_by: string;
    completed_date: string | null;
    start_time: string | null;
    end_time: string | null;
}