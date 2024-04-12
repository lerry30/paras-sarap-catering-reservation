export const getDaysInMonth = (year, month) => {
    // Get the number of days in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // Create an array to hold the days
    const daysArray = [];
    // Populate the array with the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      daysArray.push(day);
    }
    
    return daysArray;
}