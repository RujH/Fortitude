interface Exercise {
    name: string;
    description?: string;
    beginner_modification?: string;
  }
  
  interface WorkoutCategory {
    name: string;
    exercises: Exercise[];
  }
  
  const workoutData: WorkoutCategory[] = [
    {
      name: "Push",
      exercises: [
        {
          name: "Bodyweight Triceps Dips",
          description: "Stand with your feet shoulder-width apart, holding onto a stable surface (e.g., a chair or countertop) for support. Lower your body by bending your elbows, then push your body back up to the starting position. Repeat for the desired number of reps.",
        },
        {
          name: "Dumbbell Chest Fly",
          description: "Sit on a bench with your feet flat on the floor. Hold a dumbbell in each hand, palms facing forward. Lower your arms by bending your elbows, then push your arms back up to the starting position. Repeat for the desired number of reps.",
        },
        {
          name: "Lateral Shoulder Raises",
          description: "Stand with your feet shoulder-width apart, holding a dumbbell in each hand. Raise your arms out to the sides, then lower them back down to your sides. Repeat for the desired number of reps.",
        },
        {
          name: "Overhead Press",
          description: "Stand with your feet shoulder-width apart, holding a dumbbell in each hand. Raise your arms overhead, then lower them back down to your sides. Repeat for the desired number of reps.",
        },
        {
          name: "Bench Press",
          description: "Lie on a bench with your feet flat on the floor. Hold a dumbbell in each hand, palms facing forward. Lower your arms by bending your elbows, then push your arms back up to the starting position. Repeat for the desired number of reps.",
        },
        {
          name: "Cable Triceps Pushdowns",
          description: "Sit on a bench with your feet flat on the floor. Hold a cable handle in each hand, palms facing forward. Lower your arms by bending your elbows, then push your arms back up to the starting position. Repeat for the desired number of reps.",
        },
        {
          name: "Dumbbell Chest Presses",
          description: "Sit on a bench with your feet flat on the floor. Hold a dumbbell in each hand, palms facing forward. Lower your arms by bending your elbows, then push your arms back up to the starting position. Repeat for the desired number of reps.",
        },
        {
          name: "Push-ups",
          description: "Lie on your back with your feet flat on the floor. Raise your hips by bending your knees, then lower your hips back down to the starting position. Repeat for the desired number of reps.",
        },
        {
          name: "Shoulder Presses",
          description: "Stand with your feet shoulder-width apart, holding a dumbbell in each hand. Raise your arms overhead, then lower them back down to your sides. Repeat for the desired number of reps.",
        }
      ]
    },
    {
      name: "Pull",
      exercises: [
        {
          name: "Bent Over Dumbbell Rows",
          description: "Stand with your feet shoulder-width apart, holding a dumbbell in each hand. Lower your body by bending your elbows, then push your body back up to the starting position. Repeat for the desired number of reps.",
        },
        {
          name: "Cable Lat Pull Downs",
          description: "Sit on a bench with your feet flat on the floor. Hold a cable handle in each hand, palms facing forward. Lower your arms by bending your elbows, then push your arms back up to the starting position. Repeat for the desired number of reps.",
        },
        {
          name: "Biceps Curls",
          description: "Stand with your feet shoulder-width apart, holding a dumbbell in each hand. Lower your body by bending your elbows, then push your body back up to the starting position. Repeat for the desired number of reps.",
        },
        {
          name: "Renegade Rows",
          description: "Stand with your feet shoulder-width apart, holding a dumbbell in each hand. Lower your body by bending your elbows, then push your body back up to the starting position. Repeat for the desired number of reps.",
        },
        {
            name: "Reverse Dumbbell Fly",
          description: "Sit on a bench with your feet flat on the floor. Hold a dumbbell in each hand, palms facing forward. Lower your arms by bending your elbows, then push your arms back up to the starting position. Repeat for the desired number of reps.",
        },
        {
          name: "Biceps Hammer Curls",
          description: "Stand with your feet shoulder-width apart, holding a dumbbell in each hand. Lower your body by bending your elbows, then push your body back up to the starting position. Repeat for the desired number of reps.",
        },
        {
          name: "Dumbbell Shrugs",
          description: "Stand with your feet shoulder-width apart, holding a dumbbell in each hand. Lower your body by bending your elbows, then push your body back up to the starting position. Repeat for the desired number of reps.",
        },
        {
          name: "Pull-ups",
          description: "Stand with your feet shoulder-width apart, holding a dumbbell in each hand. Lower your body by bending your elbows, then push your body back up to the starting position. Repeat for the desired number of reps.",
        }
      ]
    },
    {
      name: "Core and Legs",
      exercises: [
        {
          name: "Deadlifts",
          description: "Stand with your feet shoulder-width apart, holding a dumbbell in each hand. Lower your body by bending your elbows, then push your body back up to the starting position. Repeat for the desired number of reps.",
        },
        {
          name: "Squats",
          description: "Stand with your feet shoulder-width apart, holding a dumbbell in each hand. Lower your body by bending your elbows, then push your body back up to the starting position. Repeat for the desired number of reps.",
        },
        {
          name: "Glute Bridges",
          description: "Lie on your back with your feet flat on the floor. Raise your hips by bending your knees, then lower your hips back down to the starting position. Repeat for the desired number of reps.",
        },
        {
          name: "Plank Variations",
          description: "Lie on your back with your feet flat on the floor. Raise your hips by bending your knees, then lower your hips back down to the starting position. Repeat for the desired number of reps.",
        },
        {
          name: "Mountain Climbers",
          description: "Stand with your feet shoulder-width apart, holding a dumbbell in each hand. Lower your body by bending your elbows, then push your body back up to the starting position. Repeat for the desired number of reps.",
        },
        {
          name: "Lunges",
          description: "Stand with your feet shoulder-width apart, holding a dumbbell in each hand. Lower your body by bending your elbows, then push your body back up to the starting position. Repeat for the desired number of reps.",
        },
        {
          name: "Side Lunges",
          description: "Stand with your feet shoulder-width apart, holding a dumbbell in each hand. Lower your body by bending your elbows, then push your body back up to the starting position. Repeat for the desired number of reps.",
        },
        {
          name: "Sumo Squats",
          description: "Stand with your feet shoulder-width apart, holding a dumbbell in each hand. Lower your body by bending your elbows, then push your body back up to the starting position. Repeat for the desired number of reps.",
        },
        {
          name: "Crunch Variations",
          description: "Lie on your back with your feet flat on the floor. Raise your hips by bending your knees, then lower your hips back down to the starting position. Repeat for the desired number of reps.",
        },
        {
          name: "Bird Dog",
          description: "Lie on your back with your feet flat on the floor. Raise your hips by bending your knees, then lower your hips back down to the starting position. Repeat for the desired number of reps.",
        }
      ]
    }
  ];
  
  export default workoutData;