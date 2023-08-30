import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom'
import pksLogo from '../../Images/Phi_Kappa_Sigma_coat_of_arms.png'
import './Home.css'
import Footer from "../../Components/Footer";
import {getEvents, addEvent} from "../../Api/api-service";
import Loading from "../../Components/Loading";

function Home() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function fetchData() {
            try {
                const eventData = await getEvents();
                console.log("From home:", eventData)
                setEvents(eventData);
                setLoading(false)
            } catch (error) {
                throw error;
            }
        }
        fetchData();
    }, []);

    if(!loading) {
        return (
            <div>
                <header>
                    <Link to="/add-event">
                        <button className="add-event-button">Add Event</button>
                    </Link>
                    <img src={pksLogo} alt="Logo" className="logo-image"/>
                </header>
                <section className="events-section">
                    <h2 className="events-title">Events</h2>
                    <ul style={{listStyleType: "none"}}>
                        {events.length === 0 ? (
                            <p>There are no events at this time.</p>
                        ) : (
                            events.map((event, index) => (
                                <li key={index}>
                                    <Link to={`/manage-event/${event.eventData.id}`}>
                                        {event.eventData.name}
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
    else
        return <Loading/>
}

export default Home;