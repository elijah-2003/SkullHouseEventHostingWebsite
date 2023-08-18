import React, {useEffect} from 'react';
import {Link} from 'react-router-dom'
import { useEventContext } from '../../EventContext';
import pksLogo from '../../Images/Phi_Kappa_Sigma_coat_of_arms.png'
import { v4 as uuidv4 } from 'uuid';
import './Home.css'
import Footer from "../../Components/Footer";


function Home() {
    const { events, addEvent} = useEventContext();
    useEffect(() => {
        // Check if there are no events already
        if (events.length === 0) {
            // Create a new event
            const newEvent = {
                name: 'Sample Event',
                description: 'This is a sample event description.',
                location: 'Sample Location',
                emergency: '123-456-7890',
                special: 'Sample details.',
                invited: [{
                    firstName: "Warmando",
                    lastName: "Moncada",
                    school: "MIT"
                }],
                blacklist: [{
                    firstName: "Elijah",
                    lastName: "Johnson",
                    school: "MIT"
                }],
                id: "hjevfehwbfdehwjwehbjb"
            };

            // Add the new event using the addEvent function
            addEvent(newEvent);
        }
    }, [events, addEvent]);

    return (
        <div>
            <header>
                <Link to="/add-event">
                    <button className="add-event-button">Add Event</button>
                </Link>
                <img src={pksLogo} alt="Logo" className="logo-image" />
            </header>
            <section className="events-section">
                <h2 className="events-title">Events</h2>
                <ul style={{ listStyleType: "none" }}>
                    {events.length === 0 ? (
                        <p>There are no events at this time.</p>
                    ) : (
                        events.map((event, index) => (
                            <li key={index}>
                                <Link to={`/manage-event/${event.id}`}>
                                    {event.name}
                                </Link>
                            </li>
                        ))
                    )}
                </ul>
            </section>
            <Footer/>
        </div>
    );
}

export default Home;