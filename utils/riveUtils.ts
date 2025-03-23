/**
 * Utility functions for working with Rive animations
 */

/**
 * Get the full path to a Rive file in the public directory
 * @param filename The filename within the rive directory
 * @returns The full path to the Rive file
 */
export const getRiveFilePath = (filename: string): string => {
  // Handle cases where the user already included 'rive/' in the path
  if (filename.startsWith('rive/') || filename.startsWith('/rive/')) {
    return filename;
  }
  
  return `/rive/${filename}`;
};

/**
 * Preload a Rive animation file to improve performance
 * @param filePath Path to the Rive file
 */
export const preloadRiveAnimation = async (filePath: string): Promise<void> => {
  try {
    const path = getRiveFilePath(filePath);
    
    // Remove any existing preload link for this file
    const existingLink = document.querySelector(`link[rel="preload"][href="${path}"]`);
    if (existingLink) {
      existingLink.remove();
    }
    
    // Create a link element to preload the Rive file
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = path;
    link.as = 'fetch';
    link.type = 'application/octet-stream';
    link.crossOrigin = 'anonymous'; // Add crossorigin attribute
    
    // Append the link and return a promise that resolves when the file is loaded
    return new Promise((resolve, reject) => {
      link.onload = () => {
        console.log(`Successfully preloaded Rive animation: ${path}`);
        resolve();
      };
      
      link.onerror = (error) => {
        console.error(`Failed to preload Rive animation: ${path}`, error);
        reject(error);
      };
      
      document.head.appendChild(link);
    });
  } catch (error) {
    console.error(`Failed to preload Rive animation: ${filePath}`, error);
    throw error;
  }
};

/**
 * Bulk preload multiple Rive animations
 * @param filePaths Array of Rive file paths to preload
 */
export const preloadRiveAnimations = async (filePaths: string[]): Promise<void> => {
  try {
    await Promise.all(filePaths.map(preloadRiveAnimation));
    console.log('All Rive animations preloaded successfully');
  } catch (error) {
    console.error('Failed to preload some Rive animations:', error);
    throw error;
  }
}; 