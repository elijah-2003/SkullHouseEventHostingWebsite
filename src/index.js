import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Your main App component
import { EventProvider } from './EventContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <EventProvider>
            <App />
        </EventProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
