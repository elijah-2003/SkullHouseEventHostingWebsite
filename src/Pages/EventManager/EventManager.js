import React, { useState, useEffect } from 'react';
import logo from '../../Images/Phi_Kappa_Sigma_coat_of_arms.png';
import qr from '../../Images/qr.png';
import './EventManager.css';
import { useParams } from 'react-router-dom';
import { getEvent, addToCheckedIn } from '../../Api/api-service';
import Loading from '../../Components/Loading';
import ItemNotFound from '../../Components/ItemNotFound';
import WebSocketError from "../../Components/WebsocketError";
import {useNavigate} from "react-router-dom";
import isEventExpired from "../../Utilities/expired";


function EventManager() {
    const navigate = useNavigate();
    const { eventId } = useParams();
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState('');
    const [currentAttendees, setCurrentAttendees] = useState(0);
    const [isQREnabled, setIsQREnabled] = useState(true);
    const [checkedInPeople, setCheckedInPeople] = useState([]);
    const [socket, setSocket] = useState(null); // State for the WebSocket instance
    const [webSocketId, setWebSocketId] = useState(''); // State for the WebSocket ID
    const [websocketOff, setWebsocketOff] = useState(false)

    useEffect(() => {
        let globalId = ""
        let globalSocket = null
        let globalEvent = {}
        async function fetchData() {
            try {
                let eventData = await getEvent(eventId);
                globalEvent = eventData
                setEvent(eventData);
                setCheckedInPeople(eventData.checkedIn)
                setCurrentAttendees(eventData.checkedIn.length)
                return eventData
            } catch (error) {
                throw error;
            }
        }

        async function start()
        {
            await fetchData()
            const newSocket = new WebSocket('wss://08gn0vr4ji.execute-api.us-east-1.amazonaws.com/production');

            newSocket.onopen = (event) => {
                console.log('WebSocket connection opened:');
                // Get the WebSocket ID here and set it in state
                const eventData = {
                    action: 'getWebsocketId',
                };
                const eventString = JSON.stringify(eventData)
                setSocket(newSocket)
                globalSocket = newSocket
                newSocket.send(eventString);
            };

            newSocket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log('Received data from server:', data);
                switch (data.action) {
                    case "sendWebsocketId":
                        setWebSocketId(data.id);
                        globalId = data.id
                        setLoading(false)
                        break;

                    case "checkBlackListResponse":
                        const eventData = {
                            action: 'onCheckIn',
                            person: data.person,
                            eventId: eventId
                        };
                        const eventString = JSON.stringify(eventData);
                        console.log("data:", data);
                        console.log("event data:", eventData);

                        if (data.matches.length > 0) {
                            console.log("This person is blacklisted!")
                            const confirmed = window.confirm(`${data.person.firstName} ${data.person.lastName} may be blacklisted. Do you still wish to check them in?`);
                            if (confirmed) {
                                (async () => {
                                    await addToCheckedIn(eventId, data.person);
                                    console.log("Checked in?")
                                    newSocket.send(eventString);
                                })();
                            }
                        } else {
                            (async () => {
                                await addToCheckedIn(eventId, data.person);
                                console.log("Checked in?")
                                newSocket.send(eventString);
                            })();
                        }
                        break;

                    case "sendCheckIn":
                        if (data.eventId === eventId) {
                            (async () => {
                                const newEvent = await fetchData();
                                setEvent(newEvent);
                                setCheckedInPeople(newEvent.checkedIn);
                                setCurrentAttendees(newEvent.checkedIn.length)
                            })();
                        }
                        break;

                    // Add more cases as needed
                    default:
                        // Handle other cases if required
                        break;
                }
            }

            newSocket.onclose = () => {
                console.log('WebSocket connection closed');
                setWebsocketOff(true)
            };
        }
        start();
        let accumulatedInput = '';
        const handleKeyDown = async (event) => {
            if (event.key === 'Enter') {
                // Handle the accumulated input here
                console.log("WebsocketId:", webSocketId)
                await handleScan(accumulatedInput, globalId, globalSocket);
                accumulatedInput = '';
            } else {
                // Append the current key to the accumulated input
                accumulatedInput += event.key;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        const checkEventStatus = setInterval(() => {
            if (isEventExpired(globalEvent)) {
                alert("You cannot manage an expired event")
                clearInterval(checkEventStatus); // Stop checking once expired
                globalSocket.close();
                navigate(`/manage-event/${eventId}`); // Navigate to manageEvent page
            }
        }, 3000);
        return () => {
            if (socket) {
                socket.close();
            }
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleQRToggle = () => {
        setIsQREnabled(!isQREnabled);
    };

    const handleScan = async (data, id, socket) => {
        const checkBlackList = (person) => {
            const hostId = id; // Get the selected host ID
            console.log("Host:", id)

            const eventData = {
                action: 'checkBlackList',
                host: hostId,
                person: person,
            };
            const eventString = JSON.stringify(eventData)
            console.log("event:", eventString)

            socket.send(eventString);
        }
        if (data) {
            // Assuming the scanned data is a valid person ID
            const personId = data; // Adjust this based on the structure of the scanned data

            // Call API to get invited person by ID
            setLoading(true)
            let event = await getEvent(eventId);
            let invitedPerson = event.invited.find(e => e.id === personId);

            if (invitedPerson) {
                if (event.checkedIn.find(e => e.id === personId)) {
                    alert("This person has already been checked in")
                    setLoading(false)
                    return;
                }
                // Person is invited, so check them in
                try {
                    checkBlackList(invitedPerson)
                    console.log('Person checked in successfully');
                    alert(`${invitedPerson.firstName} checked in successfully`)
                    setLoading(false)
                    // You can show a success message or perform any other actions
                } catch (error) {
                    console.log('Failed to check in person:', error);
                    alert("Something went wrong. Please try again")
                    setLoading(false)
                    // Handle the case where check-in fails
                }
            } else {
                console.log('Invalid invite');
                alert("Invalid Invite Provided. (Probably using an old invite)")
                setLoading(false)
                // Handle the case of an invalid invite
            }
        }
    };

    if (websocketOff)
        return <WebSocketError/>

    if (loading) {
        return <Loading />;
    }

    if (!event && !loading) {
        return <ItemNotFound />;
    }

    return (
        <div className="event-manager-container">
            <header className="header">
                <img className="logo" src={logo} alt="Logo" />
            </header>
            <main className="main-content">
                <div className="QR-logo-container">
                    <h1>Host ID: {webSocketId}</h1>
                    <img
                        className={`QR-logo ${isQREnabled ? 'QR-logo-enabled' : 'QR-logo-disabled'}`}
                        src={qr}
                        alt="QR Logo"
                    />
                </div>
                <div className="event-info">
                    <h2>{event.name}</h2>
                    <p>Current Attendees: {currentAttendees}</p>
                    <div className="QR-toggle">
                        <p>QR Scanning Enabled</p>
                        <input
                            type="checkbox"
                            checked={isQREnabled}
                            onChange={handleQRToggle}
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
        </div>
    );
}

export default EventManager;