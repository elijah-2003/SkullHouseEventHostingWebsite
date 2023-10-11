import React, {useState, useEffect, useContext} from 'react';
import {Link} from 'react-router-dom'
import pksLogo from '../../Images/Phi_Kappa_Sigma_coat_of_arms.png'
import './Home.css'
import Footer from "../../Components/Footer";
import {getEvents, addEvent} from "../../Api/api-service";
import Loading from "../../Components/Loading";
import { AuthContext, AuthProvider } from '../../Components/AuthContext';

function Home() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { updateAuthenticated } = useContext(AuthContext); 
    const selectedBrother = JSON.parse(localStorage.getItem('selectedBrother'));
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

    const logOutHandler = (e) => {
        localStorage.setItem('selectedBrother', '')
        updateAuthenticated(false)
    }

    if (!loading) {
        return (
          <div className="home-container">
            <header className="header">
              <Link to="/add-event" className="add-event-link">
                <button className="add-event-button">Add Event</button>
              </Link>
              <img src={pksLogo} alt="Logo" className="logo-image" />
              <button onClick={logOutHandler} className="log-out-button">Log out</button>
            </header>
    
            {/* Welcome Section */}
            <section className="welcome-section">
              <h2 className="welcome-title">Welcome, Brother {selectedBrother.name}</h2>
            </section>
    
            {/* Events Section */}
            <section className="events-section">
              <h2 className="events-title">Upcoming Events</h2>
              <ul className="events-list">
                {events.length === 0 ? (
                  <li className="no-events">There are no events at this time.</li>
                ) : (
                  events.map((event, index) => (
                    <li key={index} className="event-item">
                      <Link to={`/manage-event/${event.eventData.id}`} className="event-link">
                        {event.eventData.name}
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </section>
    
            <Footer />
          </div>
        );
      } else {
        return <Loading />;
      }
    }

export default Home;