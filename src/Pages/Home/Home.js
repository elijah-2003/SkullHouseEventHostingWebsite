import React, {useEffect} from 'react';
import {Link} from 'react-router-dom'
import pksLogo from '../../Images/Phi_Kappa_Sigma_coat_of_arms.png'
import './Home.css'
import Footer from "../../Components/Footer";
import {getEvents} from "../../Api/api-service";


function Home() {
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
                    {getEvents().length === 0 ? (
                        <p>There are no events at this time.</p>
                    ) : (
                        getEvents().map((event, index) => (
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