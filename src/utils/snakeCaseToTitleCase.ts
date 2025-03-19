export function snakeCaseToTitleCase(input: string): string {
    // Split the input string by underscores
    const words = input.split('_');
    
    // Capitalize the first letter of each word
    const capitalizedWords = words.map(word => {
      if (word.length === 0) return '';
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
    
    // Join the words with spaces
    return capitalizedWords.join(' ');
  }
