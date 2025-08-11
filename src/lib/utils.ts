import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Updated formatCurrency to accept a currency code
export const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', { // Using 'en-US' for broad locale compatibility
    style: 'currency',
    currency: currency,
    currencyDisplay: 'code' // Ensures the currency code (e.g., NGN, USD) is displayed
  }).format(amount);
};

export function bytesToSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
}
