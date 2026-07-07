import {clsx, type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';

/** Merge di classi Tailwind (contratto shadcn: cn in @/lib/utils). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
