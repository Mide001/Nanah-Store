import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts a Google Drive sharing link to a direct image URL
 * @param driveUrl - The Google Drive sharing URL
 * @returns The direct image URL or the original URL if conversion fails
 */
export function convertGoogleDriveUrl(driveUrl: string): string {
  try {
    // Handle Google Drive sharing links
    if (driveUrl.includes('drive.google.com/file/d/')) {
      const fileId = driveUrl.match(/\/file\/d\/([a-zA-Z0-9-_]+)/)?.[1]
      if (fileId) {
        return `https://drive.google.com/uc?export=view&id=${fileId}`
      }
    }
    
    // Handle Google Drive preview links
    if (driveUrl.includes('drive.google.com/uc?')) {
      return driveUrl
    }
    
    // Return original URL if no conversion needed
    return driveUrl
  } catch (error) {
    console.error('Error converting Google Drive URL:', error)
    return driveUrl
  }
}

/**
 * Processes an array of image URLs, converting Google Drive links if needed
 * @param images - Array of image URLs
 * @returns Array of processed image URLs
 */
export function processImageUrls(images: string[]): string[] {
  return images.map(url => convertGoogleDriveUrl(url))
} 