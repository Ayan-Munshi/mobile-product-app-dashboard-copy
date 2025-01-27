import moment from "moment";
export const months = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

type AppProps = {
  appointments: any[];
  gapMinutes: number | null;
};

// Function to generate slots for each appointment with a 40-minute gap

const generateTimeSlots = ({ appointments, gapMinutes }: AppProps) => {
  const slots: any[] = [];

  appointments.forEach((appointment: any) => {
    const startTime = moment(appointment.DateTimeStart);
    const endTime = moment(appointment.DateTimeEnd);

    let currentSlot = startTime.clone();

    // Generate slots while there's enough time for a full appointment
    while (
      currentSlot.clone().add(gapMinutes, "minutes").isSameOrBefore(endTime)
    ) {
      const slot = {
        slotStart: currentSlot.format("hh:mm A"),
        provNum: appointment.ProvNum,
        opNum: appointment.OpNum,
      };

      // Add the slot only if no slot with the same slotStart exists
      if (!slots.some(existingSlot => existingSlot.slotStart === slot.slotStart)) {
        slots.push(slot);
      }

      currentSlot.add(gapMinutes, "minutes"); // Move to the next slot
    }
  });

  // Sort slots by slotStart in chronological order
  slots.sort((a, b) => moment(a.slotStart, "hh:mm A").diff(moment(b.slotStart, "hh:mm A")));
  return slots;
};


export default generateTimeSlots;
