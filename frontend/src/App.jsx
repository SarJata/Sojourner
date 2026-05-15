import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CreateTrip from './pages/CreateTrip';
import TripDashboard from './pages/TripDashboard';
import TravelHistory from './pages/TravelHistory';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateTrip />} />
            <Route path="/dashboard/:id" element={<TripDashboard />} />
            <Route path="/history" element={<TravelHistory />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
