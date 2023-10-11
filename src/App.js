import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './Pages/Home/Home';
import AddEvent from './Pages/AddEvent/AddEvent';
import ManageEvents from './Pages/ManageEvent/ManageEvent'
import EditPeople from "./Pages/EditPeople/EditPeople";
import EventManager from "./Pages/EventManager/EventManager";
import InformationEntry from "./Pages/InformationEntry/InformationEntry";
import Summary from "./Pages/Summary/Summary";
import Login from './Pages/Authenticate/Login';
import Phikap from './Pages/Authenticate/Phikap';
import { React, useContext } from 'react';
import {AuthContext} from './Components/AuthContext'

function App() {
const { authenticated } = useContext(AuthContext); 
  return (
    <Router>
      <Routes>
        {authenticated ? (
          <>
            {/* Protected routes */}
            <Route path="/" element={<Home />} />
            <Route path="/add-event/:eventId" element={<AddEvent />} />
            <Route path="/add-event" element={<AddEvent />} />
            <Route path="/event-manager/:eventId" element={<EventManager />} />
            <Route path="/information-entry/:eventId" element={<InformationEntry />} />
            <Route path="/edit-people/:eventId" element={<EditPeople />} />
            <Route path="/manage-event/:eventId" element={<ManageEvents />} />
            <Route path="/summary/:eventId" element={<Summary />} />
            <Route path="/choose" element={<Phikap />} />
          </>
        ) : (
          <Route path="/*" element={<Navigate to="/login" />} />
        )}

        {/* Login route accessible to all */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
