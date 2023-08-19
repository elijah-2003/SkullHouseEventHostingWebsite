import React, { useState, useEffect } from 'react';
import logo from '../../Images/Phi_Kappa_Sigma_coat_of_arms.png'; // Replace with your logo path
import nfcLogo from '../../Images/nfc.png'; // Replace with your NFC logo path
import './EventManager.css';
import {useParams, useNavigate} from "react-router-dom";
import Footer from "../../Components/Footer";
import hasEventStarted from "../../Utilities/hasEventStarted";
import {getEvents} from "../../Api/api-service";

function EventManager() {
    const { eventId } = useParams();
    const navigate = useNavigate()
    const event = getEvents().find(event => event.id === eventId);
    const [currentAttendees, setCurrentAttendees] = useState(0);
    const [maxCapacity, setMaxCapacity] = useState(100);
    const [isInviteOnly, setIsInviteOnly] = useState(false);
    const [isNfcEnabled, setIsNfcEnabled] = useState(true);
    const [checkedInPeople, setCheckedInPeople] = useState([]);

    useEffect(() => {
        // Check if the event has started
        const event = {
            date: '2023-08-20',
            time: '14:00'
        };

        if (!hasEventStarted(event)) {
            alert('The event has not yet started.');
            navigate(-1) // Go back to the previous page
        }
    }, [navigate]);

    const handleAttendeesChange = (value) => {
        setCurrentAttendees(value);
    };

    const handleMaxCapacityChange = (value) => {
        setMaxCapacity(value);
    };

    const handleInviteOnlyChange = () => {
        setIsInviteOnly(!isInviteOnly);
    };

    const handleNfcToggle = () => {
        setIsNfcEnabled(!isNfcEnabled);
    };

    const handleCheckIn = (person) => {
        setCheckedInPeople([...checkedInPeople, person]);
    };

    return (
        <div className="event-manager-container">
            <header className="header">
                <img className="logo" src={logo} alt="Logo" />
            </header>
            <main className="main-content">
                <div className="nfc-logo-container">
                    <img
                        className={`nfc-logo ${isNfcEnabled ? 'nfc-logo-enabled' : 'nfc-logo-disabled'}`}
                        src={nfcLogo}
                        alt="NFC Logo"
                    />
                </div>
                <div className="event-info">
                    <h2>{event.name}</h2>
                    <p>Current Attendees: {currentAttendees}</p>
                    <p>Max Capacity: {maxCapacity}</p>
                    <label>
                        Invite Only:
                        <input
                            type="checkbox"
                            checked={isInviteOnly}
                            onChange={handleInviteOnlyChange}
                        />
                    </label>
                    <div className="nfc-toggle">
                        <p>NFC Scanning Enabled</p>
                        <input
                            type="checkbox"
                            checked={isNfcEnabled}
                            onChange={handleNfcToggle}
                        />
                    </div>
                </div>
                <div className="checked-in-list">
                    <h3>Checked In</h3>
                    {checkedInPeople.length === 0 ? (
                        <p>No one is checked in yet.</p>
                    ) : (
                        <ul>
                            {checkedInPeople.map((person, index) => (
                                <li key={index}>
                                    {person.firstName} {person.lastName} - {person.school} {person.invited ? 'Invited' : 'Not Invited'}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </main>
            <Footer/>
        </div>
    );
}

export default EventManager;