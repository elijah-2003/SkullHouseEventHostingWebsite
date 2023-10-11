import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import './EditPeople.css';
import logo from '../../Images/Phi_Kappa_Sigma_coat_of_arms.png';
import {addToBlackList, addToInvited, getEvent, deleteFromInvited, deleteFromBlackList, getBlacklist} from "../../Api/api-service";
import Loading from "../../Components/Loading";
import ItemNotFound from "../../Components/ItemNotFound";
import qrcode from "qrcode";
import { PDFViewer, Page, Text, View, Document, Image as PdfImage, Font } from "@react-pdf/renderer";
import isEventExpired from "../../Utilities/expired";
import hasEventStarted from "../../Utilities/hasEventStarted";
import imageCompression from 'browser-image-compression';


function EditPeople() {
    const navigate = useNavigate();
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
    const [numGuests, setNumGuests] = useState(0)
    const [selectedFile, setSelectedFile] = useState(null)

    useEffect(() => {
        let globalEvent;
        async function fetchData() {
            try {
                let eventData = await getEvent(eventId);
                let blacklist = await getBlacklist()
                setEvent(eventData);
                globalEvent = eventData
                setBlacklist(blacklist)
                setLoading(false)
            } catch (error) {
                console.log("Event Doesn't Exist")
            }
        }

        fetchData();

        const checkEventStatus = setInterval(() => {
            if (hasEventStarted(globalEvent)) {
                alert(`You can no longer edit an ${isEventExpired(globalEvent) ? 'expired' : 'ongoing'} event.`)
                clearInterval(checkEventStatus); // Stop checking once expired
                navigate(`/manage-event/${eventId}`); // Navigate to manageEvent page
            }
        }, 3000);
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
            color: "#0056b3",
            fontSize: 16,
            fontWeight: "bold",
            cursor: "pointer",
        },
        viewer: {
            width: window.innerWidth,
            height: window.innerHeight,
        },
    };
    const createPerson = (first, last, school, phone, image, invited, guests) =>
    {
        return {
            firstName: first,
            lastName: last,
            school: school,
            phone: phone,
            image:image,
            guests: guests,
            id: uuidv4(),
            eventId: eventId,
            invited: invited,
        }
    }

    const compress = async (event) => {
        const imageFile = event.target.files[0];
        console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
        console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);
      
        const options = {
          maxSizeMB: 0.3,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        }
        try {
          const compressedFile = await imageCompression(imageFile, options);
          console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
          console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
      
          return compressedFile
        } catch (error) {
          console.log(error);
        }
      
    };

    function convertImageToBase64(imageFilePromise, callback) {
        imageFilePromise
        .then((imageFile) => {
            const reader = new FileReader();

            reader.readAsDataURL(imageFile);

            reader.onload = (event) => {
                const base64String = event.target.result;
                callback(base64String);
            };

            reader.onerror = (event) => {
                console.error("Error reading the file:", event.target.error);
                // Handle the error here, e.g., by calling the callback with an error message.
                callback(null, event.target.error);
            };
        })
        .catch((error) => {
            console.error(error);
            // Handle the error here, e.g., by calling the callback with an error message.
            callback(null, error);
        });
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
            const person = createPerson(firstName, lastName, school, contact, selectedFile, false, numGuests)
            setLoading(true)
            await addToBlackList(eventId, person)
            window.location.href = window.location.href;
        }
        else
        {
            const person = createPerson(firstName, lastName, school, contact, selectedFile, true, numGuests)
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
                    Close (Don't Use Navigation Arrows!)
                    </span>
                    </div>
                    <PDFViewer style={styles.viewer}>
                        <Document>
                            <Page style={styles.page}>
                                <View style={styles.header}>
                                    <PdfImage style={styles.logo} src={logo} />
                                    <Text style={styles.eventName}>{event.name}</Text>
                                </View>
                                <View style={styles.eventInfo}>
                                    <Text>Event Description: {event.description}</Text>
                                    <Text>Event Special Details: {event.special}</Text>
                                    <Text>Emergency Contact: {event.emergency}</Text>
                                </View>
                                <View>
                                    <Text style={styles.personName}>
                                        Number of Guests: {person.guests}
                                    </Text>
                                    <Text style={styles.personName}>
                                        {person.firstName} {person.lastName}
                                    </Text>
                                    <Text style={styles.schoolName}>{person.school}</Text>
                                    <PdfImage style={styles.qrCode} src={generateQRCodeDataURL(person)} />
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
                                required={!addToBlackListView}/>
                            </label>
                            <label>
                                Last Name:
                                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
                                required={!addToBlackListView}/>
                            </label>
                            <label>
                                School:
                                <input type="text" value={school} onChange={(e) => setSchool(e.target.value)} 
                                required={!addToBlackListView}/>
                            </label>
                            {!addToBlackListView && (<label>
                                Number of Guests:
                                <input type="number" value={numGuests} onChange={(e) => setNumGuests(e.target.value)} 
                                required={!addToBlackListView}/>
                            </label>)}
                            {addToBlackListView && (<label>
                                Upload Image{addToBlackListView ? ' (required)' : ''}:
                                <input type="file" accept="image/*" onChange={(e) => convertImageToBase64(compress(e), (base64String) => {
                                    console.log('Base64 encoded image:', base64String);
                                    setSelectedFile(base64String)
                                })}
                                required={addToBlackListView}/>
                            </label>)}
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
                    <button onClick={(e) => navigate(`/`)}><img src={logo} alt="pks logo" className="logo" /></button>
                        <h2>Edit People</h2>
                    </header>
                    <form className="edit-people-form">
                        {/* ... (dropdowns and textboxes) */}
                        <div className="actions">
                            <button type="button" id="add-to-invited" onClick={() => setAddToInvitedListView(true)}>
                                {selectedAction === 'invite' ? 'Invite' : 'Add to Invited'}
                            </button>
                            <button type="button" id="add-to-blacklist" onClick={() => setAddToBlackListView(true)}>
                                {selectedAction === 'blacklist' ? 'Blacklist' : 'Add to Blacklist'}
                            </button>
                        </div>
                    </form>
                    <div className="people-lists">
                        <div className="people-column">
                            <h3>Invited People</h3>
                            <ul style={{listStyleType:'none'}}>
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
                                            </div>
                                            <div className="person-actions">
                                                <button id="delete-button" onClick={() => handleDeleteInvited(index)}>Delete</button>
                                                <button id="generate-invite" onClick={() => QRCodePDF(person)}>Generate Invite</button>
                                            </div>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                        <div className="people-column">
                            <h3>Blacklisted People</h3>
                            <ul style={{listStyleType:'none'}}>
                                {blacklist.length === 0 ? (
                                    <p>There are no blacklisted people.</p>
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
                                                <button id="delete-button" onClick={() => handleDeleteBlackList(index)}>Delete</button>
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