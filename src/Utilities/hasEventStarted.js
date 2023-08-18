const hasEventStarted = (event) => {
  if (!event.date || !event.time) {
    return false; // Return false if any required fields are missing
  }

  const currentDateTime = new Date();
  const eventDateTime = new Date(`${event.date} ${event.time}`);

  return currentDateTime >= eventDateTime;
};
export default hasEventStarted