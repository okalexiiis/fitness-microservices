export const DateRange = ['4weeks', '6months', 'lastYear'] as const
export type TDateRange = (typeof DateRange)[number]
