import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
//import './ManageEvent.css'
import logo from '../../Images/Phi_Kappa_Sigma_coat_of_arms.png'
import Footer from "../../Components/Footer";
import {getEvent, deleteEvent} from "../../Api/api-service";
import Loading from "../../Components/Loading";
import ItemNotFound from "../../Components/ItemNotFound";
import hasEventStarted from "../../Utilities/hasEventStarted";
import isEventExpired from "../../Utilities/expired";
function ManageEvent() {
    const { eventId } = useParams();
    const navigate= useNavigate();
    const [event, setEvent] = useState("");
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        async function fetchData() {
            try {
                let eventData = await getEvent(eventId);
                setEvent(eventData);
                setLoading(false)
            } catch (error) {
                throw error;
            }
        }
        fetchData();
    }, []);

    const deleteEventApi = async () => {
        if (loading)
            return;
        const result = window.confirm('Are you sure you want to delete this event?');
        if (result)
        {
            setLoading(true)
            await deleteEvent(event.id);
            navigate(`/`);
        }

    }
    const editInformation = () => {
        if (!hasEventStarted(event))
            navigate(`/add-event/${event.id}`);
        else
            alert(`You cannot change information for an ${isEventExpired(event) ? "expired" : "ongoing"} event`)
    }

    const editPeople = () => {
        if (!hasEventStarted(event))
            navigate(`/edit-people/${event.id}`);
        else
            alert(`You cannot change information for an ${isEventExpired(event) ? "expired" : "ongoing"} event`)
    }
    const manage_event = () => {
        if (hasEventStarted(event) && !isEventExpired(event))
            navigate(`/event-manager/${event.id}`);
        else
            isEventExpired(event) ? alert("The event has expired") : alert("The event has not yet started")
    }

    const checkInForm = () => {
        if (hasEventStarted(event) && !isEventExpired(event))
            navigate(`/information-entry/${event.id}`);
        else
            isEventExpired(event) ? alert("The event has expired") : alert("The event has not yet started")
    }

    const summary = () =>
    {
        if (isEventExpired(event))
            navigate(`/summary/${event.id}`);
        else
            alert("You can not view the summary for an event that has not expired.")
    }

    if(!loading) {
        if(event) {
            return (
                <div className="manage-event-container">
                    <header className="header">
                    <button onClick={(e) => navigate(`/`)}><img src={logo} alt="pks logo" className="logo" /></button>
                        <h2 className="event-title">{event.name}</h2>
                    </header>
                    <section className="content">
                        <div className="button-group">
                            <button onClick={editPeople} className="edit-people-button">Edit People</button>
                            <button onClick={deleteEventApi} className="delete-button">Delete Event</button>
                            <button onClick={editInformation} className="change-info-button">Change Information</button>
                            <button onClick={checkInForm} className="check-in-form-button">Check in Form</button>
                            <button onClick={manage_event} className="manage-event-button">Manage Event</button>
                            <button onClick={summary} className="manage-event-button">Summary</button>
                        </div>
                        <div className="event-parameters">
                            <p><strong>Description:</strong> {event.description}</p>
                            <p><strong>Location:</strong> {event.location}</p>
                            <p><strong>Date:</strong> {event.date}</p>
                            <p><strong>Time:</strong> {event.time}</p>
                            <p><strong>Duration:</strong> {event.duration} hours</p>
                            <p><strong>Emergency Contact:</strong> {event.emergency}</p>
                            <p><strong>Special Details:</strong> {event.special}</p>
                        </div>
                    </section>
                    <Footer/>
                </div>
            );
        }
        else
            return <ItemNotFound/>
    }
    else
        return <Loading/>
}

export default ManageEvent;