export const militaryToStandardTime = (militaryTime) => {
    // Split the military time string into hours and minutes
    const [hours, minutes] = militaryTime.split(':').map(Number);
    
    // Convert hours to 12-hour format
    const hour12 = hours % 12 || 12;
    
    // Determine whether it's AM or PM
    const period = hours < 12 ? 'am' : 'pm';
    
    // Construct the standard time string
    const standardTime = `${hour12}:${minutes < 10 ? '0' : ''}${minutes}${period}`;
    
    return standardTime;
  }
  