import React, {useState} from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
//import './ManageEvent.css'
import logo from '../../Images/Phi_Kappa_Sigma_coat_of_arms.png'
import Footer from "../../Components/Footer";
import {getEvents, deleteEvent} from "../../Api/api-service";
function ManageEvent() {
    const { eventId } = useParams();
    const navigate  = useNavigate()
    const event = getEvents().find(event => event.id === eventId);

    const deleteEvent = () => {
        const result = window.confirm('Are you sure you want to delete this event?');
        if (result)
        {
            deleteEvent(event.id);
        }

    }
    const editInformation = () => {
        navigate(`/add-event/${event.id}`);
    }

    const editPeople = () => {
        navigate(`/edit-people/${event.id}`);
    }
    const manage_event = () => {
        navigate(`/event-manager/${event.id}`);
    }

    if (!event) {
        return <p>Event not found.</p>;
    }

    return (
        <div className="manage-event-container">
            <header className="header">
                <img className="logo" src={logo} alt="Event Logo" />
                <h2 className="event-title">{event.name}</h2>
            </header>
            <section className="content">
                <div className="file-upload">
                    <label htmlFor="excel-upload">Upload Excel Sheet:</label>
                    <input type="file" id="excel-upload" accept=".xlsx, .xls" />
                </div>
                <div className="button-group">
                    <button onClick={editPeople} className="edit-people-button">Edit People</button>
                    <button onClick={deleteEvent} className="delete-button">Delete Event</button>
                    <button onClick={editInformation} className="change-info-button">Change Information</button>
                    <button onClick={manage_event} className="manage-event-button">Manage Event</button>
                </div>
                <div className="event-parameters">
                    <p><strong>Hosts:</strong> None</p>
                    <p><strong>Description:</strong> {event.description}</p>
                    <p><strong>Location:</strong> {event.location}</p>
                    <p><strong>Date:</strong> {event.date}</p>
                    <p><strong>Time:</strong> {event.time}</p>
                    <p><strong>Duration:</strong> {event.duration}</p>
                    <p><strong>Emergency Contact:</strong> {event.emergency}</p>
                    <p><strong>Special Details:</strong> {event.special}</p>
                </div>
            </section>
            <Footer/>
        </div>
    );
}

export default ManageEvent;