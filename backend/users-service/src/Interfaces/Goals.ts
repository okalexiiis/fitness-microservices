export const Goals = ['lose_weight', 'gain_muscle', 'maintain'] as const;
export type EGoals = typeof Goals[number];