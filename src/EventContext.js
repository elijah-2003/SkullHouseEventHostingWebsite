import { createContext, useContext, useState } from 'react';

const EventContext = createContext();

export function EventProvider({ children }) {
    const [events, setEvents] = useState([]); // Initial empty events array
    function addEvent (newEvent){
        setEvents([...events, newEvent]);
    }

    function updateEvent (eventId, updatedEvent) {
        const updatedEvents = events.map((event) => {
            if (event.id === eventId) {
                // Keep the same ID and update other properties
                return updatedEvent
            }
            return event;
        });
        setEvents(updatedEvents);
    }
    function addToInviteList (eventId, person)
    {
        const updatedEvents = events.map((event) => {
            if (event.id === eventId) {
                const newInvite = [...event.invited, person]
                return {...event, invited: newInvite}
            }
            return event;
        });
        setEvents(updatedEvents);
    }
    function deleteFromInviteList (eventId, person)
    {
        const updatedEvents = events.map((event) => {
            if (event.id === eventId) {
                const newInvite = event.invited.filter((p) => p === person)
                return {...event, invited: newInvite}
            }
            return event;
        });

        setEvents(updatedEvents);
    }
    function addToBlackList (eventId, person)
    {
        const updatedEvents = events.map((event) => {
            if (event.id === eventId) {
                const newBlackList = [...event.blacklist, person]
                return {...event, blacklist: newBlackList}
            }
            return event;
        });
        setEvents(updatedEvents);
    }
    function deleteFromBlackList (eventId, person) {
        const updatedEvents = events.map((event) => {
            if (event.id === eventId) {
                const newBlackList = event.blacklist.filter((p) => p === person)
                return {...event, invited: newBlackList}
            }
            return event;
        });

        setEvents(updatedEvents);
    }

    return (
        <EventContext.Provider value={{ events, setEvents, addEvent, updateEvent, addToInviteList,
            deleteFromInviteList, addToBlackList, deleteFromBlackList}}>
            {children}
        </EventContext.Provider>
    );
}

export function useEventContext() {
    return useContext(EventContext);
}