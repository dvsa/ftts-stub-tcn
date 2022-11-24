export const random = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1) + min);

export const sample = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
