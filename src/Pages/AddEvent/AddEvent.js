import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import isEventExpired from '../../Utilities/expired'
import './AddEvent.css'; // Import your AddEvent.css for styling
import {addEvent, getEvent} from "../../Api/api-service";
import Loading from "../../Components/Loading";
import ItemNotFound from "../../Components/ItemNotFound";

function AddEvent(props) {
    const { eventId } = useParams();
    const [event, setEvent] = useState("")
    const navigate = useNavigate();
    const [eventName, setEventName] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [emergencyContact, setEmergencyContact] = useState('');
    const [specialDetails, setSpecialDetails] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [loading, setLoading] = useState(true)
    const [eventDuration, setEventDuration] = useState(''); // Selected duration

    useEffect(() => {
        async function fetchData() {
            try {
                if (eventId) {
                    const eventData = await getEvent(eventId);
                    setEvent(eventData)
                    console.log("eventData:",eventData )
                    if (eventData) {
                        setEventName(eventData.name);
                        setEventDescription(eventData.description);
                        setEventLocation(eventData.location);
                        setEmergencyContact(eventData.emergency);
                        setSpecialDetails(eventData.special);
                        setEventDate(eventData.date || ''); // Set date if available, otherwise empty string
                        setEventTime(eventData.time || '');
                        setEventDuration(eventData.duration || '')
                    }
                }
                setLoading(false);
                } catch (error) {
                    throw error;
                }
            }
            fetchData();
        }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let newEvent = {
            name: eventName,
            hosts: event ? event.invited : [],
            description: eventDescription,
            location: eventLocation,
            emergency: emergencyContact,
            special: specialDetails,
            invited: event ? event.invited : [],
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
        }

        setLoading(true)

       await addEvent(newEvent)

        setLoading(false)

        setEventName('');
        setEventDescription('');
        setEventLocation('');
        setEmergencyContact('');
        setSpecialDetails('');
        setEventDate('');
        setEventTime('');
        setEventDuration(0)
        //Exit the Add Event page
        navigate('/')

    };
    if (loading)
        return <Loading/>

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
                        placeholder="Phi Kap Event"
                        onChange={(e) => setEventName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="eventDescription">Event Description:</label>
                    <textarea
                        id="eventDescription"
                        value={eventDescription}
                        placeholder="What is this event for?"
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
                        placeholder="Skullhouse"
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
                        placeholder="(123)-456-7890"
                        onChange={(e) => setEmergencyContact(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="specialDetails">Special Details:</label>
                    <textarea
                        id="specialDetails"
                        value={specialDetails}
                        placeholder="Any extra details that guests should know?"
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
                    <input
                        type="number"
                        id="eventDuration"
                        value={eventDuration}
                        onChange={(e) => setEventDuration(e.target.value)}
                        placeholder="Enter duration in hours"
                        required
                    />
                </div>
                <button type="submit">{event ? 'Update Event' : 'Add Event'}</button>
            </form>
        </div>
    );
}

export default AddEvent;