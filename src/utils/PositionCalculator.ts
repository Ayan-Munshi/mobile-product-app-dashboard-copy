// Helper function to calculate the position and height dynamically
export const calculatePosition = (start, end) => {
  const timeToMinutes = (time) => {
    const [hourMin, period] = time.split(" "); // hourMin (hours and minutes, e.g., "12:30"),period (either "AM" or "PM").
    const [hours, minutes] = hourMin.split(":").map(Number); // 12 hours , 30 minutes

    let totalMinutes = hours * 60 + (minutes || 0); // 12 * 60 + 30 minutes

    // AM and PM logic
    if (period === "AM" && hours === 12) {
      totalMinutes -= 12 * 60; // 12:xx AM should be 00:xx (totalMinutes = otalMinutes - 720)
    } else if (period === "PM" && hours !== 12) {
      totalMinutes += 12 * 60; // Convert PM to 24-hour format
    }

    return totalMinutes;
  };

  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);

  const slotHeight = 64; // each time slot is 64px tall
  const minutesPerSlot = 60; //each time slot has 1 hour = 60 minutes

  // calculate the position for AM and PM separately
  let top;
  if (start.includes("AM")) {
    top = ((startMinutes - 0) / minutesPerSlot) * slotHeight; // Start from 12:00 AM
  } else {
    top = ((startMinutes - 720) / minutesPerSlot) * slotHeight; // Start from 12:00 PM (720 minutes)
    top += 768; // Adjust for PM to start after 768px (768 px is the total height from 12 AM to 11 AM)
  }

  const height = ((endMinutes - startMinutes) / minutesPerSlot) * slotHeight;

  return { top, height };
};
