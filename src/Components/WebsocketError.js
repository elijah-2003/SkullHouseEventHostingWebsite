import React from 'react';
import './WebSocketError.css'; // Create a CSS file for styling if needed

function WebSocketError() {
    return (
        <div className="websocket-error-container">
            <p>The connection to the server was terminated.</p>
            <p>Please refresh the page to receive another host ID.</p>
            <p>If you are using a check-in form, please refresh it as well and set a new host ID.</p>
        </div>
    );
}

export default WebSocketError;