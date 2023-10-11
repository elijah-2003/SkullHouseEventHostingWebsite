import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Logo from '../../Images/Phi_Kappa_Sigma_coat_of_arms.png';
import Loading from "../../Components/Loading";
import {getEvent, getWebsockets} from "../../Api/api-service";
import ItemNotFound from "../../Components/ItemNotFound";
import WelcomeMessage from "../../Components/WelcomeMessage";
import {v4 as uuidv4} from "uuid";
import isEventExpired from "../../Utilities/expired";
import hasEventStarted from "../../Utilities/hasEventStarted";
import WebSocketError from '../../Components/WebsocketError';

const InformationEntry = () => {
    const { eventId } = useParams();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [school, setSchool] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const websocketURL = 'wss://08gn0vr4ji.execute-api.us-east-1.amazonaws.com/production/';
    const [socket, setSocket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showHostSelector, setShowHostSelector] = useState(true);
    const [websockets, setWebsockets] = useState([]);
    const [selectedHostId, setSelectedHostId] = useState('');
    const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
    const [websocketOff, setWebsocketOff] = useState(false)
    const [event, setEvent] = useState(false)

    const navigate = useNavigate();

    useEffect(() => {
        let globalEvent;
        let globalSocket;
        async function start()
        {
            let websockets = await getWebsockets()
            globalEvent = await getEvent(eventId)
            setWebsockets(websockets)
            setEvent(globalEvent)
            const newSocket = new WebSocket(websocketURL);
            globalSocket = newSocket
            newSocket.onopen = () => {
                console.log('WebSocket connection opened');
            };

            newSocket.onmessage = (event) => {
                const data = event
                console.log('Received data from server:', data);

            };

            newSocket.onclose = () => {
                console.log('WebSocket connection closed');
                setWebsocketOff(true)
            };
            setSocket(newSocket);
            setLoading(false);
        }
        start();
        const checkEventStatus = setInterval(() => {
            if (isEventExpired(globalEvent) || !hasEventStarted(globalEvent)) {
                alert(`You cannot be host for an ${isEventExpired(globalEvent) ? 'expired' : 'unstarted '} event`)
                clearInterval(checkEventStatus); // Stop checking once expired
                globalSocket.close();
                navigate(`/manage-event/${eventId}`); // Navigate to manageEvent page
            }
        }, 3000);
        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedHostId) {
            alert('Please select a host before submitting.');
            return;
        }
        let websockets = await getWebsockets()
        let isHostActive = websockets.find((w) => w === selectedHostId)
        if (!isHostActive)
        {
            setWebsocketOff(true)
            return;
        }
        
        console.log("socket:", socket)
        const newPerson = {
            firstName: firstName,
            lastName: lastName,
            school: school,
            phone: phoneNumber,
            image:"",
            id: uuidv4(),
            eventId: eventId,
            invited:false
        }
        console.log("after socket:", socket)
        checkBlackList(newPerson)
        setShowWelcomeMessage(true);

        // Clear the form entries and reset the host selector after a delay
        setTimeout(() => {
            setFirstName('');
            setLastName('');
            setSchool('');
            setPhoneNumber('');
            setShowWelcomeMessage(false); // Hide the welcome message
        }, 1000);
    };

    const confirmHostSelection = () => {
        setShowHostSelector(false);
    };

     const checkBlackList = (person) => {
        const hostId = selectedHostId; // Get the selected host ID
        console.log("Host:", hostId)

        const eventData = {
            action: 'checkBlackList',
            host: hostId,
            person: person,
        };
        const eventString = JSON.stringify(eventData)
        console.log("event:", eventString)

        socket.send(eventString);
    }

    if (websocketOff)
        return <WebSocketError/>
    if (loading)
        return <Loading/>
    if (!websockets || !event)
        return <ItemNotFound/>
    if (showWelcomeMessage)
        return <WelcomeMessage/>

    return (
        <div className="information-entry-container">
            <button onClick={(e) => navigate(`/`)}><img src={Logo} alt="pks logo" className="logo" /></button>
            <h1>Enter Your Information</h1>
            {showHostSelector && (
                <div className="overlay">
                    <h2>Choose Host ID</h2>
                    <select
                        value={selectedHostId}
                        onChange={(e) => setSelectedHostId(e.target.value)}
                    >
                        <option value="">Select a Host</option>
                        {websockets.map((ws) => (
                            <option key={ws} value={ws}>
                                {ws}
                            </option>
                        ))}
                    </select>
                    <button onClick={confirmHostSelection}>Confirm</button>
                </div>
            )}

            {!showHostSelector && (
                <>
                    <h2>Host ID: {selectedHostId}</h2>
                    <form onSubmit={handleSubmit} className="entry-form">
                        <TextField
                            label="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            variant="outlined"
                            fullWidth
                            required
                            margin="normal"
                            disabled={!selectedHostId}
                        />
                        <TextField
                            label="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            variant="outlined"
                            fullWidth
                            required
                            margin="normal"
                            disabled={!selectedHostId}
                        />
                        <TextField
                            label="School"
                            value={school}
                            onChange={(e) => setSchool(e.target.value)}
                            variant="outlined"
                            fullWidth
                            required
                            margin="normal"
                            disabled={!selectedHostId}
                        />
                        <TextField
                            label="Phone Number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            disabled={!selectedHostId}
                        />
                        <Button type="submit" variant="contained" color="primary">
                            Submit
                        </Button>
                    </form>
                </>
            )}
        </div>
    );
};

export default InformationEntry;





