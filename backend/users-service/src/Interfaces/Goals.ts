export const Goals = ['lose_weight', 'gain_muscle', 'mantain'] as const;
export type EGoals = typeof Goals[number];