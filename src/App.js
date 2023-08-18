import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './Pages/Home/Home';
import AddEvent from './Pages/AddEvent/AddEvent';
import ManageEvents from './Pages/ManageEvent/ManageEvent'
import EditPeople from "./Pages/EditPeople/EditPeople";
import EventManager from "./Pages/EventManager/EventManager";

function App() {
  return (
      <Router>
          <Routes>
            <Route path="/add-event/:eventId" element={<AddEvent />}>
            </Route>
              <Route path="/add-event" element={<AddEvent />}>
              </Route>
              <Route path="/event-manager/:eventId" element={<EventManager />}>
              </Route>
              <Route path="/edit-people/:eventId" element={<EditPeople />}>
              </Route>
            <Route path="/manage-event/:eventId" element={<ManageEvents />}>
            </Route>
            <Route path="/" element={<Home />}>
            </Route>
          </Routes>
      </Router>
  );
}

export default App;
