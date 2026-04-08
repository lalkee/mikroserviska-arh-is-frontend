import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import EventsPage from './pages/EventsPage';
import LocationsPage from './pages/LocationsPage';
import SpeakersPage from './pages/SpeakersPage';
import CreateLocationCard from './components/CreateLocationCard';
import CreateSpeakerCard from './components/CreateSpeakerCard';
import CreateEventCard from './components/CreateEventCard';
import MQTestPage from './pages/MQTestPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/events" replace />} />
          
          <Route path="events" element={<EventsPage />}>
            <Route path="new" element={<CreateEventCard />} />
            <Route path="edit/:id" element={<CreateEventCard />} />
          </Route>
          
          <Route path="locations" element={<LocationsPage />}>
            <Route path="new" element={<CreateLocationCard />} />
            <Route path="edit/:id" element={<CreateLocationCard />} />
          </Route>
          
          <Route path="speakers" element={<SpeakersPage />}>
            <Route path="new" element={<CreateSpeakerCard />} />
            <Route path="edit/:id" element={<CreateSpeakerCard />} />
          </Route>
        </Route>


        <Route path="test" element={<MQTestPage />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;