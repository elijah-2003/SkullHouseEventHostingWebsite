import axios from 'axios';

export async function addEvent(event) {
    const apiUrl = 'https://ta9ufpda6l.execute-api.us-east-1.amazonaws.com/Prod'; // Replace with your actual API endpoint

    try {
        const response = await axios.put(apiUrl, {
            event: event,
            eventId:event.id,
            operation: 'addEvent'
        });
        console.log("addEventResponse:",response)
    } catch (error) {
        console.error('Error:', error);
    }
}

// Example function to add a person to the invited list
export async function addToInvited(eventId, person) {
    const apiUrl = 'https://ta9ufpda6l.execute-api.us-east-1.amazonaws.com/Prod'; // Replace with your actual API endpoint

    try {
        const response = await axios.put(apiUrl, {
            eventId: eventId,
            person: person,
            operation:'addToInvited'
        });
        console.log(response.data.message); // Message from the API
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function addToCheckedIn(eventId, person) {
    const apiUrl = 'https://ta9ufpda6l.execute-api.us-east-1.amazonaws.com/Prod'; // Replace with your actual API endpoint

    try {
        const response = await axios.put(apiUrl, {
            eventId: eventId,
            person: person,
            operation:'checkedIn'
        });
        console.log(response.data.message); // Message from the API
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function addToBlackList(eventId, person) {
    const apiUrl = 'https://ta9ufpda6l.execute-api.us-east-1.amazonaws.com/Prod'; // Replace with your actual API endpoint

    try {
        const response = await axios.put(apiUrl, {
            person: person,
            operation:'addToBlacklist'
        });
        console.log(response.data.message); // Message from the API
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function deleteFromBlackList(person) {
    const apiUrl = 'https://ta9ufpda6l.execute-api.us-east-1.amazonaws.com/Prod/blacklist';
    try {
        console.log("ID:", person.id)
        const response = await axios.delete(apiUrl, {data:{
            person: person,
        }});
        console.log(response); // Message from the API
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function deleteFromInvited(eventId, person) {
    const apiUrl = 'https://ta9ufpda6l.execute-api.us-east-1.amazonaws.com/Prod';

    try {
        const response = await axios.delete(apiUrl, {data: {
            eventId: eventId,
            personId: person.id,
            operation:'deleteInvited'
        }});
        console.log(response.data.message); // Message from the API
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function deleteEvent(eventId) {
    const apiUrl = 'https://ta9ufpda6l.execute-api.us-east-1.amazonaws.com/Prod';

    try {
        const response = await axios.delete(apiUrl, {data: {
            eventId: eventId,
            operation: 'deleteEvent'
        }});
        console.log(response.data.message); // Message from the API
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function getEvents() {
    const apiUrl = 'https://ta9ufpda6l.execute-api.us-east-1.amazonaws.com/Prod';
    try {
        const response = await axios.get(apiUrl)
        console.log("Response:", response.data)
        return response.data
    } catch (error) {
        console.error('Error:', error);
    }
}
export async function getEvent(eventId) {
    const apiUrl = 'https://ta9ufpda6l.execute-api.us-east-1.amazonaws.com/Prod';
    try {
        const response = await axios.post(apiUrl, {
            eventId: eventId,
        });
        console.log("Response:", response)
        return response.data;
    } catch (error) {
        console.error('Error:', error);
    }
}
export async function getBlacklist() {
    const apiUrl = 'https://ta9ufpda6l.execute-api.us-east-1.amazonaws.com/Prod/blacklist';
    try {
        const response = await axios.get(apiUrl);
        console.log("Response:", response)
        return response.data;
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function getWebsockets() {
    const apiUrl = 'https://ta9ufpda6l.execute-api.us-east-1.amazonaws.com/Prod/websockets';
    try {
        const response = await axios.get(apiUrl);
        console.log("Response:", response)
        return response.data;
    } catch (error) {
        console.error('Error:', error);
    }
}
