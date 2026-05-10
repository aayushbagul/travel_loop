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
import PackingChecklist from './components/PackingChecklist'
import AdminPanel from './components/AdminPanel'
import TripNotes from './components/TripNotes'
import ExpenseInvoice from './components/ExpenseInvoice'

// Simple auth guard — checks if token exists
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return children
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/home" element={<ProtectedRoute><LandingPage /></ProtectedRoute>} />
        <Route path="/create-trip" element={<ProtectedRoute><CreateTrip /></ProtectedRoute>} />
        <Route path="/build-itinerary" element={<ProtectedRoute><BuildItinerary /></ProtectedRoute>} />
        <Route path="/build-itinerary/:tripId" element={<ProtectedRoute><BuildItinerary /></ProtectedRoute>} />
        <Route path="/trips" element={<ProtectedRoute><UserTripListing /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><ActivitySearch /></ProtectedRoute>} />
        <Route path="/itinerary-view" element={<ProtectedRoute><ItineraryView /></ProtectedRoute>} />
        <Route path="/itinerary-view/:tripId" element={<ProtectedRoute><ItineraryView /></ProtectedRoute>} />
        <Route path="/community" element={<ProtectedRoute><CommunityTab /></ProtectedRoute>} />
        <Route path="/packing-checklist" element={<ProtectedRoute><PackingChecklist /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
        <Route path="/notes" element={<ProtectedRoute><TripNotes /></ProtectedRoute>} />
        <Route path="/notes/:tripId" element={<ProtectedRoute><TripNotes /></ProtectedRoute>} />
        <Route path="/invoice" element={<ProtectedRoute><ExpenseInvoice /></ProtectedRoute>} />
        <Route path="/invoice/:tripId" element={<ProtectedRoute><ExpenseInvoice /></ProtectedRoute>} />
      </Routes>
    </Router>
  )
}

export default App
