interface Exercise {
    name: string;
    description?: string;
    link: string;
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
          link: "https://www.muscleandstrength.com/exercises/tricep-dip.html",
          description: "Stand with your feet shoulder-width apart, holding onto a stable surface (e.g., a chair or countertop) for support. Lower your body by bending your elbows, then push your body back up to the starting position. Repeat for the desired number of reps.",
        },
        {
          name: "Dumbbell Chest Fly",
          link: "https://www.muscleandstrength.com/exercises/dumbbell-flys.html",
          description: "Sit on a bench with your feet flat on the floor. Hold a dumbbell in each hand, palms facing forward. Lower your arms by bending your elbows, then push your arms back up to the starting position. Repeat for the desired number of reps.",
        },
        {
          name: "Lateral Shoulder Raises",
          link: "https://www.muscleandstrength.com/exercises/dumbbell-lateral-raise.html",
          description: "Stand with your feet shoulder-width apart, holding a dumbbell in each hand. Raise your arms out to the sides, then lower them back down to your sides. Repeat for the desired number of reps.",
        },
        {
          name: "Overhead Press",
          link: "https://www.muscleandstrength.com/exercises/military-press.html",
          description: "Stand with your feet shoulder-width apart, holding a dumbbell in each hand. Raise your arms overhead, then lower them back down to your sides. Repeat for the desired number of reps.",
        },
        {
          name: "Bench Press",
          link: "https://www.muscleandstrength.com/exercises/barbell-bench-press.html",
          description: "Lie on a bench with your feet flat on the floor. Hold a dumbbell in each hand, palms facing forward. Lower your arms by bending your elbows, then push your arms back up to the starting position. Repeat for the desired number of reps.",
        },
        {
          name: "Cable Triceps Pushdowns",
          link: "https://www.verywellfit.com/how-to-do-the-triceps-pushdown-3498613",
          description: "Sit on a bench with your feet flat on the floor. Hold a cable handle in each hand, palms facing forward. Lower your arms by bending your elbows, then push your arms back up to the starting position. Repeat for the desired number of reps.",
        },
        {
          name: "Dumbbell Chest Presses",
          link: "https://www.muscleandstrength.com/exercises/dumbbell-bench-press.html",
          description: "Sit on a bench with your feet flat on the floor. Hold a dumbbell in each hand, palms facing forward. Lower your arms by bending your elbows, then push your arms back up to the starting position. Repeat for the desired number of reps.",
        },
        {
          name: "Push-ups",
          link: "https://www.verywellfit.com/the-push-up-exercise-3120574",
          description: "Lie on your back with your feet flat on the floor. Raise your hips by bending your knees, then lower your hips back down to the starting position. Repeat for the desired number of reps.",
        },
        {
          name: "Shoulder Presses",
          link: "https://www.verywellfit.com/how-to-do-the-dumbbell-overhead-press-3498298",
          description: "Stand with your feet shoulder-width apart, holding a dumbbell in each hand. Raise your arms overhead, then lower them back down to your sides. Repeat for the desired number of reps.",
        }
      ]
    },
    {
      name: "Pull",
      exercises: [
        {
          name: "Bent Over Dumbbell Rows",  
          link: "https://www.muscleandstrength.com/exercises/bent-over-dumbbell-row.html",
          description: "Stand with your feet shoulder-width apart, holding a dumbbell in each hand. Lower your body by bending your elbows, then push your body back up to the starting position. Repeat for the desired number of reps.",
        },
        {
          name: "Cable Lat Pull Downs",
          link: "https://www.verywellfit.com/cable-pulldown-exercise-for-abs-and-arms-3498474",
          description: "Sit on a bench with your feet flat on the floor. Hold a cable handle in each hand, palms facing forward. Lower your arms by bending your elbows, then push your arms back up to the starting position. Repeat for the desired number of reps.",
        },
        {
          name: "Biceps Curls", 
          link: "https://www.verywellfit.com/how-to-do-the-biceps-arm-curl-3498604",
          description: "Stand with your feet shoulder-width apart, holding a dumbbell in each hand. Lower your body by bending your elbows, then push your body back up to the starting position. Repeat for the desired number of reps.",
        },
        {
          name: "Renegade Rows",
          link: "https://www.menshealth.com/fitness/a27178801/renegade-row-form/",
          description: "Stand with your feet shoulder-width apart, holding a dumbbell in each hand. Lower your body by bending your elbows, then push your body back up to the starting position. Repeat for the desired number of reps.",
        },
        {
            name: "Reverse Dumbbell Fly",
            link: "https://www.verywellfit.com/how-to-perform-the-reverse-fly-4684392",
          description: "Sit on a bench with your feet flat on the floor. Hold a dumbbell in each hand, palms facing forward. Lower your arms by bending your elbows, then push your arms back up to the starting position. Repeat for the desired number of reps.",
        },
        {
          name: "Biceps Hammer Curls",
          link: "https://www.verywellfit.com/how-to-hammer-curls-techniques-benefits-variations-4788329",
          description: "Stand with your feet shoulder-width apart, holding a dumbbell in each hand. Lower your body by bending your elbows, then push your body back up to the starting position. Repeat for the desired number of reps.",
        },
        {
          name: "Dumbbell Shrugs",
          link: "https://www.muscleandstrength.com/exercises/dumbbell-shrugs.html",
          description: "Stand with your feet shoulder-width apart, holding a dumbbell in each hand. Lower your body by bending your elbows, then push your body back up to the starting position. Repeat for the desired number of reps.",
        },
        {
          name: "Pull-ups",
          link: "https://www.verywellfit.com/pullup-bar-exercises-for-upper-body-strength-3120735",
          description: "Stand with your feet shoulder-width apart, holding a dumbbell in each hand. Lower your body by bending your elbows, then push your body back up to the starting position. Repeat for the desired number of reps.",
        }
      ]
    },
    {
      name: "Core and Legs",
      exercises: [
        {
          name: "Deadlifts",
          link: "https://www.verywellfit.com/how-to-do-the-deadlift-3498608",
          description: "Stand with your feet shoulder-width apart, holding a dumbbell in each hand. Lower your body by bending your elbows, then push your body back up to the starting position. Repeat for the desired number of reps.",
        },
        {
          name: "Squats",
          link: "https://www.verywellfit.com/safe-squat-technique-3119136",
          description: "Stand with your feet shoulder-width apart, holding a dumbbell in each hand. Lower your body by bending your elbows, then push your body back up to the starting position. Repeat for the desired number of reps.",
        },
        {
          name: "Glute Bridges",
          link: "https://www.verywellfit.com/how-to-do-the-bridge-exercise-3120738",
          description: "Lie on your back with your feet flat on the floor. Raise your hips by bending your knees, then lower your hips back down to the starting position. Repeat for the desired number of reps.",
        },
        {
          name: "Plank Variations",
          link: "https://www.womenshealthmag.com/fitness/g21346960/plank-exercise-variations/",
          description: "Lie on your back with your feet flat on the floor. Raise your hips by bending your knees, then lower your hips back down to the starting position. Repeat for the desired number of reps.",
        },
        {
          name: "Mountain Climbers",
          link: "https://www.verywellfit.com/mountain-climbers-exercise-3966947",
          description: "Stand with your feet shoulder-width apart, holding a dumbbell in each hand. Lower your body by bending your elbows, then push your body back up to the starting position. Repeat for the desired number of reps.",
        },
        {
          name: "Lunges",
          link: "https://www.verywellfit.com/how-to-lunge-variations-modifications-and-mistakes-1231320",
          description: "Stand with your feet shoulder-width apart, holding a dumbbell in each hand. Lower your body by bending your elbows, then push your body back up to the starting position. Repeat for the desired number of reps.",
        },
        {
          name: "Side Lunges",
          link: "https://www.verywellfit.com/how-to-do-side-lunges-techniques-benefits-variations-5186818",
          description: "Stand with your feet shoulder-width apart, holding a dumbbell in each hand. Lower your body by bending your elbows, then push your body back up to the starting position. Repeat for the desired number of reps.",
        },
        {
          name: "Sumo Squats",
          link: "https://www.verywellfit.com/how-to-do-sumo-squats-4847240",
          description: "Stand with your feet shoulder-width apart, holding a dumbbell in each hand. Lower your body by bending your elbows, then push your body back up to the starting position. Repeat for the desired number of reps.",
        },
        {
          name: "Crunch Variations",
          link: "https://www.verywellfit.com/how-to-do-the-crunch-3498607",
          description: "Lie on your back with your feet flat on the floor. Raise your hips by bending your knees, then lower your hips back down to the starting position. Repeat for the desired number of reps.",
        },
        {
          name: "Bird Dog",
          link: "https://www.verywellfit.com/how-to-do-the-bird-dog-exercise-3498253",
          description: "Lie on your back with your feet flat on the floor. Raise your hips by bending your knees, then lower your hips back down to the starting position. Repeat for the desired number of reps.",
        }
      ]
    }
  ];
  
  export default workoutData;