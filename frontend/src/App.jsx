import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Registration from './components/Registration'
import LandingPage from './components/LandingPage'
import CreateTrip from './components/CreateTrip'
import BuildItinerary from './components/BuildItinerary'
import UserTripListing from './components/UserTripListing'
import UserProfile from './components/UserProfile'
import ActivitySearch from './components/ActivitySearch'
import ItineraryView from './components/ItineraryView'
import CommunityTab from './components/CommunityTab'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/create-trip" element={<CreateTrip />} />
        <Route path="/build-itinerary" element={<BuildItinerary />} />
        <Route path="/trips" element={<UserTripListing />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/search" element={<ActivitySearch />} />
        <Route path="/itinerary-view" element={<ItineraryView />} />
        <Route path="/community" element={<CommunityTab />} />
      </Routes>
    </Router>
  )
}

export default App
