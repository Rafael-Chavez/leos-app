import { AdventureArea } from '../types';

export const ADVENTURE_AREAS: AdventureArea[] = [
  {
    id: 'meadow',
    name: 'Meadow of Ones',
    description: 'Start your journey in the peaceful meadow',
    theme: 'grass',
    unlocked: true,
    completed: false,
    challenges: [
      {
        id: 'meadow-1',
        areaId: 'meadow',
        name: 'First Steps',
        description: 'Learn the basics',
        questionCount: 5,
        difficulty: 'easy',
        completed: false,
        stars: 0,
        bestScore: 0,
      },
    ],
    stars: 0,
    maxStars: 15,
  },
  {
    id: 'forest',
    name: 'Double Trouble Forest',
    description: 'Master multiplying by 2',
    theme: 'forest',
    unlocked: false,
    completed: false,
    challenges: [],
    stars: 0,
    maxStars: 15,
  },
  {
    id: 'peaks',
    name: 'Triple Peaks',
    description: 'Climb the mountains of threes',
    theme: 'mountain',
    unlocked: false,
    completed: false,
    challenges: [],
    stars: 0,
    maxStars: 15,
  },
];
