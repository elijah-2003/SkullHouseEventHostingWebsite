import React, {useEffect, useState} from 'react';
import Logo from '../../Images/Phi_Kappa_Sigma_coat_of_arms.png';
import './Summary.css';
import {useParams} from "react-router-dom";
import {getEvent} from "../../Api/api-service";
import Loading from "../../Components/Loading";
import ItemNotFound from "../../Components/ItemNotFound";

const Summary = () => {
    const { eventId } = useParams();
    const [expandedPerson, setExpandedPerson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState(null);

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

    const handleExpand = (personId) => {
        if (expandedPerson === personId) {
            setExpandedPerson(null);
        } else {
            setExpandedPerson(personId);
        }
    };

    if (loading)
        return <Loading/>
    if (!loading && !event)
        return <ItemNotFound/>

    return (
        <div className="event-summary-container">
            <img src={Logo} alt="Your Logo" className="logo" />
            <h1 className="summary-title">Event Summary</h1>
            <div className="checked-in-list">
                {event.checkedIn.length === 0 ? (
                    <p>No one checked into this event.</p>
                ) : (
                    <ul>
                        {event.checkedIn.map((person) => (
                            <li key={person.id} className="person-item">
                                <button
                                    className="person-button"
                                    onClick={() => handleExpand(person.id)}
                                >
                                    {person.firstName} {person.lastName}
                                </button>
                                {expandedPerson === person.id && (
                                    <div className="person-details">
                                        <p>School: {person.school}</p>
                                        <p>Contact: {person.phone}</p>
                                        <p>Image: <img
                                            alt="Image not found"
                                            width={"250px"}
                                            src={person.image}
                                        /></p>
                                        {/* Add more person details as needed */}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Summary;