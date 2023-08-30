import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Logo from '../../Images/Phi_Kappa_Sigma_coat_of_arms.png';
import Loading from "../../Components/Loading";
import {getWebsockets } from "../../Api/api-service";
import ItemNotFound from "../../Components/ItemNotFound";
import WelcomeMessage from "../../Components/WelcomeMessage";
import {v4 as uuidv4} from "uuid";

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
    const [event, setEvent] = useState("");
    const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
    const [websocketOff, setWebsocketOff] = useState(false)

    const navigate = useNavigate();

    useEffect(() => {
        async function start()
        {
            let websockets = await getWebsockets()
            setWebsockets(websockets)
            const newSocket = new WebSocket(websocketURL);

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

    if (loading)
        return <Loading/>
    if (!websockets)
        return <ItemNotFound/>
    if (showWelcomeMessage)
        return <WelcomeMessage/>

    return (
        <div className="information-entry-container">
            <img src={Logo} alt="Your Logo" className="logo" />
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
            )}
        </div>
    );
};

export default InformationEntry;





