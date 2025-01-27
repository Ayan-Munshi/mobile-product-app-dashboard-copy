// function to convert "HH:MM:SS" to "h:mm AM/PM"
export const formatTime = (time) => {
  const [hour, minute] = time.split(":").map(Number); 
  const isPM = hour >= 12;
  const formattedHour = hour % 12 || 12; // convert 0 to 12 
  const ampm = isPM ? "PM" : "AM";
  return `${formattedHour}:${minute.toString().padStart(2, "0")} ${ampm}`;
};
