import axios from 'axios';

export async function addEvent(event) {
    const apiUrl = 'https://ta9ufpda6l.execute-api.us-east-1.amazonaws.com/addEvent'; // Replace with your actual API endpoint

    try {
        const response = await axios.put(apiUrl, event);
        console.log(response.data.message); // Message from the API
    } catch (error) {
        console.error('Error:', error);
    }
}

// Example function to add a person to the invited list
export async function addToInvited(eventId, person) {
    const apiUrl = 'https://ta9ufpda6l.execute-api.us-east-1.amazonaws.com/addToInvited'; // Replace with your actual API endpoint

    try {
        const response = await axios.put(apiUrl, {
            eventId: eventId,
            person: person
        });
        console.log(response.data.message); // Message from the API
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function addToBlackList(eventId, person) {
    const apiUrl = 'https://ta9ufpda6l.execute-api.us-east-1.amazonaws.com/addToBlacklist'; // Replace with your actual API endpoint

    try {
        const response = await axios.put(apiUrl, {
            eventId: eventId,
            person: person
        });
        console.log(response.data.message); // Message from the API
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function deleteFromBlackList(eventId, person) {
    const apiUrl = 'https://ta9ufpda6l.execute-api.us-east-1.amazonaws.com/deleteBlackList';

    try {
        const response = await axios.delete(apiUrl, {
            eventId: eventId,
            personId: person.id
        });
        console.log(response.data.message); // Message from the API
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function deleteFromInvited(eventId, person) {
    const apiUrl = 'https://ta9ufpda6l.execute-api.us-east-1.amazonaws.com/deleteInvited';

    try {
        const response = await axios.delete(apiUrl, {
            eventId: eventId,
            personId: person.id
        });
        console.log(response.data.message); // Message from the API
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function deleteEvent(eventId) {
    const apiUrl = 'https://ta9ufpda6l.execute-api.us-east-1.amazonaws.com/deleteEvent';

    try {
        const response = await axios.delete(apiUrl, {
            eventId: eventId,
        });
        console.log(response.data.message); // Message from the API
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function getEvents() {
    const apiUrl = 'https://ta9ufpda6l.execute-api.us-east-1.amazonaws.com';
    try {
        const response = await axios.get(apiUrl);
        console.log(response.data.message); // Message from the API
    } catch (error) {
        console.error('Error:', error);
    }
}
