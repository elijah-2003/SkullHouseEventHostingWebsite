const isEventExpired = (event) => {
    if (!event.date|| !event.time || !event.duration) {
        return false; // Return false if any required fields are missing
    }

    const currentDate = new Date();
    const eventDateTime = new Date(`${event.date} ${event.time}`);
    const eventEndTime = new Date(eventDateTime);
    eventEndTime.setHours(eventEndTime.getHours() + parseInt(event.duration, 10));
    return currentDate > eventEndTime;
};
export default isEventExpired