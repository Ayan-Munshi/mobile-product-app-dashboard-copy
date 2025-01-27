import moment from "moment";

export function isValidDate(dateString: string): boolean {
  // Parse the date parts (assumes the format YYYY-MM-DD)
  const [year, month, day] = dateString.split("-").map(Number);

  // Create a new Date object with the parsed values
  const date = new Date(year, month - 1, day); // month is 0-indexed

  // Check if the date is valid
  const isValidDate =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 && // JS months are 0-indexed
    date.getDate() === day;

  // Check if the date is greater than or equal to today
  const isPastDate = moment(date).isBefore(moment(), "day"); // Returns true if the date is before today

  return isValidDate && isPastDate; // Return false if the date is today or in the future
}
