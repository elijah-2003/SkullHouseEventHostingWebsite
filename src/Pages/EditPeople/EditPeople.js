import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import './EditPeople.css';
import logo from '../../Images/Phi_Kappa_Sigma_coat_of_arms.png';
import Footer from "../../Components/Footer";
import {addToBlackList, addToInvited, getEvent, deleteFromInvited, deleteFromBlackList, getBlacklist} from "../../Api/api-service";
import Loading from "../../Components/Loading";
import ItemNotFound from "../../Components/ItemNotFound";
import qrcode from "qrcode";
import { PDFViewer, Page, Text, View, Document, Image, Font } from "@react-pdf/renderer";

function EditPeople() {
    const [selectedAction, setSelectedAction] = useState('invite');
    const [loading, setLoading] = useState(true)
    const [event, setEvent] = useState("")
    const [blacklist, setBlacklist] = useState([])
    const [pdfView, setPdfView] = useState(false)
    const [person, setPerson] = useState(null)
    const {eventId} = useParams();
    const [addToBlackListView, setAddToBlackListView] = useState(false)
    const [addToInvitedListView, setAddToInvitedListView] = useState(false)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [school, setSchool] = useState("")
    const [contact, setContact] = useState("")
    const [selectedFile, setSelectedFile] = useState(null)

    useEffect(() => {
        async function fetchData() {
            try {
                let eventData = await getEvent(eventId);
                let blacklist = await getBlacklist()
                setEvent(eventData);
                setBlacklist(blacklist)
                setLoading(false)
            } catch (error) {
                console.log("Event Doesn't Exist")
            }
        }

        fetchData();
    }, []);

    const styles = {
        page: {
            backgroundColor: "#fff", // White background
            padding: 20,
            flexDirection: "column",
            alignItems: "center",
        },
        header: {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 10,
        },
        logo: {
            width: 60,
            height: 60,
            marginRight: 10,
        },
        eventName: {
            fontSize: 20,
            color: "#000", // Black color
        },
        eventInfo: {
            marginBottom: 20,
            fontSize: 12,
            color: "#666", // Dark gray color
            textAlign: "center",
        },
        personName: {
            fontSize: 18,
            fontWeight: "bold",
            color: "#000", // Black color
            marginBottom: 5,
        },
        schoolName: {
            fontSize: 14,
            color: "#666", // Dark gray color
            marginBottom: 10,
        },
        qrCode: {
            width: 120,
            height: 120,
        },
        navBar: {
            backgroundColor: "black",
            height: 40,
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            paddingRight: 20,
        },
        exitButton: {
            color: "gold",
            fontSize: 16,
            fontWeight: "bold",
            cursor: "pointer",
        },
        viewer: {
            width: window.innerWidth,
            height: window.innerHeight,
        },
    };
    const createPerson = (first, last, school, phone, image, invited) =>
    {
        return {
            firstName: first,
            lastName: last,
            school: school,
            phone: phone,
            image:image,
            id: uuidv4(),
            eventId: eventId,
            invited: invited,
        }
    }

    function convertImageToBase64(imageFile, callback) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64String = event.target.result;
            callback(base64String);
        };
        reader.readAsDataURL(imageFile);
    }

