import React, {useEffect, useState} from 'react';
import Logo from '../../Images/Phi_Kappa_Sigma_coat_of_arms.png';
import './Summary.css';
import {useNavigate, useParams} from "react-router-dom";
import {getEvent} from "../../Api/api-service";
import Loading from "../../Components/Loading";
import ItemNotFound from "../../Components/ItemNotFound";
import {addToBlackList, getBlacklist} from "../../Api/api-service";

const Summary = () => {
    const navigate = useNavigate()
    const { eventId } = useParams();
    const [expandedPerson, setExpandedPerson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState(null);

    useEffect(() => {
        let globalEvent;
        async function fetchData() {
            try {
                let eventData = await getEvent(eventId);
                setEvent(eventData);
                globalEvent = eventData
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

    const handleAddToBlacklist = async (person) => {
        setLoading(true)
        const blacklist = await getBlacklist()
        if (blacklist.find((p) => p.id === person.id))
        {
            alert("This person has already been added to the blacklist")
            window.location.href = window.location.href;
        }
        else
        {
            await addToBlackList(eventId, person)
            alert(`${person.firstName} ${person.lastName} has been added to the blacklist.`)
            window.location.href = window.location.href;
        }
    }

    if (loading)
        return <Loading/>
    if (!event)
        return <ItemNotFound/>

    return (
        <div className="event-summary-container">
           <button onClick={(e) => navigate(`/`)}><img src={Logo} alt="pks logo" className="logo" /></button>
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