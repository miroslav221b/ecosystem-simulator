import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const getRandomNumber = (min: number, max: number) => {
  return parseInt((Math.random() * (max - min) + min).toFixed(0));
};