// Inside the EditPeople component
    const generateQRCodeDataURL = async (person) => {
        const qrData = person.id;

        const qrDataURL = await qrcode.toDataURL(qrData);
        return qrDataURL;
    };

    const QRCodePDF = (person) => {
        setPdfView(true)
        setLoading(false)
        setPerson(person)
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (addToBlackListView)
        {
            const person = createPerson(firstName, lastName, school, contact, selectedFile, false)
            console.log("person:", person)
            setLoading(true)
            await addToBlackList(eventId, person)
            window.location.href = window.location.href;
        }
        else
        {
            const person = createPerson(firstName, lastName, school, contact, selectedFile, true)
            setLoading(true)
            await addToInvited(eventId, person)
            window.location.href = window.location.href;
        }
    };

    const handleDeleteInvited = async (index) => {
        setLoading(true)
        await deleteFromInvited(eventId, event.invited[index])
        window.location.href = window.location.href;
    }

    const handleDeleteBlackList = async (index) => {
        setLoading(true)
        await deleteFromBlackList(blacklist[index].personData)
        window.location.href = window.location.href;
    }

    const onClose = () => {
        setPdfView(false)
        setAddToBlackListView(false)
        setAddToInvitedListView(false)
    }

    if (!loading) {
        if (pdfView) {
            return (
                <>
                    <div style={styles.navBar}>
                    <span style={styles.exitButton} onClick={onClose}>
                    X
                    </span>
                    </div>
                    <PDFViewer style={styles.viewer}>
                        <Document>
                            <Page style={styles.page}>
                                <View style={styles.header}>
                                    <Image style={styles.logo} src={logo} />
                                    <Text style={styles.eventName}>{event.name}</Text>
                                </View>
                                <View style={styles.eventInfo}>
                                    <Text>Event Description: {event.description}</Text>
                                    <Text>Event Special Details: {event.special}</Text>
                                    <Text>Emergency Contact: {event.emergency}</Text>
                                </View>
                                <View>
                                    <Text style={styles.personName}>
                                        {person.firstName} {person.lastName}
                                    </Text>
                                    <Text style={styles.schoolName}>{person.school}</Text>
                                    <Image style={styles.qrCode} src={generateQRCodeDataURL(person)} />
                                </View>
                            </Page>
                        </Document>
                    </PDFViewer>
                </>
            );
        }
        if (addToInvitedListView || addToBlackListView)
        {
            return (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>{`Add to ${addToBlackListView ? 'blacklist' : 'Invited'}`}</h2>
                        <form onSubmit={handleSubmit}>
                            <label>
                                First Name:
                                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                                required={true}/>
                            </label>
                            <label>
                                Last Name:
                                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
                                required={true}/>
                            </label>
                            <label>
                                School:
                                <input type="text" value={school} onChange={(e) => setSchool(e.target.value)} />
                            </label>
                            <label>
                                Contact:
                                <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} />
                            </label>
                            <label>
                                Upload Image{addToBlackListView ? ' (required)' : ''}:
                                <input type="file" accept="image/*" onChange={(e) => convertImageToBase64(e.target.files[0], (base64String) => {
                                    console.log('Base64 encoded image:', base64String);
                                    setSelectedFile(base64String)
                                    // You can use the base64String as needed, such as including it in your JSON object
                                })}
                                required={addToBlackListView}/>
                            </label>
                            <button type="submit">{addToBlackListView ? "Blacklist" : "Invite"}</button>
                            <button type="button" onClick={onClose}>Cancel</button>
                        </form>
                    </div>
                </div>
            );
        }
        if (event) {
            return (
                <div className="edit-people-container">
                    <header className="header">
                        <img className="logo" src={logo} alt="Logo"/>
                        <h2>Edit People</h2>
                    </header>
                    <form className="edit-people-form">
                        {/* ... (dropdowns and textboxes) */}
                        <div className="actions">
                            <button type="button" onClick={() => setAddToInvitedListView(true)}>
                                {selectedAction === 'invite' ? 'Invite' : 'Add to Invited'}
                            </button>
                            <button type="button" onClick={() => setAddToBlackListView(true)}>
                                {selectedAction === 'blacklist' ? 'Blacklist' : 'Add to Blacklist'}
                            </button>
                        </div>
                    </form>
                    <div className="people-lists">
                        <div className="people-column">
                            <h3>Invited People</h3>
                            <ul>
                                {event.invited.length === 0 ? (
                                    <p>There are currently no invitations.</p>
                                ) : (
                                    event.invited.map((person, index) => (
                                        <li key={index}>
                                            <div className="person-info">
                                                <div className="person-name">
                                                    <p>{person.firstName} {person.lastName}</p>
                                                    <p>{person.school}</p>
                                                </div>
                                                <div className="person-image">
                                                    <img
                                                        alt="Image not found"
                                                        width={"100px"}
                                                        src={person.image}
                                                    />
                                                </div>
                                            </div>
                                            <div className="person-actions">
                                                <button onClick={() => handleDeleteInvited(index)}>Delete</button>
                                                <button onClick={() => QRCodePDF(person)}>Generate Invite</button>
                                            </div>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                        <div className="people-column">
                            <h3>Blacklisted People</h3>
                            <ul>
                                {blacklist.length === 0 ? (
                                    <p>There are no blacklisted persons.</p>
                                ) : (
                                    blacklist.map((person, index) => (
                                        <li key={index}>
                                            <div className="person-info">
                                                <div className="person-name">
                                                    <p>{person.personData.firstName} {person.personData.lastName}</p>
                                                    <p>{person.personData.school}</p>
                                                </div>
                                                <div className="person-image">
                                                    <img
                                                        alt="Image not found"
                                                        width={"100px"}
                                                        src={person.personData.image}
                                                    />
                                                </div>
                                            </div>
                                            <div className="person-actions">
                                                <button onClick={() => handleDeleteBlackList(index)}>Delete</button>
                                            </div>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            );
        } else
            return <ItemNotFound/>
    } else
        return <Loading/>
}

export default EditPeople;