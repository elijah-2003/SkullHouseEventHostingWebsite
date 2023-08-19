import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import './EditPeople.css';
import logo from '../../Images/Phi_Kappa_Sigma_coat_of_arms.png';
import Footer from "../../Components/Footer";
import {addToBlackList, addToInvited, getEvents, deleteFromInvited, deleteFromBlackList} from "../../Api/api-service";

function EditPeople() {
    const [selectedAction, setSelectedAction] = useState('invite');
    const { eventId } = useParams();
    const navigate  = useNavigate()
    const event = getEvents().find(event => event.id === eventId);

    const handleActionChange = (e) => {
        setSelectedAction(e.target.value);
    };

    const handleInvite = () => {
        const firstName = prompt('Enter First Name:');
        const lastName = prompt('Enter Last Name:');
        const school = prompt('Enter School:');

        addToInvited(eventId, createPerson(firstName, lastName, school));
    };

    const handleBlacklist = () => {
        const firstName = prompt('Enter First Name:');
        const lastName = prompt('Enter Last Name:');
        const school = prompt('Enter School:');

        addToBlackList(eventId, createPerson(firstName, lastName, school));
    };

    const handleDeleteInvited = (index) => {
        deleteFromInvited(eventId, event.invited[index].id)
    }

    const handleDeleteBlackList = (index) => {
        deleteFromBlackList(eventId, event.invited[index].id)
    }

    const createPerson = (first, last, school) =>
    {
        return {
            firstName: first,
            lastName: last,
            school: school,
            image:"",
            id: uuidv4()
        }
    }

    return (
        <div className="edit-people-container">
            <header className="header">
                <img className="logo" src={logo} alt="Logo" />
                <h2>Edit People</h2>
            </header>
            <form className="edit-people-form">
                {/* ... (dropdowns and textboxes) */}
                <div className="actions">
                    <button type="button" onClick={handleInvite}>
                        {selectedAction === 'invite' ? 'Invite' : 'Add to Invited'}
                    </button>
                    <button type="button" onClick={handleBlacklist}>
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
                                    {person.firstName} {person.lastName} - {person.school}
                                    <button onClick={() => handleDeleteInvited(index)}>Delete</button>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
                <div className="people-column">
                    <h3>Blacklisted People</h3>
                    <ul>
                        {event.blacklist.length === 0 ? (
                            <p>There are no blacklisted persons.</p>
                        ) : (
                            event.blacklist.map((person, index) => (
                                <li key={index}>
                                    {person.firstName} {person.lastName} - {person.school}
                                    <button onClick={() => handleDeleteBlackList(index)}>Delete</button>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default EditPeople;