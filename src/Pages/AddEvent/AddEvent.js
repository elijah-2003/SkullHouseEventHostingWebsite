import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import isEventExpired from '../../Utilities/expired'
import './AddEvent.css'; // Import your AddEvent.css for styling

function AddEvent(props) {
    const { addEvent, updateEvent, events } = useEventContext();
    const { eventId } = useParams();
    const event = events.find(event => event.id === eventId);
    const navigate = useNavigate();
    const [eventName, setEventName] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [emergencyContact, setEmergencyContact] = useState('');
    const [specialDetails, setSpecialDetails] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [eventDuration, setEventDuration] = useState(''); // Selected duration
    const eventDurationOptions = ['1', '2', '3', '4', '5'];
    let duration = '';

    useEffect(() => {
        console.log(event)
        if (event !== undefined) {
            setEventName(event.name);
            setEventDescription(event.description);
            setEventLocation(event.location);
            setEmergencyContact(event.emergency);
            setSpecialDetails(event.special);
            setEventDate(event.date || ''); // Set date if available, otherwise empty string
            setEventTime(event.time || '');
            setEventDuration(event.duration || '')
        }
    }, [event]);

    const handleSubmit = (e) => {
        e.preventDefault();
        let newEvent = {
            name: eventName,
            hosts: event ? event.invited : [],
            description: eventDescription,
            location: eventLocation,
            emergency: emergencyContact,
            special: specialDetails,
            invited: event ? event.invited : [],
            blacklist: event ? event.blacklist : [],
            date: eventDate,
            time: eventTime,
            duration: eventDuration,
            checkedIn: event ? event.checkedIn : [],
            id: event ? eventId : uuidv4(),
        };
        if (isEventExpired(newEvent))
        {
            alert("The event has expired and cannot be submitted.");
            return; // Abort the submission
        };

        if (event) {
            // Update the event using the updateEvent function
            updateEvent(event.id, newEvent);
        } else {
            // Add a new event using the addEvent function
            addEvent(newEvent);
        }

        setEventName('');
        setEventDescription('');
        setEventLocation('');
        setEmergencyContact('');
        setSpecialDetails('');
        setEventDate('');
        setEventTime('');
        duration = ''
        //Exit the Add Event page
        navigate('/')

    };

    return (
        <div className="add-event-container">
            <h2>{event ? 'Update Event' : 'Add Event'}</h2>
            <form className="add-event-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="eventName">Event Name:</label>
                    <input
                        type="text"
                        id="eventName"
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="eventDescription">Event Description:</label>
                    <textarea
                        id="eventDescription"
                        value={eventDescription}
                        onChange={(e) => setEventDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="eventLocation">Event Location:</label>
                    <input
                        type="text"
                        id="eventLocation"
                        value={eventLocation}
                        onChange={(e) => setEventLocation(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="emergencyContact">Emergency Contact (Alpha Phone Number):</label>
                    <input
                        type="tel"
                        id="emergencyContact"
                        value={emergencyContact}
                        onChange={(e) => setEmergencyContact(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="specialDetails">Special Details:</label>
                    <textarea
                        id="specialDetails"
                        value={specialDetails}
                        onChange={(e) => setSpecialDetails(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="eventDate">Event Date:</label>
                    <input
                        type="date"
                        id="eventDate"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="eventTime">Event Time:</label>
                    <input
                        type="time"
                        id="eventTime"
                        value={eventTime}
                        onChange={(e) => setEventTime(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="eventDuration">Event Duration (hours):</label>
                    <select
                        id="eventDuration"
                        value={eventDuration}
                        onChange={(e) => setEventDuration(e.target.value)}
                        required
                    >
                        <option value="">Select Duration</option>
                        {eventDurationOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">{event ? 'Update Event' : 'Add Event'}</button>
            </form>
        </div>
    );
}

export default AddEvent;