
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  
  // Handle ISO dates (YYYY-MM-DD) and partial dates (YYYY-MM, YYYY)
  const parts = dateString.split('-');
  const year = parts[0];
  const month = parts[1];
  
  if (parts.length === 1) {
    return year; // Just year
  }
  
  if (parts.length === 2) {
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const monthIndex = parseInt(month) - 1;
    return `${monthNames[monthIndex]} ${year}`;
  }
  
  // Full date
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  } catch {
    return dateString; // Return original if parsing fails
  }
}

export function formatText(text: string): string {
  return text.trim();
}
